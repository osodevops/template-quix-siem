import io
import threading

import pandas as pd

__all__ = ("StreamStateStore",)


class StreamStateStore:
    def __init__(self, max_size: int = 5000):
        self._df = pd.DataFrame()
        self._max_size = max_size
        self._lock = threading.Lock()

    def append(self, new_df: pd.DataFrame):
        with self._lock:
            self._df = pd.concat([self._df, new_df])
            self._df = self._df.iloc[-self._max_size :, :]

    def to_csv_bytes(self) -> bytes:
        with self._lock, io.BytesIO() as f:
            self._df.to_csv(f, index=False)
            f.seek(0)
            return f.read()