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

let ShedTemp;

let VegTentCo2;
let VegTentTemp;
let VegTentExhaust;
let VegTentWater;
let VegTentHeat;

function Automate() {

    !ATentCo2 && (ATentCo2 = dk.tasmota.device("A Tent Co2"));
    !ATentTemp && (ATentTemp = dk.tasmota.device("A Tent Temp"));
    !ATentExhaust && (ATentExhaust = dk.tasmota.device("A Tent Exhaust Fan"));
    !ATentWater && (ATentWater = dk.tasmota.device("A Tent Water Walls"));
    !ATentHeat && (ATentHeat = dk.tasmota.device("A Tent Heater"));

    !BTentCo2 && (BTentCo2 = dk.tasmota.device("B Tent Co2"));
    !BTentTemp && (BTentTemp = dk.tasmota.device("B Tent Temp"));
    !BTentExhaust && (BTentExhaust = dk.tasmota.device("B Tent Exhaust Fan"));
    !BTentWater && (BTentWater = dk.tasmota.device("B Tent Water Walls"));
    !BTentHeat && (BTentHeat = dk.tasmota.device("B Tent Heater"));

    !ShedTemp && (ShedTemp = dk.tasmota.device("Shed Temp"));

    !VegTentCo2 && (VegTentCo2 = dk.tasmota.device("Veg Tent Co2"));
    !VegTentTemp && (VegTentTemp = dk.tasmota.device("Veg Tent Temp"));
    !VegTentExhaust && (VegTentExhaust = dk.tasmota.device("Veg Tent Exhaust Fan"));
    !VegTentWater && (VegTentWater = dk.tasmota.device("Veg Tent Water Walls"));
    !VegTentHeat && (VegTentHeat = dk.tasmota.device("Veg Tent Heater"));

    ////////////////////////////////////////////////////////////
    //A Tent Presets
    if (ATentTemp && ATentTemp.user) {
        if (ATentCo2 && ATentCo2.user.automate) {
            //When using Co2, temperature should average 85 degrees
            ATentTemp.user.temperatureTarget = 85;
            ATentTemp.user.temperatureZone = 20;
            ATentTemp.user.humidityTarget = 50;
            ATentTemp.user.humidityZone = 20;
        } else {
            //When NOT using Co2, temperature should be 77 degrees
            ATentTemp.user.temperatureTarget = 77;
            ATentTemp.user.temperatureZone = 20;
            ATentTemp.user.humidityTarget = 50;
            ATentTemp.user.humidityZone = 20;
        }

        //A Tent Alarms
        if (ATentTemp.user.temperature < (ATentTemp.user.temperatureTarget - ATentTemp.user.temperatureZone))
            console.log("!!! A TENT TEMPERATURE BELOW MINIMUM(" + (ATentTemp.user.temperatureTarget - ATentTemp.user.temperatureZone) + "&#176;F) @" + ATentTemp.user.temperature + "&#176;F !!!", "red");
        if (ATentTemp.user.temperature > (ATentTemp.user.temperatureTarget + ATentTemp.user.temperatureZone))
            console.log("!!! A TENT TEMPERATURE ABOVE MAXIMUM(" + (ATentTemp.user.temperatureTarget + ATentTemp.user.temperatureZone) + "&#176;F) @" + ATentTemp.user.temperature + "&#176;F !!!", "red");
        if (ATentTemp.user.humidity < (ATentTemp.user.humidityTarget - ATentTemp.user.humidityZone))
            console.log("!!! A TENT HUMUDITY BELOW MINIMUM(" + (ATentTemp.user.humidityTarget - ATentTemp.user.humidityZone) + "%) @" + ATentTemp.user.humidity + "% !!!", "red");
        if (ATentTemp.user.humidity > (ATentTemp.user.humidityTarget + ATentTemp.user.humidityZone))
            console.log("!!! A TENT HUMUDITY ABOVE MAXIMUM(" + (ATentTemp.user.humidityTarget + ATentTemp.user.humidityZone) + "%) @" + ATentTemp.user.humidity + "% !!!", "red");

        //A Tent Co2
        if (ATentCo2 && ATentCo2.user.automate) {
            let power = false;
            (ATentTemp.user.temperature < (ATentTemp.user.temperatureTarget-1)) && (power = true);
            power && (ATentCo2.user.power === "OFF") && console.log("A Tent Co2 Fan ON", "green");
            !power && (ATentCo2.user.power === "ON") && console.log("A Tent Co2 Fan OFF", "yellow");
            dk.sendRequest("http://" + ATentCo2.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //A Tent Exhaust fan
        if (ATentExhaust && ATentExhaust.user.automate) {
            let power = false;
            (ATentTemp.user.temperature > ATentTemp.user.temperatureTarget) && (power = true);
            (ATentTemp.user.humidity > ATentTemp.user.humidityTarget) && (power = true);
            //(ATentTemp.user.temperature < (ATentTemp.user.temperatureTarget - 10)) && (power = false);
            (dk.clock.time < dk.clock.sunrise+.30) && (power = false);
            (dk.clock.time > (dk.clock.sunset+1)) && (power = false);
            (ATentTemp.user.humidity > 90) && (power = true);
            power && (ATentExhaust.user.power === "OFF") && console.log("A Tent Exhaust Fan ON", "green");
            !power && (ATentExhaust.user.power === "ON") && console.log("A Tent Exhaust Fan OFF", "yellow");
            dk.sendRequest("http://" + ATentExhaust.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //A Tent Water walls
        if (ATentWater && ATentWater.user.automate) {
            let power = false;
            (ATentTemp.user.humidity < ATentTemp.user.humidityTarget) && (power = true);
            (ATentTemp.user.temperature > ATentTemp.user.temperatureTarget) && (power = true);
            (dk.clock.time < dk.clock.sunrise) && (power = false);
            (dk.clock.time > (dk.clock.sunset-1)) && (power = false);
            power && (ATentWater.user.power === "OFF") && console.log("A Tent Water walls ON", "green");
            !power && (ATentWater.user.power === "ON") && console.log("A Tent Water walls OFF", "yellow");
            dk.sendRequest("http://" + ATentWater.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //A Tent Heater
        if (ATentHeat && ATentHeat.user.automate) {
            let power = false;
            (ATentTemp.user.temperature < ATentTemp.user.temperatureTarget) && (power = true);
            power && (ATentHeat.user.power === "OFF") && console.log("A Tent Heater ON", "green");
            !power && (ATentHeat.user.power === "ON") && console.log("A Tent Heater OFF", "yellow");
            dk.sendRequest("http://" + ATentHeat.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }
    }

    ////////////////////////////////////////////////////////////
    //B Tent Presets
    if (BTentTemp && BTentTemp.user) {
        if (BTentCo2 && BTentCo2.user.automate) {
            //When using Co2, temperature should average 85 degrees
            BTentTemp.user.temperatureTarget = 85;
            BTentTemp.user.temperatureZone = 20;
            BTentTemp.user.humidityTarget = 50;
            BTentTemp.user.humidityZone = 20;
        } else {
            //When NOT using Co2, temperature should be 77 degrees
            BTentTemp.user.temperatureTarget = 77;
            BTentTemp.user.temperatureZone = 20;
            BTentTemp.user.humidityTarget = 50;
            BTentTemp.user.humidityZone = 20;
        }

        //drying room
        BTentTemp.user.temperatureTarget = 65;
        BTentTemp.user.temperatureZone = 10;
        BTentTemp.user.humidityTarget = 45;
        BTentTemp.user.humidityZone = 10;

        //B Tent Alarms
        if (BTentTemp.user.temperature < (BTentTemp.user.temperatureTarget - BTentTemp.user.temperatureZone))
            console.log("!!! B TENT TEMPERATURE BELOW MINIMUM(" + (BTentTemp.user.temperatureTarget - BTentTemp.user.temperatureZone) + "&#176;F) @" + BTentTemp.user.temperature + "&#176;F !!!", "red");
        if (BTentTemp.user.temperature > (BTentTemp.user.temperatureTarget + BTentTemp.user.temperatureZone))
            console.log("!!! B TENT TEMPERATURE ABOVE MAXIMUM(" + (BTentTemp.user.temperatureTarget + BTentTemp.user.temperatureZone) + "&#176;F) @" + BTentTemp.user.temperature + "&#176;F !!!", "red");
        if (BTentTemp.user.humidity < (BTentTemp.user.humidityTarget - BTentTemp.user.humidityZone))
            console.log("!!! B TENT HUMUDITY BELOW MINIMUM(" + (BTentTemp.user.humidityTarget - BTentTemp.user.humidityZone) + "%) @" + BTentTemp.user.humidity + "% !!!", "red");
        if (BTentTemp.user.humidity > (BTentTemp.user.humidityTarget + BTentTemp.user.humidityZone))
            console.log("!!! B TENT HUMUDITY ABOVE MAXIMUM(" + (BTentTemp.user.humidityTarget + BTentTemp.user.humidityZone) + "%) @" + BTentTemp.user.humidity + "% !!!", "red");

        //B Tent Co2
        if (BTentCo2 && BTentCo2.user.automate) {
            let power = false;
            (BTentTemp.user.temperature < (BTentTemp.user.temperatureTarget-1)) && (power = true);
            power && (BTentCo2.user.power === "OFF") && console.log("B Tent Co2 ON", "green");
            !power && (BTentCo2.user.power === "ON") && console.log("B Tent Co2 OFF", "yellow");
            dk.sendRequest("http://" + BTentCo2.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //B Tent Exhaust fan
        if (BTentExhaust && BTentExhaust.user.automate) {
            let power = false;
            (BTentTemp.user.temperature > BTentTemp.user.temperatureTarget) && (power = true);
            (BTentTemp.user.humidity > BTentTemp.user.humidityTarget) && (power = true);
            //(BTentTemp.user.temperature < (BTentTemp.user.temperatureTarget - 10)) && (power = false);
            (dk.clock.time < dk.clock.sunrise+.30) && (power = false);
            (dk.clock.time > (dk.clock.sunset+1)) && (power = false);
            (BTentTemp.user.humidity > 90) && (power = true);
            power && (BTentExhaust.user.power === "OFF") && console.log("B Tent Exhaust Fan ON", "green");
            !power && (BTentExhaust.user.power === "ON") && console.log("B Tent Exhaust Fan OFF", "yellow");
            dk.sendRequest("http://" + BTentExhaust.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //B Tent Water walls
        if (BTentWater && BTentWater.user.automate) {
            let power = false;
            (BTentTemp.user.humidity < BTentTemp.user.humidityTarget) && (power = true);
            (BTentTemp.user.temperature < BTentTemp.user.temperatureTarget) && (power = false);
            (dk.clock.time < dk.clock.sunrise) && (power = false);
            (dk.clock.time > (dk.clock.sunset-1)) && (power = false);
            power && (BTentWater.user.power === "OFF") && console.log("B Tent Water walls ON", "green");
            !power && (BTentWater.user.power === "ON") && console.log("B Tent Water walls OFF", "yellow");
            dk.sendRequest("http://" + BTentWater.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //B Tent Heater
        if (BTentHeat && BTentHeat.user.automate) {
            let power = false;
            (BTentTemp.user.temperature < BTentTemp.user.temperatureTarget) && (power = true);
            power && (BTentHeat.user.power === "OFF") && console.log("B Tent Heater ON", "green");
            !power && (BTentHeat.user.power === "ON") && console.log("B Tent Heater OFF", "yellow");
            dk.sendRequest("http://" + BTentHeat.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }
    }

    ////////////////////////////////////////////////////////////
    //Shed Presets
    if (ShedTemp && ShedTemp.user) {
        ShedTemp.user.temperatureTarget = 75;
        ShedTemp.user.temperatureZone = 10;
        ShedTemp.user.humidityTarget = 50;
        ShedTemp.user.humidityZone = 20;

        //Shed Alarms
        if (ShedTemp.user.temperature < (ShedTemp.user.temperatureTarget - ShedTemp.user.temperatureZone))
            console.log("!!! SHED TEMPERATURE BELOW MINIMUM(" + (ShedTemp.user.temperatureTarget - ShedTemp.user.temperatureZone) + "&#176;F) @" + ShedTemp.user.temperature + "&#176;F !!!", "red");
        if (ShedTemp.user.temperature > (ShedTemp.user.temperatureTarget + ShedTemp.user.temperatureZone))
            console.log("!!! SHED TEMPERATURE ABOVE MAXIMUM(" + (ShedTemp.user.temperatureTarget + ShedTemp.user.temperatureZone) + "&#176;F) @" + ShedTemp.user.temperature + "&#176;F !!!", "red");
        //if (ShedTemp.user.humidity < (ShedTemp.user.humidityTarget - ShedTemp.user.humidityZone))
        //    console.log("!!! SHED HUMUDITY BELOW MINIMUM("+(ShedTemp.user.humidityTarget - ShedTemp.user.humidityZone) + "%) @" + ShedTemp.user.humidity + "% !!!", "red");
        //if (ShedTemp.user.humidity > (ShedTemp.user.humidityTarget + ShedTemp.user.humidityZone))
        //    console.log("!!! SHED HUMUDITY ABOVE MAXIMUM("+(ShedTemp.user.humidityTarget + ShedTemp.user.humidityZone)+ "%) @" + ShedTemp.user.humidity + "% !!!", "red");
    }

    ////////////////////////////////////////////////////////////
    //Veg Tent Presets
    if (VegTentTemp && VegTentTemp.user) {
        if (VegTentCo2 && VegTentCo2.user.automate) {
            //When using Co2, temperature should average 85 degrees
            VegTentTemp.user.temperatureTarget = 85;
            VegTentTemp.user.temperatureZone = 20;
            VegTentTemp.user.humidityTarget = 50;
            VegTentTemp.user.humidityZone = 20;
        } else {
            //When NOT using Co2, temperature should be 77 degrees
            VegTentTemp.user.temperatureTarget = 77;
            VegTentTemp.user.temperatureZone = 20;
            VegTentTemp.user.humidityTarget = 50;
            VegTentTemp.user.humidityZone = 20;
        }

        //Veg Tent Alarms
        if (VegTentTemp.user.temperature < (VegTentTemp.user.temperatureTarget - VegTentTemp.user.temperatureZone))
            console.log("!!! Veg TENT TEMPERATURE BELOW MINIMUM(" + (VegTentTemp.user.temperatureTarget - VegTentTemp.user.temperatureZone) + "&#176;F) @" + VegTentTemp.user.temperature + "&#176;F !!!", "red");
        if (VegTentTemp.user.temperature > (VegTentTemp.user.temperatureTarget + VegTentTemp.user.temperatureZone))
            console.log("!!! Veg TENT TEMPERATURE ABOVE MAXIMUM(" + (VegTentTemp.user.temperatureTarget + VegTentTemp.user.temperatureZone) + "&#176;F) @" + VegTentTemp.user.temperature + "&#176;F !!!", "red");
        if (VegTentTemp.user.humidity < (VegTentTemp.user.humidityTarget - VegTentTemp.user.humidityZone))
            console.log("!!! Veg TENT HUMUDITY BELOW MINIMUM(" + (VegTentTemp.user.humidityTarget - VegTentTemp.user.humidityZone) + "%) @" + VegTentTemp.user.humidity + "% !!!", "red");
        if (VegTentTemp.user.humidity > (VegTentTemp.user.humidityTarget + VegTentTemp.user.humidityZone))
            console.log("!!! Veg TENT HUMUDITY ABOVE MAXIMUM(" + (VegTentTemp.user.humidityTarget + VegTentTemp.user.humidityZone) + "%) @" + VegTentTemp.user.humidity + "% !!!", "red");

        //Veg Tent Co2
        if (VegTentCo2 && VegTentCo2.user.automate) {
            let power = false;
            (VegTentTemp.user.temperature < (VegTentTemp.user.temperatureTarget-1)) && (power = true);
            power && (VegTentCo2.user.power === "OFF") && console.log("Veg Tent Co2 ON", "green");
            !power && (VegTentCo2.user.power === "ON") && console.log("Veg Tent Co2 OFF", "yellow");
            dk.sendRequest("http://" + VegTentCo2.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //Veg Tent Exhaust fan
        if (VegTentExhaust && VegTentExhaust.user.automate) {
            let power = false;
            (VegTentTemp.user.temperature > VegTentTemp.user.temperatureTarget) && (power = true);
            (VegTentTemp.user.humidity > VegTentTemp.user.humidityTarget) && (power = true);
            //(VegTentTemp.user.temperature < (VegTentTemp.user.temperatureTarget - 10)) && (power = false);
            //(VegTentTemp.user.humidity < VegTentTemp.user.humidityTarget) && (power = false);
            (dk.clock.time < dk.clock.sunrise+.30) && (power = false);
            (dk.clock.time > (dk.clock.sunset+1)) && (power = false);
            (VegTentTemp.user.humidity > 90) && (power = true);
            power && (VegTentExhaust.user.power === "OFF") && console.log("Veg Tent Exhaust Fan ON", "green");
            !power && (VegTentExhaust.user.power === "ON") && console.log("Veg Tent Exhaust Fan OFF", "yellow");
            dk.sendRequest("http://" + VegTentExhaust.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //Veg Tent Water walls
        if (VegTentWater && VegTentWater.user.automate) {
            let power = false;
            (VegTentTemp.user.humidity < VegTentTemp.user.humidityTarget) && (power = true);
            (VegTentTemp.user.temperature > VegTentTemp.user.temperatureTarget) && (power = true);
            (VegTentTemp.user.humidity > VegTentTemp.user.humidityTarget) && (power = false);
            (VegTentTemp.user.temperature < VegTentTemp.user.temperatureTarget) && (power = false);
            (dk.clock.time < dk.clock.sunrise) && (power = false);
            (dk.clock.time > (dk.clock.sunset-1)) && (power = false);
            power && (VegTentWater.user.power === "OFF") && console.log("Veg Tent Water Walls ON", "green");
            !power && (VegTentWater.user.power === "ON") && console.log("Veg Tent Water Walls OFF", "yellow");
            dk.sendRequest("http://" + VegTentWater.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

        //Veg Tent Heater
        if (VegTentHeat && VegTentHeat.user.automate) {
            let power = false;
            (VegTentTemp.user.temperature < VegTentTemp.user.temperatureTarget) && (power = true);
            power && (VegTentHeat.user.power === "OFF") && console.log("Veg Tent Heater ON", "green");
            !power && (VegTentHeat.user.power === "ON") && console.log("Veg Tent Heater OFF", "yellow");
            dk.sendRequest("http://" + VegTentHeat.ip + "/cm?cmnd=POWER%20" + power, UpdateScreen);
        }

    }
}
