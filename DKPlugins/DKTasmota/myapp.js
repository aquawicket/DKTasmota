"use strict";

const app = [];

function DKLoadFiles() {
    //If you initiate anything here, it may fail.
    //This function should only load files, Not initiate variables
    //DKLoadPage() will be call after this loads everything.
    //DK_Create("https://cdn.jsdelivr.net/npm/superagent");
    DK_Create("DK/DKErrorHandler.js");
    DK_Create("DK/DK.css");
    DK_Create("DK/DKPhp.js");
    DK_Create("DK/DKTrace.js");
    DK_Create("DK/DKJson.js");
    DK_Create("DK/DKValidate.js");
    
    DK_Create("DKFile/DKFile.js");
    
    DK_Create("DKGui/DKGui.js");
    DK_Create("DKGui/DKFrame.js");
    //DK_Create("DKGui/DKMessageBox.js");
    DK_Create("DKGui/DKDrag.js");
    DK_Create("DKGui/DKClipboard.js");
    DK_Create("DKGui/DKTable.js");
    DK_Create("DKGui/DKConsole.js");
    
    DK_Create("DKAudio/DKAudio2.js", function() {
        DKAudio_PreLoadAudio("PowerDown.mp3");
    });

    DK_Create("superagent.js");
    DK_Create("DKMqtt.js");
    DK_Create("DKDebug.js");
    DK_Create("DKNotifications.js");
    DK_Create("DKTasmota.js");
    DK_Create("DKClock.js");
    DK_Create("DKChart.js");
    DK_Create("Automation.js");
    DK_Create("VPDCalculator.js");

    DK_PreloadImage("loading.gif");
    DK_PreloadImage("restart.png");
    DK_PreloadImage("info.png");
    DK_PreloadImage("settings.png");
    DK_PreloadImage("online.png");
    DK_PreloadImage("offline.png");
}

function DKLoadApp() {
    DKErrorHandler_Create();
    DKAudio_CreateSound("PowerDown.mp3");
    DKTasmota_LoadDevices();

    PHP_GetRemoteAddress(function(rval) {
        dkconsole.log(rval);
        if (rval === "192.168.1.78" || rval === "192.168.1.1") {
            app.server = true;
            app.automate = true;
        } else {
            app.client = true;
            app.automate = false;
        }

        LoadGui();
    });

    //Run app main loop
    window.setInterval(MainAppLoop, 40000);
}

function LoadGui() {
    DKConsole_Create(document.body, "dkconsole", "", "0px", "0px", "0px", "100%", "25%");
    dkconsole.debug("**** Tasmota device manager 0.1b ****");
    document.body.style.backgroundColor = "rgb(100,100,100)";
    CreateButtons(document.body);
    DKClock_Create(document.body, "clock", "2px", "", "25%");
    CreateDeviceTable(document.body);
    DKChart_Create(document.body, "chart", "50%", "75%", "0px", "0px", "100%", "25%");
    DKDebug_CreateButton(document.body, "debug_button", "23px", "", "", "5px", "63px", "20px");

    for (let n = 0; n < devices.length; n++) {
        AddDeviceToTable(devices[n].ip);
    }
}

function MainAppLoop() {
    //Check internet connection
    const internet = byId("internet");
    if (DK_IsOnline()) {
        internet.src = "online.png";
    } else {
        internet.src = "offline.png";
    }

    ProcessDevices();
    if (app.automate) {
        Automate();
    }
}

function DKSendSuperRequest(url, callback) {
    superagent.get(url).timeout({
        response: 18000,
        // Wait 18 seconds for the server to start sending,
        deadline: 20000,
        // but allow 20 seconds for the file to finish loading.
    }).then(function DKSendSuperRequestSuccessCallback(res) {
        callback(true, res);
    }, function DKSendSuperRequestFailCallback(res) {
        callback(false, res);
    });
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

    const automation = document.createElement("button");
    if (app.automate === true) {
        automation.innerHTML = "Automat ON";
    } else {
        automation.innerHTML = "Automat OFF";
    }
    automation.style.cursor = "pointer";
    automation.onclick = function() {
        if (app.automate === true) {
            app.automate = false;
            automation.innerHTML = "Automat OFF";
        } else {
            app.automate = true;
            automation.innerHTML = "Automat ON";
        }
    }
    parent.appendChild(automation);

    const internet = document.createElement("img");
    internet.id = "internet";
    if (DK_IsOnline()) {
        internet.src = "online.png";
    } else {
        internet.src = "onffline.png";
    }
    internet.style.position = "absolute";
    internet.style.height = "19px";
    internet.style.top = "2px";
    internet.style.right = "28px";
    parent.appendChild(internet);

    const volume = document.createElement("img");
    volume.src = "volume_100.png";
    volume.style.position = "absolute";
    volume.style.height = "19px";
    volume.style.top = "2px";
    volume.style.right = "2px";
    volume.style.cursor = "pointer";
    parent.appendChild(volume);
    volume.onclick = function() {
        if (DKAudio_GetVolume("PowerDown.mp3") === 1.0) {
            DKAudio_SetVolume("PowerDown.mp3", 0.0);
            volume.src = "volume_0.png";
        } else {
            DKAudio_SetVolume("PowerDown.mp3", 1.0);
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
    deviceDiv.style.height = "47.0%";
    //deviceDiv.style.backgroundColor = "rgb(0,0,0)";
    deviceDiv.style.overflow = "auto";
    parent.appendChild(deviceDiv);

    const table = DKTable_Create(deviceDiv, "deviceTable", "0px", "", "0px");

    //Create Header Row as a normal <tr>
    //const deviceHeader = DKTableAddColumn(table, "HEADER", "device"); //FIXME
    DKTable_AddRow(table, "HEADER", "device");
    DKTable_GetRowByName(table, "HEADER").style.backgroundColor = "rgb(50,50,50)";
    DKTable_GetRowByName(table, "HEADER").style.fontWeight = "bold";
    DKTable_GetRowByName(table, "HEADER").style.cursor = "pointer";
    DKTable_GetCellByName(table, "HEADER", "device").innerHTML = "Devices (0)";
    DKTable_GetCellByName(table, "HEADER", "device").style.width = "240px";
    DKTable_GetCellByName(table, "HEADER", "device").onclick = function deviceHeaderOnClick() {
        DKTable_Sort("deviceTable", 0);
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "power");
    DKTable_GetCellByName(table, "HEADER", "power").innerHTML = "power";
    DKTable_GetCellByName(table, "HEADER", "power").style.width = "50px";
    DKTable_GetCellByName(table, "HEADER", "power").style.textAlign = "center";
    DKTable_GetCellByName(table, "HEADER", "power").onclick = function powerHeaderOnClick() {
        DKTable_Sort("deviceTable", 1);
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "data");
    DKTable_GetCellByName(table, "HEADER", "data").innerHTML = "data";
    DKTable_GetCellByName(table, "HEADER", "data").style.width = "140px";
    DKTable_GetCellByName(table, "HEADER", "data").style.textAlign = "center";
    DKTable_GetCellByName(table, "HEADER", "data").onclick = function dataHeaderOnClick() {
        DKTable_Sort("deviceTable", 2);
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "wifi");
    DKTable_GetCellByName(table, "HEADER", "wifi").innerHTML = "wifi signal";
    DKTable_GetCellByName(table, "HEADER", "wifi").style.width = "70px";
    DKTable_GetCellByName(table, "HEADER", "wifi").style.textAlign = "center";
    DKTable_GetCellByName(table, "HEADER", "wifi").onclick = function wifiHeaderOnClick() {
        DKTable_Sort("deviceTable", 3);
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "options");
    DKTable_GetCellByName(table, "HEADER", "options").innerHTML = "options";
    DKTable_GetCellByName(table, "HEADER", "options").style.width = "80px";
    DKTable_GetCellByName(table, "HEADER", "options").style.textAlign = "center";
    DKTable_GetCellByName(table, "HEADER", "options").onclick = function optionsHeaderOnClick() {
        dkconsole.log("optionsHeaderOnClick");
    }
}

function AddDeviceToTable(ip) {
    const table = byId("deviceTable");
    const row = DKTable_AddRow(table, ip);
    row.setAttribute("ip", ip);
    if (row.rowIndex % 2 == 0) {
        //even
        row.style.backgroundColor = "rgb(90,90,90)";
    } else {
        //odd
        row.style.backgroundColor = "rgb(60,60,60)";
    }

    const deviceCell = DKTable_GetCellByName(table, ip, "device");
    deviceCell.innerHTML = "<a>" + ip + "</a>";
    deviceCell.style.cursor = "pointer";
    deviceCell.onclick = function CellOnClick() {
        const deviceWindow = window.open("http://" + ip, ip, "_blank, width=500, height=700");
    }

    const powerCell = DKTable_GetCellByName(table, ip, "power");
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
                devices[n].user.automate = false;
                dkconsole.warn("Temporarily added " + ip + " to bypass automation, refresh page to reset");
            }
        }
        DK_SendRequest("http://" + ip + "/cm?cmnd=POWER%20Toggle", UpdateScreen);
    }

    const dataCell = DKTable_GetCellByName(table, ip, "data");
    dataCell.style.textAlign = "center";

    const wifiCell = DKTable_GetCellByName(table, ip, "wifi");
    wifiCell.style.textAlign = "center";

    const optionsCell = DKTable_GetCellByName(table, ip, "options");
    optionsCell.innerHTML = "";
    optionsCell.style.textAlign = "center";

    //Device Restart
    const restart = document.createElement("img");
    restart.setAttribute("title", "Restart Device");
    restart.src = "restart.png";
    restart.style.width = "12px";
    restart.style.height = "12px";
    restart.style.cursor = "pointer";
    restart.style.paddingRight = "3px";
    restart.style.paddingBottom = "2px";
    restart.onclick = function restartOnClick() {
        DKMessageBox_Confirm("Restart this device?", function() {
        //DKConfirm("Restart this device?", function() {
            restart.src = "loading.gif";
            DK_SendRequest("http://" + ip + "/cm?cmnd=Restart%201", UpdateScreen);
        });
    }
    optionsCell.appendChild(restart);

    //Device Info
    const info = document.createElement("img");
    info.setAttribute("title", "Device Info");
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

    //Device Settings
    const settings = document.createElement("img");
    settings.setAttribute("title", "Device Settings");
    settings.src = "settings.png";
    settings.style.width = "15px";
    settings.style.height = "15px";
    settings.style.cursor = "pointer";
    settings.onclick = function SettingsOnClick() {
        SettingsWindow(ip);
    }
    optionsCell.appendChild(settings);

    const dConsole = document.createElement("img");
    dConsole.setAttribute("title", "Device Console");
    dConsole.src = "console.png";
    dConsole.style.width = "15px";
    dConsole.style.height = "15px";
    dConsole.style.paddingLeft = "3px";
    dConsole.style.cursor = "pointer";
    dConsole.onclick = function SettingsOnClick() {
        DConsoleWindow(ip);
    }
    optionsCell.appendChild(dConsole);

    //Do some final processing
    const deviceHeader = DKTable_GetCellByName(table, "HEADER", "device");
    deviceHeader.innerHTML = "Devices (" + (table.rows.length - 1) + ")";
    DK_SendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    DKTable_Sort("deviceTable", 0);
    UpdateTableStyles();
}

function InfoWindow(ip) {
    const div = document.createElement("div");
    div.id = "Info";
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
    div.style.overflow = "auto";

    const obj = DKJson_FindObjectValueIncludes(devices, "ip", ip);
    const n = devices.indexOf(obj);
    const jsonString = DKJson_PrettyJson(JSON.stringify(devices[n]));
    const jsonSuper = DKJson_HighlightJson(jsonString);
    //dkconsole.log(jsonSuper);
    div.innerHTML = jsonSuper;
    document.body.appendChild(div);
    DKFrame_Html("Info");
}

function SettingsWindow(ip) {
    const div = document.createElement("div");
    div.id = "Settings";
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
    div.style.overflow = "auto";

    document.body.appendChild(div);
    DKFrame_Html("Settings");
}

function DConsoleWindow(ip) {
    const div = document.createElement("div");
    div.id = "Console";
    div.style.position = "absolute";
    div.style.width = "100%";
    //div.style.backgroundColor = "rgb(36,36,36)";
    div.style.overflow = "auto";

    const output = document.createElement("div");
    output.style.position = "absolute";
    output.style.top = "10px";
    output.style.left = "10px";
    //output.style.width = "";
    //output.style.height = "";
    output.style.right = "10px";
    output.style.bottom = "40px";
    output.style.backgroundColor = "rgb(0,0,0)";
    div.appendChild(output);

    //command box
    const input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    //input.style.top = "";
    input.style.left = "10px";
    input.style.width = "90%";
    input.style.height = "22px";
    //input.style.right = "10px";
    input.style.bottom = "10px";
    input.style.color = "rgb(255,255,255)";
    input.style.backgroundColor = "rgb(0,0,0)";
    input.onkeydown = function() {
        const key = event.charCode || event.keyCode;
        if (key === 13) {
            //enter
            dkconsole.debug("Send command -> " + input.value);
            const cmnd = input.value;
            const url = "http://" + ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
            DK_SendRequest(url, function(success, url, data) {
                //dkconsole.log("function("+success+","+url+","+data+")");
                if (data) {
                    const msgDiv = document.createElement("div");
                    msgDiv.style.width = "100%";
                    msgDiv.style.fontSize = "12px";
                    msgDiv.style.fontFamily = "Consolas, Lucinda, Console, Courier New, monospace";
                    msgDiv.style.whiteSpace = "pre-wrap";
                    msgDiv.style.boxSizing = "border-box";
                    msgDiv.style.padding = "2px";
                    msgDiv.style.paddingLeft = "10px";

                    const msgText = document.createElement("span");
                    msgText.innerHTML = data;
                    msgText.style.color = "rgb(250,250,250)";

                    output.appendChild(msgDiv);
                    msgDiv.appendChild(msgText);
                    output.scrollTop = output.scrollHeight;

                    //Limit the number of stored lines
                    if (output.childElementCount > 500) {
                        output.removeChild(output.firstChild);
                    }
                    input.value = "";
                }
            });

        }
    }
    div.appendChild(input);

    document.body.appendChild(div);
    DKFrame_Html("Console");
}

function UpdateTableStyles() {
    const table = byId("deviceTable");
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

    DKTasmota_GetDevices("192.168.1.", function GetTasmotaDevicesCallback(ip, done) {
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
    const table = byId("deviceTable");
    table.parentNode.remove(table);
    CreateDeviceTable(document.body);
    DKRemoveFromLocalStorage("deviceIPs");
}

function ProcessDevices() {
    const table = byId("deviceTable");
    for (let n = 1; n < table.rows.length; n++) {
        const ip = table.rows[n].getAttribute("ip");
        DK_SendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    }
}

function UpdateScreen(success, url, data) {
    if (!url) {
        dkconsole.log("url invalid");
        return;
    }
    let device = DKJson_FindObjectValueIncludes(devices, 'ip', url);
    if (!device) {
        dkconsole.error("device invalid");
        return;
    }
    const table = byId("deviceTable");
    const row = DKTable_GetRowByName(table, device.ip);
    if (!row) {
        doconsole.error("row invlid");
        return;
    }
    if (!success || !data) {
        DKAudio_PlaySound("PowerDown.mp3");
        dkconsole.warn(device.ip + " did not respond");
        row.style.backgroundColor = "red";
        return;
    }

    //const jsonString = PrettyJson(data);
    //const jsonSuper = HighlightJson(jsonString);
    //dkconsole.log(jsonSuper);

    try {
        let deviceData = JSON.parse(data);
        deviceData.ip = device.ip;
        deviceData.user = device.user;
        devices[devices.indexOf(device)] = deviceData;
        device = deviceData;
    } catch {
        dkconsole.error("data could not be parsed to json");
    }

    // UPDATE TABLE
    device.user.name = device.Status ? device.Status.DeviceName : device.DeviceName;
    if (device.user.name) {
        const deviceCell = DKTable_GetCellByName(table, device.ip, "device");
        deviceCell.innerHTML = "<a title='" + device.ip + "'>" + device.user.name + "</a>";
        DKTable_Sort("deviceTable", 0);
        UpdateTableStyles();
    }

    device.user.power = device.StatusSTS ? device.StatusSTS.POWER : device.POWER;
    if (device.user.power) {
        const powerCell = DKTable_GetCellByName(table, device.ip, "power");
        powerCell.innerHTML = "<a>" + device.user.power + "</a>";
        if (device.user.power === "ON") {
            row.cells[1].style.color = "rgb(0,180,0)";
            DKChart_UpdateChartDevice(device.ip, "switch1", 100);
        } else {
            row.cells[1].style.color = "rgb(40,40,40)";
            DKChart_UpdateChartDevice(device.ip, "switch1", 0);
        }
    }

    const dataCell = DKTable_GetCellByName(table, device.ip, "data");
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
        byId(device.ip + "Temp").style.color = "rgb(" + tempRed + "," + tempGreen + ",0)";
        byId(device.ip + "Temp").style.textAlign = "center";

        DKChart_UpdateChartDevice(device.ip, "sensor1", device.user.temperature);
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
        byId(device.ip + "RH").style.color = "rgb(" + humRed + "," + humGreen + ",0)";
        byId(device.ip + "RH").style.textAlilgn = "center";

        DKChart_UpdateChartDevice(device.ip, "sensor2", device.user.humidity);
    }

    device.user.dewpoint = device.StatusSNS?.SI7021 ? device.StatusSNS.SI7021.DewPoint : false;
    if (device.user.dewpoint) {
        const dewPointText = "<a id='" + device.ip + "DewP'>" + device.user.dewpoint + " DP &#176;F</a>";
        dataCell.innerHTML = dataCell.innerHTML + dewPointText;
        byId(device.ip + "DewP").style.color = "rgb(40,40,40)";
        byId(device.ip + "DewP").style.textAlign = "center";

        DKChart_UpdateChartDevice(device.ip, "sensor3", device.user.dewpoint);
    }

    device.user.rssi = device.StatusSTS?.Wifi ? device.StatusSTS.Wifi.RSSI : device.Wifi?.RSSI;
    if (device.user.rssi) {
        const signal = device.user.rssi;
        const scale = 510;
        const num = (signal * scale / 100);
        const green = num.clamp(0, 255);
        const red = (510 - num).clamp(0, 255);
        const wifiCell = DKTable_GetCellByName(table, device.ip, "wifi");
        wifiCell.innerHTML = signal + "%";
        wifiCell.style.color = "rgb(" + red + "," + green + ",0)";
    }
}
