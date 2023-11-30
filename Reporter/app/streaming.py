import os
import json
import pandas as pd
import quixstreams as qx

from .store import StreamStateStore

__all__ = ("start_quixstreams",)

qx.Logging.update_factory(qx.LogLevel.Debug)


def start_quixstreams(topic_name: str, state_store: StreamStateStore):
    is_container = bool(os.getenv('KUBERNETES_SERVICE_HOST'))
    token = os.getenv("STREAMING_TOKEN")
    client = qx.QuixStreamingClient() if is_container else qx.QuixStreamingClient(token)

    consumer_topic = client.get_raw_topic_consumer(
        topic_name, "siem_" + topic_name, auto_offset_reset=qx.AutoOffsetReset.Latest
    )

    def on_alert_message_received_handler(topic_consumer: qx.RawTopicConsumer, msg: qx.RawMessage):
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

        # Add the new row to the DataFrame
        state_store.append(pd.DataFrame([alert_ui_row]))


    consumer_topic.on_message_received = on_alert_message_received_handler
    qx.App.run()
