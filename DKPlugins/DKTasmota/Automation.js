///////////////////////
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
    if (!bypassRules.includes("Device005") && exhaustFan) {
        if ((temperature > tempTarget) || (humidity > humTarget && temperature > tempMin)) {
            dkconsole.message("Exhaust Fan ON", "green");
            DKSendRequest("http://Device005/cm?cmnd=POWER%20ON", UpdateScreen);

        } else {
            dkconsole.warn("Exhaust Fan OFF");
            DKSendRequest("http://Device005/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Water walls
    if (!bypassRules.includes("Device007") && waterWalls) {
        if ((time < 17) && (humidity < humTarget) && (temperature > tempTarget)) {
            dkconsole.message("Water walls ON", "green");
            DKSendRequest("http://Device007/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.warn("Water walls OFF");
            DKSendRequest("http://Device007/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Co2
    if (!bypassRules.includes("Device008") && co2) {
        if ((temperature < tempMax) && (humidity < humMax)) {
            dkconsole.message("Co2 ON", "green");
            //When using Co2, temperature should be 85 degrees
            tempTarget = 85;
            DKSendRequest("http://Device008/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.warn("Co2 OFF");
            //When NOT using Co2, temperature should be 77 degrees
            tempTarget = 77;
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
