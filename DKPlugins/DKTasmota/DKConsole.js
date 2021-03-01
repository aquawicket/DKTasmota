//"use strict";
// https://developer.mozilla.org/en-US/docs/Web/API/console

var dkconsole;

/////////////////////////////////////////////////////////////////////////////
function CreateDKConsole(parent, id, top, bottom, left, right, width, height) {
    DKLoadCSSFile("dkconsole.css");
    var dkconsoleFrame = document.createElement("div");
    dkconsoleFrame.id = id;
    dkconsoleFrame.style.position = "absolute";
    dkconsoleFrame.style.top = top;
    dkconsoleFrame.style.bottom = bottom;
    dkconsoleFrame.style.left = left;
    dkconsoleFrame.style.right = right;
    dkconsoleFrame.style.width = width;
    dkconsoleFrame.style.height = height;
    parent.appendChild(dkconsoleFrame);

    dkconsole = document.createElement("div");
    dkconsole.className = "dkconsole";
    dkconsole.style.position = "absolute";
    dkconsole.style.backgroundColor = "black";
    dkconsole.style.color = "white";
    dkconsole.style.fontColor = "white";
    dkconsole.style.top = "0px";
    dkconsole.style.bottom = "20px";
    dkconsole.style.left = "0px";
    dkconsole.style.right = "0px";
    //dkconsole.style.width = "";
    //dkconsole.style.height = "";
    dkconsole.style.visibility = "visible";
    dkconsole.style.overflow = "auto";
    dkconsoleFrame.appendChild(dkconsole);

    //command box
    var cmdbox = document.createElement("input");
    cmdbox.type = "text";
    cmdbox.style.position = "absolute";
    cmdbox.style.left = "0px";
    cmdbox.style.bottom = "0px";
    cmdbox.style.right = "0px";
    cmdbox.style.height = "20px";
    cmdbox.style.width = "100%";
    cmdbox.onkeydown = function(event) {
        var key = event.charCode || event.keyCode;
        if (key === 13) {
            //enter
            if (cmdbox.value === "clear" || cmdbox.value === "cls") {
                dkconsole.innerHTML = "";
                cmdbox.value = "";
                return;
            }
            dkconsole.log("RUN Javascript -> " + cmdbox.value);

            try {
                eval(cmdbox.value);
            } catch (x) {
                dkconsole.log(x.stack);
            }

            cmdbox.value = "";
        }
    }
    dkconsoleFrame.appendChild(cmdbox);

    /////////////////////////////////////
    dkconsole.log = function(text, color) {
        var newText = document.createElement("a");
        newText.className = "dkconsole";
        newText.innerHTML = text + "<br>";
        if (color !== undefined) {
            newText.style.color = color;
        } else {//newText.style.color = "white"; //default anyway?
        }
        dkconsole.appendChild(newText);
        dkconsole.scrollTop = dkconsole.scrollHeight;
        //console.log(text); //mirror message to the console as well.
    }

    ////////////////////////////////
    dkconsole.debug = function(text) {
        //dkconsole.log("DEBUG: "+LastCall(3)+":  "+text, "orange");
        dkconsole.log("DEBUG: " + text, "orange");
    }

    ////////////////////////////////
    dkconsole.error = function(text) {
        if (!text) {
            text = "";
        }
        dkconsole.log("ERROR: " + LastCall(3) + ":  " + text, "red");
    }

    ///////////////////////////////
    dkconsole.warn = function(text) {
        dkconsole.log(text, "yelow");
    }

    /////////////////////////////////////
    dkconsole.add = function(text, color) {
        var newText = document.createElement("a");
        var lastText = dkconsole.lastElementChild;
        newText.className = "dkconsole";
        lastText.innerHTML = lastText.innerHTML.slice(0, -4);
        newText.innerHTML = text + "<br>";
        if (color !== undefined) {
            newText.style.color = color;
        } else {//newText.style.color = "white";
        }
        dkconsole.appendChild(newText);
    }

    return dkconsole;
}
