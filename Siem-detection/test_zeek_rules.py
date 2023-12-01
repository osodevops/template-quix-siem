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
        friendly_log_data) == str()

    assert GoDetectorInterface().find_match_str(
        malicious_log_data) == rule_id
