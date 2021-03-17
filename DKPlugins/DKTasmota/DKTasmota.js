"use strict";
// https://tasmota.github.io/docs/Commands/

//Device shortcut variables
let temperatureD;
let exhaustFan;
let waterWalls;
let co2;
let heater;
let shedWaterA;
let shedWaterB;
let waterStation;
let vegTentFan;
let vegTentLights;
let vegTentWaterPump;
let kitchenLight;
let bedroomLight;

let autoExhaustFan = true;
let autoWaterWalls = true;
let autoHeater = true;
let autoCo2 = false;

let tasmotaDeviceCount;
let devicesScanned;

function AssignDeviceShortcuts() {
    if (!shedWaterB) {
        shedWaterB = GetDeviceByCode("001");
    }
    if (!shedWaterA) {
        shedWaterA = GetDeviceByCode("002");
    }
    if (!waterStation) {
        waterStation = GetDeviceByCode("003");
    }
    if (!vegTentLights) {
        vegTentLights = GetDeviceByCode("004");
    }
    if (!exhaustFan) {
        exhaustFan = GetDeviceByCode("005");
    }
    if (!heater) {
        heater = GetDeviceByCode("006");
    }
    if (!waterWalls) {
        waterWalls = GetDeviceByCode("007");
    }
    if (!co2) {
        co2 = GetDeviceByCode("008");
    }
    if (!vegTentWaterPump) {
        vegTentWaterPump = GetDeviceByCode("009");
    }
    if (!vegTentFan) {
        vegTentFan = GetDeviceByCode("010");
    }
    if (!kitchenLight) {
        kitchenLight = GetDeviceByCode("011");
    }
    if (!bedroomLight) {
        bedroomLight = GetDeviceByCode("012");
    }
    if (!temperatureD) {
        temperatureD = GetDeviceByCode("013");
    }
}

function GetDeviceByCode(nnn) {
    for (var n = 0; n < devices.length; n++) {
        if (devices[n]?.Status?.DeviceName?.includes(nnn)) {
            return devices[n];
        }
    }
}

//return all local network device IPs that respond to /cm?cmnd=CORS 
function GetTasmotaDevices(ipPrefix, callback) {
    tasmotaDeviceCount = 0;
    devicesScanned = 0;
    //scan 192.168.1.1 thru 192.168.1.254
    if (!ipPrefix) {
        ipPrefix = "192.168.1.";
    }
    let corsWrite = 1;
    let cmnd;
    for (let n = 1; n < 255; n++) {
        let ip = ipPrefix + n;
        cmnd = "CORS";
        if (corsWrite) {
            cmnd += " *";
            //cmnd += ` ${window.location.protocol}//${window.location.hostname}`;
            //if (window.location.port && window.location.port !== "") {
            //    cmnd += `:${window.location.port}`;
            //}
        }
        //let url = "http://"+ip+"/cm?cmnd="+cmnd; //Un-encodeURIComponent
        let url = "http://" + ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
        dkconsole.debug(url);
        DKSendSuperRequest(url, function DKSendSuperRequestCallback(success, data) {
            //send request using superAgent
            dkconsole.log("pinged " + ip);
            if (success) {
                devicesScanned += 1;
                tasmotaDeviceCount += 1;
                if (devicesScanned >= 254) {
                    callback(ip, true);
                } else {
                    callback(ip, false);
                }
            } else {
                devicesScanned += 1;
                if (devicesScanned >= 254) {
                    ip = false;
                    callback(ip, true);
                }
            }
        });
    }
}
