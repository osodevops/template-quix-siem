import glob
import os
import quixstreams as qx
import yaml
import uuid

from dotenv import load_dotenv
from quixstreams import RawMessage
from go_detector_interface import GoDetectorInterface


# This messy util class will take a confluent sigma rule and make it sigma-go compliant
# Reads a bunch of sigma rules (yaml format) and uploads to a kafka topic - currently in quix
# Note that Quix does not support compact topics, and this is just a quick proof of concept
# So changes to this loader should be made to connect to Kafka/Redpanda
class SigmaRulesLoader:
    def __init__(self):
        is_container = bool(os.getenv('KUBERNETES_SERVICE_HOST'))
        self.detector = GoDetectorInterface()
        load_dotenv()
        token = os.getenv("STREAMING_TOKEN")
        print("Preparing Quix Environment for Authentication logs gen")
        self.client = qx.QuixStreamingClient() if is_container else qx.QuixStreamingClient(token)
        self.producer_topic = self.client.get_raw_topic_producer(os.environ.get("SIGMA_RULE_TOPIC",
                                                                                "sigma-rules"))

    def load_sigma_rules(self):
        folder_paths = ["sigma-rules/**/*.yaml", "sigma-rules/**/*.yml"]
        sigma_rules = {}  # Initialize a dictionary to store the rules

        for folder_path in folder_paths:
            yaml_files = glob.glob(folder_path, recursive=True)

            # Loop through the files and load them into the dictionary
            for file_path in yaml_files:
                with open(file_path, 'r') as file:
                    file_name = os.path.basename(file_path)  # Extract the file name
                    sigma_rules[file_name] = file.read()  # Store the file content in the dictionary
                    print(f"Loaded sigma rule: {file_name}")

        return sigma_rules

    def make_rules_compliant_with_sigma_go(self):
        with_timeframe = 0
        total_files = 0
        folder_paths = ["sigma-rules/**/*.yaml", "sigma-rules/**/*.yml"]

        for folder_path in folder_paths:
            yaml_files = glob.glob(folder_path, recursive=True)

            for file_path in yaml_files:
                total_files += 1
                with open(file_path, 'r') as file:
                    lines = file.readlines()

                index = next(
                    (index for index, line in enumerate(lines) if line.startswith(" timeframe:")), None)
                if index:
                    with_timeframe += 1

                # Sigma-go only accepts lower case logical operators
                index = next(
                    (index for index, line in enumerate(lines) if line.startswith(" condition:")), None)
                if index:
                    lines[index] = lines[index].replace(" AND ", " and ")
                    lines[index] = lines[index].replace(" OR ", " or ")
                    lines[index] = lines[index].replace(" NOT ", " not ")
                    with open(file_path, 'w') as file:
                        file.writelines(lines)

                # A Rule id is defined for compact topic usage and is considered best practise in
                if len(lines) >= 2 and not lines[1].startswith("id:"):
                    # Insert the "id:" line with a UUID
                    id_line = f"id: {uuid.uuid4()}\n"
                    lines.insert(1, id_line)

                    # Write the modified content back to the file
                    with open(file_path, 'w') as file:
                        file.writelines(lines)
                    print(f"Added ID line to {file_path}")
                else:
                    print(f"No changes made to {file_path}")

            print(f"Total files: {total_files}")
            print(f"Total files with timeframe option: {with_timeframe}")

    def load(self):
        self.make_rules_compliant_with_sigma_go()
        sigma_rules = self.load_sigma_rules()

        for file_name, file_content in sigma_rules.items():
            print(f"Uploading: {file_name} to topic")
            rule_obj = yaml.safe_load(file_content)  # Load the content, not the file name

            if not self.detector.is_valid_sigma_rule(file_content):
                print(f"Problem validating rule.")
                continue

            key = bytearray(bytes(rule_obj['id'], 'utf-8'))
            message = bytearray(bytes(file_content, 'utf-8'))  # Use file content here
            message = RawMessage(message)
            message.key = key
            self.producer_topic.publish(message)

        self.producer_topic.flush()


if __name__ == "__main__":
    SigmaRulesLoader().load()
