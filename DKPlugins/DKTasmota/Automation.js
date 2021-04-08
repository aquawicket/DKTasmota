"use strict";

function Automate() {
    
    if (Device("A Tent Co2"))
        Device("A Tent Co2").user.automate = false;
    if (Device("B Tent Co2"))
        Device("B Tent Co2").user.automate = false;
    if (Device("Veg Tent Co2"))
        Device("Veg Tent Co2").user.automate = false;

    ////////////////////////////////////////////////////////////
    //A Tent Presets
    if (Device("A Tent Co2")?.user.automate && Device("A Tent Temp").user) {
        //When using Co2, temperature should average 85 degrees
        Device("A Tent Temp").user.temperatureTarget = 85;
        Device("A Tent Temp").user.temperatureZone = 20;
        Device("A Tent Temp").user.humidityTarget = 55;
        Device("A Tent Temp").user.humidityZone = 20;
    } else if (Device("A Tent Temp") && Device("A Tent Temp").user) {
        //When NOT using Co2, temperature should be 77 degrees
        Device("A Tent Temp").user.temperatureTarget = 77;
        Device("A Tent Temp").user.temperatureZone = 20;
        Device("A Tent Temp").user.humidityTarget = 50;
        Device("A Tent Temp").user.humidityZone = 20;
    }

    //A Tent Alarms
    if (Device("A Tent Temp").user.temperature < (Device("A Tent Temp").user.temperatureTarget - Device("A Tent Temp").user.temperatureZone)) {
        dkconsole.message("!!! A TENT TEMPERATURE BELOW MINIMUM " + Device("A Tent Temp").user.temperature + "&#176;F < " + (Device("A Tent Temp").user.temperatureTarget - Device("A Tent Temp").user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (Device("A Tent Temp").user.temperature > (Device("A Tent Temp").user.temperatureTarget + Device("A Tent Temp").user.temperatureZone)) {
        dkconsole.message("!!! A TENT TEMPERATURE ABOVE MAXIMUM " + Device("A Tent Temp").user.temperature + "&#176;F > " + (Device("A Tent Temp").user.temperatureTarget + Device("A Tent Temp").user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (Device("A Tent Temp").user.humidity < (Device("A Tent Temp").user.humidityTarget - Device("A Tent Temp").user.humidityZone)) {
        dkconsole.message("!!! A TENT HUMUDITY BELOW MINIMUM " + Device("A Tent Temp").user.humidity + "% < " + (Device("A Tent Temp").user.humidityTarget - Device("A Tent Temp").user.humidityZone) + "% !!!", "red");
    }
    if (Device("A Tent Temp").user.humidity > (Device("A Tent Temp").user.humidityTarget + Device("A Tent Temp").user.humidityZone)) {
        dkconsole.message("!!! A TENT HUMUDITY ABOVE MAXIMUM " + Device("A Tent Temp").user.humidity + "% > " + (Device("A Tent Temp").user.humidityTarget + Device("A Tent Temp").user.humidityZone) + "% !!!", "red");
    }

    //A Tent Co2
    if (Device("A Tent Co2")?.user?.automate) {
        if (/*(time > 8) && (time < 11) || (time > 14) && (time < 17) && */
        Device("A Tent Temp").user.temperature < (Device("A Tent Temp").user.temperatureTarget - 5) && Device("A Tent Temp").user.humidity < (Device("A Tent Temp").user.humidityTarget + Device("A Tent Temp").user.humidityZone)) {
            dkconsole.message("A Tent Co2 ON", "green");
            Device("A Tent Co2").user.power = "ON";
            DK_SendRequest("http://" + Device("A Tent Co2").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
            DK_SendRequest("http://" + Device("A Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        } else {
            dkconsole.message("A TentCo2 OFF", "yellow");
            Device("A Tent Co2").user.power = "OFF";
            DK_SendRequest("http://" + Device("A Tent Co2").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //A Tent Exhaust fan
    if (Device("A Tent Exhaust Fan")?.user?.automate) {
        if (Device("A Tent Co2")?.user?.power !== "ON" && Device("A Tent Temp")?.user?.temperature > (Device("A Tent Temp").user.temperatureTarget) || Device("A Tent Temp").user.humidity > (Device("A Tent Temp").user.humidityTarget + Device("A Tent Temp").user.humidityZone) && Device("A Tent Temp").user.temperature > 60) {
            dkconsole.message("A Tent Exhaust Fan ON", "green");
            DK_SendRequest("http://" + Device("A Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("A Tent Exhaust Fan OFF", "yellow");
            DK_SendRequest("http://" + Device("A Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //A Tent Water walls
    if (Device("A Tent Water Walls")?.user?.automate) {
        if ((time < 18) && (Device("A Tent Temp").user.humidity < Device("A Tent Temp").user.humidityTarget) && (Device("A Tent Temp").user.temperature > Device("A Tent Temp").user.temperatureTarget)) {
            dkconsole.message("A Tent Water walls ON", "green");
            DK_SendRequest("http://" + Device("A Tent Water Walls").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("A Tent Water walls OFF", "yellow");
            DK_SendRequest("http://" + Device("A Tent Water Walls").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //A Tent Heater
    if (Device("A Tent Heater")?.user?.automate) {
        if (Device("A Tent Co2").user.power !== "ON" && Device("A Tent Temp").user.temperature < Device("A Tent Temp").user.temperatureTarget) {
            dkconsole.message("A Tent Heater ON", "green");
            DK_SendRequest("http://" + Device("A Tent Heater").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("A Tent Heater OFF", "yellow");
            DK_SendRequest("http://" + Device("A Tent Heater").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    ////////////////////////////////////////////////////////////
    //B Tent Presets
    if (Device("B Tent Co2")?.user.automate && Device("B Tent Temp").user) {
        //When using Co2, temperature should average 85 degrees
        Device("B Tent Temp").user.temperatureTarget = 85;
        Device("B Tent Temp").user.temperatureZone = 20;
        Device("B Tent Temp").user.humidityTarget = 55;
        Device("B Tent Temp").user.humidityZone = 20;
    } else {
        //When NOT using Co2, temperature should be 77 degrees
        Device("B Tent Temp").user.temperatureTarget = 77;
        Device("B Tent Temp").user.temperatureZone = 20;
        Device("B Tent Temp").user.humidityTarget = 50;
        Device("B Tent Temp").user.humidityZone = 20;
    }

    //B Tent Alarms
    if (Device("B Tent Temp").user.temperature < (Device("B Tent Temp").user.temperatureTarget - Device("B Tent Temp").user.temperatureZone)) {
        dkconsole.message("!!! B TENT TEMPERATURE BELOW MINIMUM " + Device("B Tent Temp").user.temperature + "&#176;F < " + (Device("B Tent Temp").user.temperatureTarget - Device("B Tent Temp").user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (Device("B Tent Temp").user.temperature > (Device("B Tent Temp").user.temperatureTarget + Device("B Tent Temp").user.temperatureZone)) {
        dkconsole.message("!!! B TENT TEMPERATURE ABOVE MAXIMUM " + Device("B Tent Temp").user.temperature + "&#176;F > " + (Device("B Tent Temp").user.temperatureTarget + Device("B Tent Temp").user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (Device("B Tent Temp").user.humidity < (Device("B Tent Temp").user.humidityTarget - Device("B Tent Temp").user.humidityZone)) {
        dkconsole.message("!!! B TENT HUMUDITY BELOW MINIMUM " + Device("B Tent Temp").user.humidity + "% < " + (Device("B Tent Temp").user.humidityTarget - Device("B Tent Temp").user.humidityZone) + "% !!!", "red");
    }
    if (Device("B Tent Temp").user.humidity > (Device("B Tent Temp").user.humidityTarget + Device("B Tent Temp").user.humidityZone)) {
        dkconsole.message("!!! B TENT HUMUDITY ABOVE MAXIMUM " + Device("B Tent Temp").user.humidity + "% > " + (Device("B Tent Temp").user.humidityTarget + Device("B Tent Temp").user.humidityZone) + "% !!!", "red");
    }

    //B Tent Co2
    if (Device("B Tent Co2")?.user?.automate) {
        if (/*(time > 8) && (time < 11) || (time > 14) && (time < 17) && */
        Device("B Tent Temp").user.temperature < (Device("B Tent Temp").user.temperatureTarget - 1) && Device("B Tent Temp").user.humidity < (Device("B Tent Temp").user.humidityTarget + Device("B Tent Temp").user.humidityZone)) {
            dkconsole.message("B Tent Co2 ON", "green");
            Device("B Tent Co2").user.power = "ON";
            DK_SendRequest("http://" + Device("B Tent Co2").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
            DK_SendRequest("http://" + Device("B Tent Exhaust Fan")?.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        } else {
            dkconsole.message("B Tent Co2 OFF", "yellow");
            Device("B Tent Co2").user.power = "OFF";
            DK_SendRequest("http://" + Device("B Tent Co2").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //B Tent Exhaust fan
    if (Device("B Tent Exhaust Fan")?.user?.automate) {
        if (Device("B Tent Co2")?.user?.power !== "ON" && Device("B Tent Temp")?.user?.temperature > (Device("B Tent Temp").user.temperatureTarget + 1) || Device("B Tent Temp").user.humidity > (Device("B Tent Temp").user.humidityTarget + Device("B Tent Temp").user.humidityZone) && Device("B Tent Temp").user.temperature > 60) {
            dkconsole.message("B Tent Exhaust Fan ON", "green");
            DK_SendRequest("http://" + Device("B Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("B Tent Exhaust Fan OFF", "yellow");
            DK_SendRequest("http://" + Device("B Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //B Tent Water walls
    if (Device("B Tent Water Walls")?.user?.automate) {
        if ((time < 18) && (Device("B Tent Temp").user.humidity < Device("B Tent Temp").user.humidityTarget) && (Device("B Tent Temp").user.temperature > Device("B Tent Temp").user.temperatureTarget)) {
            dkconsole.message("B Tent Water walls ON", "green");
            DK_SendRequest("http://" + Device("B Tent Water Walls").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("B Tent Water walls OFF", "yellow");
            DK_SendRequest("http://" + Device("B Tent Water Walls").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //B Tent Heater
    if (Device("B Tent Heater")?.user?.automate) {
        if (Device("B Tent Co2")?.user.power !== "ON" && Device("B Tent Temp").user.temperature < Device("B Tent Temp").user.temperatureTarget) {
            dkconsole.message("B Tent Heater ON", "green");
            DK_SendRequest("http://" + Device("B Tent Heater").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("B Tent Heater OFF", "yellow");
            DK_SendRequest("http://" + Device("B Tent Heater").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    ////////////////////////////////////////////////////////////
    //Veg Tent Presets
    if (Device("Veg Tent Co2")?.user.automate && Device("Veg Tent Temp").user) {
        //When using Co2, temperature should average 85 degrees
        Device("Veg Tent Temp").user.temperatureTarget = 85;
        Device("Veg Tent Temp").user.temperatureZone = 20;
        Device("Veg Tent Temp").user.humidityTarget = 55;
        Device("Veg Tent Temp").user.humidityZone = 20;
    } else if(Device("Veg Tent Temp")){
        //When NOT using Co2, temperature should be 77 degrees
        Device("Veg Tent Temp").user.temperatureTarget = 77;
        Device("Veg Tent Temp").user.temperatureZone = 20;
        Device("Veg Tent Temp").user.humidityTarget = 50;
        Device("Veg Tent Temp").user.humidityZone = 20;
    }

    //Veg Tent Alarms
    if(Device("Veg Tent Temp")){
    if (Device("Veg Tent Temp").user.temperature < (Device("Veg Tent Temp").user.temperatureTarget - Device("Veg Tent Temp").user.temperatureZone)) {
        dkconsole.message("!!! Veg TENT TEMPERATURE BELOW MINIMUM " + Device("Veg Tent Temp").user.temperature + "&#176;F < " + (Device("Veg Tent Temp").user.temperatureTarget - Device("Veg Tent Temp").user.temperatureZone) + "&#176;F !!!", "red");
    }
    if (Device("Veg Tent Temp").user.temperature > (Device("Veg Tent Temp").user.temperatureTarget + Device("Veg Tent Temp").user.temperatureZone)) {
        dkconsole.message("!!! Veg TENT TEMPERATURE ABOVE MAXIMUM " + Device("Veg Tent Temp").user.temperature + "&#176;F > " + (Device("Veg Tent Temp").user.temperatureTarget + Device("Veg Tent Temp").user.temperatureZone) + "&#176;F !!!", "red");
    }
    /*
    if (Device("Veg Tent Temp").user.humidity < (Device("Veg Tent Temp").user.humidityTarget - Device("Veg Tent Temp").user.humidityZone)) {
        dkconsole.message("!!! Veg TENT HUMUDITY BELOW MINIMUM " + Device("Veg Tent Temp").user.humidity + "% < " + (Device("Veg Tent Temp").user.humidityTarget - Device("Veg Tent Temp").user.humidityZone) + "% !!!", "red");
    }
    if (Device("Veg Tent Temp").user.humidity > (Device("Veg Tent Temp").user.humidityTarget + Device("Veg Tent Temp").user.humidityZone)) {
        dkconsole.message("!!! Veg TENT HUMUDITY ABOVE MAXIMUM " + Device("Veg Tent Temp").user.humidity + "% > " + (Device("Veg Tent Temp").user.humidityTarget + Device("Veg Tent Temp").user.humidityZone) + "% !!!", "red");
    }
    */
    }

    //Veg Tent Co2
    if (Device("Veg Tent Co2")?.user?.automate) {
        if (/*(time > 8) && (time < 11) || (time > 14) && (time < 17) && */
        Device("Veg Tent Temp").user.temperature < (Device("Veg Tent Temp").user.temperatureTarget - 5) && Device("Veg Tent Temp").user.humidity < (Device("Veg Tent Temp").user.humidityTarget + Device("Veg Tent Temp").user.humidityZone)) {
            dkconsole.message("Veg Tent Co2 ON", "green");
            Device("Veg Tent Co2").user.power = "ON";
            DK_SendRequest("http://" + Device("Veg Tent Co2")?.ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
            DK_SendRequest("http://" + Device("Veg Tent Exhaust Fan")?.ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        } else {
            dkconsole.message("Veg Tent Co2 OFF", "yellow");
            Device("Veg Tent Co2").user.power = "OFF";
            DK_SendRequest("http://" + Device("Veg Tent Co2").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Veg Tent Exhaust fan
    if (Device("Veg Tent Exhaust Fan")?.user?.automate && Device("Veg Tent Temp")) {
        if (Device("Veg Tent Co2")?.user?.power !== "ON" && Device("Veg Tent Temp")?.user?.temperature > (Device("Veg Tent Temp").user.temperatureTarget + 1) || Device("Veg Tent Temp").user.humidity > (Device("Veg Tent Temp").user.humidityTarget + Device("Veg Tent Temp").user.humidityZone) && Device("Veg Tent Temp").user.temperature > 60) {
            dkconsole.message("Veg Tent Exhaust Fan ON", "green");
            DK_SendRequest("http://" + Device("Veg Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Veg Tent Exhaust Fan OFF", "yellow");
            DK_SendRequest("http://" + Device("Veg Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Veg Tent Water walls
    if (Device("Veg Tent Water Walls")?.user?.automate) {
        if ((time < 18) && (Device("Veg Tent Temp").user.humidity < Device("Veg Tent Temp").user.humidityTarget) && (Device("Veg Tent Temp").user.temperature > Device("Veg Tent Temp").user.temperatureTarget)) {
            dkconsole.message("Veg Tent Water walls ON", "green");
            DK_SendRequest("http://" + Device("Veg Tent Water Walls").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Veg Tent Water walls OFF", "yellow");
            DK_SendRequest("http://" + Device("Veg Tent Water Walls").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //Veg Tent Heater
    if (Device("Veg Tent Heater")?.user?.automate) {
        if (Device("Veg Tent Co2").user.power !== "ON" && Device("Veg Tent Temp").user.temperature < Device("Veg Tent Temp").user.temperatureTarget) {
            dkconsole.message("Veg Tent Heater ON", "green");
            DK_SendRequest("http://" + Device("Veg Tent Heater").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Veg Tent Heater OFF", "yellow");
            DK_SendRequest("http://" + Device("Veg Tent Heater").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }
}
