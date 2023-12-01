import os
import json
import itertools
import re
import sys

import time
import quixstreams as qx
import logging
from dotenv import load_dotenv
from datetime import datetime

from quixstreams import RawMessage

logging.basicConfig(level=logging.INFO)


class FirewallLogGen:
    def __init__(self):
        is_container = bool(os.getenv('KUBERNETES_SERVICE_HOST'))
        load_dotenv()
        token = os.getenv("STREAMING_TOKEN")
        logging.info("Preparing Quix Environment for Firewall log gen")
        self.client = qx.QuixStreamingClient() if is_container else qx.QuixStreamingClient(token)
        self.producer_topic = self.client.get_raw_topic_producer(os.environ.get("Topic", "zeek-firewall-logs"))
        self.records_per_second = int(os.environ.get("RECS_PER_SECOND", 10))

        base_path = os.path.dirname(__file__)
        file_path = os.path.join(base_path, 'zeek-firewall.txt')

        self.firewall_logs = []

        try:
            with open(file_path, 'r') as file:
                for line in file:
                    # Convert each line from JSON to a Python dictionary
                    try:
                        json_log_entry = json.loads(line.strip())
                        self.firewall_logs.append(json_log_entry)
                    except json.JSONDecodeError:
                        logging.error(f"Invalid JSON format: {line.strip()} - skipping line")
        except FileNotFoundError:
            logging.error(f"File not found: {file_path}")
            sys.exit()

    def extract_first_ip_port(self, data):
        # Regular expression pattern for IP address and port (e.g., '123.456.789.012/3456')
        pattern = r"\b\d{1,3}(?:\.\d{1,3}){3}/\d+\b"

        # Search for the pattern in the provided string
        match = re.search(pattern, data)

        # If a match is found, return it, otherwise return None
        return match.group() if match else None

    def yield_loop(self):
        interval = 1 / self.records_per_second

        # Endlessly iterate over the firewall_logs list
        for curr_log_entry in itertools.cycle(self.firewall_logs):
            start_time = time.time()
            current_utc_time = datetime.utcnow()
            formatted_utc_time = current_utc_time.strftime('%b %d %H:%M:%S')
            event_parts = curr_log_entry["event"].split(" ")
            original_event_time_str = " ".join(event_parts[:3])
            curr_log_entry["source_ip"] = self.extract_first_ip_port(curr_log_entry["event"])
            curr_log_entry["event"] = curr_log_entry["event"].replace(original_event_time_str, formatted_utc_time)
            yield curr_log_entry

            # Calculate elapsed time and sleep if necessary
            elapsed_time = time.time() - start_time
            if elapsed_time < interval:
                time.sleep(interval - elapsed_time)

    def generate(self):
        if self.firewall_logs:
            log_generator = self.yield_loop()
            for i, log_entry in enumerate(log_generator):
                json_string = json.dumps(log_entry)

                key = bytearray(bytes(log_entry["source_ip"], 'utf-8'))
                message = bytearray(bytes(json_string, 'utf-8'))
                message = RawMessage(message)
                message.key = key

                self.producer_topic.publish(message)

                if i % self.records_per_second == 0:
                    self.producer_topic.flush()
                    logging.info("Firewall Recs generated: " + str(i))
        else:
            logging.info("No data found or failed to load data.")


if __name__ == "__main__":
    FirewallLogGen().generate()
