"use strict";

function DKLoadFiles() {
    //If you initiate anything here, it may fail.
    //This function should only load files, Not initiate variables
    //DKLoadPage() will be call after this loads everything.
    //DKLoadJSFile("https://cdn.jsdelivr.net/npm/superagent");
    DKLoadJSFile("superagent.js");
    DKLoadJSFile("DKMqtt.js");
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
    DKLoadImage("restart.png");
    DKLoadImage("info.png");
    DKLoadImage("settings.png");
    DKLoadAudio("PowerDown.mp3");
}

function DKLoadApp() {
    //Load Non-Gui Stuff
    DKCreateErrorHandler();
    CreateSound("PowerDown.mp3");
    LoadDevices();
    LoadGui();
    
    //Run TimerLoop every minute
    //window.setInterval(TimerLoop, 60000);
    window.setInterval(TimerLoop, 40000);
}

//Load devices from local storage
function LoadDevices() {
    let deviceIPs = [];
    let data = DKLoadFromLocalStorage("deviceIPs")
    if (data) {
        deviceIPs = JSON.parse(data);
    }
    dkconsole.log("Loading (" + deviceIPs.length + ") Devices");
    for (let n = 0; n < deviceIPs.length; n++) {
        let dev = {
            'ip': deviceIPs[n],
            'bypass' : false,
            /*'DK': {
                'ip': deviceIPs[n],
            },*/
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
            let device = JSON.parse(data);
            let deviceInstance = FindObjectValueIncludes(devices, 'ip', url);
            //incoming data doesn't have user data, so copy them in 
            device.ip = deviceInstance.ip;
            device.bypass = deviceInstance.bypass;
            //then update the stored device with the new data
            devices[devices.indexOf(deviceInstance)] = device;
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

    let volume = document.createElement("img");
    volume.src = "volume_100.png";
    volume.style.position = "absolute";
    volume.style.height = "21px";
    volume.style.top = "2px";
    volume.style.right = "2px";
    volume.style.cursor = "pointer";
    parent.appendChild(volume);
    volume.onclick = function(){
        if(GetVolume("PowerDown.mp3") === 1.0){
            SetVolume("PowerDown.mp3", 0.0);
            volume.src = "volume_0.png";
        }
        else{
            SetVolume("PowerDown.mp3", 1.0);
            volume.src = "volume_100.png";
        }
    }
}

function CreateDeviceTable(parent) {
    let deviceDiv = document.createElement("div");
    parent.appendChild(deviceDiv);
    let table = DKCreateTable(deviceDiv, "deviceTable", "30px", "", "20px");

    //Create Header Row as a normal <tr>
    //const deviceHeader = DKTableAddColumn(table, "HEADER", "device"); //FIXME
    DKTableAddRow(table, "HEADER", "device");
    DKTableGetRowByName(table, "HEADER").style.backgroundColor = "rgb(50,50,50)";
    DKTableGetRowByName(table, "HEADER").style.fontWeight = "bold";
    DKTableGetRowByName(table, "HEADER").style.cursor = "pointer";
    DKTableGetCellByName(table, "HEADER", "device").innerHTML = "Devices (0)";
    DKTableGetCellByName(table, "HEADER", "device").style.width = "220px";
    DKTableGetCellByName(table, "HEADER", "device").onclick = function deviceHeaderOnClick(){
        DKSortTable("deviceTable", 0);
        UpdateTableStyles();
    }
    
    DKTableAddColumn(table, "power");
    DKTableGetCellByName(table, "HEADER", "power").innerHTML = "power";
    DKTableGetCellByName(table, "HEADER", "power").style.width = "50px";
    DKTableGetCellByName(table, "HEADER", "power").style.textAlign = "center";
    DKTableGetCellByName(table, "HEADER", "power").onclick = function powerHeaderOnClick(){
        DKSortTable("deviceTable", 1);
        UpdateTableStyles();
    }

    DKTableAddColumn(table, "data");
    DKTableGetCellByName(table, "HEADER", "data").innerHTML = "data";
    DKTableGetCellByName(table, "HEADER", "data").style.width = "140px";
    DKTableGetCellByName(table, "HEADER", "data").style.textAlign = "center";
    DKTableGetCellByName(table, "HEADER", "data").onclick = function dataHeaderOnClick(){
        DKSortTable("deviceTable", 2);
        UpdateTableStyles();
    }

    DKTableAddColumn(table, "wifi");
    DKTableGetCellByName(table, "HEADER", "wifi").innerHTML = "wifi signal";
    DKTableGetCellByName(table, "HEADER", "wifi").style.width = "70px";
    DKTableGetCellByName(table, "HEADER", "wifi").style.textAlign = "center";
    DKTableGetCellByName(table, "HEADER", "wifi").onclick = function wifiHeaderOnClick(){
        DKSortTable("deviceTable", 3);
        UpdateTableStyles();
    }

    DKTableAddColumn(table, "options");
    DKTableGetCellByName(table, "HEADER", "options").innerHTML = "options";
    DKTableGetCellByName(table, "HEADER", "options").style.width = "50px";
    DKTableGetCellByName(table, "HEADER", "options").style.textAlign = "center";
    DKTableGetCellByName(table, "HEADER", "options").onclick = function optionsHeaderOnClick(){
        dkconsole.log("optionsHeaderOnClick");
    }
}

function AddDeviceToTable(ip) {
    let table = document.getElementById("deviceTable");
    let row = DKTableAddRow(table, ip);
    row.setAttribute("ip", ip);
    if (row.rowIndex % 2 == 0) {
        //even
        row.style.backgroundColor = "rgb(90,90,90)";
    } else {
        //odd
        row.style.backgroundColor = "rgb(60,60,60)";
    }

    //const deviceCell = row.cells[0];
    const deviceCell = DKTableGetCellByName(table, ip, "device");
    deviceCell.innerHTML = "<a>" + ip + "</a>";
    deviceCell.style.cursor = "pointer";
    deviceCell.onclick = function CellOnClick() {
        const deviceWindow = window.open("http://" + ip, ip, "_blank, width=500, height=700");
    }

    //const powerCell = row.cells[1];
    const powerCell = DKTableGetCellByName(table, ip, "power");
    powerCell.style.textAlign = "center";
    powerCell.style.cursor = "pointer";
    powerCell.onclick = function PowerOnClick(id) {
        powerCell.innerHTML = "";
        let loading = document.createElement("img");
        loading.src = "loading.gif";
        loading.style.width = "15px";
        loading.style.height = "15px";
        powerCell.appendChild(loading);
        
        //FIXME: get the device from devices and add bypass=1
        for(let n=0; n<devices.length; n++){
            if(devices[n].ip === ip){
                devices[n].bypass = true;
                 dkconsole.warn("Temporarily added " + ip + " to bypass automation, refresh page to reset");
            }
        }
        DKSendRequest("http://" + ip + "/cm?cmnd=POWER%20Toggle", UpdateScreen);
    }

    //const dataCell = row.cells[2];
    const dataCell = DKTableGetCellByName(table, ip, "data");
    //dataCell.setAttribute("name", table.rows[0].cells[2].getAttribute("name"));
    dataCell.style.textAlign = "center";

    //const wifiCell = row.cells[3];
    const wifiCell = DKTableGetCellByName(table, ip, "wifi");
    //wifiCell.setAttribute("name", table.rows[0].cells[3].getAttribute("name"));
    wifiCell.style.textAlign = "center";


    const optionsCell = DKTableGetCellByName(table, ip, "options");
    //optionsCell.setAttribute("name", table.rows[0].cells[3].getAttribute("name"));
    optionsCell.innerHTML = "";
    optionsCell.style.textAlign = "center";

    let restart = document.createElement("img");
    restart.setAttribute("title", "Restart Device");
    restart.src = "restart.png";
    restart.style.width = "12px";
    restart.style.height = "12px";
    restart.style.cursor = "pointer";
    restart.style.paddingRight = "3px";
    restart.style.paddingBottom = "2px";
    restart.onclick = function restartOnClick(){
        DKConfirm("Restart this device?", function(){
            restart.src = "loading.gif";
            DKSendRequest("http://" + ip + "/cm?cmnd=Restart%201", UpdateScreen);
        });
    }
    optionsCell.appendChild(restart);

    let info = document.createElement("img");
    info.setAttribute("title", "Device info");
    info.src = "info.png";
    info.style.width = "12px";
    info.style.height = "12px";
    info.style.cursor = "pointer";
    info.style.paddingRight = "3px";
    info.style.paddingBottom = "2px";
    info.onclick = function InfoOnClick(){
        InfoWindow(ip);
    }
    optionsCell.appendChild(info);

    let settings = document.createElement("img");
    settings.setAttribute("title", "Device settings");
    settings.src = "settings.png";
    settings.style.width = "15px";
    settings.style.height = "15px";
    settings.style.cursor = "pointer";
    settings.onclick = function SettingsOnClick(){
        DKCreateWindow("Settings", "300px", "300px");
    }
    optionsCell.appendChild(settings);

    //Do some final processing
    const deviceHeader = DKTableGetCellByName(table, "HEADER", "device");
    deviceHeader.innerHTML = "Devices (" + (table.rows.length - 1) + ")";
    DKSendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    //DKSortRow("deviceTable", row, 0);
    DKSortTable("deviceTable", 0);
    UpdateTableStyles();
}

function InfoWindow(ip)
{
    DKCreateWindow("Info", "600px", "500px");
    const info = document.getElementById("Info");
    const div = document.createElement("div");
    
    div.style.position = "absolute";
    div.style.top = "20px";
    /*
    div.style.top = "20px";
    div.style.left = "5px";
    div.style.right = "5px";
    div.style.bottom = "5px";
    div.style.backgroundColor = "rgb(70,70,70)";
    */
    
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
    let jsonString = PrettyJson(JSON.stringify(devices[n]));
    let jsonSuper = HighlightJson(jsonString);
    //dkconsole.log(jsonSuper);

    div.innerHTML = jsonSuper;
    info.appendChild(div);
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
    let data = DKLoadFromLocalStorage("deviceIPs");
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
    if(!url || !data){

        PlaySound("PowerDown.mp3");
        return;
    }
    if (!success){
        //dkconsole.error("!success || !url || !data");
        PlaySound("PowerDown.mp3");
        return;
    }
    
    /*
    let jsonString = PrettyJson(data);
    let jsonSuper = HighlightJson(jsonString);
    dkconsole.log(jsonSuper);
    */
    let device;
    try{
        device = JSON.parse(data);
    }catch{
        dkconsole.error("data could not be parsed to json");
    }
    let deviceInstance = FindObjectValueIncludes(devices, 'ip', url);
    //incoming data doesn't have user defined variable, so copy them
    device.ip = deviceInstance.ip;
    device.bypass = deviceInstance.bypass;
    //then update the stored device with the new data
    devices[devices.indexOf(deviceInstance)] = device;

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
        DKTableGetCellByName(table, ip, "device");
        row.setAttribute("Hostname", device.StatusNET.Hostname);
    }
    */
    let deviceName = device.Status ? device.Status.DeviceName : device.DeviceName;
    if (deviceName) {
        row.cells[0].innerHTML = "<a>" + deviceName + "</a>";
        //DKSortRow("deviceTable", row, 0);
        DKSortTable("deviceTable", 0);
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
    if (deviceSI7021 && deviceName.includes("013")) {
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
