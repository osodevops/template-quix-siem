// This code is called from a Quix Python client
// It maintains in memory sigma rules
// These rules are then evaluated for json formatted logs (currently one at a time)
// If there is a match the ruleId(s) are returned.
package main

/*
#include <stdbool.h>
*/
import "C"
import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/osodevops/sigma-go"
	"github.com/osodevops/sigma-go/evaluator"
	"strings"
)

var rulesMap = make(map[string]evaluator.RuleEvaluator)

//export findMatch
func findMatch(input *C.char) *C.char {
	jsonString := C.GoString(input)
	return C.CString(findMatchInternal(jsonString))
}

//export updateSigmaRule
func updateSigmaRule(input *C.char) C.bool {
	yamlString := C.GoString(input)
	return C.bool(updateSigmaRuleInternal(yamlString))
}

//export removeSigmaRule
func removeSigmaRule(input *C.char) C.bool {
	ruleId := C.GoString(input)
	return C.bool(removeSigmaRuleInternal(ruleId))
}

//export isValidSigmaRule
func isValidSigmaRule(input *C.char) C.bool {
	ruleId := C.GoString(input)
	return C.bool(isValidSigmaRuleInternal(ruleId))
}

func findMatchInternal(jsonString string) string {
	var matchingIds []string
	isInvalid, resultMap := convertToJsonObject(jsonString)

	if isInvalid {
		fmt.Println("Golang - Error occurred while trying to convert to json with this data: ", jsonString)
		return `Error,Could not convert the log data to a Json object`
	}

	for _, ruleEvaluator := range rulesMap {
		result, err := ruleEvaluator.Matches(context.Background(), resultMap)

		if err != nil {
			fmt.Println("Golang - Error occurred matching rule to data for Id: ", ruleEvaluator.ID, "For data: ", jsonString)
			continue
		}

		if result.Match {
			matchingIds = append(matchingIds, ruleEvaluator.ID)
			fmt.Println("Golang - Matching found for Id: ", ruleEvaluator.ID, "For data: ", jsonString)
		}
	}

	return strings.Join(matchingIds, ",")
}

func convertToJsonObject(jsonString string) (bool, map[string]interface{}) {
	var jsonMap map[string]interface{}
	err := json.Unmarshal([]byte(jsonString), &jsonMap)
	if err != nil {
		fmt.Println("Golang - Error in JSON un-marshaling: ", err)
		return true, nil
	}

	return false, jsonMap
}

func updateSigmaRuleInternal(sigmaRuleString string) bool {
	if !isValidSigmaRuleInternal(sigmaRuleString) {
		return false
	}

	var rule, err = sigma.ParseRule([]byte(sigmaRuleString))
	var ruleEvaluatorPtr = evaluator.ForRule(rule)

	if ruleEvaluatorPtr != nil {
		rulesMap[rule.ID] = *ruleEvaluatorPtr
		fmt.Println("Golang - Added/Updated Rule id: ", rule.ID, "-", rule.Title)
	} else {
		fmt.Println("Golang - Error, Rule evaluator is nil, Rule id: ", rule.ID,
			"Error: ", err)
		return false
	}

	return true
}

func removeSigmaRuleInternal(ruleId string) bool {
	if _, exists := rulesMap[ruleId]; exists {
		delete(rulesMap, ruleId)
		fmt.Println("Golang - Removed Rule id: ", ruleId)
		return true
	} else {
		fmt.Println("Golang - Could not find expected sigma rule to remove: ", ruleId)
		return false
	}
}

func isValidSigmaRuleInternal(sigmaRuleString string) bool {
	// The parser reads any old yaml - does not report on valid sigma rules!
	var rule, err = sigma.ParseRule([]byte(sigmaRuleString))
	var ruleEvaluatorPtr = evaluator.ForRule(rule)

	if err != nil {
		fmt.Println("Golang - Sigma yaml is invalid:", sigmaRuleString)
		fmt.Println("Error:", err)
		return false
	}

	if rule.ID == "" {
		fmt.Println("Golang - Sigma rule id is not specified:", sigmaRuleString)
		return false
	}

	if rule.Title == "" {
		fmt.Println("Golang - Sigma rule does not contain a title. Rule id:", rule.ID)
		return false
	}

	if rule.Logsource.Category == "" && rule.Logsource.Product == "" && rule.Logsource.Service == "" &&
		rule.Logsource.Definition == "" && len(rule.Logsource.AdditionalFields) == 0 {
		fmt.Println("Golang - Sigma rule does not contain any log source information, Rule id:", rule.ID)
		return false
	}

	if len(rule.Detection.Searches) == 0 && rule.Detection.Conditions == nil && rule.Detection.Timeframe == 0 {
		fmt.Println("Golang - Sigma rule does not contain any detection logic, Rule id:", rule.ID)
		return false
	}

	if ruleEvaluatorPtr == nil {
		fmt.Println("Golang - Sigma rule return pointer is nil, Rule id:", rule.ID)
		return false
	}

	return true
}

func main() {}
