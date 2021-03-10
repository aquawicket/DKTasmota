"use strict";
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement

/////////////////////////
function CreateSound(src) {
    const audio = document.createElement("audio");
    audio.id = src;
    audio.src = src;
    audio.setAttribute("preload", "auto");
    audio.setAttribute("controls", "none");
    //audio.setAttribute("muted", "muted"); //Attemp to fix PlaySound error
    audio.muted = true;
    //Attemp to fix PlaySound error
    audio.style.display = "none";
    document.body.appendChild(audio);
}

////////////////////////
function PauseSound(src) {
    const ele = document.getElementById(src);
    ele.pause();
}

///////////////////////
function PlaySound(src) {
    const ele = document.getElementById(src);
    // FIXME: This causes errors
    // DKAudio.js:23 Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
    ele.play();
}

///////////////////////
function StopSound(src) {
    const ele = document.getElementById(src);
    ele.stop();
}
