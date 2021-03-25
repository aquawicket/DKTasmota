"use strict";

function Automate() {

    //AssignDeviceShortcuts();
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

    //Co2
    if (co2mode) {
        //When using Co2, temperature should be 85 degrees
        tempTarget = 85;
        humTarget = 55;
    } else {
        //When NOT using Co2, temperature should be 77 degrees
        tempTarget = 77;
        humTarget = 50;
    }
    tempMin = tempTarget - 10;
    tempMax = tempTarget + 10;
    humMin = humTarget - 10;
    humMax = humTarget + 10;

    if (co2 && !bypassRules.includes(co2.ip)) {
        if (co2mode && /*(time > 8) && (time < 11) || (time > 14) && (time < 17) && */temperature < (tempTarget-1) && humidity < humMax ) {
            dkconsole.message("Co2 ON", "green");
            co2.StatusSTS.POWER = "ON";
            DKSendRequest("http://" + co2.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
            DKSendRequest("http://" + exhaustFan.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        } else {
            dkconsole.message("Co2 OFF", "yellow");
            co2.StatusSTS.POWER = "OFF";
            DKSendRequest("http://" + co2.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Exhaust fan
    if (exhaustFan && !bypassRules.includes(exhaustFan.ip)) {
        if ((co2?.StatusSTS?.POWER !== "ON") && ((temperature > (tempTarget + 1)) || (humidity > humMax && temperature > tempMin))) {
            dkconsole.message("Exhaust Fan ON", "green");
            DKSendRequest("http://" + exhaustFan.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Exhaust Fan OFF", "yellow");
            DKSendRequest("http://" + exhaustFan.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Water walls
    if (waterWalls && !bypassRules.includes(waterWalls.ip)) {
        if ((time < 17) && (humidity < humTarget) && (temperature > tempTarget)) {
            dkconsole.message("Water walls ON", "green");
            DKSendRequest("http://" + waterWalls.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Water walls OFF", "yellow");
            DKSendRequest("http://" + waterWalls.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Heater
    if (heater && !bypassRules.includes(heater.ip)) {
        if (co2?.StatusSTS?.POWER !== "ON" && (temperature < tempTarget)) {
            dkconsole.message("Heater ON", "green");
            DKSendRequest("http://" + heater.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Heater OFF", "yellow");
            DKSendRequest("http://" + heater.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
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
    dkconsole.debug("co2mode: " + co2mode);
}
