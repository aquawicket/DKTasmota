"use strict";

function DKLoadFiles() {
    //If you initiate anything here, it may fail.
    //This function should only load files, Not initiate variables
    //DKLoadPage() will be call after this loads everything.
    //DKLoadJSFile("https://cdn.jsdelivr.net/npm/superagent");
    DKLoadJSFile("DK/DK.js");
    DKLoadCSSFile("DK/DK.css");
    DKLoadJSFile("DKFile/DKFile.js");
    DKLoadJSFile("superagent.js");
    DKLoadJSFile("DKMqtt.js");
    DKLoadJSFile("DKValidate.js");
    DKLoadJSFile("DKError.js");
    DKLoadJSFile("DKGui/DKFrame.js");
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
    DKLoadImage("restart.png");
    DKLoadImage("info.png");
    DKLoadImage("settings.png");
    DKLoadAudio("PowerDown.mp3");
}

function DKLoadApp() {
    //Load Non-Gui Stuff
    DKCreateErrorHandler();
    CreateSound("PowerDown.mp3");
    LoadDevicesFromStorage();
    LoadGui();

    //Run app main loop
    window.setInterval(MainAppLoop, 40000);
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

function MainAppLoop() {
    Automate();
    ProcessDevices();
}

function CreateButtons(parent) {
    const scanDevices = document.createElement("button");
    scanDevices.innerHTML = "Scan Devices";
    scanDevices.style.cursor = "pointer";
    scanDevices.onclick = ScanDevices;
    parent.appendChild(scanDevices);

    const updateDevices = document.createElement("button");
    updateDevices.innerHTML = "Update Devices";
    updateDevices.style.cursor = "pointer";
    updateDevices.onclick = MainAppLoop;
    parent.appendChild(updateDevices);

    const clearDevices = document.createElement("button");
    clearDevices.innerHTML = "Clear Devices";
    clearDevices.style.cursor = "pointer";
    clearDevices.onclick = ClearDevices;
    parent.appendChild(clearDevices);

    const volume = document.createElement("img");
    volume.src = "volume_100.png";
    volume.style.position = "absolute";
    volume.style.height = "21px";
    volume.style.top = "2px";
    volume.style.right = "2px";
    volume.style.cursor = "pointer";
    parent.appendChild(volume);
    volume.onclick = function() {
        if (GetVolume("PowerDown.mp3") === 1.0) {
            SetVolume("PowerDown.mp3", 0.0);
            volume.src = "volume_0.png";
        } else {
            SetVolume("PowerDown.mp3", 1.0);
            volume.src = "volume_100.png";
        }
    }
}

function CreateDeviceTable(parent) {
    const deviceDiv = document.createElement("div");
    deviceDiv.style.position = "absolute";
    deviceDiv.style.top = "25px";
    deviceDiv.style.left = "20px";
    deviceDiv.style.width = "550px";
    deviceDiv.style.height = "420px";
    //deviceDiv.style.backgroundColor = "rgb(0,0,0)";
    deviceDiv.style.overflow = "auto";
    parent.appendChild(deviceDiv);

    const table = DKCreateTable(deviceDiv, "deviceTable", "0px", "", "0px");

    //Create Header Row as a normal <tr>
    //const deviceHeader = DKTableAddColumn(table, "HEADER", "device"); //FIXME
    DKTableAddRow(table, "HEADER", "device");
    DKTableGetRowByName(table, "HEADER").style.backgroundColor = "rgb(50,50,50)";
    DKTableGetRowByName(table, "HEADER").style.fontWeight = "bold";
    DKTableGetRowByName(table, "HEADER").style.cursor = "pointer";
    DKTableGetCellByName(table, "HEADER", "device").innerHTML = "Devices (0)";
    DKTableGetCellByName(table, "HEADER", "device").style.width = "220px";
    DKTableGetCellByName(table, "HEADER", "device").onclick = function deviceHeaderOnClick() {
        DKSortTable("deviceTable", 0);
        UpdateTableStyles();
    }

    DKTableAddColumn(table, "power");
    DKTableGetCellByName(table, "HEADER", "power").innerHTML = "power";
    DKTableGetCellByName(table, "HEADER", "power").style.width = "50px";
    DKTableGetCellByName(table, "HEADER", "power").style.textAlign = "center";
    DKTableGetCellByName(table, "HEADER", "power").onclick = function powerHeaderOnClick() {
        DKSortTable("deviceTable", 1);
        UpdateTableStyles();
    }

    DKTableAddColumn(table, "data");
    DKTableGetCellByName(table, "HEADER", "data").innerHTML = "data";
    DKTableGetCellByName(table, "HEADER", "data").style.width = "140px";
    DKTableGetCellByName(table, "HEADER", "data").style.textAlign = "center";
    DKTableGetCellByName(table, "HEADER", "data").onclick = function dataHeaderOnClick() {
        DKSortTable("deviceTable", 2);
        UpdateTableStyles();
    }

    DKTableAddColumn(table, "wifi");
    DKTableGetCellByName(table, "HEADER", "wifi").innerHTML = "wifi signal";
    DKTableGetCellByName(table, "HEADER", "wifi").style.width = "70px";
    DKTableGetCellByName(table, "HEADER", "wifi").style.textAlign = "center";
    DKTableGetCellByName(table, "HEADER", "wifi").onclick = function wifiHeaderOnClick() {
        DKSortTable("deviceTable", 3);
        UpdateTableStyles();
    }

    DKTableAddColumn(table, "options");
    DKTableGetCellByName(table, "HEADER", "options").innerHTML = "options";
    DKTableGetCellByName(table, "HEADER", "options").style.width = "50px";
    DKTableGetCellByName(table, "HEADER", "options").style.textAlign = "center";
    DKTableGetCellByName(table, "HEADER", "options").onclick = function optionsHeaderOnClick() {
        dkconsole.log("optionsHeaderOnClick");
    }
}

function AddDeviceToTable(ip) {
    const table = document.getElementById("deviceTable");
    const row = DKTableAddRow(table, ip);
    row.setAttribute("ip", ip);
    if (row.rowIndex % 2 == 0) {
        //even
        row.style.backgroundColor = "rgb(90,90,90)";
    } else {
        //odd
        row.style.backgroundColor = "rgb(60,60,60)";
    }

    const deviceCell = DKTableGetCellByName(table, ip, "device");
    deviceCell.innerHTML = "<a>" + ip + "</a>";
    deviceCell.style.cursor = "pointer";
    deviceCell.onclick = function CellOnClick() {
        const deviceWindow = window.open("http://" + ip, ip, "_blank, width=500, height=700");
    }

    const powerCell = DKTableGetCellByName(table, ip, "power");
    powerCell.style.textAlign = "center";
    powerCell.style.cursor = "pointer";
    powerCell.onclick = function PowerOnClick(id) {
        powerCell.innerHTML = "";
        const loading = document.createElement("img");
        loading.src = "loading.gif";
        loading.style.width = "15px";
        loading.style.height = "15px";
        powerCell.appendChild(loading);

        for (let n = 0; n < devices.length; n++) {
            if (devices[n].ip === ip) {
                devices[n].automate = false;
                dkconsole.warn("Temporarily added " + ip + " to bypass automation, refresh page to reset");
            }
        }
        DKSendRequest("http://" + ip + "/cm?cmnd=POWER%20Toggle", UpdateScreen);
    }

    const dataCell = DKTableGetCellByName(table, ip, "data");
    dataCell.style.textAlign = "center";

    const wifiCell = DKTableGetCellByName(table, ip, "wifi");
    wifiCell.style.textAlign = "center";

    const optionsCell = DKTableGetCellByName(table, ip, "options");
    optionsCell.innerHTML = "";
    optionsCell.style.textAlign = "center";

    const restart = document.createElement("img");
    restart.setAttribute("title", "Restart Device");
    restart.src = "restart.png";
    restart.style.width = "12px";
    restart.style.height = "12px";
    restart.style.cursor = "pointer";
    restart.style.paddingRight = "3px";
    restart.style.paddingBottom = "2px";
    restart.onclick = function restartOnClick() {
        DKConfirm("Restart this device?", function() {
            restart.src = "loading.gif";
            DKSendRequest("http://" + ip + "/cm?cmnd=Restart%201", UpdateScreen);
        });
    }
    optionsCell.appendChild(restart);

    const info = document.createElement("img");
    info.setAttribute("title", "Device info");
    info.src = "info.png";
    info.style.width = "12px";
    info.style.height = "12px";
    info.style.cursor = "pointer";
    info.style.paddingRight = "3px";
    info.style.paddingBottom = "2px";
    info.onclick = function InfoOnClick() {
        InfoWindow(ip);
    }
    optionsCell.appendChild(info);

    const settings = document.createElement("img");
    settings.setAttribute("title", "Device settings");
    settings.src = "settings.png";
    settings.style.width = "15px";
    settings.style.height = "15px";
    settings.style.cursor = "pointer";
    settings.onclick = function SettingsOnClick() {
        DKCreateWindow("Settings", "300px", "300px");
    }
    optionsCell.appendChild(settings);

    //Do some final processing
    const deviceHeader = DKTableGetCellByName(table, "HEADER", "device");
    deviceHeader.innerHTML = "Devices (" + (table.rows.length - 1) + ")";
    DKSendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    DKSortTable("deviceTable", 0);
    UpdateTableStyles();
}

function InfoWindow(ip) {
    DKCreateWindow("Info", "600px", "500px");
    const info = document.getElementById("Info");
    const div = document.createElement("div");

    div.style.position = "absolute";
    div.style.top = "20px";
    div.style.width = "100%";
    div.style.fontSize = "12px";
    div.style.fontFamily = "Consolas, Lucinda, Console, Courier New, monospace";
    div.style.whiteSpace = "pre-wrap";
    div.style.boxSizing = "border-box";
    div.style.padding = "2px";
    div.style.paddingLeft = "20px";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1px";
    div.style.borderTopWidth = "0px";
    div.style.borderLeftWidth = "0px";
    div.style.borderRightWidth = "0px";
    div.style.backgroundColor = "rgb(36,36,36)";

    const obj = FindObjectValueIncludes(devices, "ip", ip);
    const n = devices.indexOf(obj);
    const jsonString = PrettyJson(JSON.stringify(devices[n]));
    const jsonSuper = HighlightJson(jsonString);
    //dkconsole.log(jsonSuper);
    div.innerHTML = jsonSuper;
    info.appendChild(div);
}

function UpdateTableStyles() {
    const table = document.getElementById("deviceTable");
    for (let n = 1; n < table.rows.length; n++) {
        const row = table.rows[n];
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
    const data = DKLoadFromLocalStorage("deviceIPs");
    if (data) {
        deviceIPs = JSON.parse(data);
    }

    GetTasmotaDevices("192.168.1.", function GetTasmotaDevicesCallback(ip, done) {
        if (ip && !deviceIPs.includes(ip)) {
            deviceIPs.push(ip);
            DKSaveToLocalStorage("deviceIPs", JSON.stringify(deviceIPs));
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
    const table = document.getElementById("deviceTable");
    table.parentNode.remove(table);
    CreateDeviceTable(document.body);
    RemoveFromLocalStorage("deviceIPs");
}

function ProcessDevices() {
    const table = document.getElementById("deviceTable");
    for (let n = 1; n < table.rows.length; n++) {
        const ip = table.rows[n].getAttribute("ip");
        DKSendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    }
}

function UpdateScreen(success, url, data) {
    if (!success || !url || !data) {
        dkconsole.warn("UpdateScreen(" + success + "," + url + "," + data + ")");
        PlaySound("PowerDown.mp3");
        return;
    }

    //const jsonString = PrettyJson(data);
    //const jsonSuper = HighlightJson(jsonString);
    //dkconsole.log(jsonSuper);

    let device;
    try {
        device = JSON.parse(data);
    } catch {
        dkconsole.error("data could not be parsed to json");
    }
    const deviceInstance = FindObjectValueIncludes(devices, 'ip', url);
    if(!deviceInstance){
        return;
    }
    //incoming data doesn't have user defined variable, so copy them
    device.ip = deviceInstance.ip;
    device.user = deviceInstance.user;

    //then update the stored device with the new data
    devices[devices.indexOf(deviceInstance)] = device;

    const table = document.getElementById("deviceTable");
    const row = DKTableGetRowByName(table, device.ip);
    if (!row) {
        dkconsole.error("!row success:" + success + " url:" + url + " data:" + data);
        return;
    }

    device.user.name = device.Status ? device.Status.DeviceName : device.DeviceName;
    if (device.user.name) {
        const deviceCell = DKTableGetCellByName(table, device.ip, "device");
        deviceCell.innerHTML = "<a title='" + device.ip + "'>" + device.user.name + "</a>";
        DKSortTable("deviceTable", 0);
        UpdateTableStyles();
    }

    device.user.power = device.StatusSTS ? device.StatusSTS.POWER : device.POWER;
    if (device.user.power) {
        const powerCell = DKTableGetCellByName(table, device.ip, "power");
        powerCell.innerHTML = "<a>" + device.user.power + "</a>";
        if (device.user.power === "ON") {
            row.cells[1].style.color = "rgb(0,180,0)";
            UpdateChartDevice(device.ip, "switch1", 100);
        } else {
            row.cells[1].style.color = "rgb(40,40,40)";
            UpdateChartDevice(device.ip, "switch1", 0);
        }
    }

    const dataCell = DKTableGetCellByName(table, device.ip, "data");
    dataCell.innerHTML = "";
    if (device.StatusSNS?.DS18B20?.Temperature)
        device.user.temperature = device.StatusSNS.DS18B20.Temperature
    if (device.StatusSNS?.SI7021?.Temperature)
        device.user.temperature = device.StatusSNS.SI7021.Temperature;
    if (device.user.temperature) {
        let tempDirection = " ";
        if (device.user.temperature > device.user.temperatureTarget) {
            tempDirection = "&#8593;"
        }
        if (device.user.temperature < device.user.temperatureTarget) {
            tempDirection = "&#8595;"
        }
        const tempText = "<a id='" + device.ip + "Temp'>" + device.user.temperature + " &#176;F" + tempDirection + "</a>";
        const tempTargetText = "<a id='" + device.ip + "TempTarg'> (" + device.user.temperatureTarget + "&#176;F)</a>";
        dataCell.innerHTML = dataCell.innerHTML + tempTargetText + " " + tempText + "<br>"

        const tempScale = 510;
        const tempDiff = (Math.abs(device.user.temperatureTarget - device.user.temperature) * 5)
        const tempNum = (tempDiff * tempScale / 100)
        const tempRed = tempNum.clamp(0, 255);
        const tempGreen = (510 - tempNum).clamp(0, 255);
        document.getElementById(device.ip + "Temp").style.color = "rgb(" + tempRed + "," + tempGreen + ",0)";
        document.getElementById(device.ip + "Temp").style.textAlign = "center";

        UpdateChartDevice(device.ip, "sensor1", device.user.temperature);
    }

    device.user.humidity = device.StatusSNS?.SI7021 ? device.StatusSNS.SI7021.Humidity : false;
    if (device.user.humidity) {
        let humDirection = " ";
        if (device.user.humidity > device.user.humidityTarget) {
            humDirection = "&#8593;"
        }
        if (device.user.humidity < device.user.humidityTarget) {
            humDirection = "&#8595;"
        }
        const humText = "<a id='" + device.ip + "RH'>" + device.user.humidity + " RH%" + humDirection + "</a>";
        const humTargetText = "<a id='" + device.ip + "humTarg'> (" + device.user.humidityTarget + "%)</a>";
        dataCell.innerHTML = dataCell.innerHTML + humTargetText + " " + humText + "<br>";

        const humScale = 510;
        const humDiff = (Math.abs(device.user.humidityTarget - device.user.humidity) * 5);
        const humNum = (humDiff * humScale / 100);
        const humRed = humNum.clamp(0, 255);
        const humGreen = (510 - humNum).clamp(0, 255);
        document.getElementById(device.ip + "RH").style.color = "rgb(" + humRed + "," + humGreen + ",0)";
        document.getElementById(device.ip + "RH").style.textAlilgn = "center";

        UpdateChartDevice(device.ip, "sensor2", device.user.humidity);
    }

    device.user.dewpoint = device.StatusSNS?.SI7021 ? device.StatusSNS.SI7021.DewPoint : false;
    if (device.user.dewpoint) {
        const dewPointText = "<a id='" + device.ip + "DewP'>" + device.user.dewpoint + " DP &#176;F</a>";
        dataCell.innerHTML = dataCell.innerHTML + dewPointText;
        document.getElementById(device.ip + "DewP").style.color = "rgb(40,40,40)";
        document.getElementById(device.ip + "DewP").style.textAlign = "center";

        UpdateChartDevice(device.ip, "sensor3", device.user.dewpoint);
    }

    device.user.rssi = device.StatusSTS?.Wifi ? device.StatusSTS.Wifi.RSSI : device.Wifi?.RSSI;
    if (device.user.rssi) {
        const signal = device.user.rssi;
        const scale = 510;
        const num = (signal * scale / 100);
        const green = num.clamp(0, 255);
        const red = (510 - num).clamp(0, 255);
        const wifiCell = DKTableGetCellByName(table, device.ip, "wifi");
        wifiCell.innerHTML = signal + "%";
        wifiCell.style.color = "rgb(" + red + "," + green + ",0)";
    }
}
