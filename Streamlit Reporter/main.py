import json
import os
import logging
import socket
import threading
import time

import pandas as pd

import streamlit as st

from dotenv import load_dotenv
from quixstreams import QuixStreamingClient, AutoOffsetReset, RawTopicConsumer, RawMessage, App


# This alert processor will consume an alert message from the alert topic
# Using Streamlit it will update the UI every 5 seconds. (I have not made a websockets version yet)
class AlertProcessor:
    def __init__(self):
        self._lock = threading.Lock()
        is_container = bool(os.getenv('KUBERNETES_SERVICE_HOST'))
        local_extension = "" if is_container else f"_{socket.gethostname().lower()}"
        logging.basicConfig(level=logging.INFO)
        load_dotenv()
        token = os.getenv("STREAMING_TOKEN")

        self.alert_source = os.environ.get("input", "alerts")
        self.client = QuixStreamingClient() if is_container else QuixStreamingClient(token)

        self.alert_consumer = self.client.get_raw_topic_consumer(self.alert_source, "siem_" + self.alert_source +
                                                                 local_extension,
                                                                 auto_offset_reset=AutoOffsetReset.Earliest)
        self.alert_consumer.on_message_received = self.on_alert_message_received_handler
        self.alert_consumer.on_error_occurred = self.on_alert_error_occurred_handler

        self.alerts_df = pd.DataFrame(columns=['alert_id', 'timestamp', 'alert_title', 'source_ip', 'source_port',
                                               'log_source'])

        if 'alerts_df' not in st.session_state:
            st.session_state.alerts_df = self.alerts_df

        self.processing_thread = threading.Thread(target=self.run, daemon=True)
        self.processing_thread.start()

    def run(self):
        logging.info("Processor started on new thread")
        App.run()
        logging.info("Processor stopped.")

    def refresh_alerts(self):
        logging.info("Refreshing alerts df")
        # Function to refresh the alerts table in Streamlit
        st.session_state.alerts_df = self.alerts_df

    def on_alert_message_received_handler(self, topic_consumer: RawTopicConsumer, msg: RawMessage):
        json_str = msg.value.decode("utf-8")
        json_obj = json.loads(json_str)

        # Extract the required fields
        alert_ui_row = {
            'alert_id': json_obj.get('alert_id', ''),
            'timestamp': json_obj.get('timestamp', ''),
            'alert_title': json_obj.get('alert_title', ''),
            'source_ip': json_obj.get('source_ip', ''),
            'source_port': json_obj.get('source_port', ''),
            'log_source': json_obj.get('log_source', '')
        }

        # Add the new row to the DataFrame and crop to max size as needed
        with self._lock:
            self.alerts_df = pd.concat([pd.DataFrame([alert_ui_row]), self.alerts_df])

            # Limit the size of the DataFrame to the last N rows
            max_rows = 1000  # Set the max number of rows
            if len(self.alerts_df) > max_rows:
                self.alerts_df = self.alerts_df.head(max_rows)

    def on_alert_error_occurred_handler(self, topic_consumer: RawTopicConsumer, error_message: BaseException):
        logging.error(f"Log receiving error.{error_message}")

    def process_data_for_chart(self):
        # Convert 'timestamp' to datetime and set it as the index
        df = self.alerts_df.copy()
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df.set_index('timestamp', inplace=True)

        # Resample the data to get the count per minute
        local_chart_data = df.resample('1T').count()['alert_id']
        return local_chart_data


if __name__ == "__main__":
    st.title = "SIEM Alerts"
    st.set_page_config(layout="wide")

    processor = AlertProcessor()

    chart_title_placeholder = st.empty()
    chart_placeholder = st.empty()
    table_placeholder = st.empty()

    while True:
        processor.refresh_alerts()

        chart_data = processor.process_data_for_chart()
        chart_title_placeholder.markdown("#### Number of Alerts per Minute")

        chart_placeholder.line_chart(chart_data)

        table_placeholder.table(st.session_state.alerts_df)
        time.sleep(5)
