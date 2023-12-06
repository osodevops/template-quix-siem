const alerts = [
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
    {
        "alert_id": "A001",
        "timestamp": "2023-12-06T09:00:00Z",
        "alert_title": "Unauthorized Access Attempt",
        "source_ip": "192.168.1.10",
        "source_port": 443,
        "log_source": "Firewall"
    },
    {
        "alert_id": "A002",
        "timestamp": "2023-12-06T09:30:00Z",
        "alert_title": "Suspicious Login Activity",
        "source_ip": "192.168.1.15",
        "source_port": 22,
        "log_source": "Server Log"
    },
    {
        "alert_id": "A003",
        "timestamp": "2023-12-06T10:00:00Z",
        "alert_title": "Malware Detected",
        "source_ip": "192.168.1.20",
        "source_port": 80,
        "log_source": "Antivirus"
    },
    {
        "alert_id": "A004",
        "timestamp": "2023-12-06T10:30:00Z",
        "alert_title": "Data Exfiltration Attempt",
        "source_ip": "192.168.1.25",
        "source_port": 21,
        "log_source": "IDS"
    },
    {
        "alert_id": "A005",
        "timestamp": "2023-12-06T11:00:00Z",
        "alert_title": "High Resource Usage",
        "source_ip": "192.168.1.30",
        "source_port": 3389,
        "log_source": "System Monitor"
    },
]

export default alerts;