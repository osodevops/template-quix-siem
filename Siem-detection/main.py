import json
import os
import logging
import socket
import sys
import time
import uuid
from datetime import datetime, timezone

import yaml
from dotenv import load_dotenv
from quixstreams import QuixStreamingClient, AutoOffsetReset, RawTopicConsumer, RawMessage, App
from go_detector_interface import GoDetectorInterface


# This log processor will consume any json formatted log data
# Mappings towards the alerts for specific log formats are specified in file log_source_mappings.yaml
# It currently only supports flat json, not nested values as yet
class LogProcessor:
    def __init__(self):
        is_container = bool(os.getenv('KUBERNETES_SERVICE_HOST'))
        logging.basicConfig(level=logging.INFO)
        load_dotenv()
        token = os.getenv("STREAMING_TOKEN")
        self.report_every_count = int(os.getenv("REPORT_COUNT", "100"))
        self.matches_found = 0
        self.total_logs_received = 0
        self.log_source = os.environ.get("log_info", "authentication-linux")

        self.log_source_mappings = self.load_log_source_mappings()

        self.client = QuixStreamingClient() if is_container else QuixStreamingClient(token)
        self.go_detector = GoDetectorInterface()

        self.sigma_rules_info = {}
        self.sigma_rules_loaded = False

        log_topic = os.environ.get("log_data", "authentication-linux-logs")
        local_extension = "" if is_container else f"_{socket.gethostname().lower()}"
        self.log_consumer = self.client.get_raw_topic_consumer(log_topic, "siem_" + self.log_source + local_extension,
                                                               auto_offset_reset=AutoOffsetReset.Earliest)
        self.alert_producer = self.client.get_raw_topic_producer(os.environ.get("alerts", "alerts"))
        self.log_consumer.on_message_received = self.on_log_message_received_handler
        self.log_consumer.on_error_occurred = self.on_log_error_occurred_handler

        # Do not add a consumer group id, a random one will be generated by Quix, thus will enable the entire log
        # to be read. Not ideal, would prefer an assign() loop to manually read until the end.
        self.rules_consumer = self.client.get_raw_topic_consumer("sigma-rules",
                                                                 auto_offset_reset=AutoOffsetReset.Earliest)
        self.rules_consumer.on_message_received = self.on_rule_message_received_handler
        self.rules_consumer.on_error_occurred = self.on_rule_error_occurred_handler

    def is_valid_to_field(self, to_field):
        valid_fields = ["source_system", "source_ip", "source_port", "target_system", "*info", "*tag"]
        return to_field in valid_fields

    def load_log_source_mappings(self):
        with open("log_source_mappings.yaml", 'r') as file:
            mappings = yaml.safe_load(file)

        fields = []

        for mapping in mappings.get('mappings', []):
            if mapping['logsource'] == self.log_source:
                fields = mapping.get('fields', [])
                for field in fields:
                    if not self.is_valid_to_field(field['to']):
                        logging.error(f"Invalid 'to_field' found for log source: {self.log_source}, "
                                      f"to field: {field['to']}")
                        sys.exit(1)

        if len(fields) == 0:
            logging.warning("Not log source mappings were found! The alert messages will be lacking in valuable data")

        return fields

    # Hopefully won't time out the consumer - even with thousands of entries
    def wait_until_rules_loaded(self):
        for _ in range(5):
            logging.info("Waiting until all rules are loaded.")
            time.sleep(1)

        logging.info(f"Number of sigma rules loaded: {len(self.sigma_rules_info)}")

    def on_log_message_received_handler(self, topic_consumer: RawTopicConsumer, msg: RawMessage):
        if not self.sigma_rules_loaded:
            self.wait_until_rules_loaded()
            self.sigma_rules_loaded = True

        self.total_logs_received += 1
        matching_rule_ids = self.go_detector.find_match(msg.value)

        if matching_rule_ids != str():
            # logging.info(f"Found match with this key: {msg.key} value: {msg.value}, "
            #              f"matching rules: {matching_rule_ids}")
            self.publish_alerts(matching_rule_ids, msg)
            self.matches_found += 1

        if self.total_logs_received % self.report_every_count == 0:
            logging.info(f"Total logs processed: {self.total_logs_received}, Number of matches: {self.matches_found}")

    def on_rule_message_received_handler(self, topic_consumer: RawTopicConsumer, msg: RawMessage):
        if not self.sigma_rules_loaded:
            sigma_yaml_str = msg.value.decode('utf-8')
            self.update_sigma_rule_map(sigma_yaml_str)
        else:
            logging.info("update a rule message")

    def publish_alerts(self, matching_rule_ids, msg: RawMessage):
        current_utc_datetime = datetime.now(timezone.utc)
        original_log = msg.value.decode('utf-8')
        original_log_dict = json.loads(original_log)

        rule_ids = matching_rule_ids.split(',')

        # Iterate over each ID in the list
        for rule_id in rule_ids:
            sigma_rule = self.sigma_rules_info[rule_id]

            sigma_title = sigma_rule.get("title", "Unknown")
            sigma_description = sigma_rule.get("description", "Unknown")
            severity = sigma_rule.get("level", "Unknown")
            alert_id = str(uuid.uuid4())

            alert_entry = {
                "alert_id": alert_id,
                "timestamp": current_utc_datetime.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z",
                "sigma_rule_id": rule_id,
                "alert_title": sigma_title,
                "description": sigma_description,
                "severity": severity,
                "source_system": "unspecified",
                "source_ip": "unspecified",
                "source_port": "unspecified",
                "log_source": self.log_source,
                "target_system": "unknown",
                "attempt_count": "1",
                "tags": [],
                "action_taken": "",
                "additional_info": {}
            }

            alert_entry["additional_info"]["original_log"] = original_log

            # Apply mappings from log_source_mappings yaml definition
            for mapping in self.log_source_mappings:
                from_field = mapping['from']
                log_value = original_log_dict[from_field]
                to_field = mapping['to']

                if to_field == "*tag":
                    alert_entry["tags"].append(log_value)
                elif to_field == "*info":
                    alert_entry["additional_info"][from_field] = log_value
                else:
                    # allowed fields source_system, source_ip, source_port, target_system
                    alert_entry[to_field] = log_value

            key = bytearray(bytes(alert_id, 'utf-8'))
            message = bytearray(bytes(json.dumps(alert_entry), 'utf-8'))
            message = RawMessage(message)
            message.key = key

            logging.info(f"Publishing alert: {alert_entry}")
            self.alert_producer.publish(message)

    def on_log_error_occurred_handler(self, topic_consumer: RawTopicConsumer, error_message: BaseException):
        logging.error(f"Log receiving error.{error_message}")

    def on_rule_error_occurred_handler(self, topic_consumer: RawTopicConsumer, error_message: BaseException):
        logging.error(f"Sigma rule receiving error.{error_message}")

    # The idea is that sigma rules can be updated from a compact topic, for now loaded from disk
    def update_sigma_rule_map(self, data_content):
        try:
            sigma_rule = yaml.safe_load(data_content)
        except yaml.YAMLError as e:
            logging.error(f"Error parsing sigma rule YAML: {data_content}, error : {e}")
            return

        log_source = sigma_rule.get('logsource', {}).get('category') or sigma_rule.get('logsource', {}).get('product')

        # Rules not in the current category/product context are ignored to improve performance
        if log_source != self.log_source:
            return

        rule_id = sigma_rule.get('id', None)

        if rule_id is None:
            logging.error(f"Rule Id is missing from Sigma rule: {data_content}")
            return

        if not self.go_detector.update_rule(data_content):
            logging.error("The content of this yaml was rejected by the go sigma parser")
            return

        self.sigma_rules_info[rule_id] = sigma_rule

    # The idea is that sigma rules can be updated from a compact topic
    def remove_sigma_forwarding_rule(self, rule_id):
        self.sigma_rules_info.pop(rule_id, None)
        self.go_detector.remove_rule(rule_id)

    def run(self):
        App.run()
        logging.info("Processor stopped.")


if __name__ == "__main__":
    processor = LogProcessor()
    processor.run()
