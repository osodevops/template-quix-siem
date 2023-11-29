import os
import json
import itertools
import sys

import random
import string
import time
import quixstreams as qx
import logging
from dotenv import load_dotenv
from quixstreams import RawMessage

logging.basicConfig(level=logging.INFO)


class DnsLogGen:
    def __init__(self):
        is_container = bool(os.getenv('KUBERNETES_SERVICE_HOST'))
        load_dotenv()
        token = os.getenv("STREAMING_TOKEN")
        logging.info("Preparing Quix Environment for Zeek-Http log gen")
        self.client = qx.QuixStreamingClient() if is_container else qx.QuixStreamingClient(token)
        self.producer_topic = self.client.get_raw_topic_producer(os.environ.get("Topic", "zeek-http-logs"))
        self.records_per_second = int(os.environ.get("RECS_PER_SECOND", 5))

        base_path = os.path.dirname(__file__)
        file_path = os.path.join(base_path, 'zeek-http.txt')

        self.logs = []

        try:
            with open(file_path, 'r') as file:
                for line in file:
                    # Convert each line from JSON to a Python dictionary
                    try:
                        json_log_entry = json.loads(line.strip())
                        self.logs.append(json_log_entry)
                    except json.JSONDecodeError:
                        logging.error(f"Invalid JSON format: {line.strip()} - skipping line")
        except FileNotFoundError:
            logging.error(f"File not found: {file_path}")
            sys.exit()

    def yield_loop(self):
        interval = 1 / self.records_per_second

        # Endlessly iterate over the logs list
        for curr_log_entry in itertools.cycle(self.logs):
            start_time = time.time()
            random_id = ''.join(random.choices(string.ascii_letters + string.digits, k=15))
            curr_log_entry['uid'] = random_id
            curr_log_entry['ts'] = time.time()
            yield curr_log_entry

            # Calculate elapsed time and sleep if necessary
            elapsed_time = time.time() - start_time
            if elapsed_time < interval:
                time.sleep(interval - elapsed_time)

    def generate(self):
        if self.logs:
            log_generator = self.yield_loop()
            for i, log_entry in enumerate(log_generator):
                json_string = json.dumps(log_entry)
                key = bytearray(bytes(log_entry["id.orig_h"], 'utf-8'))
                message = bytearray(bytes(json_string, 'utf-8'))
                print(message)
                message = RawMessage(message)
                message.key = key

                self.producer_topic.publish(message)
                if i % self.records_per_second == 0:
                    logging.info("Zeek Http Recs generated: " + str(i))
        else:
            logging.info("No data found or failed to load data.")


if __name__ == "__main__":
    DnsLogGen().generate()

