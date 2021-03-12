"use strict";

function ProcessRules() {

    DumpVariables();

    if (!temperature || !humidity || !dewPoint) {
        return;
    }

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
    //let Co2Device = GetObjectMatch(co2Ip);
    const Co2Device = FindObject(devices, "ip", co2Ip);
    if(Co2Device){ console.log("found the Co2 Device"); }
    if (!bypassRules.includes(exhaustFanIp) && exhaustFan) {
        if ((temperature > tempTarget) || (humidity > humTarget && temperature > tempMin)) {
            dkconsole.message("Exhaust Fan ON", "green");
            DKSendRequest("http://" + exhaustFanIp + "/cm?cmnd=POWER%20ON", UpdateScreen);

        } else {
            dkconsole.warn("Exhaust Fan OFF");
            DKSendRequest("http://" + exhaustFanIp + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Water walls
    if (!bypassRules.includes(waterWallsIp) && waterWalls) {
        if ((time < 17) && (humidity < humTarget) && (temperature > tempTarget)) {
            dkconsole.message("Water walls ON", "green");
            DKSendRequest("http://" + waterWallsIp + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.warn("Water walls OFF");
            DKSendRequest("http://" + waterWallsIp + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Co2
    if (!bypassRules.includes(co2Ip) && co2) {
        if ((temperature < tempMax) && (humidity < humMax)) {
            dkconsole.message("Co2 ON", "green");
            //When using Co2, temperature should be 85 degrees
            tempTarget = 85;
            DKSendRequest("http://" + co2Ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.warn("Co2 OFF");
            //When NOT using Co2, temperature should be 77 degrees
            tempTarget = 77;
            DKSendRequest("http://" + co2Ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Heater
    if (!bypassRules.includes(heaterIp) && heater) {
        if (temperature < tempTarget) {
            dkconsole.message("Heater ON", "green");
            DKSendRequest("http://" + heaterIp + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.warn("Heater OFF");
            DKSendRequest("http://" + heaterIp + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }
}

function DumpVariables() {
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
