import pytest
import re

from go_detector_interface import GoDetectorInterface


# These tests are for checking the capabilities of the sigma-go with more complex sigma rules

@pytest.fixture
def detector():
    return GoDetectorInterface()


def add_rule(file_name):
    with open("sigma-rules/zeek/" + file_name, 'r') as file:
        data = file.read()

    GoDetectorInterface().update_rule(data)

    match = re.search(r'id:\s*([^\n\r]+)', data)
    if match:
        return match.group(1)
    else:
        raise ValueError("No rule ID found")


# Sample test using the common method
def test_contains():
    # Contains test on robots with php extension, post and 200.
    malicious_log_data = '{ "uri": "/path/to/contains-robots-word.php", "method": "POST", "status_code": 200}'
    # Normal log entry, called
    friendly_log_data = '{ "uri": "/path/to/just-robot-word.php", "method": "POST", "status_code": 200}'

    rule_id = add_rule("zeek_corelight_possible_webshell_-_dirty_word_list.yml")

    assert GoDetectorInterface().find_match_str(
        malicious_log_data) == rule_id

    assert GoDetectorInterface().find_match_str(
        friendly_log_data) == str()


def test_endwith():
    # contains shell and endswith php extension, post and 200
    malicious_log_data = '{ "uri": "/path/to/shell.php", "method": "POST", "status_code": 200}'
    # Normal html file log entry with html extension
    friendly_log_data = '{ "uri": "/path/to/shell.html", "method": "POST", "status_code": 200}'

    rule_id = add_rule("zeek_corelight_possible_webshell_-_dirty_word_list.yml")

    assert GoDetectorInterface().find_match_str(
        malicious_log_data) == rule_id

    assert GoDetectorInterface().find_match_str(
        friendly_log_data) == str()


def test_not_condition():
    # This test ends with php thus satisfies the condition "uri|endswith" and in the list is .php
    malicious_log_data = '{ "uri": "/path/to/shell.php", "method": "POST", "status_code": 200}'
    # Same log entry but with Status code 4nn used in the filter with a Not op.
    friendly_log_data = '{ "uri": "/path/to/shell.php", "method": "POST", "status_code": 401}'

    rule_id = add_rule("zeek_corelight_possible_webshell_-_dirty_word_list.yml")

    assert GoDetectorInterface().find_match_str(
        malicious_log_data) == rule_id

    assert GoDetectorInterface().find_match_str(
        friendly_log_data) == str()

def test_greater_than():
    # orig_bytes less than 1GB
    # resp_bytes more than 100MB
    malicious_log_data = """{
  "id.orig_h": "192.168.1.10",
  "id.orig_p": 12345,
  "id.resp_h": "192.168.1.20",
  "id.resp_p": 80,
  "orig_bytes": 999999999,
  "resp_bytes": 100000001,
  "service": "http",
  "duration": 15.5,
  "orig_pkts": 9000,
  "orig_ip_bytes": 920000000,
  "resp_pkts": 8500,
  "resp_ip_bytes": 160000000
}"""

    # orig_bytes less than 1GB
    # resp_bytes less than 100MB
    friendly_log_data = """
{
  "id.orig_h": "192.168.1.30",
  "id.orig_p": 54321,
  "id.resp_h": "192.168.1.40",
  "id.resp_p": 443,
  "orig_bytes": 1000000001,  
  "resp_bytes": 99999999,
  "service": "https",
  "duration": 10.2,
  "orig_pkts": 5000,
  "orig_ip_bytes": 510000000,
  "resp_pkts": 4000,
  "resp_ip_bytes": 55000000
}
"""

    rule_id = add_rule("zeek_corelight_client_sending_large_amount_of_data.yml")

    assert GoDetectorInterface().find_match_str(
        malicious_log_data) == rule_id

    assert GoDetectorInterface().find_match_str(
        friendly_log_data) == str()


def test_regex():
    # Non-ASCII characters in URI, fulfilling the selection criteria
    malicious_log_data = """{
  "ts": "2023-12-01T12:00:00.000000Z",
  "uid": "C1LrSi3BKY30IjwHja",
  "id.orig_h": "10.0.0.1",
  "id.orig_p": 50500,
  "id.resp_h": "192.168.1.15",
  "id.resp_p": 80,
  "trans_depth": 1,
  "method": "POST",
  "host": "example.com",
  "uri": "/upload/файл",  
  "version": "1.1",
  "user_agent": "Mozilla/5.0",
  "request_body_len": 1024,
  "response_body_len": 200,
  "status_code": 200,
  "status_msg": "OK"
}"""

    # Same log with a valid uri
    friendly_log_data = """{
  "ts": "2023-12-01T12:00:00.000000Z",
  "uid": "C1LrSi3BKY30IjwHja",
  "id.orig_h": "10.0.0.1",
  "id.orig_p": 50500,
  "id.resp_h": "192.168.1.15",
  "id.resp_p": 80,
  "trans_depth": 1,
  "method": "POST",
  "host": "example.com",
  "uri": "/upload/options?fileName=text.txt", 
  "version": "1.1",
  "user_agent": "Mozilla/5.0",
  "request_body_len": 1024,
  "response_body_len": 200,
  "status_code": 200,
  "status_msg": "OK"
}"""

    rule_id = add_rule("zeek_corelight_http_post_or_put_uri_non_ascii_character.yml")

    assert GoDetectorInterface().find_match_str(
        malicious_log_data) == rule_id

    assert GoDetectorInterface().find_match_str(
        friendly_log_data) == str()
