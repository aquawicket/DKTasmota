"use strict";
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement



function CreateSound(src) {
    const audio = document.createElement("audio");
    audio.id = src;
    audio.src = src;
    audio.setAttribute("preload", "auto");
    audio.setAttribute("controls", "none");
    audio.style.display = "none";
    document.body.appendChild(audio);
}

function PauseSound(src) {
    const ele = document.getElementById(src);
    ele.pause();
}

//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
async function PlaySound(src) {
    //try {
    const ele = document.getElementById(src);
    await ele.play();
    //} catch(errMsg) {
    //    dkconsole.error(errMsg);
    //}
}

function StopSound(src) {
    const ele = document.getElementById(src);
    ele.stop();
}

function GetVolume(src) {
    const ele = document.getElementById(src);
    return ele.volume;
}

function SetVolume(src, volume) {
    const ele = document.getElementById(src);
    ele.volume = volume;
}
