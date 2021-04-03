"use strict";

function Automate() {
    
    if (Device("A Tent Co2"))
        Device("A Tent Co2").automate = false;

    if (Device("B Tent Co2"))
        Device("B Tent Co2").automate = false;

    if (Device("Veg Tent Co2"))
        Device("Veg Tent Co2").automate = false;
        
    if (Device("B Tent Co2")?.automate) {
        //When using Co2, temperature should average 85 degrees
        Device("B Tent Temp").targetTemperature = 85;
        Device("B Tent Temp").targetHumidity = 55;
        tempTarget = 85;
        humTarget = 55;
    } else {
        //When NOT using Co2, temperature should be 77 degrees
        Device("B Tent Temp").targetTemperature = 77;
        Device("B Tent Temp").targetHumidity = 50;
        tempTarget = 77;
        humTarget = 50;
    }
    tempMin = tempTarget - 10;
    tempMax = tempTarget + 10;
    humMin = humTarget - 10;
    humMax = humTarget + 10;

    //B Tent Alarms
    if (Device("B Tent Temp")?.temperature < tempMin) {
        dkconsole.warn("!!! TEMPERATURE BELOW MINIMUM " + Device("B Tent Temp").temperature + "&#176;F < " + tempMin + "&#176;F !!!");
    }
    if (Device("B Tent Temp")?.temperature > tempMax) {
        dkconsole.warn("!!! TEMPERATURE ABOVE MAXIMUM " + Device("B Tent Temp").temperature + "&#176;F > " + tempMax + "&#176;F !!!");
    }
    if (Device("B Tent Temp")?.humidity < humMin) {
        dkconsole.warn("!!! HUMUDITY BELOW MINIMUM " + Device("B Tent Temp").humidity + "% < " + humMin + "% !!!");
    }
    if (Device("B Tent Temp")?.humidity > humMax) {
        dkconsole.warn("!!! HUMUDITY ABOVE MAXIMUM " + Device("B Tent Temp").humidity + "% > " + humMax + "% !!!");
    }

    //B Tent Co2
    if (Device("B Tent Co2")?.automate) {
        if (/*(time > 8) && (time < 11) || (time > 14) && (time < 17) && */
        temperature < (tempTarget - 5) && humidity < humMax) {
            dkconsole.message("Co2 ON", "green");
            Device("B Tent Co2").StatusSTS.POWER = "ON";
            DKSendRequest("http://" + Device("B Tent Co2").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
            DKSendRequest("http://" + Device("B Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        } else {
            dkconsole.message("Co2 OFF", "yellow");
            Device("B Tent Co2").StatusSTS.POWER = "OFF";
            DKSendRequest("http://" + Device("B Tent Co2").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //B Tent Exhaust fan
    if (Device("B Tent Exhaust Fan")?.automate) {
        if (Device("B Tent Co2")?.power !== "ON" && Device("B Tent Temp").temperature > (tempTarget + 1) || Device("B Tent Temp").humidity > humMax && Device("B Tent Temp").temperature > 60) {
            dkconsole.message("Exhaust Fan ON", "green");
            DKSendRequest("http://" + Device("B Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Exhaust Fan OFF", "yellow");
            DKSendRequest("http://" + Device("B Tent Exhaust Fan").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //B Tent Water walls
    if (Device("B Tent Water Walls")?.automate) {
        if ((time < 18) && (Device("B Tent Temp").humidity < humTarget) && (Device("B Tent Temp").temperature > tempTarget)) {
            dkconsole.message("Water walls ON", "green");
            DKSendRequest("http://" + Device("B Tent Water Walls").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Water walls OFF", "yellow");
            DKSendRequest("http://" + Device("B Tent Water Walls").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }

    //B Tent Heater
    if (Device("B Tent Heater")?.automate) {
        if (Device("B Tent Temp").temperature < tempTarget) {
            dkconsole.message("Heater ON", "green");
            DKSendRequest("http://" + Device("B Tent Heater").ip + "/cm?cmnd=POWER%20ON", UpdateScreen);
        } else {
            dkconsole.message("Heater OFF", "yellow");
            DKSendRequest("http://" + Device("B Tent Heater").ip + "/cm?cmnd=POWER%20OFF", UpdateScreen);
        }
    }
}
