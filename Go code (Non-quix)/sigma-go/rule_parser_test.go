package sigma

import (
	"github.com/google/go-cmp/cmp/cmpopts"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/bradleyjkemp/cupaloy/v2"
	"github.com/google/go-cmp/cmp"
	"gopkg.in/yaml.v3"
)

func TestParseRule(t *testing.T) {
	err := filepath.Walk("./testdata/", func(path string, info os.FileInfo, err error) error {
		if !strings.HasSuffix(path, ".rule.yml") {
			return nil
		}

		t.Run(strings.TrimSuffix(filepath.Base(path), ".rule.yml"), func(t *testing.T) {
			contents, err := ioutil.ReadFile(path)
			if err != nil {
				t.Fatalf("failed reading test input: %v", err)
			}

			rule, err := ParseRule(contents)
			if err != nil {
				t.Fatalf("error parsing rule: %v", err)
			}

			cupaloy.New(cupaloy.SnapshotSubdirectory("testdata")).SnapshotT(t, rule)
		})
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}

func TestMarshalRule(t *testing.T) {
	err := filepath.Walk("./testdata/", func(path string, info os.FileInfo, err error) error {
		if !strings.HasSuffix(path, ".rule.yml") {
			return nil
		}

		t.Run(strings.TrimSuffix(filepath.Base(path), ".rule.yml"), func(t *testing.T) {
			contents, err := ioutil.ReadFile(path)
			if err != nil {
				t.Fatalf("failed reading test input: %v", err)
			}

			rule, err := ParseRule(contents)
			if err != nil {
				t.Fatalf("error parsing rule: %v", err)
			}

			// Create a new temporary file in our testing temp directory
			stream, err := os.CreateTemp(t.TempDir(), filepath.Base(path))
			if err != nil {
				t.Fatalf("error creating temp rule file: %v", err)
			}
			defer os.Remove(stream.Name())
			defer stream.Close()

			// Save the rule to a temporary file
			encoder := yaml.NewEncoder(stream)
			if err := encoder.Encode(&rule); err != nil {
				t.Fatalf("error encoding rule to file: %v", err)
			}

			// Return to the beginning of the stream
			stream.Seek(0, os.SEEK_SET)

			// Re-read the rule from the newly serialized file
			var rule_copy Rule
			decoder := yaml.NewDecoder(stream)
			if err := decoder.Decode(&rule_copy); err != nil {
				t.Fatalf("error decoding rule copy: %v", err)
			}

			if !cmp.Equal(rule, rule_copy, cmpopts.IgnoreUnexported(Condition{}, FieldMatcher{}, Search{})) {
				t.Fatalf("rule and marshalled copy are not equal")
			}
		})
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}

func TestMyTest(t *testing.T) {
	const largeRule = `title: Multiple Kerberos Tickets Used from Single Client
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
  condition: is_sucessful AND is_tgs_client and client_exists and till_exists | count(client) by id_orig_h > 5
  timeframe: 1m
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
	t.Run("Confluent rule test", func(t *testing.T) {
		_, err := ParseRule([]byte(largeRule))
		if err != nil {
			t.Fatalf("error parsing rule: %v", err)
		}
	})
}
