# test_detector.py
import sys
from pathlib import Path

import pytest

from go_detector_interface import GoDetectorInterface

simple_rule_1 = """title: Suspicious Login Attempt Detected
id: f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8
status: experimental
description: Detects login attempts from a known suspicious IP address
logsource:
    category: authentication-linux
detection:
    selection:
        src_ip: '192.168.1.100'
        action: 'login'
    condition: selection
level: high
"""

simple_rule_2 = """title: Unauthorized SSH Login Attempt Detection
id: c7cc9103-1acb-4058-9479-62e1d734669f
status: experimental
description: This rule detects unauthorized login attempts over SSH (Port 22), a common vector for targeted attacks and unauthorized access attempts.
logsource:
    category: authentication-linux
detection:
    selection:
        port: '22'
    condition: selection
level: high
"""

log_entry_match = """
{
    "timestamp": "2023-11-20T08:30:00Z",
    "src_ip": "192.168.1.100",
    "user": "john_hacker_doe",
    "action": "login",
    "status": "success",
    "device_type": "mobile",
    "port": "22"
}
"""

log_entry_no_match = """
{
    "timestamp": "2023-11-20T09:00:00Z",
    "src_ip": "192.168.1.101",
    "user": "jane_goody2shoes_doe",
    "action": "login",
    "status": "failed",
    "login_attempts": 3,
    "device_type": "mobile",
    "port": "443"
}
"""

conplex_rule = """
title: Multiple Compressed Files Transferred Outbound
id: 8669dd70-9d59-48c5-8fc0-13cea75cd611
status: stable
description: 'Advesaries may use compressed archives to transfer data. Make sure your zeek or coreligth device has local_orig and local_resp variables filled out correctly matching your organizations subnets. This Sigma query is designed to accompany the Corelight Threat Hunting Guide, which can be found here: https://www3.corelight.com/corelights-introductory-guide-to-threat-hunting-with-zeek-bro-logs'
references:
  - "https://github.com/zeek/zeek/blob/002109973dbb2b86cf9b0be0a85797c5feba5a4e/scripts/base/frameworks/files/magic/archive.sig"
author: SOC Prime Team
tags:
  - attack.ta0010
  - attack.t1560
  - attack.data_compressed
  - attack.automated_exfiltration
logsource:
  product: zeek
  service: files
detection:
  outbound:
    local_orig: true
  pre_filter:
    total_bytes: 0
  selection:
    mime_type:
      - 'application/vnd.ms-cab-compressed'
      - 'application/warc'
      - 'application/x-7z-compressed'
      - 'application/x-ace'
      - 'application/x-arc'
      - 'application/x-archive'
      - 'application/x-arj'
      - 'application/x-compress'
      - 'application/x-cpio'
      - 'application/x-dmg'
      - 'application/x-eet'
      - 'application/x-gzip'
      - 'application/x-lha'
      - 'application/x-lrzip'
      - 'application/x-lz4'
      - 'application/x-lzma'
      - 'application/x-lzh'
      - 'application/x-lzip'
      - 'application/x-rar'
      - 'application/x-rpm'
      - 'application/x-stuffit'
      - 'application/x-tar'
      - 'application/x-xz'
      - 'application/x-zoo'
      - 'application/zip'
  referrer_exists:
    referrer: '*'
  timeframe: 5m
  condition: not pre_filter and selection | count(sha1) by tx_hosts > 25
fields:
  - filename
  - mime_type
  - extracted
  - total_bytes
  - sha1
  - md5
  - sha256
  - rx_hosts
  - local_orig
  - is_orig
  - tx_hosts
level: low
falsepositive:
  - 'Unknown'
"""


@pytest.fixture
def detector():
    return GoDetectorInterface()


def test_add_rule(detector):
    assert detector.update_rule(simple_rule_1) == True


def test_remove_rule(detector):
    detector.update_rule(simple_rule_1)
    rule_id = "f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8"
    assert detector.remove_rule(rule_id) == True


def test_find_match(detector):
    detector.update_rule(simple_rule_1)
    detector.update_rule(simple_rule_2)
    assert detector.find_match_str(
        log_entry_match) == "f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8,c7cc9103-1acb-4058-9479-62e1d734669f"


def test_find_no_match(detector):
    detector.update_rule(simple_rule_1)
    detector.update_rule(simple_rule_2)
    assert detector.find_match_str(log_entry_no_match) == str()


def test_is_valid_test(detector):
    assert detector.is_valid_sigma_rule(simple_rule_1) == True
    assert detector.is_valid_sigma_rule(conplex_rule) == True
