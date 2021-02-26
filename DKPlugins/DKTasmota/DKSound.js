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
