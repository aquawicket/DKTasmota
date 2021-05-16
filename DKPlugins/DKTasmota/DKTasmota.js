"use strict";
// https://tasmota.github.io/docs/Commands/

dk.tasmota = new DKPlugin("dk_tasmota");
dk.tasmota.devices = new Array;

// Device Array
//let devices = [];
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

dk.tasmota.init = function dk_tasmota_init() {
    dk.tasmota.devices = [];
}

//return a Device by partial matching name
dk.tasmota.device = function dk_tasmota_device(str) {
    if (!dk.tasmota.devices || !dk.tasmota.devices.length) {
        //console.warn("dk.tasmota.devices invalid");
        return false;
    }

    //const device = DKJson_FindPartialMatch(dk.tasmota.devices, "DeviceName", str);
    //if(device)
    //    return device;

    for (let n = 0; n < dk.tasmota.devices.length; n++) {
        if (dk.tasmota.devices[n].Status && dk.tasmota.devices[n].Status.DeviceName.includes(str)) {
            return dk.tasmota.devices[n];
        }
    }
}

dk.tasmota.device.loadDevicesFromLocalStorage = function dk_tasmota_loadDevicesFromLocalStorage() {
    const data = dk.loadFromLocalStorage("devices");
    if (!data)
        return false;
    dk.tasmota.devices = JSON.parse(data);
    return dk.tasmota.devices;

}

dk.tasmota.saveDevicesToLocalStorage = function dk_tasmota_saveDevicesToLocalStorage() {
    const devicesString = JSON.stringify(dk.tasmota.devices);
    dk.saveToLocalStorage("devices", devicesString);
}

dk.tasmota.loadDevicesFromServer = function dk_tasmota_loadDevicesFromServer(callback) {
    const path = "USER/devices.js";
    dk.json.loadJsonFromFile(path, function dk_json_loadJsonFromFile_callback(json) {
        if (!json) {
            console.log("json invalid");
            return callback(false);
        }
        dk.tasmota.devices = json;
        return callback && callback(dk.tasmota.devices);
    });
}

dk.tasmota.saveDevicesToServer = function dk_tasmota_saveDevicesToServer() {
    for (let n = 0; n < dk.tasmota.devices.length; n++) {
        delete dk.tasmota.devices[n].Status;
        delete dk.tasmota.devices[n].StatusFWR;
        delete dk.tasmota.devices[n].StatusLOG;
        delete dk.tasmota.devices[n].StatusMEM;
        delete dk.tasmota.devices[n].StatusMQT;
        delete dk.tasmota.devices[n].StatusNET;
        delete dk.tasmota.devices[n].StatusPRM;
        delete dk.tasmota.devices[n].StatusSNS;
        delete dk.tasmota.devices[n].StatusSTS;
        delete dk.tasmota.devices[n].StatusTIM;
    }
    dk.file.isDir("USER/", function(result) {
        if (!result)
            dk.file.makeDir("USER/");
    });
    const path = "USER/devices.js";
    dk.json.saveJsonToFile(dk.tasmota.devices, path, 0, console.log);
}

dk.tasmota.createDevice = function dk_tasmota_createDevice(ip) {
    const dev = {
        'ip': ip,
        'user': {}
    }
    dk.tasmota.devices.push(dev);
    return dk.tasmota.devices[dk.tasmota.devices.length - 1];
}

dk.tasmota.initializeDevices = function dk_tasmota_initializeDevices(callback) {
    if (!callback)
        return error("callback invalid");
    if (!dk.tasmota.devices || !dk.tasmota.devices.length) {
        return warn("dk.tasmota.devices array empty");
    }
    let deviceCount = 0;
    for (let n = 0; n < dk.tasmota.devices.length; n++) {
        const url = "http://" + dk.tasmota.devices[n].ip + "/cm?cmnd=Status%200";
        dk.sendRequest("GET", url, function dk_sendRequest_callback(success, url, data) {
            if (success && url && data) {
                let device = DKJson_FindPartialMatch(dk.tasmota.devices, 'ip', url);
                if (!device)
                    return error("device invalid");

                try {
                    let deviceData = JSON.parse(data);
                    deviceData.ip = device.ip;
                    deviceData.user = device.user;
                    //dk.tasmota.devices[dk.tasmota.devices.indexOf(device)] = deviceData;
                    device = deviceData;
                } catch (e) {
                    console.error("data could not be parsed to json");
                }
                dk.tasmota.devices.sort((a,b)=>(a.name > b.name) ? 1 : -1)
            }

            deviceCount++;
            if (deviceCount === devices.length) {
                callback && callback();
            }
        });
    }
}

//return all local network device ip addresses that respond to /cm?cmnd=CORS 
dk.tasmota.getDevices = function dk_tasmota_getDevices(ipPrefix, callback) {
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
        //myapp.sendSuperRequest(url, function myapp_sendSuperRequest_callback(success, data) {
        console.log("pinging " + ip);
        /*
        dk.tasmota.sendCommand(ip, cmnd, function(success, device, data){
            let done = false;
            devicesScanned += 1;
            (devicesScanned >= 254) && (done = true);
            if (!success || !data)
                return callback(false, done);
            tasmotaDeviceCount += 1;
            return callback(ip, done);
        });
        */

        dk.sendRequest("GET", url, function DK_SendRequestCallback(success, url, data) {
            let done = false;
            devicesScanned += 1;
            (devicesScanned >= 254) && (done = true);
            if (!success || !data)
                return callback(false, done);
            tasmotaDeviceCount += 1;
            return callback(ip, done);
        });

    }
}

dk.tasmota.updateDevices = function dk_tasmote_updateDevices(ipAddress, callback) {
    for (let n = 0; n < dk.tasmota.devices.length; n++) {
        const ip = dk.tasmota.devices[n].ip;
        if (ip !== ipAddress && ipAddress !== "ALL")
            continue;
        dk.tasmota.sendCommand(ip, "Status 0", callback);
        /*    
        dk.sendRequest("GET", http://" + ip + "/cm?cmnd=Status%200", function dk_sendRequest_callback(success, url, data) {
            if (!url)
                return error("url invalid");
            let device = dk.json.findPartialMatch(dk.tasmota.devices, 'ip', url);
            if (!device)
                return error("device invalid, didn't find ip in url:" + url);
            if (!success || !data) {
                //console.log(ip + " did not respond");
                return callback & callback(false, device, data);
            }
            try {
                let deviceData = JSON.parse(data);
                Object.assign(device, deviceData);
            } catch (e) {
                console.error("data could not be parsed to json");
                return callback & callback(false, device, data);
            }

            return callback & callback(true, device, data);
        });
        */
    }
}

dk.tasmota.sendCommand = function dk_tasmota_sendCommand(ipAddress, command, callback) {
    command = encodeURIComponent(command).replace(";", "%3B");
    dk.sendRequest("GET", "http://" + ipAddress + "/cm?cmnd=" + command, function dk_sendRequest_callback(success, url, data) {
        if (!url)
            return error("url invalid", callback(false, null, data));
        let device = dk.json.findPartialMatch(dk.tasmota.devices, 'ip', url);
        if (!device)
            return error("device invalid", callback(false, device, data));
        if (!success || !data)
            return callback(success, device, data);
        let deviceData = JSON.parse(data);
        deviceData.POWER && Object.assign(device.StatusSTS, deviceData);
        deviceData.DeviceName && Object.assign(device.Status, deviceData);
        deviceData.Wifi && Object.assign(device.StatusSTS, deviceData);
        Object.assign(device, deviceData);
        return callback(true, device, data);
    });
}
