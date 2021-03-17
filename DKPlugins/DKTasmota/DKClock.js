"use strict";
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLTimeElement

// Date/Time 
/*
let dateEvent = new Date();
//format: August 19, 1975 23:15:30 UTC
let date = dateEvent.toJSON();
//format: 1975-08-19T23:15:30.000Z
let utcDate = dateEvent.toUTCString();
//format: Tue, 19 Aug 1975 23:15:30 GMT
*/
let time;

function GetDateInMilliseconds() {
    let date = new Date();
    return date.getTime();
}

function DKCreateClock(parent, id, top, bottom, left, right, width, weight) {
    const clock = document.createElement("a");
    clock.id = id;
    clock.style.position = "absolute";
    clock.style.top = top;
    clock.style.right = right;
    parent.appendChild(clock);
    window.setInterval(UpdateClock, 1000);
}

function UpdateClock() {
    const currentdate = new Date();
    time = currentdate.getHours() + (currentdate.getMinutes() * .01);
    let dayOfWeek; 
    switch(currentdate.getDay()) {
        case 0:
            dayOfWeek = "Sunday";
            break;
        case 1:
            dayOfWeek = "Monday";
            break;
        case 2:
            dayOfWeek = "Tuesday";
            break;
        case 3:
            dayOfWeek = "Wednesday";
            break;
        case 4:
            dayOfWeek = "Thursday";
            break;
        case 5:
            dayOfWeek = "Friday";
            break;
        case 6:
            dayOfWeek = "Saturday";
            break;
        default:
            dayOfWeek = "ERROR";
    }

    const datetime = dayOfWeek +" "+(currentdate.getMonth() + 1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    if (document.getElementById("clock")) {
        document.getElementById("clock").innerHTML = datetime;
    }
}
