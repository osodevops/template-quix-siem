## SIEM Detector info

We chose Go to boost our SIEM process's efficiency in cycling through and comparing each rule against a log entry. For instance, in a context like ZEEK, with approximately a hundred rules, the system must evaluate each rule against every log entry to find potential matches. Although marshalling calls from Python to Go introduces some overhead, employing batch processing can alleviate this further. Yet, the wrapper hasn't integrated batch processing so far.
There are 2 folders here:

* **SiemDetector**: This contains the wrapper code + unit tests that makes calls on the sigma-go code. Sigma-rules are held and updated in memory within this code. The Python code calls methods on this code 

* **sigma-go**: A slightly modified version of the original sigma-go found in Github. There are still some bugs that need ironing out, especially with rules where there are less then/greater than operands and integer values. Be sure to write unit tests for each change. 

