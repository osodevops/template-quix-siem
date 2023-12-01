import os

import time
import quixstreams as qx
import logging
import random
from dotenv import load_dotenv
from datetime import datetime

from quixstreams import RawMessage

logging.basicConfig(level=logging.INFO)


class AuthLogGen:
    def __init__(self):
        is_container = bool(os.getenv('KUBERNETES_SERVICE_HOST'))
        load_dotenv()
        token = os.getenv("STREAMING_TOKEN")
        logging.info("Preparing Quix Environment for Authentication logs gen")
        self.client = qx.QuixStreamingClient() if is_container else qx.QuixStreamingClient(token)
        self.producer_topic = self.client.get_raw_topic_producer(os.environ.get("Topic",
                                                                                "authentication-linux-logs"))
        self.records_per_second = int(os.environ.get("RECS_PER_SECOND", 5))
        self.users = [
            "john_hacker_doe", "jane_goody2shoes_doe", "alice_adventure", "bob_builder",
            "charlie_chaplin", "david_dreamer", "eve_explorer", "frank_finder",
            "grace_gamer", "harry_hacker", "irene_inventor", "jack_jumper",
            "steve_strider", "tina_traveler", "uma_user", "victor_visitor",
            "wanda_watcher", "xavier_explorer", "yvonne_yielder", "zachary_zealous",
            "larry_legend", "megan_mover", "nathan_navigator", "olivia_overseer",
            "paula_pioneer", "quentin_quester", "rachel_racer", "sam_seeker",
            "tracy_trekker", "ursula_undertaker", "vince_voyager", "wilma_wanderer"
        ]

        self.actions = [
            "login", "logout", "upload", "download", "update", "delete",
            "create_account", "reset_password", "change_settings"
        ]

        self.statuses = ["success", "failed", "pending", "error"]
        self.device_types = ["mobile", "desktop", "laptop", "tablet", "server", "smartwatch"]
        self.ports = ["80", "443", "22", "8080", "21", "25", "110", "143", "993", "995"]

    def random_log_entry(self):
        # Randomly select values from the lists
        user = random.choice(self.users)
        action = random.choice(self.actions)
        status = random.choice(self.statuses)
        device_type = random.choice(self.device_types)
        port = random.choice(self.ports)

        # Generate a random IP address
        src_ip = (f"{random.randint(50, 255)}.{random.randint(1, 255)}"
                  f".{random.randint(1, 255)}.{random.randint(1, 255)}")

        # Generate a silly gateway login to be caught by sigma rule
        if random.randint(1, 150) == 50:
            src_ip = "192.168.0.1"
            action = "login"
            logging.info("***************** SHOULD FIRE ALERT (Gateway) ********************")

        if random.randint(1, 150) == 50:
            action = "login"
            port = "22"
            logging.info("***************** SHOULD FIRE ALERT (Port 22) ********************")

        if random.randint(1, 200) == 50:
            action = "login"
            src_ip = "192.168.0.1"
            port = "22"
            logging.info("***************** SHOULD FIRE ALERT (both) ********************")

        # Generate a random timestamp for the current day
        now = datetime.now()
        timestamp = now.strftime("%Y-%m-%dT%H:%M:%SZ")

        # Additional fields based on the action
        extra_fields = ""
        if action == "login" and status == "failed":
            extra_fields = f', "login_attempts": {random.randint(1, 5)}'

        # Create the log entry
        log_entry = (f'{{"timestamp": "{timestamp}", "src_ip": "{src_ip}", "user": "{user}", "action": '
                     f'"{action}", "status": "{status}", "device_type": "{device_type}", "port": '
                     f'"{port}"{extra_fields}}}')

        return log_entry, src_ip

    def generate(self):
        interval = 1 / self.records_per_second
        count = 0
        while True:

            iteration_start_time = time.time()
            log_entry, src_ip = self.random_log_entry()
            key = bytearray(bytes(src_ip, 'utf-8'))
            message = bytearray(bytes(log_entry, 'utf-8'))
            message = RawMessage(message)
            message.key = key
            self.producer_topic.publish(message)
            count += 1

            # Calculate elapsed time and sleep if necessary
            elapsed_time = time.time() - iteration_start_time
            if elapsed_time < interval:
                logging.info("Auth logs generated: " + str(count))
                time.sleep(interval - elapsed_time)
                self.producer_topic.flush()


if __name__ == "__main__":
    AuthLogGen().generate()
