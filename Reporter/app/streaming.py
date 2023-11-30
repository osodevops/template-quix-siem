import os

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

    def read_stream(stream_consumer: qx.StreamConsumer):
        """
        Callback to react to new data received from input topic.
        Called for each incoming stream.
        """

        def on_read_pandas_data(_: qx.StreamConsumer, df_i: pd.DataFrame):
            """
            Callback called for each incoming data frame
            """
            df_i["datetime"] = pd.to_datetime(df_i["timestamp"])
            # Add new data to the store
            state_store.append(df_i)

        stream_consumer.timeseries.on_dataframe_received = on_read_pandas_data

    consumer_topic.on_stream_received = read_stream
    qx.App.run()