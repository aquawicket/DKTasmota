var Time;
var Temp;
var Humidity;
var DewPoint;
var bypassRules = [];

var TempTarget = 77;
var TempCalib = -5;
var TempMin = TempTarget - 10;
var TempMax = TempTarget + 10;

var HumTarget = 50;
var HumCalib = -13;
var HumMin = HumTarget - 10;
var HumMax = HumTarget + 10;

var ExhaustFan = true;
var Co2 = false;
var WaterWalls = false;
var Heater = true;


//////////////////////
function DKLoadFiles() {
    DKLoadJSFile("https://cdn.jsdelivr.net/npm/superagent");
    DKLoadJSFile("DKCookies.js");
    DKLoadJSFile("DKConsole.js");
    DKLoadJSFile("DKDebug.js");
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
    body = document.getElementsByTagName('body')[0];
    body.style.backgroundColor = "rgb(100,100,100)";

    CreateButtons(body);
    CreateClock(body, "clock", "2px", "", "", "10px");
    CreateDeviceTable(body);
    CreateChart(body, "id", "", "75px", "2px", "2px", "", "400px");
    CreateDKConsole(body, "dkConsole", "700px", "0px", "0px", "0px", "", "");
    CreateSound("PowerDown.mp3");
    //CreateVPDCalculator(body, "30px", "", "", "2px", "400px", "600px");
    //CreateDebugBox(body, "30px", "", "", "2px", "200px", "400px");

    dkConsole.log("**** Tasmota device manager 0.1b ****<br>");
    var cookies = getCookie().split("^");
    for (n = 0; n < cookies.length - 1; n++) {
        var ip = cookies[n];
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
    scanDevices.onclick = function() {
        ScanDevices();
    }
    parent.appendChild(scanDevices);

    var updateDevices = document.createElement("button");
    updateDevices.innerHTML = "Update Devices";
    updateDevices.position = "absolute";
    updateDevices.top = "5px";
    updateDevices.left = "30px";
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
    DKTableAddRow(table, "header");
    table.rows[0].style.backgroundColor = "rgb(50,50,50)";
    table.rows[0].style.fontWeight = "bold";
    table.rows[0].cells[0].innerHTML = "Devices (0)";
    table.rows[0].cells[0].style.width = "220px";
    DKTableAddColumn(table, "power");
    table.rows[0].cells[1].innerHTML = "power";
    table.rows[0].cells[1].style.width = "50px";
    table.rows[0].cells[1].style.textAlign = "center";
    DKTableAddColumn(table, "data");
    table.rows[0].cells[2].innerHTML = "data";
    table.rows[0].cells[2].style.width = "140px";
    table.rows[0].cells[2].style.textAlign = "center";
    DKTableAddColumn(table, "wifi");
    table.rows[0].cells[3].innerHTML = "wifi signal";
    table.rows[0].cells[3].style.width = "70px";
    table.rows[0].cells[3].style.textAlign = "center";
}

//////////////////////
function AddDevice(ip) {
    DKSendRequest("http://" + ip + "/cm?cmnd=Hostname", function(success, url, data) {
        if (!success || !url.includes(ip)) {
            return;
        }
        var device = JSON.parse(data);
        if (!device.Hostname) {
            return;
        }
        var hostname = device.Hostname;
        var table = document.getElementById("deviceTable");
        DKTableAddRow(table, ip);
        var row = table.rows[table.rows.length - 1];
        if (row.rowIndex % 2 == 0) {
            //even
            row.style.backgroundColor = "rgb(100,100,100)";
        } else {
            //odd
            row.style.backgroundColor = "rgb(70,70,70)";
        }

        row.setAttribute("ip", ip);
        row.setAttribute("hostname", hostname);

        //row.cells[0].setAttribute("name", "ip");
        row.cells[0].innerHTML = "<a>" + ip + "</a>";
        row.cells[0].style.cursor = "pointer";
        row.cells[0].onclick = function() {
            var theWindow = window.open("http://" + ip, "MsgWindow", "width=500,height=700");
        }
        //row.cells[1].setAttribute("name", "power");
        row.cells[1].style.textAlign = "center";
        row.cells[1].style.cursor = "pointer";
        row.cells[1].onclick = function() {
            var hostname = row.getAttribute("hostname");
            if (!bypassRules.includes(hostname)) {
                bypassRules += hostname;
                bypassRules += ",";
                dkConsole.log("Temporarily added " + hostname + " to bypassRules, refresh page to reset", "Yellow");
            }
            DKSendRequest("http://" + ip + "/cm?cmnd=POWER%20Toggle", UpdateScreen);
        }
        //row.cells[2].setAttribute("name", "data");
        row.cells[2].style.textAlign = "center";
        //row.cells[3].setAttribute("name", "wifi");
        row.cells[3].style.textAlign = "center";
        table.rows[0].cells[0].innerHTML = "Devices (" + (table.rows.length - 1) + ")";

        DKSendRequest("http://" + ip + "/cm?cmnd=Status%200", UpdateScreen);
    });
}

/////////////////////////
function TimerLoop(force) {
    
    //DUBUG ///////////////////////
    /*
    var table = document.getElementById("deviceTable");
    dkConsole.log("table.rows[3].rowIndex = " + table.rows[3].rowIndex);
    dkConsole.log("table.rows[3].cells[3].cellIndex = " + table.rows[3].cells[3].cellIndex);
    */
    //DEBUG /////////////////////

    var currentdate = new Date();
    Time = currentdate.getHours() + (currentdate.getMinutes() * .01);
    ProcessRules();
    ProcessDevices();
    if(Temp && Humidity){
        UpdateChart(Temp, Humidity/*, DewPoint*/);
    }
}

////////////////////////
function ScanDevices() {
    var cookieString = "";
    var table = document.getElementById("deviceTable");

    table.parentNode.remove(table);
    CreateDeviceTable(body);

    GetTasmotaDevices("192.168.1.", function(ip, done) {
        if (ip) {
            AddDevice(ip);
            if (!cookieString.includes(ip)) {
                cookieString = cookieString + ip + "^";
                setCookie(cookieString, 30);
            }
        }
        if (done) {
            dkConsole.log("\n");
            dkConsole.log("Scan Complete");
            dkConsole.log("(" + tasmotaDeviceCount + ") Tasmota Devices found");
            setCookie(cookieString, 30);
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

///////////////////////
function ProcessRules() {

    DumpVariables();

    //Alarms
    if (Temp < TempMin) {
        dkConsole.log("!!! TEMPERATURE BELOW MINIMUM " + Temp + "&#176;F < " + TempMin + "&#176;F !!!", "red");
    }
    if (Temp > TempMax) {
        dkConsole.log("!!! TEMPERATURE ABOVE MAXIMUM " + Temp + "&#176;F > " + TempMax + "&#176;F !!!", "red");
    }
    if (Humidity < HumMin) {
        dkConsole.log("!!! HUMUDITY BELOW MINIMUM " + Humidity + "% < " + HumMin + "% !!!", "red");
    }
    if (Humidity > HumMax) {
        dkConsole.log("!!! HUMUDITY ABOVE MAXIMUM " + Humidity + "% > " + HumMax + "% !!!", "red");
    }

    if (!bypassRules.includes("Device005") && ExhaustFan) {
        if ((Temp > TempTarget) || (Humidity > HumTarget && Temp > TempMin)) {
            //exhaust fan ON
            DKSendRequest("http://Device005/cm?cmnd=POWER%20ON", UpdateScreen);

        } else {
            //exhaust fan OFF
            DKSendRequest("http://Device005/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    if (!bypassRules.includes("Device007") && WaterWalls) {
        if (Time > 17 && (((Temp > TempTarget) && (Humidity < HumMax)) || ((Humidity < HumTarget) && (Temp > TempMin)))) {
            DKSendRequest("http://Device007/cm?cmnd=POWER%20ON", UpdateScreen);
            //water walls ON
        } else {
            DKSendRequest("http://Device007/cm?cmnd=POWER%20OFF", UpdateScreen);
            //water walls OFF
        }
    }

    if (!bypassRules.includes("Device008") && Co2) {
        if ((Temp < TempTarget) && (Humidity < HumTarget)) {
            DKSendRequest("http://Device008/cm?cmnd=POWER%20ON", UpdateScreen);
            //Co2 ON
        } else {
            DKSendRequest("http://Device008/cm?cmnd=POWER%20OFF", UpdateScreen);
            //Co2 OFF
        }
    }

    if (!bypassRules.includes("Device006") && Heater) {
        if (Temp < TempTarget) {
            DKSendRequest("http://Device006/cm?cmnd=POWER%20ON", UpdateScreen);
            //heater ON
        } else {
            DKSendRequest("http://Device006/cm?cmnd=POWER%20OFF", UpdateScreen);
            //heater OFF
        }
    }
}

/////////////////////////////////////////
function UpdateScreen(success, url, data) {
    if (!success) {
        //Test for power outage
        dkConsole.log("UpdateScreen(" + success + ", " + url + ", " + data + ")", "orange");
        PlaySound("PowerDown.mp3");
        return;
    }

    var row;
    var table = document.getElementById("deviceTable");
    for (var n = 1; n < table.rows.length; n++) {
        if (url.includes(table.rows[n].getAttribute("ip"))) {
            row = table.rows[n];
            continue;
        }
    }
    if (!row) {
        return;
    }

    var device = JSON.parse(data);
    var ip = row.getAttribute("ip");

    var deviceHostname = device.StatusNet ? device.StatusNet.Hostname : device.Hostname;
    if (deviceHostname) {
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
            row.cells[1].style.color = "rgb(50,50,50)";
        }
    }

    var deviceSI7021 = device.StatusSNS ? device.StatusSNS.SI7021 : 0;
    if (deviceSI7021) {
        Temp = (deviceSI7021.Temperature + TempCalib).toFixed(1);
        var tempDirection = " ";
        if (Temp > TempTarget) {
            tempDirection = "&#8593;"
        }
        if (Temp < TempTarget) {
            tempDirection = "&#8595;"
        }
        if (temp === TempTarget) {
            tempDirection = " ";
        }
        var temp = "<a id='Temp'>" + Temp + " &#176;F" + tempDirection + "</a>";
        var targTemp = "<a id='targTemp'> (" + TempTarget + "&#176;F)</a>";

        Humidity = (deviceSI7021.Humidity + HumCalib).toFixed(1);
        var humDirection = " ";
        if (Humidity > HumTarget) {
            humDirection = "&#8593;"
        }
        if (Humidity < HumTarget) {
            humDirection = "&#8595;"
        }
        if (Humidity === HumTarget) {
            humDirection = " ";
        }
        var humidity = "<a id='RH'>" + Humidity + " RH%" + humDirection + "</a>";
        var targHum = "<a id='targHum'> (" + HumTarget + "%)</a>";
        var dewPoint = "<a id='DewP'>Dew point " + deviceSI7021.DewPoint + "&#176;F</a>";

        var scaleTemp = 510;
        var tempDiff = (Math.abs(TempTarget - Temp) * 5).toFixed(1);
        var tempNum = (tempDiff * scaleTemp / 100).toFixed(1);
        var redTemp = tempNum
        var greenTemp = 510 - tempNum;
        if (redTemp > 255) {
            redTemp = 255;
        }
        if (redTemp < 0) {
            redTemp = 0;
        }
        if (greenTemp > 255) {
            greenTemp = 255;
        }
        if (greenTemp < 0) {
            greenTemp = 0;
        }
        row.cells[2].innerHTML = targTemp + " " + temp + "<br>" + targHum + " " + humidity + "<br>" + dewPoint;
        document.getElementById("Temp").style.color = "rgb(" + redTemp + "," + greenTemp + ",0)";
        document.getElementById("Temp").style.textAlign = "center";
        var scaleHum = 510;
        var humDiff = (Math.abs(HumTarget - Humidity) * 5).toFixed(1);
        var humNum = (humDiff * scaleHum / 100).toFixed(1);
        var redHum = humNum;
        var greenHum = 510 - humNum;
        if (redHum > 255) {
            redHum = 255;
        }
        if (redHum < 0) {
            redHum = 0;
        }
        if (greenHum > 255) {
            greenHum = 255;
        }
        if (greenHum < 0) {
            greenHum = 0;
        }
        document.getElementById("RH").style.color = "rgb(" + redHum + "," + greenHum + ",0)";
        document.getElementById("RH").style.textAlilgn = "center";
        document.getElementById("DewP").style.color = "rgb(50,50,50)";
        document.getElementById("DewP").style.textAlign = "center";
    }

    var deviceWifi = device.StatusSTS ? device.StatusSTS.Wifi : device.Wifi;
    if (deviceWifi) {
        var device = JSON.parse(data);
        var signal = deviceWifi.RSSI;
        var scale = 510;
        var num = (signal * scale / 100).toFixed(1);
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

////////////////////////
function DumpVariables() {
    dkConsole.debug("Time: " + Time);
    dkConsole.log("Temp: " + Temp, "orange");
    dkConsole.log("Humidity: " + Humidity, "orange");
    dkConsole.log("DewPoint: " + DewPoint, "orange");
    dkConsole.log("bypassRules: " + bypassRules, "orange");

    dkConsole.log("TempTarget: " + TempTarget, "orange");
    dkConsole.log("TempCalib: " + TempCalib, "orange");
    dkConsole.log("TempMin: " + TempMin, "orange");
    dkConsole.log("TempMax: " + TempMax, "orange");

    dkConsole.log("HumTarget: " + HumTarget, "orange");
    dkConsole.log("HumCalib: " + HumCalib, "orange");
    dkConsole.log("HumMin: " + HumMin, "orange");
    dkConsole.log("HumMax: " + HumMax, "orange");

    dkConsole.log("ExhaustFan: " + ExhaustFan, "orange");
    dkConsole.log("Co2: " + Co2, "orange");
    dkConsole.log("WaterWalls: " + WaterWalls, "orange");
    dkConsole.log("Heater: " + Heater, "orange");
}