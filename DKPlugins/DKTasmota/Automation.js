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

dk.automate = function dk_automate() {

    // Device alias accessors
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

    // Presets    
    const veg_preset = {
        temperatureTarget: 77,
        temperatureZone: 25,
        temperatureAlarm: 30,
        humidityTarget: 55,
        humidityZone: 25,
        humidityAlarm: 30
    }
    const bloom_preset = {
        temperatureTarget: 77,
        temperatureZone: 25,
        temperatureAlarm: 30,
        humidityTarget: 40,
        humidityZone: 25,
        humidityAlarm: 30
    }
    const co2_preset = {
        temperatureTarget: 85,
        temperatureZone: 25,
        temperatureAlarm: 30,
        humidityTarget: 50,
        humidityZone: 25,
        humidityAlarm: 30
    }
    const dry_preset = {
        temperatureTarget: 65,
        temperatureZone: 25,
        temperatureAlarm: 30,
        humidityTarget: 45,
        humidityZone: 25,
        humidityAlarm: 30
    }
    const empty_preset = {
        temperatureTarget: 100,
        temperatureZone: 25,
        temperatureAlarm: 30,
        humidityTarget: 50,
        humidityZone: 25,
        humidityAlarm: 30
    }

    ////////////////////////////////////////////////////////////
    //A Tent
    if (ATentTemp && ATentTemp.user) {
        ATentTemp.user.mode = "VegRoom";
        (ATentTemp.user.mode === "VegRoom") && Object.assign(ATentTemp.user, veg_preset);
        (ATentTemp.user.mode === "BloomRoom") &&  Object.assign(ATentTemp.user, bloom_preset);
        (ATentTemp.user.mode === "Co2Room") && Object.assign(ATentTemp.user, co2_preset);
        (ATentTemp.user.mode === "DryRoom") && Object.assign(ATentTemp.user, dry_preset);
        (ATentTemp.user.mode === "EmptyRoom") && Object.assign(ATentTemp.user, empty_preset);

        //A Tent Alarms
        if (ATentTemp.user.temperature < (ATentTemp.user.temperatureTarget - ATentTemp.user.temperatureAlarm))
            console.log("%c!!! A TENT TEMPERATURE BELOW MINIMUM(" + (ATentTemp.user.temperatureTarget - ATentTemp.user.temperatureAlarm) + "&#176;F) @" + ATentTemp.user.temperature + "&#176;F !!!", "color: red;");
        if (ATentTemp.user.temperature > (ATentTemp.user.temperatureTarget + ATentTemp.user.temperatureAlarm))
            console.log("%c!!! A TENT TEMPERATURE ABOVE MAXIMUM(" + (ATentTemp.user.temperatureTarget + ATentTemp.user.temperatureAlarm) + "&#176;F) @" + ATentTemp.user.temperature + "&#176;F !!!", "color: red;");
        if (ATentTemp.user.humidity < (ATentTemp.user.humidityTarget - ATentTemp.user.humidityAlarm))
            console.log("%c!!! A TENT HUMUDITY BELOW MINIMUM(" + (ATentTemp.user.humidityTarget - ATentTemp.user.humidityAlarm) + "%) @" + ATentTemp.user.humidity + "% !!!", "color: red;");
        if (ATentTemp.user.humidity > (ATentTemp.user.humidityTarget + ATentTemp.user.humidityAlarm))
            console.log("%c!!! A TENT HUMUDITY ABOVE MAXIMUM(" + (ATentTemp.user.humidityTarget + ATentTemp.user.humidityAlarm) + "%) @" + ATentTemp.user.humidity + "% !!!", "color: red;");

        //A Tent Co2
        if (ATentCo2 && ATentCo2.user.automate) {
            let power = false;
            (ATentTemp.user.temperature < ATentTemp.user.temperatureTarget) && (power = true);
            power && (ATentCo2.user.power === "OFF") && console.log("%cA Tent Co2 Fan ON", "color: green;");
            !power && (ATentCo2.user.power === "ON") && console.log("%cA Tent Co2 Fan OFF", "color: yellow;");
            dk.tasmota.sendCommand(ATentCo2.ip, "POWER "+power, myapp.updateScreen);
        }

        //A Tent Exhaust fan
        if (ATentExhaust && ATentExhaust.user.automate) {
            let power = false;
            (ATentTemp.user.temperature > ATentTemp.user.temperatureTarget) && (power = true);
            (ATentTemp.user.humidity > ATentTemp.user.humidityTarget) && (power = true);
            (dk.time.time < dk.time.sunrise) && (power = false);
            (dk.time.time > dk.time.sunset) && (power = false);
            (ATentTemp.user.temperature < (ATentTemp.user.temperatureTarget - ATentTemp.user.temperatureZone)) && (power = false);
            (ATentTemp.user.humidity > 90) && (power = true);
            power && (ATentExhaust.user.power === "OFF") && console.log("%cA Tent Exhaust Fan ON", "color: green;");
            !power && (ATentExhaust.user.power === "ON") && console.log("%cA Tent Exhaust Fan OFF", "color: yellow;");
            dk.tasmota.sendCommand(ATentExhaust.ip, "POWER "+power, myapp.updateScreen);
        }

        //A Tent Water walls
        if (ATentWater && ATentWater.user.automate) {
            let power = false;
            (ATentTemp.user.humidity < ATentTemp.user.humidityTarget) && (power = true);
            (ATentTemp.user.temperature > ATentTemp.user.temperatureTarget) && (power = true);
            (dk.time.time < dk.time.sunrise) && (power = false);
            (dk.time.time > dk.time.sunset) && (power = false);
            power && (ATentWater.user.power === "OFF") && console.log("%cA Tent Water walls ON", "color: green;");
            !power && (ATentWater.user.power === "ON") && console.log("%cA Tent Water walls OFF", "color: yellow;");
            dk.tasmota.sendCommand(ATentWater.ip, "POWER "+power, myapp.updateScreen);
        }

        //A Tent Heater
        if (ATentHeat && ATentHeat.user.automate) {
            let power = false;
            (ATentTemp.user.temperature < ATentTemp.user.temperatureTarget) && (power = true);
            power && (ATentHeat.user.power === "OFF") && console.log("%cA Tent Heater ON", "color: green;");
            !power && (ATentHeat.user.power === "ON") && console.log("%cA Tent Heater OFF", "color: yellow;");
            dk.tasmota.sendCommand(ATentHeat.ip, "POWER "+power, myapp.updateScreen);
        }
    }

    ////////////////////////////////////////////////////////////
    //B Tent
    if (BTentTemp && BTentTemp.user) {
        BTentTemp.user.mode = "VegRoom";
        (BTentTemp.user.mode === "VegRoom") && Object.assign(BTentTemp.user, veg_preset);
        (BTentTemp.user.mode === "BloomRoom") &&  Object.assign(BTentTemp.user, bloom_preset);
        (BTentTemp.user.mode === "Co2Room") && Object.assign(BTentTemp.user, co2_preset);
        (BTentTemp.user.mode === "DryRoom") && Object.assign(BTentTemp.user, dry_preset);
        (BTentTemp.user.mode === "EmptyRoom") && Object.assign(BTentTemp.user, empty_preset);

        //B Tent Alarms
        if (BTentTemp.user.temperature < (BTentTemp.user.temperatureTarget - BTentTemp.user.temperatureAlarm))
            console.log("%c!!! B TENT TEMPERATURE BELOW MINIMUM(" + (BTentTemp.user.temperatureTarget - BTentTemp.user.temperatureAlarm) + "&#176;F) @" + BTentTemp.user.temperature + "&#176;F !!!", "color: red;");
        if (BTentTemp.user.temperature > (BTentTemp.user.temperatureTarget + BTentTemp.user.temperatureAlarm))
            console.log("%c!!! B TENT TEMPERATURE ABOVE MAXIMUM(" + (BTentTemp.user.temperatureTarget + BTentTemp.user.temperatureAlarm) + "&#176;F) @" + BTentTemp.user.temperature + "&#176;F !!!", "color: red;");
        if (BTentTemp.user.humidity < (BTentTemp.user.humidityTarget - BTentTemp.user.humidityAlarm))
            console.log("%c!!! B TENT HUMUDITY BELOW MINIMUM(" + (BTentTemp.user.humidityTarget - BTentTemp.user.humidityAlarm) + "%) @" + BTentTemp.user.humidity + "% !!!", "color: red;");
        if (BTentTemp.user.humidity > (BTentTemp.user.humidityTarget + BTentTemp.user.humidityAlarm))
            console.log("%c!!! B TENT HUMUDITY ABOVE MAXIMUM(" + (BTentTemp.user.humidityTarget + BTentTemp.user.humidityAlarm) + "%) @" + BTentTemp.user.humidity + "% !!!", "color: red;");

        //B Tent Co2
        if (BTentCo2 && BTentCo2.user.automate) {
            let power = false;
            (BTentTemp.user.temperature < BTentTemp.user.temperatureTarget) && (power = true);
            power && (BTentCo2.user.power === "OFF") && console.log("%cB Tent Co2 ON", "color: green;");
            !power && (BTentCo2.user.power === "ON") && console.log("%cB Tent Co2 OFF", "color: yellow;");
            dk.tasmota.sendCommand(BTentCo2.ip, "POWER "+power, myapp.updateScreen);
        }

        //B Tent Exhaust fan
        if (BTentExhaust && BTentExhaust.user.automate) {
            let power = false;
            (BTentTemp.user.temperature > BTentTemp.user.temperatureTarget) && (power = true);
            (BTentTemp.user.humidity > BTentTemp.user.humidityTarget) && (power = true);
            (dk.time.time < dk.time.sunrise) && (power = false);
            (dk.time.time > dk.time.sunset) && (power = false);
            (BTentTemp.user.temperature < (BTentTemp.user.temperatureTarget - BTentTemp.user.temperatureZone)) && (power = false);
            (BTentTemp.user.humidity > 90) && (power = true);
            power && (BTentExhaust.user.power === "OFF") && console.log("%cB Tent Exhaust Fan ON", "color: green;");
            !power && (BTentExhaust.user.power === "ON") && console.log("%cB Tent Exhaust Fan OFF", "color: yellow;");
            dk.tasmota.sendCommand(BTentExhaust.ip, "POWER "+power, myapp.updateScreen);
        }

        //B Tent Water walls
        if (BTentWater && BTentWater.user.automate) {
            let power = false;
            (BTentTemp.user.humidity < BTentTemp.user.humidityTarget) && (power = true);
            (BTentTemp.user.temperature < BTentTemp.user.temperatureTarget) && (power = false);
            (dk.time.time < dk.time.sunrise) && (power = false);
            (dk.time.time > dk.time.sunset) && (power = false);
            power && (BTentWater.user.power === "OFF") && console.log("%cB Tent Water walls ON", "color: green;");
            !power && (BTentWater.user.power === "ON") && console.log("%cB Tent Water walls OFF", "color: yellow;");
            dk.tasmota.sendCommand(BTentWater.ip, "POWER "+power, myapp.updateScreen);
        }

        //B Tent Heater
        if (BTentHeat && BTentHeat.user.automate) {
            let power = false;
            (BTentTemp.user.temperature < BTentTemp.user.temperatureTarget) && (power = true);
            power && (BTentHeat.user.power === "OFF") && console.log("%cB Tent Heater ON", "color: green;");
            !power && (BTentHeat.user.power === "ON") && console.log("%cB Tent Heater OFF", "color: yellow;");
            dk.tasmota.sendCommand(BTentHeat.ip, "POWER "+power, myapp.updateScreen);
        }
    }

    ////////////////////////////////////////////////////////////
    //Shed Presets
    if (ShedTemp && ShedTemp.user) {
        ShedTemp.user.mode = "VegRoom";
        (ShedTemp.user.mode === "VegRoom") && Object.assign(ShedTemp.user, veg_preset);
        (ShedTemp.user.mode === "BloomRoom") &&  Object.assign(ShedTemp.user, bloom_preset);
        (ShedTemp.user.mode === "Co2Room") && Object.assign(ShedTemp.user, co2_preset);
        (ShedTemp.user.mode === "DryRoom") && Object.assign(ShedTemp.user, dry_preset);
        (ShedTemp.user.mode === "EmptyRoom") && Object.assign(ShedTemp.user, empty_preset);

        //Shed Alarms
        if (ShedTemp.user.temperature < (ShedTemp.user.temperatureTarget - ShedTemp.user.temperatureAlarm))
            console.log("%c!!! SHED TEMPERATURE BELOW MINIMUM(" + (ShedTemp.user.temperatureTarget - ShedTemp.user.temperatureAlarm) + "&#176;F) @" + ShedTemp.user.temperature + "&#176;F !!!", "color: red;");
        if (ShedTemp.user.temperature > (ShedTemp.user.temperatureTarget + ShedTemp.user.temperatureAlarm))
            console.log("%c!!! SHED TEMPERATURE ABOVE MAXIMUM(" + (ShedTemp.user.temperatureTarget + ShedTemp.user.temperatureAlarm) + "&#176;F) @" + ShedTemp.user.temperature + "&#176;F !!!", "color: red;");
        //if (ShedTemp.user.humidity < (ShedTemp.user.humidityTarget - ShedTemp.user.humidityAlarm))
        //    console.log("%c!!! SHED HUMUDITY BELOW MINIMUM("+(ShedTemp.user.humidityTarget - ShedTemp.user.humidityAlarm) + "%) @" + ShedTemp.user.humidity + "% !!!", "color: red;");
        //if (ShedTemp.user.humidity > (ShedTemp.user.humidityTarget + ShedTemp.user.humidityAlarm))
        //    console.log("%c!!! SHED HUMUDITY ABOVE MAXIMUM("+(ShedTemp.user.humidityTarget + ShedTemp.user.humidityAlarm)+ "%) @" + ShedTemp.user.humidity + "% !!!", "color: red;");
    }

    ////////////////////////////////////////////////////////////
    //Veg Tent Presets
    if (VegTentTemp && VegTentTemp.user) {
        VegTentTemp.user.mode = "EmptyRoom";
        (VegTentTemp.user.mode === "VegRoom") && Object.assign(VegTentTemp.user, veg_preset);
        (VegTentTemp.user.mode === "BloomRoom") &&  Object.assign(VegTentTemp.user, bloom_preset);
        (VegTentTemp.user.mode === "Co2Room") && Object.assign(VegTentTemp.user, co2_preset);
        (VegTentTemp.user.mode === "DryRoom") && Object.assign(VegTentTemp.user, dry_preset);
        (VegTentTemp.user.mode === "EmptyRoom") && Object.assign(VegTentTemp.user, empty_preset);

        //Veg Tent Alarms
        if (VegTentTemp.user.temperature < (VegTentTemp.user.temperatureTarget - VegTentTemp.user.temperatureAlarm))
            console.log("%c!!! Veg TENT TEMPERATURE BELOW MINIMUM(" + (VegTentTemp.user.temperatureTarget - VegTentTemp.user.temperatureAlarm) + "&#176;F) @" + VegTentTemp.user.temperature + "&#176;F !!!", "color: red;");
        if (VegTentTemp.user.temperature > (VegTentTemp.user.temperatureTarget + VegTentTemp.user.temperatureAlarm))
            console.log("%c!!! Veg TENT TEMPERATURE ABOVE MAXIMUM(" + (VegTentTemp.user.temperatureTarget + VegTentTemp.user.temperatureAlarm) + "&#176;F) @" + VegTentTemp.user.temperature + "&#176;F !!!", "color: red;");
        if (VegTentTemp.user.humidity < (VegTentTemp.user.humidityTarget - VegTentTemp.user.humidityAlarm))
            console.log("%c!!! Veg TENT HUMUDITY BELOW MINIMUM(" + (VegTentTemp.user.humidityTarget - VegTentTemp.user.humidityAlarm) + "%) @" + VegTentTemp.user.humidity + "% !!!", "color: red;");
        if (VegTentTemp.user.humidity > (VegTentTemp.user.humidityTarget + VegTentTemp.user.humidityAlarm))
            console.log("%c!!! Veg TENT HUMUDITY ABOVE MAXIMUM(" + (VegTentTemp.user.humidityTarget + VegTentTemp.user.humidityAlarm) + "%) @" + VegTentTemp.user.humidity + "% !!!", "color: red;");

        //Veg Tent Co2
        if (VegTentCo2 && VegTentCo2.user.automate) {
            let power = false;
            (VegTentTemp.user.temperature < (VegTentTemp.user.temperatureTarget - 1)) && (power = true);
            power && (VegTentCo2.user.power === "OFF") && console.log("%cVeg Tent Co2 ON", "color: green;");
            !power && (VegTentCo2.user.power === "ON") && console.log("%cVeg Tent Co2 OFF", "color: yellow;");
            dk.tasmota.sendCommand(VegTentCo2.ip, "POWER "+power, myapp.updateScreen);
        }

        //Veg Tent Exhaust fan
        if (VegTentExhaust && VegTentExhaust.user.automate) {
            let power = false;
            (VegTentTemp.user.temperature > VegTentTemp.user.temperatureTarget) && (power = true);
            (VegTentTemp.user.humidity > VegTentTemp.user.humidityTarget) && (power = true);
            //(VegTentTemp.user.humidity < VegTentTemp.user.humidityTarget) && (power = false);
            (dk.time.time < dk.time.sunrise) && (power = false);
            (dk.time.time > dk.time.sunset) && (power = false);
            (VegTentTemp.user.temperature < (VegTentTemp.user.temperatureTarget - VegTentTemp.user.temperatureZone)) && (power = false);
            (VegTentTemp.user.humidity > 90) && (power = true);
            power && (VegTentExhaust.user.power === "OFF") && console.log("%cVeg Tent Exhaust Fan ON", "color: green;");
            !power && (VegTentExhaust.user.power === "ON") && console.log("%cVeg Tent Exhaust Fan OFF", "color: yellow;");
            dk.tasmota.sendCommand(VegTentExhaust.ip, "POWER "+power, myapp.updateScreen);
        }

        //Veg Tent Water walls
        if (VegTentWater && VegTentWater.user.automate) {
            let power = false;
            (VegTentTemp.user.humidity < VegTentTemp.user.humidityTarget) && (power = true);
            (VegTentTemp.user.temperature > VegTentTemp.user.temperatureTarget) && (power = true);
            (VegTentTemp.user.humidity > VegTentTemp.user.humidityTarget) && (power = false);
            (VegTentTemp.user.temperature < VegTentTemp.user.temperatureTarget) && (power = false);
            (dk.time.time < dk.time.sunrise) && (power = false);
            (dk.time.time > dk.time.sunset) && (power = false);
            power && (VegTentWater.user.power === "OFF") && console.log("%cVeg Tent Water Walls ON", "color: green;");
            !power && (VegTentWater.user.power === "ON") && console.log("%cVeg Tent Water Walls OFF", "color: yellow;");
            dk.tasmota.sendCommand(VegTentWater.ip, "POWER "+power, myapp.updateScreen);
        }

        //Veg Tent Heater
        if (VegTentHeat && VegTentHeat.user.automate) {
            let power = false;
            (VegTentTemp.user.temperature < VegTentTemp.user.temperatureTarget) && (power = true);
            power && (VegTentHeat.user.power === "OFF") && console.log("%cVeg Tent Heater ON", "color: green;");
            !power && (VegTentHeat.user.power === "ON") && console.log("%cVeg Tent Heater OFF", "color: yellow;");
            dk.tasmota.sendCommand(VegTentHeat.ip, "POWER "+power, myapp.updateScreen);
        }

    }
}
