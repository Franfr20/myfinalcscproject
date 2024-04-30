// Toggle visibility of sections based on navigation
function showSection(sectionId) {
    document.querySelectorAll('.content').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Check an IP address and store it
async function checkIP() {
    const ip = document.getElementById('checkIpInput').value.trim();
    if (!ip) {
        alert('Please enter an IP address to check.');
        return;
    }

    const apiUrl = `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`;
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            "Key": "b8c97c2963616723c8b58e8a8ebe8a70e4c8e8f19e349fc8541316f7010d782e4464b8f73aad8445",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }),
        redirect: 'follow'
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`${data.errors[0].detail} (Status code: ${response.status})`);
        }
        document.getElementById('checkResult').innerHTML = `IP Address: ${data.data.ipAddress}, Abuse Confidence Score: ${data.data.abuseConfidenceScore}`;
        storeCheckedIP(ip);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('checkResult').innerHTML = `Error checking IP: ${error.message}`;
    }
}

// Store checked IP in local storage
function storeCheckedIP(ip) {
    let checkedIPs = JSON.parse(localStorage.getItem('checkedIPs')) || [];
    if (!checkedIPs.includes(ip)) {
        checkedIPs.push(ip);
        localStorage.setItem('checkedIPs', JSON.stringify(checkedIPs));
    }
}

// Display checked IPs
function showCheckedIPs() {
    let checkedIPs = JSON.parse(localStorage.getItem('checkedIPs')) || [];
    let html = '<ul>';
    checkedIPs.forEach(ip => {
        html += `<li>${ip}</li>`;
    });
    html += '</ul>';
    document.getElementById('checkResult').innerHTML = html;
}

// Clear all checked IPs from local storage
function clearCheckedIPs() {
    localStorage.removeItem('checkedIPs');
    document.getElementById('checkResult').innerHTML = 'Checked IPs have been cleared.';
}

// Report an IP address
async function reportIP() {
    const ip = document.getElementById('reportIpInput').value.trim();
    if (!ip) {
        alert('Please enter an IP address to report.');
        return;
    }

    const requestOptions = {
        method: "POST",
        headers: new Headers({
            "Key": "b8c97c2963616723c8b58e8a8ebe8a70e4c8e8f19e349fc8541316f7010d782e4464b8f73aad8445",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({
            ip: ip,
            categories: '18,19',
            comment: 'Reported for scanning and hacking'
        }),
        redirect: "follow"
    };

    const apiUrl = 'https://api.abuseipdb.com/api/v2/report';

    try {
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to report IP: ${JSON.stringify(result)} (Status code: ${response.status})`);
        }
        document.getElementById('reportResult').innerHTML = 'IP reported successfully';
        storeReportedIP(ip);
    } catch (error) {
        console.error('Error reporting IP:', error);
        document.getElementById('reportResult').innerHTML = `Error reporting IP: ${error.message}`;
    }
}

// Store reported IP in local storage
function storeReportedIP(ip) {
    let reportedIPs = JSON.parse(localStorage.getItem('reportedIPs')) || [];
    if (!reportedIPs.includes(ip)) {
        reportedIPs.push(ip);
        localStorage.setItem('reportedIPs', JSON.stringify(reportedIPs));
    }
}

// Display reported IPs
function showReportedIPs() {
    let reportedIPs = JSON.parse(localStorage.getItem('reportedIPs')) || [];
    let html = '<ul>';
    reportedIPs.forEach(ip => {
        html += `<li>${ip}</li>`;
    });
    html += '</ul>';
    document.getElementById('reportResult').innerHTML = html;
}

// Clear all reported IPs from local storage
function clearReportedIPs() {
    localStorage.removeItem('reportedIPs');
    document.getElementById('reportResult').innerHTML = 'Reported IPs have been cleared.';
}

// Get a blacklist by country
async function getBlacklistByCountries() {
    const selectedCountry = document.getElementById('countrySelect').value;
    const apiUrl = `https://api.abuseipdb.com/api/v2/blacklist?onlyCountries=${selectedCountry}`;

    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            "Key": "b8c97c2963616723c8b58e8a8ebe8a70e4c8e8f19e349fc8541316f7010d782e4464b8f73aad8445",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }),
        redirect: 'follow'
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`${data.errors ? data.errors[0].detail : 'Unknown error'} (Status code: ${response.status})`);
        }
        const resultHtml = data.data.map(ip => `<li>${ip.ipAddress} - Score: ${ip.abuseConfidenceScore}</li>`).join('');
        document.getElementById('blacklistResult').innerHTML = `<ul>${resultHtml}</ul>`;
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('blacklistResult').innerHTML = `Error fetching data: ${error.message}`;
    }
}