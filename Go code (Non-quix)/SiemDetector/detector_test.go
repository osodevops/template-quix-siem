package main

import (
	"github.com/osodevops/sigma-go/evaluator"
	"github.com/stretchr/testify/assert"
	"testing"
)

// TestConvertToJsonObject tests the convertToJsonObject function
func TestConvertToJsonObject(t *testing.T) {
	// Test with valid JSON
	validJSON := `{"key": "value"}`
	errFlag, resultMap := convertToJsonObject(validJSON)
	if errFlag || resultMap["key"] != "value" {
		t.Errorf("convertToJsonObject() with valid JSON failed, got: %v, want: %v.", resultMap, map[string]interface{}{"key": "value"})
	}

	// Test with invalid JSON
	invalidJSON := `{"key": "value"`
	errFlag, resultMap = convertToJsonObject(invalidJSON)
	if !errFlag {
		t.Errorf("convertToJsonObject() with invalid JSON should have failed")
	}
}

func TestUpdateSigmaRuleInternal(t *testing.T) {
	// Example Sigma rule in YAML format
	const exampleRule = `title: APT40 Dropbox Tool User Agent
id: 5ba715b6-71b7-44fd-8245-f66893e81b3d
status: experimental
description: Detects suspicious user agent string of APT40 Dropbox tool
references:
    - Internal research from Florian Roth
author: Thomas Patzke
date: 2019/11/12
modified: 2020/09/02
tags:
    - attack.command_and_control
    - attack.t1071.001
    - attack.t1043  # an old one
    - attack.exfiltration
    - attack.t1567.002
    - attack.t1048  # an old one 
logsource:
    category: proxy
detection:
    selection:
      c-useragent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'
      r-dns: 'api.dropbox.com'
    condition: selection
fields:
    - c-ip
    - c-uri
falsepositives:
    - Old browsers
level: high`

	const exampleRule2 = `title: SQL Injection Attempt Detected
id: 8a1ef9de-810e-49c7-9f81-3eb497ad7a4f
status: experimental
description: Detects potential SQL injection attempts in web server logs
references:
    - https://owasp.org/www-community/attacks/SQL_Injection
author: Jane Doe
date: 2023/11/19
modified: 2023/11/19
tags:
    - attack.injection
    - attack.t1190
logsource:
    category: webserver
detection:
    keywords:
      - 'SELECT * FROM'
      - 'DROP TABLE'
      - 'OR 1=1'
      - '--'
    conditions:
      - keywords
fields:
    - client_ip
    - request_uri
    - http_user_agent
falsepositives:
    - Developers testing
    - Legitimate administrative actions
level: critical
`
	// and/or conditions need setting to lowercase to be compatible with sigma-go
	const confluentSigmaRule = `title: Multiple Kerberos Tickets Used from Single Client
id: d25d5f38-ea9d-45fd-b009-f6edbf28a21e
description: 'A single client should rarely use multiple kerberos tickets. This rule looks for this scenario which could be an indication that multiple kerberos tickets have been stolen or used that belong to other computer or service accounts and or users. This is a supported version of research done within the Open Threat Research (OTR) community.'
author: 'Nate Guagenti (@neu5ron), Open Threat Research (OTR), SOC Prime Team'
references:
- "https://github.com/OTRF/detection-hackathon-apt29/issues/48#issuecomment-623217460"
- "https://github.com/OTRF/detection-hackathon-apt29"
tags:
- attack.lateral_movement
- attack.t1021 # Lateral Movement: Remote Services
logsource:
  product: zeek
  service: kerberos
detection:
  is_sucessful:
    successful: 'true'
  is_tgs_client:
    request_type: 'TGS'
  client_exists:
    client: '*'
  till_exists:
    till: '*'
  timeframe: 1m
  condition: is_sucessful and is_tgs_client and client_exists and till_exists | count(client) by id_orig_h > 5
level: medium
fields:
- ts
- id.orig_h
- id.orig_p
- id.resp_h
- id.resp_p
- request_type
- client_cert_subject
- service
- server_cert_subject
- renewable
- auth_ticket
- from
- till
falsepositive:
- 'When a single client or user uses multiple different accounts from a single source in a short amount of time.'
- 'Performance monitoring or scanning type systems that have a large amount of access. Verify if this is supposed to be the case.'
`

	const updatedRule = `title: APT40 Dropbox Tool User Agent
id: 5ba715b6-71b7-44fd-8245-f66893e81b3d
status: experimental
description: Detects suspicious user agent string of APT40 Dropbox tool
references:
    - Internal research from Florian Roth
author: Thomas Patzke
date: 2019/11/12
modified: 2020/09/02
tags:
    - attack.command_and_control
    - attack.t1071.001
    - attack.t1043  # an old one
    - attack.exfiltration
    - attack.t1567.002
    - attack.t1048  # an old one 
logsource:
    category: proxy
detection:
    selection:
      c-useragent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'
      r-dns: 'api.dropbox.com'
    condition: selection
fields:
    - c-ip
    - c-uri
falsepositives:
    - Old browsers
level: medium`

	// Reset rulesMap before each test
	defer func() { rulesMap = make(map[string]evaluator.RuleEvaluator) }()

	// Test adding a new Sigma rule
	t.Run("Add New Sigma Rule Evaluator", func(t *testing.T) {
		assert.True(t, updateSigmaRuleInternal(exampleRule), "Expected successful rule addition")

		rule, exists := rulesMap["5ba715b6-71b7-44fd-8245-f66893e81b3d"]
		assert.True(t, exists, "Rule should exist after addition")
		assert.Equal(t, "APT40 Dropbox Tool User Agent", rule.Title, "Rule title should match")

		assert.True(t, updateSigmaRuleInternal(exampleRule2), "Expected exampleRule2 successful rule addition")
		assert.Equal(t, 2, len(rulesMap), "expected 2 rules to be in the map")
	})

	// Test updating a Sigma rule
	t.Run("Updating Sigma Rule Evaluator", func(t *testing.T) {
		assert.True(t, updateSigmaRuleInternal(exampleRule), "Expected successful rule addition")
		assert.True(t, updateSigmaRuleInternal(updatedRule), "Expected successful rule updated")

		rule, exists := rulesMap["5ba715b6-71b7-44fd-8245-f66893e81b3d"]
		assert.True(t, exists, "Rule should exist after updating")
		assert.Equal(t, "medium", rule.Level, "Rule level should be updated")
	})

	// Test large rule
	t.Run("Updating Sigma Rule Evaluator", func(t *testing.T) {
		assert.True(t, updateSigmaRuleInternal(confluentSigmaRule), "Expected successful large rule addition")

		rule, exists := rulesMap["5ba715b6-71b7-44fd-8245-f66893e81b3d"]
		assert.True(t, exists, "Rule should exist after updating")
		assert.Equal(t, "medium", rule.Level, "Rule level should be updated")
	})

	// Test removing an existing Sigma rule
	t.Run("Remove Existing Sigma Rule Evaluator", func(t *testing.T) {
		// First add a rule to be removed
		assert.True(t, updateSigmaRuleInternal(exampleRule), "Expected successful rule addition")
		assert.True(t, removeSigmaRuleInternal("5ba715b6-71b7-44fd-8245-f66893e81b3d"), "Expected successful rule removal")

		_, exists := rulesMap["5ba715b6-71b7-44fd-8245-f66893e81b3d"]
		assert.False(t, exists, "Rule should not exist after removal")
	})

	// Test removing a non-existing Sigma rule
	t.Run("Remove Non-Existing Sigma Rule Evaluator", func(t *testing.T) {
		assert.False(t, removeSigmaRuleInternal("some-unknown-id"), "Expected failure on removing non-existing rule")
	})
}

func TestSigmaRuleValidity(t *testing.T) {
	const validRule = `title: Suspicious Login Attempt Detected
id: f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8
status: experimental
description: Detects login attempts from a known suspicious IP address
logsource:
    category: authentication
detection:
    selection:
        src_ip: '192.168.1.100'
        action: 'login'
    condition: selection
level: high
`

	const invalidRule1 = `some non yaml
`
	const invalidRule2 = `# Random YAML content
person:
  name: John Doe
  age: 30
  occupation: Developer
  languages:
    - English
    - Spanish
`

	const missingId = `title: Suspicious Login Attempt Detected
status: experimental
description: Detects login attempts from a known suspicious IP address
logsource:
    category: authentication
detection:
    selection:
        src_ip: '192.168.1.100'
        action: 'login'
    condition: selection
level: high
`

	const missingTitle = `id: f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8
status: experimental
description: Detects login attempts from a known suspicious IP address
logsource:
    category: authentication
detection:
    selection:
        src_ip: '192.168.1.100'
        action: 'login'
    condition: selection
level: high
`

	const missingLogSource = `title: Suspicious Login Attempt Detected
id: f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8
status: experimental
description: Detects login attempts from a known suspicious IP address
detection:
    selection:
        src_ip: '192.168.1.100'
        action: 'login'
    condition: selection
level: high
`

	const missingDetection = `title: Suspicious Login Attempt Detected
id: f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8
status: experimental
description: Detects login attempts from a known suspicious IP address
logsource:
    category: authentication
level: high
`

	t.Run("Finds 2 matched sigma rules based on one log entry", func(t *testing.T) {
		// Add the simpleRule to the rulesMap
		assert.True(t, isValidSigmaRuleInternal(validRule), "Expected successful rule to be valid")
		assert.False(t, isValidSigmaRuleInternal(invalidRule1), "Expected successful rule1 to be invalid")
		assert.False(t, isValidSigmaRuleInternal(invalidRule2), "Expected successful rule2 to be invalid")
		assert.False(t, isValidSigmaRuleInternal(missingId), "Expected successful missing id to be invalid")
		assert.False(t, isValidSigmaRuleInternal(missingTitle), "Expected successful missing title to be invalid")
		assert.False(t, isValidSigmaRuleInternal(missingLogSource), "Expected successful missing log source to be invalid")
		assert.False(t, isValidSigmaRuleInternal(missingDetection), "Expected successful missing detection source to be invalid")
	})

}
func TestEvaluations(t *testing.T) {
	const simpleRule1 = `title: Suspicious Login Attempt Detected
id: f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8
status: experimental
description: Detects login attempts from a known suspicious IP address
logsource:
    category: authentication
detection:
    selection:
        src_ip: '192.168.1.100'
        action: 'login'
    condition: selection
level: high
`

	const simpleRule2 = `title: Unauthorized SSH Login Attempt Detection
id: c7cc9103-1acb-4058-9479-62e1d734669f
status: experimental
description: This rule detects unauthorized login attempts over SSH (Port 22), a common vector for targeted attacks and unauthorized access attempts.
logsource:
    category: authentication
detection:
    selection:
        port: '22'
    condition: selection
level: high
`

	const logEntryMatch = `{
    "timestamp": "2023-11-20T08:30:00Z",
    "src_ip": "192.168.1.100",
    "user": "john_hacker_doe",
    "action": "login",
    "status": "success",
    "device_type": "mobile",
	"port": "22"
}
`

	const logEntryNoMatch = `{
    "timestamp": "2023-11-20T09:00:00Z",
    "src_ip": "192.168.1.101",
    "user": "jane_goody2shoes_doe",
    "action": "login",
    "status": "failed",
    "login_attempts": 3,
    "device_type": "mobile",
	"port": "443"
}
`

	const greaterAndLessThanRule = `title: Client Sending Large Amount of Data 
id: 32688a1a-c953-4afb-b96a-f366cf9782d1
description: 'Client is sending a large amount of data to another host. Verify if the destination is a known host for transfering files/data too. This Sigma query is designed to accompany the Corelight Threat Hunting Guide, which can be found here: https://www3.corelight.com/corelights-introductory-guide-to-threat-hunting-with-zeek-bro-logs'
author: SOC Prime Team
logsource:
  product: zeek
  service: conn
tags:
  - attack.t1039
  - attack.collection 
detection:
  selection:
    orig_bytes|lt: 1000000000 # 1GB
    resp_bytes|gt: 100000000 # 100MB
  condition: selection
fields:
  - id.orig_h
  - id.orig_p
  - id.resp_h
  - id.resp_p
  - orig_bytes
  - resp_bytes
  - service
  - duration
  - orig_pkts
  - orig_ip_bytes
  - resp_pkts
  - resp_ip_bytes
falsepositive:
  - 'Backup servers such as for VMs, cloud file backups, etc.'
  - 'One time file sync/transfer that is non malicious'
`

	const bytesReceivedLogEntry = `{
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
}`

	// Reset rulesMap before each test
	defer func() { rulesMap = make(map[string]evaluator.RuleEvaluator) }()

	t.Run("Finds 2 matched sigma rules based on one log entry", func(t *testing.T) {
		// Add the simpleRule to the rulesMap
		assert.True(t, updateSigmaRuleInternal(simpleRule1), "Expected successful rule addition 1")
		assert.True(t, updateSigmaRuleInternal(simpleRule2), "Expected successful rule addition 2")

		// Test case where the log entry should match the rule
		t.Run("2 Matches Found", func(t *testing.T) {
			result := findMatchInternal(logEntryMatch)
			assert.Equal(t, "f7ae45f0-76f4-4f43-bf0d-f2a4e20ad6c8,c7cc9103-1acb-4058-9479-62e1d734669f", result, "Expected a match with the rule IDs")
		})
	})

	t.Run("Finds less than greater than combos", func(t *testing.T) {
		// Add the simpleRule to the rulesMap
		assert.True(t, updateSigmaRuleInternal(greaterAndLessThanRule), "Expected successful rule addition 1")

		// Test case where the log entry should match the rule
		t.Run("1 Matches Found", func(t *testing.T) {
			result := findMatchInternal(bytesReceivedLogEntry)
			assert.Equal(t, "32688a1a-c953-4afb-b96a-f366cf9782d1", result, "Expected a match with the rule IDs")
		})
	})

	t.Run("Don't find a match", func(t *testing.T) {
		// Add the simpleRule to the rulesMap
		assert.True(t, updateSigmaRuleInternal(simpleRule1), "Expected successful rule addition 1")
		assert.True(t, updateSigmaRuleInternal(simpleRule2), "Expected successful rule addition 2")

		// Test case where the log entry should not match the rule
		t.Run("No Match Found", func(t *testing.T) {
			result := findMatchInternal(logEntryNoMatch)
			assert.Empty(t, result, "Expected no match")
		})
	})
}
