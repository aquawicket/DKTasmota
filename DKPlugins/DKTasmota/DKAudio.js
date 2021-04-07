"use strict";
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement

function DKAudio_CreateSound(src) {
    const audio = document.createElement("audio");
    audio.id = src;
    audio.src = src;
    audio.setAttribute("preload", "auto");
    audio.setAttribute("controls", "none");
    audio.style.display = "none";
    document.body.appendChild(audio);
}

function DKAudio_PauseSound(src) {
    const ele = document.getElementById(src);
    ele.pause();
}

//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
async function DKAudio_PlaySound(src) {
    //try {
    const ele = document.getElementById(src);
    await ele.play();
    //} catch(errMsg) {
    //    dkconsole.error(errMsg);
    //}
}

function DKAudio_StopSound(src) {
    const ele = document.getElementById(src);
    ele.stop();
}

function DKAudio_GetVolume(src) {
    const ele = document.getElementById(src);
    return ele.volume;
}

function DKAudio_SetVolume(src, volume) {
    const ele = document.getElementById(src);
    ele.volume = volume;
}
