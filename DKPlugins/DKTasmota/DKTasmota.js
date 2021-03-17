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


function AssignDeviceShortcuts(callback) {
    let deviceCount = 0;
    for (var n = 0; n < devices.length; n++) {
        const url = "http://" + devices[n].ip + "/cm?cmnd=Status%200";
        DKSendRequest(url, function(success, url, data) {
            if (!success || !url || !data) {
                deviceCount++;
                if(deviceCount === devices.length){
                    callback && callback();
                }
                return;
            }
            let deviceData = JSON.parse(data);
            let deviceName = deviceData?.Status?.DeviceName;
            if (deviceName?.includes("001")) {
                shedWaterB = devices[n];
            }
            if (deviceName?.includes("002")) {
                shedWaterA = devices[n];
            }
            if (deviceName?.includes("003")) {
                waterStation = devices[n];
            }
            if (deviceName?.includes("004")) {
                vegTentLights = devices[n];
            }
            if (deviceName?.includes("005")) {
                exhaustFan = devices[n];
            }
            if (deviceName?.includes("006")) {
                heater = devices[n];
            }
            if (deviceName?.includes("007")) {
                waterWalls = devices[n];
            }
            if (deviceName?.includes("008")) {
                co2 = devices[n];
            }
            if (deviceName?.includes("009")) {
                vegTentWaterPump = devices[n];
            }
            if (deviceName?.includes("010")) {
                vegTentFan = devices[n];
            }
            if (deviceName?.includes("011")) {
                kitchenLight = devices[n];
            }
            if (deviceName?.includes("012")) {
                bedroomLight = devices[n];
            }
            if (deviceName?.includes("013")) {
                temperatureD = devices[n];
            }
            deviceCount++;
            if(deviceCount === devices.length){
                callback && callback();
            }
        });
    }
}

/*
function GetDeviceByCode(nnn) {
    for (var n = 0; n < devices.length; n++) {
        if (devices[n]?.Status?.DeviceName?.includes(nnn)) {
            return devices[n];
        }
    }
}
*/

//return all local network device IPs that respond to /cm?cmnd=CORS 
function GetTasmotaDevices(ipPrefix, callback) {
    let tasmotaDeviceCount = 0;
    let devicesScanned = 0;
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
