"use strict";

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
    DKLoadJSFile("DKErrorHandler.js");
    DKLoadImage("loading.gif");

}

function DKLoadApp() {
    //Load Non-Gui Stuff
    DKCreateErrorHandler();
    CreateSound("PowerDown.mp3");
    LoadDevices();

    LoadGui();

    //Run TimerLoop every minute
    window.setInterval(TimerLoop, 60000);
}

//Load devices from local storage
function LoadDevices() {
    let deviceIPs = [];
    let data = LoadFromLocalStorage("deviceIPs")
    if (data) {
        deviceIPs = JSON.parse(data);
    }
    dkconsole.log("Loading (" + deviceIPs.length + ") Devices");
    for (let n = 0; n < deviceIPs.length; n++) {
        let dev = {
            'ip': deviceIPs[n],
            'DK': {
                'ip': deviceIPs[n],
            },
            'Status': {},
            'StatusPRM': {},
            'StatusFWR': {},
            'StatusLOG': {},
            'StatusMEM': {},
            'StatusNET': {},
            'StatusTIM': {},
            'StatusSNS': {},
            'StatusSTS': {}
        }
        devices.push(dev);
        DKSendRequest("http://" + deviceIPs[n] + "/cm?cmnd=Status%200", function(success, url, data) {
            if (!success || !url || !data) {
                return;
            }
            let deviceData = JSON.parse(data);
            const n = FindObjectValueIncludes(devices, 'ip', url);
            //incoming data doesn't have an ip key, so copy it in 
            deviceData.ip = devices[n].ip;
            //then update the device data with the new data
            devices[n] = deviceData;
            devices.sort((a,b)=>(a.Status.DeviceName > b.Status.DeviceName) ? 1 : -1)
        });
    }
}

function LoadGui() {
    //Load Gui
    CreateDKConsole(document.body, "dkconsole", "", "0px", "0px", "0px", "100%", "25%");
    dkconsole.debug("**** Tasmota device manager 0.1b ****");
    document.body.style.backgroundColor = "rgb(100,100,100)";
    CreateButtons(document.body);
    DKCreateClock(document.body, "clock", "2px", "", "200px");
    CreateDeviceTable(document.body);
    CreateChart(document.body, "chart", "50%", "75%", "0px", "0px", "100%", "25%");
    CreateDebugButton(document.body, "debug_button", "23px", "", "", "5px", "63px", "20px");

    for (let n = 0; n < devices.length; n++) {
        AddDeviceToTable(devices[n].ip);
    }
}

function CreateButtons(parent) {
    let scanDevices = document.createElement("button");
    scanDevices.innerHTML = "Scan Devices";
    scanDevices.style.cursor = "pointer";
    scanDevices.onclick = ScanDevices;
    parent.appendChild(scanDevices);

    let updateDevices = document.createElement("button");
    updateDevices.innerHTML = "Update Devices";
    updateDevices.style.cursor = "pointer";
    updateDevices.onclick = TimerLoop;
    parent.appendChild(updateDevices);

    let clearDevices = document.createElement("button");
    clearDevices.innerHTML = "Clear Devices";
    clearDevices.style.cursor = "pointer";
    clearDevices.onclick = ClearDevices;
    parent.appendChild(clearDevices);
}

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

function AddDeviceToTable(ip) {
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
    cell.onclick = function CellOnClickCallback(id) {
        cell = DKTableGetCellByNames(table, ip, "power");
        cell.innerHTML = "";
        let loading = document.createElement("img");
        loading.src = "loading.gif";
        loading.style.width = "15px";
        loading.style.height = "15px";
        cell.appendChild(loading);
        if (!bypassRules.includes(ip)) {
            bypassRules.push(ip);
            dkconsole.warn("Temporarily added " + ip + " to bypass automation, refresh page to reset");
        }
        DKSendRequest("http://" + ip + "/cm?cmnd=POWER%20Toggle", UpdateScreen);
    }

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
    DKSortRow("deviceTable", _row, 0);
    UpdateTableStyles();
}

function UpdateTableStyles() {
    let table = document.getElementById("deviceTable");
    let row;
    for (let n = 1; n < table.rows.length; n++) {
        row = table.rows[n];
        if (row.rowIndex % 2 == 0) {
            //even
            row.style.backgroundColor = "rgb(90,90,90)";
        } else {
            //odd
            row.style.backgroundColor = "rgb(60,60,60)";
        }
    }
}

function ScanDevices() {
    let deviceIPs = [];
    let data = LoadFromLocalStorage("deviceIPs");
    if (data) {
        deviceIPs = JSON.parse(data);
    }

    GetTasmotaDevices("192.168.1.", function GetTasmotaDevicesCallback(ip, done) {
        if (ip && !deviceIPs.includes(ip)) {
            deviceIPs.push(ip);
            SaveToLocalStorage("deviceIPs", JSON.stringify(deviceIPs));
            AddDeviceToTable(ip);
        }
        if (done) {
            dkconsole.log("\n");
            dkconsole.message("Scan Complete", "green");
            dkconsole.message("(" + deviceIPs.length + ") Tasmota Devices found", "green");
        }
    });
}

function ClearDevices() {
    let table = document.getElementById("deviceTable");
    table.parentNode.remove(table);
    CreateDeviceTable(document.body);
    RemoveFromLocalStorage("deviceIPs");
}

function TimerLoop(force) {
    Automate();
    ProcessDevices();
}

function ProcessDevices() {
    let table = document.getElementById("deviceTable");
    for (let n = 1; n < table.rows.length; n++) {
        let ip = table.rows[n].getAttribute("ip");
        DKSendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    }
    //DKSortTable("deviceTable", 0);
}

function UpdateScreen(success, url, data) {
    if (!success || !url || !data) {
        //Test for power outage
        //dkconsole.error("!success || !url || !data");
        PlaySound("PowerDown.mp3");
        return;
    }

    //let jsonString = PrettyJson(data);
    //let jsonSuper = HighlightJson(jsonString);
    //console.log(jsonSuper);

    let deviceData = JSON.parse(data);
    const n = FindObjectValueIncludes(devices, 'ip', url);
    if (!devices[n]) {
        dkconsole.error("devices[n] invalid");
    }
    //incoming data doesn't have an ip key, so copy it in 
    deviceData.ip = devices[n].ip;
    //then update the device data with the new data
    devices[n] = deviceData;

    //make a copy of the device data to work with
    const device = devices[n];
    if (!device) {
        dkconsole.error("!device success:" + success + " url:" + url + " data:" + data);
        return;
    }

    /*
    if (deviceData.DeviceName) {
        device.Status.DeviceName = deviceData.DeviceName;
    }
    if (deviceData.Hostname) {
        device.StatusNET.Hostname = deviceData.Hostname;
    }
    if (deviceData.POWER) {
        device.StatusSTS.POWER = deviceData.POWER;
    }
    if (deviceData.Wifi) {
        device.StatusSTS.Wifi = deviceData.Wifi;
    }
    if (deviceData.Status) {
        device.Status = deviceData.Status;
    }
    */
    /*
    if (deviceData.StatusNET) {
        device.StatusNET = deviceData.StatusNET;
    }
    if (deviceData.StatusSTS) {
        device.StatusSTS = deviceData.StatusSTS;
    }
    if (deviceData.StatusSNS) {
        device.StatusSNS = deviceData.StatusSNS;
    }
    */

    let table = document.getElementById("deviceTable");
    let row = DKTableGetRowByName(table, device.ip);
    /*
    let row;
    for (let n = 1; n < table.rows.length; n++) {
        if (table.rows[n].getAttribute("ip") === device.ip) {
            row = table.rows[n];
            break;
        }
    }
    */

    if (!row) {
        dkconsole.error("!row success:" + success + " url:" + url + " data:" + data);
        return;
    }

    /*
    if (!device.Status) {
        dkconsole.error("!device.Status success:" + success + " url:" + url + " data:" + data);
        return;
    }
    */
    /*
    if (device.StatusNET.Hostname) {
        DKTableGetCellByNames(table, ip, "device");
        row.setAttribute("Hostname", device.StatusNET.Hostname);
    }
    */
    let deviceName = device.Status ? device.Status.DeviceName : device.DeviceName;
    if (deviceName) {
        row.cells[0].innerHTML = "<a>" + deviceName + "</a>";
        DKSortRow("deviceTable", row, 0);
        UpdateTableStyles();
    }

    let devicePOWER = device.StatusSTS ? device.StatusSTS.POWER : device.POWER;
    if (devicePOWER) {
        row.cells[1].innerHTML = "<a>" + devicePOWER + "</a>";
        if (devicePOWER === "ON") {
            row.cells[1].style.color = "rgb(0,180,0)";
            UpdateChartDevice(device.ip, "switch1", 100);
        } else {
            row.cells[1].style.color = "rgb(40,40,40)";
            UpdateChartDevice(device.ip, "switch1", 0);
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
        let humText = "<a id='RH'>" + humidity + " RH%" + humDirection + "</a>";
        let humTargetText = "<a id='humTarg'> (" + humTarget + "%)</a>";

        dewPoint = (deviceSI7021.DewPoint).toFixed(1);
        let dewPointText = "<a id='DewP'>" + dewPoint + " DP &#176;F</a>";

        let tempScale = 510;
        let tempDiff = (Math.abs(tempTarget - temperature) * 5)
        /*.toFixed(1)*/
        let tempNum = (tempDiff * tempScale / 100)
        /*.toFixed(1)*/
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
            UpdateChartDevice(device.ip, "sensor1", temperature);
            UpdateChartDevice(device.ip, "sensor2", humidity);
            UpdateChartDevice(device.ip, "sensor3", dewPoint);
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
