"use strict";
// https://tasmota.github.io/docs/Commands/

// Device Array
let devices = [];
// Basic device response structure
/*
let theDevice = {
    "ip": "192.168.1.0",
    "user": {
        name: "Bedroom Light",
        automate: true    
    },
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
*/

//return a Device by partial matching name
function Device(str) {
    if (!devices || !devices.length) {
        //console.warn("devices invalid");
        return false;
    }

    //const device = DKJson_FindPartialMatch(devices, "DeviceName", str);
    //if(device)
    //    return device;

    for (let n = 0; n < devices.length; n++) {
        if (devices[n].Status && devices[n].Status.DeviceName.includes(str)) {
            return devices[n];
        }
    }
}

function DKTasmota_LoadDevicesFromLocalStorage() {
    const data = dk.loadFromLocalStorage("devices");
    if (!data)
        return false;
    devices = JSON.parse(data);
    return devices;

}

function DKTasmota_SaveDevicesToLocalStorage() {
    const devicesString = JSON.stringify(devices);
    dk.saveToLocalStorage("devices", devicesString);
}

function DKTasmota_LoadDevicesFromServer(callback) {
    dk.fileToStringAsync("devices.js", function(data){
        data && (devices = JSON.parse(data));
        callback && callback(devices);
        return devices;
    });
}

function DKTasmota_SaveDevicesToServer() {
    for (let n = 0; n < devices.length; n++) {
        delete devices[n].Status;
        delete devices[n].StatusFWR;
        delete devices[n].StatusLOG;
        delete devices[n].StatusMEM;
        delete devices[n].StatusMQT;
        delete devices[n].StatusNET;
        delete devices[n].StatusPRM;
        delete devices[n].StatusSNS;
        delete devices[n].StatusSTS;
        delete devices[n].StatusTIM;
    }
    const data = JSON.stringify(devices);
    let prefix = "";
    prefix = dk.file.onlineAssets;
    const dest = prefix + "/devices.js";
    dk.php.stringToFile(dest, data, "", function(rval) {
        if (rval)
            console.log(rval);
    });
}

function DKTasmota_CreateDevice(ip) {
    const dev = {
        'ip': ip,
        'user': {}
    }
    devices.push(dev);
    return devices[devices.length - 1];
}

function DKTasmota_InitializeDevices(callback) {
    if (!callback)
        return error("callback invalid");
    if (!devices || !devices.length) {
        return warn("devices array empty");
    }
    let deviceCount = 0;
    for (let n = 0; n < devices.length; n++) {
        const url = "http://" + devices[n].ip + "/cm?cmnd=Status%200";
        dk.sendRequest(url, function dk_sendRequest_callback(success, url, data) {
            if (success && url && data) {
                let device = DKJson_FindPartialMatch(devices, 'ip', url);
                if (!device)
                    return error("device invalid");

                try {
                    let deviceData = JSON.parse(data);
                    deviceData.ip = device.ip;
                    deviceData.user = device.user;
                    //devices[devices.indexOf(device)] = deviceData;
                    device = deviceData;
                } catch {
                    console.error("data could not be parsed to json");
                }
                devices.sort((a,b)=>(a.name > b.name) ? 1 : -1)
            }

            deviceCount++;
            if (deviceCount === devices.length) {
                callback && callback();
            }
        });
    }
}

//return all local network device ip addresses that respond to /cm?cmnd=CORS 
function DKTasmota_GetDevices(ipPrefix, callback) {
    let tasmotaDeviceCount = 0;
    let devicesScanned = 0;
    //scan 192.168.1.1 thru 192.168.1.254
    if (!ipPrefix) {
        ipPrefix = "192.168.1.";
    }
    const corsWrite = 1;
    let cmnd;
    for (let n = 1; n < 255; n++) {
        const ip = ipPrefix + n;
        cmnd = "CORS";
        if (corsWrite) {
            cmnd += " *";
            //cmnd += ` ${window.location.protocol}//${window.location.hostname}`;
            //if (window.location.port && window.location.port !== "") {
            //    cmnd += `:${window.location.port}`;
            //}
        }
        const url = "http://" + ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
        //console.debug(url);
        SendSuperRequest(url, function SendSuperRequestCallback(success, data) {
        //DK_SendRequest(url, function DK_SendRequestCallback(success, url, data) {
            console.log("pinged " + ip);
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
                    //ip = false;
                    callback(false, true);
                }
            }
        });
    }
}
