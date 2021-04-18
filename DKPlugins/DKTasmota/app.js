"use strict";

const app = [];

app.loadFiles = function app_loadFiles() {
    //If you initiate anything here, it may fail.
    //This function should only load files, Not initiate variables
    //DKLoadPage() will be call after this loads everything.
    DK_Create("DK/DKErrorHandler.js");
    DK_Create("DK/DK.css");
    DK_Create("DK/DKPhp.js");
    DK_Create("DK/DKTrace.js");
    DK_Create("DK/DKJson.js");
    DK_Create("DK/DKValidate.js");
    DK_Create("DK/sun.js");
    DK_Create("DK/DKClock.js");
    DK_Create("DKDebug/DKDebug.js");
    DK_Create("DKFile/DKFile.js");
    DK_Create("DKGui/DKGui.js");
    DK_Create("DKGui/DKFrame.js");
    DK_Create("DKGui/DKMenu.js");
    DK_Create("DKGui/DKMessageBox.js");
    DK_Create("DKGui/DKDrag.js");
    DK_Create("DKGui/DKClipboard.js");
    DK_Create("DKGui/DKTable.js");
    DK_Create("DKGui/DKConsole.js");
    DK_Create("DKCodeMirror/DKCodeMirror.js");
    DK_Create("DKAudio/DKAudio.js", function DK_CreateCallback() {
        DKAudio_PreLoadAudio("DKTasmota/PowerDown.mp3");
    });

    DK_Create("DKTasmota/superagent.js");
    DK_Create("DKTasmota/DKMqtt.js");
    DK_Create("DKTasmota/DKNotifications.js");
    DK_Create("DKTasmota/DKTasmota.js");
    DK_Create("DKTasmota/DKChart.js");
    DK_Create("DKTasmota/Automation.js");
    DK_Create("DKTasmota/VPDCalculator.js");

    DK_PreloadImage("DKTasmota/loading.gif");
    DK_PreloadImage("DKTasmota/restart.png");
    DK_PreloadImage("DKTasmota/info.png");
    DK_PreloadImage("DKTasmota/settings.png");
    DK_PreloadImage("DKTasmota/online.png");
    DK_PreloadImage("DKTasmota/offline.png");
    DK_PreloadImage("DKTasmota/automateOFF.png");
    DK_PreloadImage("DKTasmota/automateON.png");
}

function DKLoadApp() {
    DKErrorHandler_Create();
    DKAudio_CreateSound("DKTasmota/PowerDown.mp3");
    DKTasmota_LoadDevicesFromServer(function() {
        if (location.protocol === "file:") {
            app.server = true;
            app.automate = true;
        } else {
            app.client = true;
            app.automate = false;
        }
        LoadGui();
        
        //Run app main loop every 30 seconds
        window.setInterval(MainAppLoop, 30000);
    });
}

function LoadGui() {
    //document.body.style.margin = "0rem;" 
    dkconsole.Create(document.body, "dkconsole", "", "0rem", "0rem", "0rem", "100%", "25%");
    console.debug("**** Tasmota device manager 0.1b ****");
    app.server && (document.body.style.backgroundColor = "rgb(100,100,140)");
    app.client && (document.body.style.backgroundColor = "rgb(100,100,100)");
    CreateButtons(document.body);
    DKClock_Create(document.body, "clock", "2rem", "", "25%");
    DKClock_GetSunrise(33.7312525, -117.3028688);
    //, 15);
    DKClock_GetSunset(33.7312525, -117.3028688);
    //, 15);
    CreateDeviceTable(document.body);
    DKChart_Create(document.body, "chart", "50%", "75%", "0rem", "0rem", "100%", "25%");
    DKGui_CreateButton(document.body, "Push Assets", "45rem", "", "", "5rem", "63rem", "34rem", PushAssets);
    DKGui_CreateButton(document.body, "DEBUG", "25rem", "", "", "5rem", "63rem", "20rem", dkdebug.debug);

    if (!devices || !devices.length) {
        //console.error("devices array empty");
        return;
    }
    for (let n = 0; n < devices.length; n++) {
        AddDeviceToTable(devices[n]);
    }
}

function PushAssets() {
    PHP_PushDKAssets(function PHP_PushDKAssetsCallback(rval) {
        console.log(rval);
        console.log("done copying assets");
    });
}

function MainAppLoop() {
    DK_IsOnline() ? byId("internet").src = "DKTasmota/online.png" : byId("internet").src = "DKTasmota/offline.png";
    ProcessDevices();
    app.automate && Automate();
}

function SendSuperRequest(url, callback) {
    superagent.get(url).timeout({
        response: 18000,
        // Wait 18 seconds for the server to start sending,
        deadline: 20000,
        // but allow 20 seconds for the file to finish loading.
    }).then(function SendSuperRequestSuccessCallback(res) {
        callback(true, res);
    }, function SendSuperRequestFailCallback(res) {
        callback(false, res);
    });
}


function CreateButtons(parent) {
    DKGui_CreateButton(document.body, "Scan Devices", "", "", "", "", "", "", ScanDevices).style.position = "";
    DKGui_CreateButton(document.body, "Update Devices", "", "", "", "", "", "", MainAppLoop).style.position = "";
    DKGui_CreateButton(document.body, "Clear Devices", "", "", "", "", "", "", ClearDevices).style.position = "";
    DKGui_CreateButton(document.body, "Save Devices", "", "", "", "", "", "", SaveDevices).style.position = "";

    const automation = DKGui_CreateButton(document.body, "Automation", "", "", "", "", "", "", automation_onclick);
    automation.style.position = "";
    automation_update();
    function automation_onclick() {
        app.automate ? app.automate = false : app.automate = true;
        automation_update();
    }
    function automation_update() {
        app.automate ? automation.innerHTML = "Automate ON" : automation.innerHTML = "Automate OFF";
    }

    const internet = DKGui_CreateImageButton(document.body, "internet", "", "2rem", "", "", "58rem", "", "19rem");
    DK_IsOnline() ? internet.src = "DKTasmota/online.png" : internet.src = "DKTasmota/onffline.png";

    const volume = DKGui_CreateImageButton(document.body, "", "DKTasmota/volume_100.png", "2rem", "", "", "28rem", "", "19rem", volume_onclick);
    function volume_onclick() {
        if (DKAudio_GetVolume("DKTasmota/PowerDown.mp3") === 1.0) {
            DKAudio_SetVolume("DKTasmota/PowerDown.mp3", 0.0);
            volume.src = "DKTasmota/volume_0.png";
        } else {
            DKAudio_SetVolume("DKTasmota/PowerDown.mp3", 1.0);
            volume.src = "DKTasmota/volume_100.png";
        }
    }

    const preferences = DKGui_CreateImageButton(document.body, "", "DKTasmota/options.png", "3rem", "", "", "3rem", "", "17rem", PreferencesWindow);
}

function CreateDeviceTable(parent) {
    const deviceDiv = document.createElement("div");
    deviceDiv.style.position = "absolute";
    deviceDiv.style.top = "25rem";
    deviceDiv.style.left = "20rem";
    deviceDiv.style.width = "720rem";
    deviceDiv.style.height = "47.0%";
    //deviceDiv.style.backgroundColor = "rgb(0,0,0)";
    deviceDiv.style.overflow = "auto";
    parent.appendChild(deviceDiv);

    const table = DKTable_Create(deviceDiv, "deviceTable", "0rem", "", "0rem");

    //Create Header Row as a normal <tr>
    //const deviceHeader = DKTableAddColumn(table, "HEADER", "device"); //FIXME
    const row = DKTable_AddRow(table, "HEADER", "device");
    row.style.backgroundColor = "rgb(50,50,50)";
    row.style.fontWeight = "bold";
    row.style.cursor = "pointer";
    const deviceCell = DKTable_GetCellByName(table, "HEADER", "device");
    deviceCell.innerHTML = "Devices (0)";
    deviceCell.style.width = "230rem";
    deviceCell.onclick = function HEADER_device_onclick() {
        DKTable_Sort("deviceTable", "device");
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "power");
    const powerCell = DKTable_GetCellByName(table, "HEADER", "power");
    powerCell.innerHTML = "power";
    powerCell.style.width = "50rem";
    powerCell.style.textAlign = "center";
    powerCell.onclick = function HEADER_power_onclick() {
        DKTable_Sort("deviceTable", "power");
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "data");
    const dataCell = DKTable_GetCellByName(table, "HEADER", "data");
    dataCell.innerHTML = "data";
    dataCell.style.width = "150rem";
    dataCell.style.textAlign = "center";
    dataCell.onclick = function HEADER_data_onclick() {
        DKTable_Sort("deviceTable", "data");
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "automate");
    const automateCell = DKTable_GetCellByName(table, "HEADER", "automate");
    automateCell.innerHTML = "automate";
    automateCell.style.width = "50rem";
    automateCell.style.textAlign = "center";
    automateCell.onclick = function HEADER_automate_onclick() {
        DKTable_Sort("deviceTable", "automate");
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "wifi");
    const wifiCell = DKTable_GetCellByName(table, "HEADER", "wifi");
    wifiCell.innerHTML = "wifi signal";
    wifiCell.style.width = "70rem";
    wifiCell.style.textAlign = "center";
    wifiCell.onclick = function HEADER_wifi_onclick() {
        DKTable_Sort("deviceTable", "wifi");
        UpdateTableStyles();
    }

    DKTable_AddColumn(table, "options");
    const optionsCell = DKTable_GetCellByName(table, "HEADER", "options");
    optionsCell.innerHTML = "options";
    optionsCell.style.width = "120rem";
    optionsCell.style.textAlign = "center";
    optionsCell.onclick = function HEADER_options_onclick() {//console.log("HEADER_options_onclick");
    }
}

function AddDeviceToTable(device) {
    const table = byId("deviceTable");
    const row = DKTable_AddRow(table, device.ip);
    row.setAttribute("ip", device.ip);
    if (row.rowIndex % 2 == 0) {
        //even
        row.style.backgroundColor = "rgb(90,90,90)";
    } else {
        //odd
        row.style.backgroundColor = "rgb(60,60,60)";
    }

    const deviceCell = DKTable_GetCellByName(table, device.ip, "device");
    device.user.name ? deviceCell.innerHTML = "<a>" + device.user.name + "</a>" : deviceCell.innerHTML = "<a>" + device.ip + "</a>";
    deviceCell.style.cursor = "pointer";
    deviceCell.onclick = function deviceCell_onclick() {
        const deviceWindow = window.open("http://" + device.ip, device.ip, "_blank, width=500, height=700");
    }

    const powerCell = DKTable_GetCellByName(table, device.ip, "power");
    powerCell.style.textAlign = "center";
    powerCell.style.cursor = "pointer";
    powerCell.onclick = function powerCell_onclick() {
        powerCell.innerHTML = "";
        const loading = document.createElement("img");
        loading.src = "DKTasmota/loading.gif";
        loading.style.width = "15rem";
        loading.style.height = "15rem";
        powerCell.appendChild(loading);
        DK_SendRequest("http://" + device.ip + "/cm?cmnd=POWER%20Toggle", UpdateScreen);
    }

    const dataCell = DKTable_GetCellByName(table, device.ip, "data");
    dataCell.style.textAlign = "center";

    const automateCell = DKTable_GetCellByName(table, device.ip, "automate");
    automateCell.style.textAlign = "center";
    const auto = document.createElement("img");
    auto.id = device.ip + "automate";
    auto.setAttribute("title", "Automation");
    (device.user.automate === undefined) && (device.user.automate = false);
    device.user.automate ? auto.src = "DKTasmota/automateON.png" : auto.src = "DKTasmota/automateOFF.png";
    auto.style.width = "17rem";
    auto.style.cursor = "pointer";
    auto.style.paddingRight = "3rem";
    auto.style.paddingBottom = "2rem";
    auto.onclick = function auto_onclick() {
        device.user.automate ? device.user.automate = false : device.user.automate = true;
        device.user.automate ? auto.src = "DKTasmota/automateON.png" : auto.src = "DKTasmota/automateOFF.png";
    }
    automateCell.appendChild(auto);

    const wifiCell = DKTable_GetCellByName(table, device.ip, "wifi");
    wifiCell.style.textAlign = "center";

    const optionsCell = DKTable_GetCellByName(table, device.ip, "options");
    optionsCell.innerHTML = "";
    optionsCell.style.textAlign = "center";

    //Device Restart
    const restart = document.createElement("img");
    restart.id = device.ip + "restart";
    restart.setAttribute("title", "Restart Device");
    restart.src = "DKTasmota/restart.png";
    restart.style.width = "12rem";
    restart.style.height = "12rem";
    restart.style.cursor = "pointer";
    restart.style.paddingRight = "3rem";
    restart.style.paddingBottom = "2rem";
    restart.onclick = function restart_onclick() {
        dk.messagebox.confirm("Restart this device?", function DKMessageBox_ConfirmCallback(rval) {
            if (rval) {
                restart.src = "DKTasmota/loading.gif";
                DK_SendRequest("http://" + device.ip + "/cm?cmnd=Restart%201", UpdateScreen);
            }
        });
        //dk.frame.setTitle(byId("DKGui/DKMessageBox.html"), "Restart?");
    }
    optionsCell.appendChild(restart);

    //Device Info
    const info = document.createElement("img");
    info.setAttribute("title", "Device Info");
    info.src = "DKTasmota/info.png";
    info.style.width = "12rem";
    info.style.height = "12rem";
    info.style.cursor = "pointer";
    info.style.paddingRight = "3rem";
    info.style.paddingBottom = "2rem";
    info.onclick = function info_onclick() {
        InfoWindow(device);
    }
    optionsCell.appendChild(info);

    //Device Settings
    const settings = document.createElement("img");
    settings.setAttribute("title", "Device Settings");
    settings.src = "DKTasmota/settings.png";
    settings.style.width = "15rem";
    settings.style.height = "15rem";
    settings.style.cursor = "pointer";
    settings.onclick = function settings_onclick() {
        SettingsWindow(device);
    }
    optionsCell.appendChild(settings);

    const dConsole = document.createElement("img");
    dConsole.setAttribute("title", "Device Console");
    dConsole.src = "DKTasmota/console.png";
    dConsole.style.width = "15rem";
    dConsole.style.height = "15rem";
    dConsole.style.paddingLeft = "3rem";
    dConsole.style.cursor = "pointer";
    dConsole.onclick = function dConsole_onclick() {
        DConsoleWindow(device);
    }
    optionsCell.appendChild(dConsole);

    const dChart = document.createElement("img");
    dChart.id = device.ip + "dChart";
    dChart.setAttribute("title", "Device Chart");
    dChart.src = "DKTasmota/chart.png";
    dChart.style.width = "15rem";
    dChart.style.marginLeft = "3rem";
    dChart.style.cursor = "pointer";
    optionsCell.appendChild(dChart);

    dChart.onclick = function dChart_onclick() {
        for (let n = 0; n < devices.length; n++) {
            if (devices[n].ip === device.ip) {
                byId(device.ip + "dChart").style.backgroundColor = DKChart_SelectChart(device.ip);
            } else {
                byId(devices[n].ip + "dChart").style.backgroundColor = "rgba(0,0,0,0.0)";
            }
        }
    }
    dChart.oncontextmenu = function dChart_oncontextmenu(event) {
        event.preventDefault();
        const color = DKChart_ToggleChart(device.ip);
        for (let n = 0; n < devices.length; n++) {
            if (devices[n].ip === device.ip) {
                if (color) {
                    byId(devices[n].ip + "dChart").style.backgroundColor = color;
                } else {
                    byId(devices[n].ip + "dChart").style.backgroundColor = "rgba(0,0,0,0.0)";
                }
            }
        }
    }
    optionsCell.appendChild(dChart);

    //Do some final processing
    const deviceHeader = DKTable_GetCellByName(table, "HEADER", "device");
    deviceHeader.innerHTML = "Devices (" + (table.rows.length - 1) + ")";
    DK_SendRequest("http://" + device.ip + "/cm?cmnd=Status%200", UpdateScreen);
    DKTable_Sort("deviceTable", "device");
    UpdateTableStyles();
}

function PreferencesWindow() {
    const div = document.createElement("div");
    div.id = "Preferences";
    div.style.position = "absolute";
    div.style.top = "20rem";
    div.style.width = "100%";
    div.style.fontSize = "12rem";
    div.style.fontFamily = "Consolas, Lucinda, Console, Courier New, monospace";
    div.style.whiteSpace = "pre-wrap";
    div.style.boxSizing = "border-box";
    div.style.padding = "2rem";
    div.style.paddingLeft = "20rem";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1rem";
    div.style.borderTopWidth = "0rem";
    div.style.borderLeftWidth = "0rem";
    div.style.borderRightWidth = "0rem";
    div.style.backgroundColor = "rgb(36,36,36)";
    div.style.overflow = "auto";

    document.body.appendChild(div);
    dk.frame.create(div);
}

function InfoWindow(device) {
    const div = document.createElement("div");
    div.id = "Info";
    div.style.position = "absolute";
    div.style.top = "20rem";
    div.style.width = "100%";
    div.style.fontSize = "12rem";
    div.style.fontFamily = "Consolas, Lucinda, Console, Courier New, monospace";
    div.style.whiteSpace = "pre-wrap";
    div.style.boxSizing = "border-box";
    div.style.padding = "2rem";
    div.style.paddingLeft = "20rem";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1rem";
    div.style.borderTopWidth = "0rem";
    div.style.borderLeftWidth = "0rem";
    div.style.borderRightWidth = "0rem";
    div.style.backgroundColor = "rgb(36,36,36)";
    div.style.overflow = "auto";

    const jsonString = DKJson_PrettyJson(JSON.stringify(device));
    const jsonSuper = DKJson_HighlightJson(jsonString);
    //console.log(jsonSuper);
    div.innerHTML = jsonSuper;
    document.body.appendChild(div);
    dk.frame.create(div);
    dk.frame.setTitle(div, device.user.name + " Info");
}

function SettingsWindow(device) {
    const div = document.createElement("div");
    div.id = "Settings";
    div.style.position = "absolute";
    div.style.top = "20rem";
    div.style.width = "100%";
    div.style.fontSize = "12rem";
    div.style.fontFamily = "Consolas, Lucinda, Console, Courier New, monospace";
    div.style.whiteSpace = "pre-wrap";
    div.style.boxSizing = "border-box";
    div.style.padding = "2rem";
    div.style.paddingLeft = "20rem";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1rem";
    div.style.borderTopWidth = "0rem";
    div.style.borderLeftWidth = "0rem";
    div.style.borderRightWidth = "0rem";
    div.style.backgroundColor = "rgb(36,36,36)";
    div.style.overflow = "auto";
    document.body.appendChild(div);
    dk.frame.create(div);
    dk.frame.setTitle(div, device.user.name + " Settings");
}

function DConsoleWindow(device) {
    const div = document.createElement("div");
    div.id = "Console";
    div.style.position = "absolute";
    div.style.width = "100%";
    //div.style.backgroundColor = "rgb(36,36,36)";
    div.style.overflow = "auto";

    const output = document.createElement("div");
    output.style.position = "absolute";
    output.style.top = "10rem";
    output.style.left = "10rem";
    //output.style.width = "";
    //output.style.height = "";
    output.style.right = "10rem";
    output.style.bottom = "40rem";
    output.style.backgroundColor = "rgb(0,0,0)";
    div.appendChild(output);

    //command box
    const input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    //input.style.top = "";
    input.style.left = "10rem";
    input.style.width = "90%";
    input.style.height = "22rem";
    //input.style.right = "10rem";
    input.style.bottom = "10rem";
    input.style.color = "rgb(255,255,255)";
    input.style.backgroundColor = "rgb(0,0,0)";
    input.onkeydown = function input_onkeydown() {
        const key = event.charCode || event.keyCode;
        if (key === 13) {
            //enter
            console.debug("Send command -> " + input.value);
            const cmnd = input.value;
            const url = "http://" + device.ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
            DK_SendRequest(url, function DK_SendRequestCallback(success, url, data) {
                //console.log("function DK_SendRequestCallback("+success+","+url+","+data+")");
                if (data) {
                    const msgDiv = document.createElement("div");
                    msgDiv.style.width = "100%";
                    msgDiv.style.fontSize = "12rem";
                    msgDiv.style.fontFamily = "Consolas, Lucinda, Console, Courier New, monospace";
                    msgDiv.style.whiteSpace = "pre-wrap";
                    msgDiv.style.boxSizing = "border-box";
                    msgDiv.style.padding = "2rem";
                    msgDiv.style.paddingLeft = "10rem";

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
    dk.frame.create(div);
    dk.frame.setTitle(div, device.user.name + " Console");
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
    DKTasmota_GetDevices("192.168.1.", function DKTasmota_GetDevicesCallback(ip, done) {
        if (ip && !DKJson_FindPartialMatch(devices, 'ip', ip)) {
            const device = DKTasmota_CreateDevice(ip);
            AddDeviceToTable(device);
            DKTasmota_SaveDevicesToServer();
            DKTasmota_SaveDevicesToLocalStorage();
        }
        if (done) {
            console.log("\n");
            console.log("Scan Complete", "green");
            console.log("(" + devices.length + ") Tasmota Devices found", "green");
        }
    });
}

function ClearDevices() {
    const table = byId("deviceTable");
    table.parentNode.remove(table);
    CreateDeviceTable(document.body);
    DK_RemoveFromLocalStorage("devices");
    devices = [];
}

function SaveDevices() {
    DKTasmota_SaveDevicesToServer();
    DKTasmota_SaveDevicesToLocalStorage();
}

function ProcessDevices() {
    const table = byId("deviceTable");
    for (let n = 1; n < table.rows.length; n++) {
        const ip = table.rows[n].getAttribute("ip");
        DK_SendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    }
}

function UpdateScreen(success, url, data) {
    if (!url)
        return error("url invalid");
    if (!devices.length)
        return warn("devices array empty");
    let device = DKJson_FindPartialMatch(devices, 'ip', url);
    if (!device)
        return error("device invalid, didn't find ip in url:" + url);
    const table = byId("deviceTable");
    if (!table)
        return error("table invlid");
    const row = DKTable_GetRowByName(table, device.ip);
    if (!row)
        return warn("row invalid");

    if (!success || !data) {
        DKAudio_Play("DKTasmota/PowerDown.mp3");
        row.style.backgroundColor = "red";
        return warn(device.ip + " did not respond");
    }

    //const jsonString = DKJson_PrettyJson(data);
    //const jsonSuper = DKJson_HighlightJson(jsonString);
    //console.log(jsonSuper);

    try {
        let deviceData = JSON.parse(data);
        deviceData.ip = device.ip;
        deviceData.user = device.user;
        devices[devices.indexOf(device)] = deviceData;
        device = deviceData;
    } catch {
        return error("data could not be parsed to json");
    }

    // UPDATE TABLE
    device.DeviceName && (device.user.name = device.DeviceName);
    device.Status && device.Status.DeviceName && (device.user.name = device.Status.DeviceName);
    if (device.user.name) {
        const deviceCell = DKTable_GetCellByName(table, device.ip, "device");
        deviceCell.innerHTML = "<a title='" + device.ip + "'>" + device.user.name + "</a>";
        DKTable_Sort("deviceTable", "device");
        UpdateTableStyles();
    }

    device.user.power = device.StatusSTS ? device.StatusSTS.POWER : device.POWER;
    if (device.user.power) {
        const powerCell = DKTable_GetCellByName(table, device.ip, "power");
        powerCell.innerHTML = "<a>" + device.user.power + "</a>";
        if (device.user.power === "ON") {
            row.cells[1].style.color = "rgb(0,180,0)";
            DKChart_UpdateDevice(device, "switch1", 100);
        } else {
            row.cells[1].style.color = "rgb(40,40,40)";
            DKChart_UpdateDevice(device, "switch1", 0);
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
        !device.user.temperatureTarget && (device.user.temperatureTarget = 77);
        !device.user.temperatureZone && (device.user.temperatureZone = 20);
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

        DKChart_UpdateDevice(device, "sensor1", device.user.temperature);
    }

    device.user.humidity = device.StatusSNS?.SI7021 ? device.StatusSNS.SI7021.Humidity : false;
    if (device.user.humidity) {
        let humDirection = " ";
        !device.user.humidityTarget && (device.user.humidityTarget = 50);
        !device.user.humidityZone && (device.user.humidityZone = 20);
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

        DKChart_UpdateDevice(device, "sensor2", device.user.humidity);
    }

    device.user.dewpoint = device.StatusSNS?.SI7021 ? device.StatusSNS.SI7021.DewPoint : false;
    if (device.user.dewpoint) {
        const dewPointText = "<a id='" + device.ip + "DewP'>" + device.user.dewpoint + " DP &#176;F</a>";
        dataCell.innerHTML = dataCell.innerHTML + dewPointText;
        byId(device.ip + "DewP").style.color = "rgb(40,40,40)";
        byId(device.ip + "DewP").style.textAlign = "center";

        DKChart_UpdateDevice(device, "sensor3", device.user.dewpoint);
    }

    if (device.user.automate === true) {
        byId(device.ip + "automate").src = "DKTasmota/automateON.png";
    } else {
        byId(device.ip + "automate").src = "DKTasmota/automateOFF.png";
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

    (data !== '{"Restart":"Restarting"}') && (byId(device.ip + "restart").src = "DKTasmota/restart.png");
}
