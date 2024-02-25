## Preparing Environment

Open Terminal at the folder for this go project and get dependencies:
```shell
go get github.com/bradleyjkemp/sigma-go
go get github.com/bradleyjkemp/sigma-go/evaluator@v0.6.5
go get github.com/stretchr/testify
```


## Build the go into a shared object enabling it to be callable by Python
```shell
go build -o detector.so -buildmode=c-shared detector.go
```

Copy this so file to the Python detector repo.
Maybe there can be automation here, but it's easier this way for the time being

## Exported methods to be used by Python
Strings param is used to keep marshalling operation simple and fast for the findMatch method.

**findMatch**(string) - String in JSON format (Straight from log message value basically)<br/>
**updateSigmaRule**(string) - Takes a string in the form of yaml<br/>
**removeSigmaRule**(string) - Takes a string in with ruleId (uuid) to remove. 

Todo: The string json only takes one document. It can be improved with a json array to reduce calls from Python with a bit of batching.

## Aggregation support
This is not tested in any way, but sigma-go handles it apparently

```yaml
 detection:
	  login_attempt:
	    # something here
	  condition:
	    login_attempt | count() by (username) > 100
		 timeframe: 100m
```