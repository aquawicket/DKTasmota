//https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement

/////////////////////////
function CreateSound(src) {
    var audio = document.createElement("audio");
    audio.id = src;
    audio.src = src;
    audio.setAttribute("preload", "auto");
    audio.setAttribute("controls", "none");
    audio.style.display = "none";
    document.body.appendChild(audio);
}

////////////////////////
function PauseSound(src) {
    var ele = document.getElementById(src);
    ele.pause();
}

///////////////////////
function PlaySound(src) {
    var ele = document.getElementById(src);
    ele.play();
}

///////////////////////
function StopSound(src) {
    var ele = document.getElementById(src);
    ele.stop();
}
