"use strict";

let ATentCo2;
let ATentTemp;
let ATentExhaust;
let ATentWater;
let ATentHeat;

let BTentCo2;
let BTentTemp;
let BTentExhaust;
let BTentWater;
let BTentHeat;

let VegTentCo2;
let VegTentTemp;
let VegTentExhaust;
let VegTentWater;
let VegTentHeat;

function Automate() {

    !ATentCo2 && (ATentCo2 = Device("A Tent Co2"));
    !ATentTemp && (ATentTemp = Device("A Tent Temp"));
    !ATentExhaust && (ATentExhaust = Device("A Tent Exhaust Fan"));
    !ATentWater && (ATentWater = Device("A Tent Water Walls"));
    !ATentHeat && (ATentHeat = Device("A Tent Heater"));

    !BTentCo2 && (BTentCo2 = Device("B Tent Co2"));
    !BTentTemp && (BTentTemp = Device("B Tent Temp"));
    !BTentExhaust && (BTentExhaust = Device("B Tent Exhaust Fan"));
    !BTentWater && (BTentWater = Device("B Tent Water Walls"));
    !BTentHeat && (BTentHeat = Device("B Tent Heater"));

    !VegTentCo2 && (VegTentCo2 = Device("Veg Tent Co2"));
    !VegTentTemp && (VegTentTemp = Device("Veg Tent Temp"));
    !VegTentExhaust && (VegTentExhaust = Device("Veg Tent Exhaust Fan"));
    !VegTentWater && (VegTentWater = Device("Veg Tent Water Walls"));
    !VegTentHeat && (VegTentHeat = Device("Veg Tent Heater"));

    ATentCo2 && (ATentCo2.user.automate = false);
    BTentCo2 && (BTentCo2.user.automate = false);
    VegTentCo2 && (VegTentCo2.user.automate = false);

    ////////////////////////////////////////////////////////////
    //A Tent Presets
    if (ATentCo2 && ATentCo2.user.automate && ATentTemp) {
        //When using Co2, temperature should average 85 degrees
        ATentTemp.user.temperatureTarget = 85;
        ATentTemp.user.temperatureZone = 20;
        ATentTemp.user.humidityTarget = 55;
        ATentTemp.user.humidityZone = 20;
    } else if (ATentTemp) {
        //When NOT using Co2, temperature should be 77 degrees
        ATentTemp.user.temperatureTarget = 77;
        ATentTemp.user.temperatureZone = 20;
        ATentTemp.user.humidityTarget = 50;
        ATentTemp.user.humidityZone = 20;
    }

    //A Tent Alarms
    if (ATentTemp.user.temperature < (ATentTemp.user.temperatureTarget - ATentTemp.user.temperatureZone)) {
        dkconsole.message("!!! A TENT TEMPERATURE BELOW MINIMUM " + ATentTemp.user.temperature + "&#176;F < " + (ATentTemp.user.temperatureTarget - ATentTemp.user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (ATentTemp.user.temperature > (ATentTemp.user.temperatureTarget + ATentTemp.user.temperatureZone)) {
        dkconsole.message("!!! A TENT TEMPERATURE ABOVE MAXIMUM " + ATentTemp.user.temperature + "&#176;F > " + (ATentTemp.user.temperatureTarget + ATentTemp.user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (ATentTemp.user.humidity < (ATentTemp.user.humidityTarget - ATentTemp.user.humidityZone)) {
        dkconsole.message("!!! A TENT HUMUDITY BELOW MINIMUM " + ATentTemp.user.humidity + "% < " + (ATentTemp.user.humidityTarget - ATentTemp.user.humidityZone) + "% !!!", "red");
    }
    if (ATentTemp.user.humidity > (ATentTemp.user.humidityTarget + ATentTemp.user.humidityZone)) {
        dkconsole.message("!!! A TENT HUMUDITY ABOVE MAXIMUM " + ATentTemp.user.humidity + "% > " + (ATentTemp.user.humidityTarget + ATentTemp.user.humidityZone) + "% !!!", "red");
    }

    //A Tent Co2
    if (ATentCo2 && ATentCo2.user.automate) {
        let power = false;
        if (ATentTemp.user.temperature < ATentTemp.user.temperatureTarget)
            power = true;
        if (power) {
            dkconsole.message("A Tent Co2 Fan ON", "green");
            DK_SendRequest("http://" + ATentCo2.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("A Tent Co2 Fan OFF", "yellow");
            DK_SendRequest("http://" + ATentCo2.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //A Tent Exhaust fan
    if (ATentExhaust && ATentExhaust.user.automate) {
        //dkconsole.log(ATentExhaust.user.power);
        let power = false;
        if (ATentTemp.user.temperature > ATentTemp.user.temperatureTarget)
            ATentExhaust.user.power = "ON";
            power = true;
        if (ATentTemp.user.humidity > ATentTemp.user.humidityTarget)
            power = true;
        if (time > 19)
            power = false;
        if (power) {
            dkconsole.message("A Tent Exhaust Fan ON", "green");
            DK_SendRequest("http://" + ATentExhaust.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("A Tent Exhaust Fan OFF", "yellow");
            DK_SendRequest("http://" + ATentExhaust.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //A Tent Water walls
    if (ATentWater && ATentWater.user.automate) {
        if (ATentTemp.user.humidity < ATentTemp.user.humidityTarget) {
            dkconsole.message("A Tent Water walls ON", "green");
            DK_SendRequest("http://" + ATentWater.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("A Tent Water walls OFF", "yellow");
            DK_SendRequest("http://" + ATentWater.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //A Tent Heater
    if (ATentHeat && ATentHeat.user.automate) {
        if (ATentTemp.user.temperature < ATentTemp.user.temperatureTarget) {
            dkconsole.message("A Tent Heater ON", "green");
            DK_SendRequest("http://" + Device("A Tent Heater").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("A Tent Heater OFF", "yellow");
            DK_SendRequest("http://" + Device("A Tent Heater").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    ////////////////////////////////////////////////////////////
    //B Tent Presets
    if (BTentCo2 && BTentCo2.user.automate && BTentTemp) {
        //When using Co2, temperature should average 85 degrees
        BTentTemp.user.temperatureTarget = 85;
        BTentTemp.user.temperatureZone = 20;
        BTentTemp.user.humidityTarget = 55;
        BTentTemp.user.humidityZone = 20;
    } else if (BTentTemp) {
        //When NOT using Co2, temperature should be 77 degrees
        BTentTemp.user.temperatureTarget = 77;
        BTentTemp.user.temperatureZone = 20;
        BTentTemp.user.humidityTarget = 50;
        BTentTemp.user.humidityZone = 20;
    }

    //B Tent Alarms
    if (BTentTemp.user.temperature < (BTentTemp.user.temperatureTarget - BTentTemp.user.temperatureZone)) {
        dkconsole.message("!!! B TENT TEMPERATURE BELOW MINIMUM " + BTentTemp.user.temperature + "&#176;F < " + (BTentTemp.user.temperatureTarget - BTentTemp.user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (BTentTemp.user.temperature > (BTentTemp.user.temperatureTarget + BTentTemp.user.temperatureZone)) {
        dkconsole.message("!!! B TENT TEMPERATURE ABOVE MAXIMUM " + BTentTemp.user.temperature + "&#176;F > " + (BTentTemp.user.temperatureTarget + BTentTemp.user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (BTentTemp.user.humidity < (BTentTemp.user.humidityTarget - BTentTemp.user.humidityZone)) {
        dkconsole.message("!!! B TENT HUMUDITY BELOW MINIMUM " + BTentTemp.user.humidity + "% < " + (BTentTemp.user.humidityTarget - BTentTemp.user.humidityZone) + "% !!!", "red");
    }
    if (BTentTemp.user.humidity > (BTentTemp.user.humidityTarget + BTentTemp.user.humidityZone)) {
        dkconsole.message("!!! B TENT HUMUDITY ABOVE MAXIMUM " + BTentTemp.user.humidity + "% > " + (BTentTemp.user.humidityTarget + BTentTemp.user.humidityZone) + "% !!!", "red");
    }

    //B Tent Co2
    if (BTentCo2 && BTentCo2.user.automate) {
        if (BTentTemp.user.temperature < BTentTemp.user.temperatureTarget) {
            dkconsole.message("B Tent Co2 ON", "green");
            DK_SendRequest("http://" + BTentCo2.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("B Tent Co2 OFF", "yellow");
            DK_SendRequest("http://" + BTentCo2.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //B Tent Exhaust fan
    if (BTentExhaust && BTentExhaust.user.automate) {
        let power = false;
        if (BTentTemp.user.temperature > BTentTemp.user.temperatureTarget)
            power = true;
        if (BTentTemp.user.humidity > BTentTemp.user.humidityTarget)
            power = true;
        if (time > 19)
            power = false;
        if (power) {
            DK_SendRequest("http://" + BTentExhaust.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
            dkconsole.message("B Tent Exhaust Fan ON", "green");
        } else {
            DK_SendRequest("http://" + BTentExhaust.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
            dkconsole.message("B Tent Exhaust Fan OFF", "yellow");
        }
    }

    //B Tent Water walls
    if (BTentWater && BTentWater.user.automate) {
        if (BTentTemp.user.humidity < BTentTemp.user.humidityTarget) {
            dkconsole.message("B Tent Water walls ON", "green");
            DK_SendRequest("http://" + BTentWater.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("B Tent Water walls OFF", "yellow");
            DK_SendRequest("http://" + BTentWater.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //B Tent Heater
    if (BTentHeat && BTentHeat.user.automate) {
        if (BTentTemp.user.temperature < BTentTemp.user.temperatureTarget) {
            dkconsole.message("B Tent Heater ON", "green");
            DK_SendRequest("http://" + BTentHeat.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("B Tent Heater OFF", "yellow");
            DK_SendRequest("http://" + BTentHeat.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    ////////////////////////////////////////////////////////////
    //Veg Tent Presets
    if (VegTentCo2 && VegTentCo2.user.automate && VegTentTemp) {
        //When using Co2, temperature should average 85 degrees
        VegTentTemp.user.temperatureTarget = 85;
        VegTentTemp.user.temperatureZone = 20;
        VegTentTemp.user.humidityTarget = 55;
        VegTentTemp.user.humidityZone = 20;
    } else if (VegTentTemp) {
        //When NOT using Co2, temperature should be 77 degrees
        VegTentTemp.user.temperatureTarget = 77;
        VegTentTemp.user.temperatureZone = 20;
        VegTentTemp.user.humidityTarget = 50;
        VegTentTemp.user.humidityZone = 20;
    }

    //Veg Tent Alarms
    if (VegTentTemp) {
        if (VegTentTemp.user.temperature < (VegTentTemp.user.temperatureTarget - VegTentTemp.user.temperatureZone)) {
            dkconsole.message("!!! Veg TENT TEMPERATURE BELOW MINIMUM " + VegTentTemp.user.temperature + "&#176;F < " + (VegTentTemp.user.temperatureTarget - VegTentTemp.user.temperatureZone) + "&#176;F !!!", "red");
        }
        if (VegTentTemp.user.temperature > (VegTentTemp.user.temperatureTarget + VegTentTemp.user.temperatureZone)) {
            dkconsole.message("!!! Veg TENT TEMPERATURE ABOVE MAXIMUM " + VegTentTemp.user.temperature + "&#176;F > " + (VegTentTemp.user.temperatureTarget + VegTentTemp.user.temperatureZone) + "&#176;F !!!", "red");
        }
        if (VegTentTemp.user.humidity < (VegTentTemp.user.humidityTarget - VegTentTemp.user.humidityZone)) {
            dkconsole.message("!!! Veg TENT HUMUDITY BELOW MINIMUM " + VegTentTemp.user.humidity + "% < " + (VegTentTemp.user.humidityTarget - VegTentTemp.user.humidityZone) + "% !!!", "red");
        }
        if (VegTentTemp.user.humidity > (VegTentTemp.user.humidityTarget + VegTentTemp.user.humidityZone)) {
            dkconsole.message("!!! Veg TENT HUMUDITY ABOVE MAXIMUM " + VegTentTemp.user.humidity + "% > " + (VegTentTemp.user.humidityTarget + VegTentTemp.user.humidityZone) + "% !!!", "red");
        }
    }

    //Veg Tent Co2
    if (VegTentCo2 && VegTentCo2.user.automate) {
        if (VegTentTemp.user.temperature < VegTentTemp.user.temperatureTarget) {
            dkconsole.message("Veg Tent Co2 ON", "green");
            DK_SendRequest("http://" + VegTentCo2.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Veg Tent Co2 OFF", "yellow");
            DK_SendRequest("http://" + VegTentCo2.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Veg Tent Exhaust fan
    if (VegTentExhaust && VegTentExhaust.user.automate) {
        let power = false;
        if (VegTentTemp.user.temperature > VegTentTemp.user.temperatureTarget)
            power = true;
        if (VegTentTemp.user.humidity > VegTentTemp.user.humidityTarget)
            power = true;
        if (time > 19)
            power = false;
        if (power) {
            DK_SendRequest("http://" + VegTentExhaust.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
            dkconsole.message("Veg Tent Exhaust Fan ON", "green");
        } else {
            DK_SendRequest("http://" + VegTentExhaust.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
            dkconsole.message("Veg Tent Exhaust Fan OFF", "yellow");
        }
    }

    //Veg Tent Water walls
    if (VegTentWater && VegTentWater.user.automate) {
        if (VegTentTemp.user.humidity < VegTentTemp.user.humidityTarget) {
            dkconsole.message("Veg Tent Water Walls ON", "green");
            DK_SendRequest("http://" + VegTentWater.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Veg Tent Water Walls OFF", "yellow");
            DK_SendRequest("http://" + VegTentWater.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Veg Tent Heater
    if (VegTentHeat && VegTentHeat.user.automate) {
        if (VegTentTemp.user.temperature < VegTentTemp.user.temperatureTarget) {
            dkconsole.message("Veg Tent Heater ON", "green");
            DK_SendRequest("http://" + VegTentHeat.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Veg Tent Heater OFF", "yellow");
            DK_SendRequest("http://" + VegTentHeat.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }
}
