// https://developer.mozilla.org/en-US/docs/Web/API/HTMLTimeElement

/////////////////////////////////////////////////////////////////////////
function CreateClock(parent, id, top, bottom, left, right, width, weight) {
    var clock = document.createElement("a");
    clock.id = id;
    clock.style.position = "absolute";
    clock.style.top = top;
    clock.style.right = right;
    parent.appendChild(clock);
    window.setInterval(UpdateClock, 1000);
}

//////////////////////
function UpdateClock() {
    var currentdate = new Date();
    var datetime = (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    if (document.getElementById("clock")) {
        document.getElementById("clock").innerHTML = datetime;
    }
}
