const sigmaRules = {
        "b57e511e-6249-4d04-a12e-0a90801fd0a6": {
            id: "b57e511e-6249-4d04-a12e-0a90801fd0a6",
            name: "Suspicious Process Creation",
            data: `title: Suspicious Process Creation
id: b57e511e-6249-4d04-a12e-0a90801fd0a6
status: experimental
description: Detects the execution of suspicious processes
author: John Doe
logsource:
  product: windows
  service: sysmon
detection:
  selection:
    EventID: 1
  condition: selection
level: high`
        },
        "874592f5-ec93-4c62-afae-0fe99c27f766": {
            id: "874592f5-ec93-4c62-afae-0fe99c27f766",
            name: "Failed User Authentication",
            data: `title: Failed User Authentication
id: 874592f5-ec93-4c62-afae-0fe99c27f766
status: stable
description: Detects a high number of failed user authentications in a short time frame
author: Jane Smith
logsource:
  product: linux
  service: auth.log
detection:
  selection:
    EventID: 4625
  condition: selection | count() > 5 within 1m
level: medium`
        },
        "071560ed-693d-4680-b572-1dba4b257431": {
            id: "071560ed-693d-4680-b572-1dba4b257431",
            name: "Potential Data Exfiltration",
            data: `title: Potential Data Exfiltration via Command Line
id: 071560ed-693d-4680-b572-1dba4b257431
status: experimental
description: Detects potential data exfiltration via commonly abused command line tools
author: John Doe
logsource:
  product: windows
  service: sysmon
detection:
  selection:
    EventID: 1
    CommandLine:
      - '* > ftp*'
      - '*copy* > *http*'
  condition: selection
falsepositives:
  - Legitimate administrative activity
level: medium`
        }
};

export default sigmaRules;