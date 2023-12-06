import React, {useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';
import AceEditor from 'react-ace';
import { QuixLiveService } from './services/quix.ts';
import 'ace-builds/src-noconflict/theme-twilight';
import './css/mdb.dark.min.css';
import './css/overrides.css';
import { v4 as uuidv4 } from 'uuid';

// TODO: Just for dev
// To be removed later
import sigmaRules from './testSigmaRules';

function App() {
    const [activeStreams, setActiveStreams] = useState([]);
    const [event, setEvent] = useState(null);
    const [data, setData] = useState(null);
    const [inputValue, setInputValue] = useState(''); // new state for input value
    const [quixInputTopic, setQuixInputTopic] = useState(''); // new state for input value
    const [quixLiveService, setQuixLiveService] = useState(null); // new state for input value// new state for input value

    const [selectedRuleData, setSelectedRuleData] = useState('');
    const [leftWidth, setLeftWidth] = useState(280);
    const [isResizing, setIsResizing] = useState(false);
    const [displayOption, setDisplayOption] = useState('alerts'); // Default to 'rules' or 'alert'

    const [alerts, setAlerts] = useState([]);

    const onActiveStreamsChanged = (stream, action) => {
        console.log("Active streams changed " + stream.streamId)
        setActiveStreams(prevStreams => [...prevStreams, stream]);
    };

    const eventReceived = (event) => {
        try {
            let jsonObj = JSON.parse(event.value);
            // This should unshift (insert latest first) into the alerts array state
            setAlerts(currentAlerts => [jsonObj, ...currentAlerts]);
        } catch (e) {
            console.error("Parsing error:", e.message);
        }
    };

    const dataReceived = (data) => {
        setData(data); // set the state here

        console.log("data*******")
        console.log(data)
    };

    const handleSendData = async () => { // new function to handle button click

        let dataObject = {
            timestamps: [Date.now() * 1000000], // Array with a single timestamp
            stringValues: {
                "ReactMessage": [inputValue] // Dictionary with a single key-value pair
            }
        };

        await quixLiveService.sendParameterData(quixInputTopic, "react-messages-stream", dataObject);
    };

    useEffect(() => {

        const startAndSubscribe = async () => {
            // Create an instance of QuixLiveService
            const quixService = new QuixLiveService();

            await quixService.getWorkspaceIdAndToken();
            await quixService.startConnection();

            const inputTopicPromise = await quixService.fetchConfig("input_topic"); //comment this if using manual topic

            /*NOTE -- If working locally you'll need to set the input topic manually*/
            //const inputTopic = "hello-world-source";
            const inputTopic = inputTopicPromise.value;

            setQuixInputTopic(inputTopic);

            console.log("Done starting")

            quixService.subscribeToActiveStreams(onActiveStreamsChanged, inputTopic);
            quixService.subscribeToEvents(eventReceived, inputTopic, "*", "*");
            quixService.subscribeToParameterData(dataReceived, inputTopic, "*", "*");

            setQuixLiveService(quixService);
        };
        startAndSubscribe();
    }, []);



    const handleDisplayChange = (option) => {
        console.log(option)
        setDisplayOption(option);
    };

    const handleRuleClick = ruleId => {
        const rule = sigmaRules[ruleId];
        if (rule) {
            setSelectedRuleData(rule.data);
        }
    };

    const [ruleSearchTerm, setRuleSearchTerm] = useState('');

    const [alertSearchTerm, setAlertSearchTerm] = useState('');

    const handleRuleSearchChange = (event) => {
        setRuleSearchTerm(event.target.value);
    };

    const handleAlertSearchChange = (event) => {
        setAlertSearchTerm(event.target.value);
    };

    const handleCreate = () => {
        // Set an example rule with a UUID and the specified format
        const newRule = `title: '<enter a title>'
id: ${uuidv4()}
description: '<please enter a description>'
author: <author>
tags:
- <tags go here>
logsource:
  category: <some catergory>
detection:
  some_condition:
    some_field_name:
    - 'list_item1'
    - 'list_item2'
  condition: some_condition
level: medium`;

        setSelectedRuleData(newRule);
    };

    const handleDelete = () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this rule?");
        if (isConfirmed) {
            setSelectedRuleData('');
        }
    };

    const filteredSigmaRules = Object.values(sigmaRules).filter(rule =>
        rule.name.toLowerCase().includes(ruleSearchTerm.toLowerCase())
    );

    const filteredAlerts = Object.values(alerts).filter(alert =>
        alert.alert_id.toLowerCase().includes(alertSearchTerm.toLowerCase()) ||
        alert.timestamp.toLowerCase().includes(alertSearchTerm.toLowerCase()) ||
        alert.alert_title.toLowerCase().includes(alertSearchTerm.toLowerCase()) ||
        alert.source_ip.toLowerCase().includes(alertSearchTerm.toLowerCase()) ||
        alert.source_port.toString().includes(alertSearchTerm) ||
        alert.log_source.toLowerCase().includes(alertSearchTerm.toLowerCase())
    );

    function getAlertData(alerts) {
        // Process your alerts data to count alerts per minute
        // This is a placeholder function
        const countsPerMinute = {}; // e.g., { '2023-12-06T09:00': 2, '2023-12-06T09:01': 3, ... }
        alerts.forEach(alert => {
            const minute = alert.timestamp.slice(0, 16); // Extract up to the minute
            countsPerMinute[minute] = (countsPerMinute[minute] || 0) + 1;
        });

        // Convert the counts object into arrays for labels and data
        const labels = Object.keys(countsPerMinute);
        const data = Object.values(countsPerMinute);

        return { labels, data };
    }

    const startResizing = (mouseDownEvent) => {
        setIsResizing(true);

        const startWidth = leftWidth;
        const startPosition = mouseDownEvent.clientX;

        const onMouseMove = (mouseMoveEvent) => {
            const newWidth = startWidth + mouseMoveEvent.clientX - startPosition;
            setLeftWidth(newWidth);
        };

        const onMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const [hoveredRuleId, setHoveredRuleId] = useState(null);

    function getAlertStageParts() {
        const chartData = {
            labels: getAlertData(filteredAlerts).labels, // The timestamps
            datasets: [
                {
                    label: 'Alerts per Minute',
                    data: getAlertData(filteredAlerts).data, // The alert counts
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        };

        const chartOptions = {
            // Options for the chart
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Alerts'
                    },
                    beginAtZero: true
                }
            }
        };

        return (
            <div className="row" style={{ height: 'calc(100vh - 140px)' }}>
                <div className="form-outline" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{marginTop: "5px"}}>Search:&nbsp;</div>
                        <input
                            type="search"
                            id="form1"
                            className="form-control"
                            placeholder="Search alerts..."
                            aria-label="Search"
                            value={alertSearchTerm}
                            onChange={handleAlertSearchChange}
                            style={{ backgroundColor: 'black', marginLeft: '8px', marginTop: '6px', width: '300px' }}
                        />
                    </div>
                </div>
                <div style={{ height: '50%', overflow: 'auto' }}>
                    <table id="alertTable" style={{ borderSpacing: 0, width: '100%' }}>
                        <thead style={{
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#333',
                            zIndex: 10,
                            margin: 0,
                            padding: 0
                        }}>
                        <tr>
                            <th>Alert ID</th>
                            <th>Timestamp</th>
                            <th>Alert Title</th>
                            <th>Source IP</th>
                            <th>Source Port</th>
                            <th>Log Source</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredAlerts.map((alert) => (
                            <tr key={alert.alert_id}>
                                <td>{alert.alert_id}</td>
                                <td>{alert.timestamp}</td>
                                <td>{alert.alert_title}</td>
                                <td>{alert.source_ip}</td>
                                <td>{alert.source_port}</td>
                                <td>{alert.log_source}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ height: '50%', marginTop: '20px' }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        );
    }


    function getSigmaRulesManagerParts() {
        return <div className="row" style={{flexWrap: 'nowrap'}}>
            <div id="columnLeft" style={{
                width: leftWidth + 'px',
                flex: 'none',
                marginRight: '5px',
                backgroundColor: '#333333',
                position: 'relative'
            }}>
                <div className="p-3">
                    <button onClick={handleCreate} className="btn btn-primary btn-block mt-2">Create Rule</button>
                    <div className="form-outline">
                        <input
                            type="search"
                            id="form1"
                            className="form-control"
                            placeholder="Search rules..."
                            aria-label="Search"
                            value={ruleSearchTerm}
                            onChange={handleRuleSearchChange}
                            style={{backgroundColor: 'black', marginTop: '10px'}}
                        />
                    </div>
                </div>

                {filteredSigmaRules.map(rule => (
                    <div
                        key={rule.id}
                        onClick={() => handleRuleClick(rule.id)}
                        onMouseEnter={() => setHoveredRuleId(rule.id)}
                        onMouseLeave={() => setHoveredRuleId(null)}
                        style={{
                            padding: '4px',
                            cursor: 'pointer',
                            backgroundColor: hoveredRuleId === rule.id ? 'black' : '',
                            color: hoveredRuleId === rule.id ? 'white' : '',
                        }}>
                        {rule.name}
                    </div>
                ))}
                <div onMouseDown={startResizing} style={{
                    cursor: 'col-resize',
                    width: '5px',
                    height: '100%',
                    position: 'absolute',
                    right: '0',
                    top: '0'
                }}/>
            </div>
            <div id="columnRight"
                 style={{flexGrow: 1, backgroundColor: '#1e1e1e'}}> {/* This column grows to take remaining space */}
                <div style={{position: 'absolute', right: '10px', bottom: '10px'}}>
                    <button onClick={handleDelete} className="btn btn-primary" style={{marginRight: '8px'}}>Delete
                    </button>
                    <button onClick={() => {/* handle validation logic */
                    }} className="btn btn-primary" style={{marginRight: '8px'}}>Validate
                    </button>
                    <button onClick={() => {/* handle save logic */
                    }} className="btn btn-primary">Save
                    </button>
                </div>
                <AceEditor
                    mode="javascript"
                    theme="twilight"
                    name="editor"
                    fontSize={18}
                    value={selectedRuleData}
                    style={{width: '100%', height: 'calc(100vh - 114px)', textAlign: 'left'}}
                />
            </div>
        </div>;
    }

    return (
        <div className="container-fluid">
            <div style={{
                color: '#505050',
                height: '55px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // Adjusted for spacing between elements
                fontSize: '24px',
                fontWeight: 'bold',
                paddingLeft: '10px',
                backgroundColor: '#252526'
            }}>
                QUIX SIEM SYSTEM

                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" viewBox="0 0 400 128">
                        <g fill="none" fill-rule="evenodd">
                            <path className="change-fill" fill="#ffffff" d="M236.033058,45.6198347 L264.46281,74.0495868 L264.46281,102.479339 C264.46281,117.085217 252.622407,128.92562 238.016529,128.92562 L163.966942,128.92562 L135.53719,100.495868 L222.809917,100.495868 C230.112856,100.495868 236.033058,94.5756661 236.033058,87.2727273 L236.033058,45.6198347 Z M100.495868,0 L128.92562,28.4297521 L128.92562,102.479339 C128.92562,117.085217 117.085217,128.92562 102.479339,128.92562 L28.4297521,128.92562 L0,100.495868 L87.2727273,100.495868 C94.5756661,100.495868 100.495868,94.5756661 100.495868,87.2727273 L100.495868,0 Z M371.570248,0 L400,28.4297521 L400,102.479339 C400,117.085217 388.159597,128.92562 373.553719,128.92562 L299.504132,128.92562 L271.07438,100.495868 L358.347107,100.495868 C365.650046,100.495868 371.570248,94.5756661 371.570248,87.2727273 L371.570248,0 Z"></path>
                            <path fill="#2AF4A3" d="M100.495868,0 L100.495868,28.4297521 L41.6528926,28.4297521 C34.3499537,28.4297521 28.4297521,34.3499537 28.4297521,41.6528926 L28.4297521,100.495868 L0,100.495868 L0,26.446281 C0,11.8404033 11.8404033,0 26.446281,0 L100.495868,0 Z M371.570248,0 L371.570248,28.4297521 L312.727273,28.4297521 C305.424334,28.4297521 299.504132,34.3499537 299.504132,41.6528926 L299.504132,100.495868 L271.07438,100.495868 L271.07438,26.446281 C271.07438,11.8404033 282.914783,0 297.520661,0 L371.570248,0 Z M236.033058,0 L264.46281,28.4297521 L177.190083,28.4297521 C169.887144,28.4297521 163.966942,34.3499537 163.966942,41.6528926 L163.966942,83.3057851 L135.53719,54.8760331 L135.53719,26.446281 C135.53719,11.8404033 147.377593,0 161.983471,0 L236.033058,0 Z"></path>
                        </g>
                    </svg>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingRight: '10px'
                }}>
                    <div style={{
                        color: '#707070',
                        marginRight: '15px',
                        cursor: 'pointer',
                        fontSize: '15px'
                    }} onClick={() => handleDisplayChange('alerts')}>ALERTS
                    </div>
                    <div style={{color: '#909090', marginRight: '15px', fontSize: '18px'}}>|</div>
                    <div style={{
                        color: '#707070',
                        cursor: 'pointer',
                        marginRight: '15px',
                        fontSize: '15px'
                    }} onClick={() => handleDisplayChange('rules')}>RULES MANAGER
                    </div>
                </div>
            </div>

            {displayOption === 'rules' && getSigmaRulesManagerParts()}
            {displayOption === 'alerts' && getAlertStageParts()}
        </div>
    );
}

export default App;
