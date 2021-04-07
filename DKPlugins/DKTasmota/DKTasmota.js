"use strict";
// https://tasmota.github.io/docs/Commands/

// Device Array
let devices = [];
// Basic device response structure
/*
let theDevice = {
    "ip": "192.168.1.0",
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
    for (let n = 0; n < devices.length; n++) {
        if (devices[n]?.Status?.DeviceName?.includes(str)) {
            return devices[n];
        }
    }
}

//Load devices from local storage
function DKTasmota_LoadDevices() {
    let deviceIPs = [];
    const data = DKLoadFromLocalStorage("deviceIPs")
    if(!data){ return; }
  
    deviceIPs = JSON.parse(data);
    dkconsole.log("Loading (" + deviceIPs.length + ") Devices");
    for (let n = 0; n < deviceIPs.length; n++) {
        const dev = {
            'ip': deviceIPs[n],
            'user':{
                'automate': true,
                'temperatureTarget': 77,
                'temperatureZone' : 20,
                'humidityTarget' : 50,
                'humidityZone' : 20
            }
        }
        devices.push(dev);
    }
}


function DKTasmota_InitializeDevices(callback) {
    if (!callback) {
        dkconsole.error("callback invalid");
        return;
    }
    let deviceCount = 0;
    for (let n = 0; n < devices.length; n++) {
        const url = "http://" + devices[n].ip + "/cm?cmnd=Status%200";
        DKSendRequest(url, function(success, url, data) {
            if (success && url && data) {
                const device = JSON.parse(data);
                const deviceInstance = DKJson_FindObjectValueIncludes(devices, 'ip', url);

                //incoming data doesn't have user data, so copy them in
                device.ip = deviceInstance.ip;
                device.user = deviceInstance.user;

                //then update the stored device with the new data
                devices[devices.indexOf(deviceInstance)] = device;
                devices.sort((a,b)=>(a.name > b.name) ? 1 : -1)
            }

            deviceCount++;
            if (deviceCount === devices.length) {
                callback && callback();
            }
        });
    }
}

//return all local network device IPs that respond to /cm?cmnd=CORS 
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
