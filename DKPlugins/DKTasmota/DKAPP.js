"use strict";

var time;
var temperature = 77.0;
var humidity = 50.0;
var dewPoint = 56.9;
var bypassRules = [];

var tempTarget = 77;
var tempCalib = -5;
var tempMin = tempTarget - 10;
var tempMax = tempTarget + 10;

var humTarget = 50;
var humCalib = -13;
var humMin = humTarget - 10;
var humMax = humTarget + 10;

var exhaustFan = true;
var co2 = false;
var waterWalls = true;
var heater = true;

//////////////////////
function DKLoadFiles() {
    //If you initiate anything here, it may fail.
    //This function can only load files, Not initiate variables. 
    //Example: DKTable: line 50 will fail because it initiates before DKConsole.
    //DKLoadJSFile("console-listener.js");
    DKLoadJSFile("DKDebug.js");
    DKLoadJSFile("DKConsole.js");
    DKLoadJSFile("https://cdn.jsdelivr.net/npm/superagent");
    DKLoadJSFile("DKNotifications.js");
    DKLoadJSFile("DKAudio.js");
    DKLoadJSFile("DKTasmota.js");
    DKLoadJSFile("DKTable.js");
    DKLoadJSFile("DKClock.js");
    DKLoadJSFile("DKChart.js");
    DKLoadJSFile("VPDCalculator.js");
}

/////////////////////
function DKLoadPage() {
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundColor = "rgb(100,100,100)";

    CreateButtons(body);
    CreateClock(body, "clock", "2px", "", "", "10px");
    CreateDeviceTable(body);

    //var winH = window.innerHeight;
    //var chartTop = (winH-500)+"px";
    CreateChart(body, "id", "30%", "", "1px", "1px", "", "400px", function() {
        UpdateChart(humidity, temperature, dewPoint);
    });

    CreateDKConsole(body, "dkconsole", "75%", "0px", "0px", "0px", "", "");
    CreateSound("PowerDown.mp3");
    //CreateVPDCalculator(body, "30px", "", "", "2px", "400px", "600px");
    //CreateDebugBox(body, "30px", "", "", "2px", "200px", "400px");

    dkconsole.debug("**** Tasmota device manager 0.1b ****");

    /*
    //Load Devices from Cookies
    var cookies = GetCookie().split("^");
    for (n = 0; n < cookies.length - 1; n++) {
        var ip = cookies[n];
        AddDevice(ip);
    }
    */

    //Load devices from local storage
    var deviceIPs = LoadFromLocalStorage("deviceIPs").split("^");
    for (var n = 0; n < deviceIPs.length - 1; n++) {
        var ip = deviceIPs[n];
        AddDevice(ip);
    }

    //Run TimerLoop every minute
    window.setInterval(TimerLoop, 60000);

}

//////////////////////////////
function CreateButtons(parent) {
    var scanDevices = document.createElement("button");
    scanDevices.innerHTML = "Scan Devices";
    scanDevices.position = "absolute";
    scanDevices.top = "5px";
    scanDevices.left = "5px";
    scanDevices.style.cursor = "pointer";
    scanDevices.onclick = function() {
        ScanDevices();
    }
    parent.appendChild(scanDevices);

    var updateDevices = document.createElement("button");
    updateDevices.innerHTML = "Update Devices";
    updateDevices.position = "absolute";
    updateDevices.top = "5px";
    updateDevices.left = "30px";
    updateDevices.style.cursor = "pointer";
    updateDevices.onclick = function() {
        TimerLoop(false);
    }
    parent.appendChild(updateDevices);
}

//////////////////////////////////
function CreateDeviceTable(parent) {
    var devices = document.createElement("div");
    parent.appendChild(devices);
    var table = DKCreateTable(devices, "deviceTable", "30px", "", "20px");

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
    DKSendRequest("http://" + ip + "/cm?cmnd=Hostname", function(success, url, data) {
        if (!success) {
            dkconsole.error("DKSendRequest(http://" + ip + "/cm?cmnd=Hostname, function(" + success + ", " + url + ", " + data + "): Failed (!success)");
            return;
        }
        if (!url.includes(ip)) {
            dkconsole.error("AddDevice(" + ip + "): Failed (!url.includes(ip))");
            return;
        }
        var device = JSON.parse(data);
        if (!device.Hostname) {
            dkconsole.error("AddDevice(" + ip + "): Failed (!device.Hostname)");
            return;
        }
        var hostname = device.Hostname;
        var table = document.getElementById("deviceTable");
        var row = DKTableAddRow(table, ip);
        //var row = table.rows[table.rows.length - 1];
        if (row.rowIndex % 2 == 0) {
            //even
            row.style.backgroundColor = "rgb(100,100,100)";
        } else {
            //odd
            row.style.backgroundColor = "rgb(70,70,70)";
        }

        row.setAttribute("ip", ip);
        row.setAttribute("hostname", hostname);

        // cell = row.cells[n]; will return the cell by index numbers.
        // cell = DKTableGetCellByNames(table, "rowName", "columbName"); will return the cell by names
        // If the table is changed, by index will be become wrong. 
        // cell By names should stay consistant upon changes to the table. 

        var cell;
        //cell = row.cells[0];
        cell = DKTableGetCellByNames(table, ip, "device");
        cell.innerHTML = "<a>" + ip + "</a>";
        cell.style.cursor = "pointer";
        cell.onclick = function() {
            var theWindow = window.open("http://" + ip, "MsgWindow", "width=500,height=700");
        }

        //cell = row.cells[1];
        cell = DKTableGetCellByNames(table, ip, "power");
        cell.style.textAlign = "center";
        cell.style.cursor = "pointer";
        cell.onclick = function() {
            var hostname = row.getAttribute("hostname");
            if (!bypassRules.includes(hostname)) {
                bypassRules += hostname;
                bypassRules += ",";
                dkconsole.warn("Temporarily added " + hostname + " to bypass automation, refresh page to reset");
            }
            DKSendRequest("http://" + ip + "/cm?cmnd=POWER%20Toggle", UpdateScreen);
        }

        // DEBUG /////
        //Add a coulum to test retrieving cells by index vs cells by name
        //DKTableAddColumn(table, "debug");
        //Event though many Columns were added on this itteration, cell by name still works
        //////////////

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
    });
}

/////////////////////////
function TimerLoop(force) {

    //DUBUG ///////////////////////
    TestStackTrace("moe", "larry", "curly");
    //DEBUG /////////////////////

    var currentdate = new Date();
    time = currentdate.getHours() + (currentdate.getMinutes() * .01);
    ProcessRules();
    ProcessDevices();
    if (temperature && humidity) {
        UpdateChart(humidity, temperature, dewPoint);
    }
}

////////////////////////
function ScanDevices() {
    var cookieString = "";
    var localStorageString = "";
    var table = document.getElementById("deviceTable");
    var body = document.body;
    table.parentNode.remove(table);
    CreateDeviceTable(body);

    GetTasmotaDevices("192.168.1.", function(ip, done) {
        if (ip) {
            AddDevice(ip);

            /*
            //Save to cookies
            if (!cookieString.includes(ip)) {
                cookieString = cookieString + ip + "^";
                SetCookie(cookieString, 30);
            }
            */

            //Save to local storage
            if (!localStorageString.includes(ip)) {
                localStorageString = localStorageString + ip + "^";
                SaveToLocalStorage("deviceIPs", localStorageString);
            }
        }
        if (done) {
            dkconsole.log("\n");
            dkconsole.message("Scan Complete", "green");
            dkconsole.message("(" + tasmotaDeviceCount + ") Tasmota Devices found", "green");
            //SetCookie(cookieString, 30);
            SaveToLocalStorage("deviceIPs", localStorageString);
        }
    });
}

/////////////////////////
function ProcessDevices() {
    var table = document.getElementById("deviceTable");
    for (var n = 1; n < table.rows.length; n++) {
        var ip = table.rows[n].getAttribute("ip");
        DKSendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    }
}

/////////////////////////////////////////
function UpdateScreen(success, url, data) {
    if (!success) {
        //Test for power outage
        dkconsole.debug("!success");
        PlaySound("PowerDown.mp3");
        return;
    }

    var row;
    var table = document.getElementById("deviceTable");
    for (var n = 1; n < table.rows.length; n++) {
        if (url.includes(table.rows[n].getAttribute("ip")) || url.includes(table.rows[n].getAttribute("hostname"))) {
            row = table.rows[n];
            continue;
        }
    }
    //var row = DKTableGetRowByName(table, ip);
    if (!row) {
        dkconsole.error("!row");
        return;
    }

    var device = JSON.parse(data);
    var ip = row.getAttribute("ip");

    var deviceHostname = device.StatusNet ? device.StatusNet.Hostname : device.Hostname;
    if (deviceHostname) {
        //DKTableGetCellByNames(table, ip, "device");
        row.setAttribute("Hostname", deviceHostname);
    }

    var deviceName = device.Status ? device.Status.DeviceName : device.DeviceName;
    if (deviceName) {
        row.cells[0].innerHTML = "<a>" + deviceName + "</a>";
    }

    var devicePower = device.StatusSTS ? device.StatusSTS.POWER : device.POWER;
    if (devicePower) {
        row.cells[1].innerHTML = "<a>" + devicePower + "</a>";
        if (devicePower === "ON") {
            row.cells[1].style.color = "rgb(0,180,0)";
        } else {
            row.cells[1].style.color = "rgb(40,40,40)";
        }
    }

    var deviceSI7021 = device.StatusSNS ? device.StatusSNS.SI7021 : 0;
    if (deviceSI7021) {
        temperature = (deviceSI7021.Temperature + tempCalib).toFixed(1);
        var tempDirection = " ";
        if (temperature > tempTarget) {
            tempDirection = "&#8593;"
        }
        if (temperature < tempTarget) {
            tempDirection = "&#8595;"
        }
        if (tempText === tempTarget) {
            tempDirection = " ";
        }
        var tempText = "<a id='Temp'>" + temperature + " &#176;F" + tempDirection + "</a>";
        var tempTargetText = "<a id='TempTarg'> (" + tempTarget + "&#176;F)</a>";

        humidity = (deviceSI7021.Humidity + humCalib).toFixed(1);
        var humDirection = " ";
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

        var humText = "<a id='RH'>" + humidity + " RH%" + humDirection + "</a>";
        var humTargetText = "<a id='humTarg'> (" + humTarget + "%)</a>";
        // At 77F and 50% RH,  Dew Point should be 56.9°F
        var dewPointText = "<a id='DewP'>" + dewPoint + " DP &#176;F</a>";

        var tempScale = 510;
        var tempDiff = (Math.abs(tempTarget - temperature) * 5)/*.toFixed(1)*/
        ;
        var tempNum = (tempDiff * tempScale / 100)/*.toFixed(1)*/
        ;
        var tempRed = tempNum
        var tempGreen = 510 - tempNum;
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
        var humScale = 510;
        var humDiff = (Math.abs(humTarget - humidity) * 5);
        var humNum = (humDiff * humScale / 100);
        var humRed = humNum;
        var humGreen = 510 - humNum;
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
    }

    var deviceWifi = device.StatusSTS ? device.StatusSTS.Wifi : device.Wifi;
    if (deviceWifi) {
        var signal = deviceWifi.RSSI;
        var scale = 510;
        var num = (signal * scale / 100)/*.toFixed(1)*/
        ;
        var green = num;
        var red = 510 - num;
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

///////////////////////
function ProcessRules() {

    DumpVariables();

    //Alarms
    if (temperature < tempMin) {
        dkconsole.warn("!!! TEMPERATURE BELOW MINIMUM " + temperature + "&#176;F < " + tempMin + "&#176;F !!!");
    }
    if (temperature > tempMax) {
        dkconsole.warn("!!! TEMPERATURE ABOVE MAXIMUM " + temperature + "&#176;F > " + tempMax + "&#176;F !!!");
    }
    if (humidity < humMin) {
        dkconsole.warn("!!! HUMUDITY BELOW MINIMUM " + humidity + "% < " + humMin + "% !!!");
    }
    if (humidity > humMax) {
        dkconsole.warn("!!! HUMUDITY ABOVE MAXIMUM " + humidity + "% > " + humMax + "% !!!");
    }

    //Exhaust fan
    if (!bypassRules.includes("Device005") && exhaustFan) {
        if ((temperature > tempTarget) || (humidity > humTarget && temperature > tempTarget) || (temperature - dewPoint) < 1.5) {
            dkconsole.message("Exhaust Fan ON", "green");
            DKSendRequest("http://Device005/cm?cmnd=POWER%20ON", UpdateScreen);

        } else {
            dkconsole.warn("Exhaust Fan OFF");
            DKSendRequest("http://Device005/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Water walls
    if (!bypassRules.includes("Device007") && waterWalls) {
        if ((time < 17) && (temperature > tempTarget) && (humidity < humMax) || (humidity < humTarget) && (temperature > tempMin)) {
            dkconsole.message("Water walls ON", "green");
            DKSendRequest("http://Device007/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.warn("Water walls OFF");
            DKSendRequest("http://Device007/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Co2
    if (!bypassRules.includes("Device008") && co2) {
        if ((temperature < tempTarget) && (humidity < humTarget)) {
            dkconsole.message("Co2 ON", "green");
            DKSendRequest("http://Device008/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.warn("Co2 OFF");
            DKSendRequest("http://Device008/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Heater
    if (!bypassRules.includes("Device006") && heater) {
        if (temperature < tempTarget) {
            dkconsole.message("Heater ON", "green");
            DKSendRequest("http://Device006/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.warn("Heater OFF");
            DKSendRequest("http://Device006/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }
}

////////////////////////
function DumpVariables() {

    if (DEBUG) {
        dkconsole.debug("time: " + time);
        dkconsole.debug("temperature: " + temperature);
        dkconsole.debug("humidity: " + humidity);
        dkconsole.debug("dewPoint: " + dewPoint);
        dkconsole.debug("bypassRules: " + bypassRules);

        dkconsole.debug("tempTarget: " + tempTarget);
        dkconsole.debug("tempCalib: " + tempCalib);
        dkconsole.debug("tempMin: " + tempMin);
        dkconsole.debug("tempMax: " + tempMax);

        dkconsole.debug("humTarget: " + humTarget);
        dkconsole.debug("humCalib: " + humCalib);
        dkconsole.debug("humMin: " + humMin);
        dkconsole.debug("humMax: " + humMax);

        dkconsole.debug("exhaustFan: " + exhaustFan);
        dkconsole.debug("co2: " + co2);
        dkconsole.debug("waterWalls: " + waterWalls);
        dkconsole.debug("heater: " + heater);
    }
}
