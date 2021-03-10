"use strict";

// New, unutalized variable structures, practice code

// Date/Time 
let dateEvent = new Date();              //format: August 19, 1975 23:15:30 UTC
let date      = dateEvent.toJSON();      //format: 1975-08-19T23:15:30.000Z
let utcDate   = dateEvent.toUTCString(); //format: Tue, 19 Aug 1975 23:15:30 GMT

// Device Array
let devices = [];
// Basic device response structure
let device = {
    "Status": {
        "Module": 1,
        "FriendlyName": "XXX",
        "Topic": "sonoff",
        "ButtonTopic": "0",
        "Power": 0,
        "PowerOnState": 0,
        "LedState": 1,
        "SaveData": 0,
        "SaveState": 1,
        "ButtonRetain": 0,
        "PowerRetain": 0
    },
    "StatusPRM": {
        "Baudrate": 115200,
        "GroupTopic": "sonoffs",
        "OtaUrl": "XXX",
        "Uptime": "1 02:33:26",
        "Sleep": 150,
        "BootCount": 32,
        "SaveCount": 72,
        "SaveAddress": "FB000"
    },
    "StatusFWR": {
        "Version": "5.12.0a",
        "BuildDateTime": "2018.02.11 16:15:40",
        "Boot": 31,
        "Core": "2_4_0",
        "SDK": "2.1.0(deb1901)"
    },
    "StatusLOG": {
        "SerialLog": 0,
        "WebLog": 4,
        "SysLog": 0,
        "LogHost": "domus1",
        "LogPort": 514,
        "SSId1": "XXX",
        "SSId2": "XXX",
        "TelePeriod": 300,
        "SetOption": "00000001"
    },
    "StatusMEM": {
        "ProgramSize": 457,
        "Free": 544,
        "Heap": 23,
        "ProgramFlashSize": 1024,
        "FlashSize": 1024,
        "FlashMode": 3
    },
    "StatusNET": {
        "Hostname": "XXX",
        "IPAddress": "192.168.178.XX",
        "Gateway": "192.168.178.XX",
        "Subnetmask": "255.255.255.XX",
        "DNSServer": "192.168.178.XX",
        "Mac": "2C:3A:E8:XX:XX:XX",
        "Webserver": 2,
        "WifiConfig": 4
    },
    "StatusTIM": {
        "UTC": "Thu Feb 15 00:00:50 2018",
        "Local": "Thu Feb 15 01:00:50 2018",
        "StartDST": "Sun Mar 25 02:00:00 2018",
        "EndDST": "Sun Oct 28 03:00:00 2018",
        "Timezone": 1
    },
    "StatusSNS": {
        "Time": "2018.02.15 01:00:50",
        "Switch1": "OFF"
    },
    "StatusSTS": {
        "Time": "2018.02.15 01:00:50",
        "Uptime": "1 02:33:26",
        "Vcc": 3.504,
        "POWER": "OFF",
        "Wifi": {
            "AP": 1,
            "SSId": "XXX",
            "RSSI": 100,
            "APMac": "34:31:C4:XX:XX:XX"
        }
    }
}


// Currently functioning variables, implemented code.
let time;

let temperature;
let humidity;
let dewPoint;

let bypassRules = [];
let tempTarget = 77;
let tempCalib = -1;
let tempMin = tempTarget - 10;
let tempMax = tempTarget + 10;

let humTarget = 50;
let humCalib = -10;
let humMin = humTarget - 10;
let humMax = humTarget + 10;

let exhaustFan = true;
let waterWalls = true;
let heater = true;
let co2 = false;

//////////////////////
function DKLoadFiles() {
    //If you initiate anything here, it may fail.
    //This function should only load files, Not initiate variables
    //DKLoadPage() will be call after this loads everything.
    //DKLoadJSFile("https://cdn.jsdelivr.net/npm/superagent");
    DKLoadJSFile("superagent.js");
    DKLoadJSFile("DKValidate.js");
    DKLoadJSFile("DKError.js");
    DKLoadJSFile("DKConsole.js");
    DKLoadJSFile("DKJson.js");
    DKLoadJSFile("DKPhp.js");
    DKLoadJSFile("DKDebug.js");
    DKLoadJSFile("DKNotifications.js");
    DKLoadJSFile("DKAudio.js");
    DKLoadJSFile("DKTasmota.js");
    DKLoadJSFile("DKTable.js");
    DKLoadJSFile("DKClock.js");
    DKLoadJSFile("DKChart.js");
    DKLoadJSFile("Automation.js");
    DKLoadJSFile("VPDCalculator.js");
}

/////////////////////
function DKLoadPage() {
    document.body.style.backgroundColor = "rgb(100,100,100)";

    CreateButtons(document.body);
    CreateClock(document.body, "clock", "2px", "", "", "10px");
    CreateDeviceTable(document.body);
    CreateDKConsole(document.body, "dkconsole", "", "0px", "0px", "0px", "100%", "25%");
    dkconsole.debug("**** Tasmota device manager 0.1b ****");
    CreateSound("PowerDown.mp3");
    CreateChart(document.body, "chart", "50%", "75%", "0px", "0px", "100%", "25%");
    //CreateVPDCalculator(document.body, "30px", "", "", "2px", "400px", "600px");
    //CreateDebugBox(document.body, "30px", "", "", "2px", "200px", "400px");
    CreateDebugButton(document.body, "debug_button", "23px", "", "", "5px", "63px", "20px");

    //Load devices from local storage
    let deviceIPs = JSON.parse(LoadFromLocalStorage("deviceIPs"));
    if (deviceIPs) {
        dkconsole.log("Loading " + deviceIPs.length + " devices");
        for (let n = 0; n < deviceIPs.length; n++) {
            let ip = deviceIPs[n];
            AddDevice(ip);
        }
    }

    //Run TimerLoop every minute
    window.setInterval(TimerLoop, 60000);
}

//////////////////////////////
function CreateButtons(parent) {
    let scanDevices = document.createElement("button");
    scanDevices.innerHTML = "Scan Devices";
    scanDevices.position = "absolute";
    scanDevices.top = "5px";
    scanDevices.left = "5px";
    scanDevices.style.cursor = "pointer";
    scanDevices.onclick = function ScanDevicesOnclickCallback() {
        ScanDevices();
    }
    parent.appendChild(scanDevices);

    let updateDevices = document.createElement("button");
    updateDevices.innerHTML = "Update Devices";
    updateDevices.position = "absolute";
    updateDevices.top = "5px";
    updateDevices.left = "30px";
    updateDevices.style.cursor = "pointer";
    updateDevices.onclick = function UpdateDevicesOnClickCallback() {
        TimerLoop(false);
    }
    parent.appendChild(updateDevices);

    let clearDevices = document.createElement("button");
    clearDevices.innerHTML = "Clear Devices";
    clearDevices.position = "absolute";
    clearDevices.top = "5px";
    clearDevices.left = "55px";
    clearDevices.style.cursor = "pointer";
    clearDevices.onclick = function ClearDevicesOnclickCallback() {
        ClearDevices();
    }
    parent.appendChild(clearDevices);
}

//////////////////////////////////
function CreateDeviceTable(parent) {
    let devices = document.createElement("div");
    parent.appendChild(devices);
    let table = DKCreateTable(devices, "deviceTable", "30px", "", "20px");

    //Create Header Row as a normal <tr>
    DKTableAddRow(table, "HEADER", "device");
    //table.rows[0].style.backgroundColor = "rgb(50,50,50)";
    DKTableGetRowByName(table, "HEADER").style.backgroundColor = "rgb(50,50,50)";
    //table.rows[0].style.fontWeight = "bold";
    DKTableGetRowByName(table, "HEADER").style.fontWeight = "bold";
    //table.rows[0].cells[0].setAttribute("name", "device");
    //table.rows[0].cells[0].innerHTML = "Devices (0)";
    DKTableGetCellByNames(table, "HEADER", "device").innerHTML = "Devices (0)";
    //table.rows[0].cells[0].style.width = "220px";
    DKTableGetCellByNames(table, "HEADER", "device").style.width = "220px";
    DKTableAddColumn(table, "power");
    //table.rows[0].cells[1].innerHTML = "power";
    DKTableGetCellByNames(table, "HEADER", "power").innerHTML = "power";
    //table.rows[0].cells[1].style.width = "50px";
    DKTableGetCellByNames(table, "HEADER", "power").style.width = "50px";
    //table.rows[0].cells[1].style.textAlign = "center";
    DKTableGetCellByNames(table, "HEADER", "power").style.textAlign = "center";
    DKTableAddColumn(table, "data");
    //table.rows[0].cells[2].innerHTML = "data";
    DKTableGetCellByNames(table, "HEADER", "data").innerHTML = "data";
    //table.rows[0].cells[2].style.width = "140px";
    DKTableGetCellByNames(table, "HEADER", "data").style.width = "140px";
    //table.rows[0].cells[2].style.textAlign = "center";
    DKTableGetCellByNames(table, "HEADER", "data").style.textAlign = "center";
    DKTableAddColumn(table, "wifi");
    //table.rows[0].cells[3].innerHTML = "wifi signal";
    DKTableGetCellByNames(table, "HEADER", "wifi").innerHTML = "wifi signal";
    //table.rows[0].cells[3].style.width = "70px";
    DKTableGetCellByNames(table, "HEADER", "wifi").style.width = "70px";
    //table.rows[0].cells[3].style.textAlign = "center";
    DKTableGetCellByNames(table, "HEADER", "wifi").style.textAlign = "center";
}

//////////////////////
function AddDevice(ip) {
    let table = document.getElementById("deviceTable");
    let _row = DKTableAddRow(table, ip);
    _row.setAttribute("ip", ip);
    if (_row.rowIndex % 2 == 0) {
        //even
        _row.style.backgroundColor = "rgb(90,90,90)";
    } else {
        //odd
        _row.style.backgroundColor = "rgb(60,60,60)";
    }
    let cell;
    //cell = row.cells[0];
    cell = DKTableGetCellByNames(table, ip, "device");
    cell.innerHTML = "<a>" + ip + "</a>";
    cell.style.cursor = "pointer";
    cell.onclick = function CellOnClickCallback() {
        let theWindow = window.open("http://" + ip, "MsgWindow", "width=500,height=700");
    }
    cell = DKTableGetCellByNames(table, ip, "power");
    cell.style.textAlign = "center";
    cell.style.cursor = "pointer";
    //cell = row.cells[2];
    cell = DKTableGetCellByNames(table, ip, "data");
    //cell.setAttribute("name", table.rows[0].cells[2].getAttribute("name"));
    cell.style.textAlign = "center";

    //cell = row.cells[3];
    cell = DKTableGetCellByNames(table, ip, "wifi");
    //cell.setAttribute("name", table.rows[0].cells[3].getAttribute("name"));
    cell.style.textAlign = "center";

    //cell = table.rows[0].cells[0];
    cell = DKTableGetCellByNames(table, "HEADER", "device");
    cell.innerHTML = "Devices (" + (table.rows.length - 1) + ")";
    DKSendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);

    DKSendRequest("http://" + ip + "/cm?cmnd=Hostname", function DKSendRequestCallback(success, url, data) {
        if (!success) {
            dkconsole.trace();
            return;
        }
        if (!url.includes(ip)) {
            dkconsole.trace();
            return;
        }
        let device = JSON.parse(data);
        if (!device.Hostname) {
            dkconsole.error(LastStackCall() + "<br>  at if(!device.Hostname)");
            return;
        }

        let row = DKTableGetRowByName(table, ip);
        let hostname = device.Hostname;
        row.setAttribute("hostname", hostname);

        cell.onclick = function CellOnClickCallback() {
            let hostname = row.getAttribute("hostname");
            if (!bypassRules.includes(hostname)) {
                bypassRules.push(hostname);
                dkconsole.warn("Temporarily added " + hostname + " to bypass automation, refresh page to reset");
            }
            DKSendRequest("http://" + ip + "/cm?cmnd=POWER%20Toggle", UpdateScreen);
        }
    });
}

//////////////////////
function ScanDevices() {
    let deviceIPs = JSON.parse(LoadFromLocalStorage("deviceIPs"));
    GetTasmotaDevices("192.168.1.", function GetTasmotaDevicesCallback(ip, done) {
        if (ip) {
            if (ip && !deviceIPs.includes(ip)) {
                deviceIPs.push(ip);
                SaveToLocalStorage("deviceIPs", JSON.stringify(deviceIPs));
                AddDevice(ip);
            }
        }
        if (done) {
            dkconsole.log("\n");
            dkconsole.message("Scan Complete", "green");
            dkconsole.message("(" + deviceIPs.length + ") Tasmota Devices found", "green");
        }
    });
}

///////////////////////
function ClearDevices() {
    let table = document.getElementById("deviceTable");
    table.parentNode.remove(table);
    CreateDeviceTable(document.body);
    SaveToLocalStorage("deviceIPs", "");
}

/////////////////////////
function TimerLoop(force) {
    let currentdate = new Date();
    time = currentdate.getHours() + (currentdate.getMinutes() * .01);
    ProcessRules();
    ProcessDevices();
}

/////////////////////////
function ProcessDevices() {
    let table = document.getElementById("deviceTable");
    for (let n = 1; n < table.rows.length; n++) {
        let ip = table.rows[n].getAttribute("ip");
        DKSendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    }
}

/////////////////////////////////////////
function UpdateScreen(success, url, data) {
    if (!success || !url || !data) {
        //Test for power outage
        //dkconsole.error(LastStackCall() + "<br>  at if(!success)");
        PlaySound("PowerDown.mp3");
        return;
    }

    let jsonString = PrettyJson(data);
    let jsonSuper = HighlightJson(jsonString);
    dkconsole.log(jsonSuper);

    let table = document.getElementById("deviceTable");
    let row;
    for (let n = 1; n < table.rows.length; n++) {
        if (url.includes(table.rows[n].getAttribute("ip")) || url.includes(table.rows[n].getAttribute("hostname"))) {
            row = table.rows[n];
            continue;
        }
    }

    //let row = DKTableGetRowByName(table, ip); //need ip for this
    if (!row) {
        dkconsole.error(LastStackCall() + "<br>  at if(!row)");
        dkconsole.error("success:" + success + " url:" + url + " data:" + data);
        dkconsole.trace();
        return;
    }

    let device = JSON.parse(data);
    let ip = row.getAttribute("ip");

    let deviceHostname = device.StatusNet ? device.StatusNet.Hostname : device.Hostname;
    if (deviceHostname) {
        //DKTableGetCellByNames(table, ip, "device");
        row.setAttribute("Hostname", deviceHostname);
    }

    let deviceName = device.Status ? device.Status.DeviceName : device.DeviceName;
    if (deviceName) {
        row.cells[0].innerHTML = "<a>" + deviceName + "</a>";
    }

    let devicePower = device.StatusSTS ? device.StatusSTS.POWER : device.POWER;
    if (devicePower) {
        row.cells[1].innerHTML = "<a>" + devicePower + "</a>";
        if (devicePower === "ON") {
            row.cells[1].style.color = "rgb(0,180,0)";
            UpdateChartDevice(row.getAttribute("hostname"), 100);
        } else {
            row.cells[1].style.color = "rgb(40,40,40)";
            UpdateChartDevice(row.getAttribute("hostname"), 0);
        }
    }

    let deviceSI7021 = device.StatusSNS ? device.StatusSNS.SI7021 : 0;
    if (deviceSI7021) {
        temperature = (deviceSI7021.Temperature + tempCalib).toFixed(1);
        let tempDirection = " ";
        if (temperature > tempTarget) {
            tempDirection = "&#8593;"
        }
        if (temperature < tempTarget) {
            tempDirection = "&#8595;"
        }
        if (temperature === tempTarget) {
            tempDirection = " ";
        }
        let tempText = "<a id='Temp'>" + temperature + " &#176;F" + tempDirection + "</a>";
        let tempTargetText = "<a id='TempTarg'> (" + tempTarget + "&#176;F)</a>";

        humidity = (deviceSI7021.Humidity + humCalib).toFixed(1);
        let humDirection = " ";
        if (humidity > humTarget) {
            humDirection = "&#8593;"
        }
        if (humidity < humTarget) {
            humDirection = "&#8595;"
        }
        if (humidity === humTarget) {
            humDirection = " ";
        }

        dewPoint = (deviceSI7021.DewPoint).toFixed(1);

        let humText = "<a id='RH'>" + humidity + " RH%" + humDirection + "</a>";
        let humTargetText = "<a id='humTarg'> (" + humTarget + "%)</a>";
        // At 77F and 50% RH,  Dew Point should be 56.9°F
        let dewPointText = "<a id='DewP'>" + dewPoint + " DP &#176;F</a>";

        let tempScale = 510;
        let tempDiff = (Math.abs(tempTarget - temperature) * 5)/*.toFixed(1)*/
        ;
        let tempNum = (tempDiff * tempScale / 100)/*.toFixed(1)*/
        ;
        let tempRed = tempNum;
        let tempGreen = 510 - tempNum;
        if (tempRed > 255) {
            tempRed = 255;
        }
        if (tempRed < 0) {
            tempRed = 0;
        }
        if (tempGreen > 255) {
            tempGreen = 255;
        }
        if (tempGreen < 0) {
            tempGreen = 0;
        }

        row.cells[2].innerHTML = tempTargetText + " " + tempText + "<br>" + humTargetText + " " + humText + "<br>" + dewPointText;
        document.getElementById("Temp").style.color = "rgb(" + tempRed + "," + tempGreen + ",0)";
        document.getElementById("Temp").style.textAlign = "center";
        let humScale = 510;
        let humDiff = (Math.abs(humTarget - humidity) * 5);
        let humNum = (humDiff * humScale / 100);
        let humRed = humNum;
        let humGreen = 510 - humNum;
        if (humRed > 255) {
            humRed = 255;
        }
        if (humRed < 0) {
            humRed = 0;
        }
        if (humGreen > 255) {
            humGreen = 255;
        }
        if (humGreen < 0) {
            humGreen = 0;
        }
        document.getElementById("RH").style.color = "rgb(" + humRed + "," + humGreen + ",0)";
        document.getElementById("RH").style.textAlilgn = "center";
        document.getElementById("DewP").style.color = "rgb(50,50,50)";
        document.getElementById("DewP").style.textAlign = "center";

        if (temperature && humidity && dewPoint) {
            var data = {
                temperature: temperature,
                humidity: humidity,
                dewPoint: dewPoint
            };
            UpdateChartDevice(row.getAttribute("hostname"), JSON.stringify(data));
        }
    }

    let deviceWifi = device.StatusSTS ? device.StatusSTS.Wifi : device.Wifi;
    if (deviceWifi) {
        let signal = deviceWifi.RSSI;
        let scale = 510;
        let num = (signal * scale / 100);
        let green = num;
        let red = 510 - num;
        row.cells[3].innerHTML = signal + "%";
        if (red > 255) {
            red = 255;
        }
        if (red < 0) {
            red = 0;
        }
        if (green > 255) {
            green = 255;
        }
        if (green < 0) {
            green = 0;
        }
        row.cells[3].style.color = "rgb(" + red + "," + green + ",0)";
    }
}