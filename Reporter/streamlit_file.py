import time

import streamlit as st

from app.conf import (
    STREAMLIT_DATAFRAME_POLL_PERIOD,
)
from app.streamlit_utils import get_stream_df, draw_line_chart_failsafe

# Basic configuration of the Streamlit dashboard
st.set_page_config(
    page_title="SIEM Alerts",
    page_icon="✅",
    layout="wide",
)

col1, col2 = st.rp(2)
with col1:
    st.markdown("### Alert Details")
    placeholder_col1 = st.empty()

with col2:
    st.markdown("### Number of Alerts per Minute")
    placeholder_col2 = st.empty()

# A placeholder for the raw data table
placeholder_raw = st.empty()

# REAL-TIME METRICS SECTION
# Below we update the charts with the data we receive from Quix in real time.
# Each 0.5s Streamlit requests new data from Quix and updates the charts.
# Keep the dashboard layout code before "while" loop, otherwise new elements
# will be appended on each iteration.
while True:
    # Wait for the streaming data to become available
    real_time_df = get_stream_df()
    print(f"Receive data from Quix. Total rows: {len(real_time_df)}")
    # The df can be shared between threads and changed over time, so we copy it
    real_time_df_copy = real_time_df[:]

    with placeholder_col1.container():
        placeholder_col1.table(st.session_state.alerts_df)

    # Display the raw dataframe data
    with placeholder_raw.container():
        st.markdown("### Raw Data View")
        st.dataframe(real_time_df_copy)

    # Wait for 0.5s before asking for new data from Quix
    time.sleep(STREAMLIT_DATAFRAME_POLL_PERIOD)
