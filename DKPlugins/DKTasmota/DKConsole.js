// https://developer.mozilla.org/en-US/docs/Web/API/console

//var dkConsole = new Object;
/////////////////////////////////////////////////////////////////////////////
function CreateDKConsole(parent, id, top, bottom, left, right, width, height) {
    DKLoadCSSFile("DKConsole.css");
    var dkConsoleFrame = document.createElement("div");
    dkConsoleFrame.id = id;
    dkConsoleFrame.style.position = "absolute";
    dkConsoleFrame.style.top = top;
    dkConsoleFrame.style.bottom = bottom;
    dkConsoleFrame.style.left = left;
    dkConsoleFrame.style.right = right;
    dkConsoleFrame.style.width = width;
    dkConsoleFrame.style.height = height;
    parent.appendChild(dkConsoleFrame);

    dkConsole = document.createElement("div");
    dkConsole.className = "DKConsole";
    dkConsole.style.position = "absolute";
    dkConsole.style.backgroundColor = "black";
    dkConsole.style.color = "white";
    dkConsole.style.fontColor = "white";
    dkConsole.style.top = "0px";
    dkConsole.style.bottom = "20px";
    dkConsole.style.left = "0px";
    dkConsole.style.right = "0px";
    //dkConsole.style.width = "";
    //dkConsole.style.height = "";
    dkConsole.style.visibility = "visible";
    dkConsole.style.overflow = "auto";
    dkConsoleFrame.appendChild(dkConsole);

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
                dkConsole.innerHTML = "";
                cmdbox.value = "";
                return;
            }
            dkConsole.log("RUN Javascript -> " + cmdbox.value);
            eval(cmdbox.value);
            cmdbox.value = "";
        }
    }
    dkConsoleFrame.appendChild(cmdbox);

    /////////////////////////////////////
    dkConsole.log = function(text, color) {
        var newText = document.createElement("a");
        newText.className = "DKConsole";
        newText.innerHTML = text + "<br>";
        if (color !== undefined) {
            newText.style.color = color;
        } else {//newText.style.color = "white"; //default anyway?
        }
        dkConsole.appendChild(newText);
        dkConsole.scrollTop = dkConsole.scrollHeight;
        //console.log(text); //mirror message to the console as well.
    }

    ////////////////////////////////
    dkConsole.debug = function(text) {
        dkConsole.log(text, "orange");
    }

    ////////////////////////////////
    dkConsole.error = function(text) {
        dkConsole.log(text, "red");
    }

    ///////////////////////////////
    dkConsole.warn = function(text) {
        dkConsole.log(text, "yelow");
    }

    /////////////////////////////////////
    dkConsole.add = function(text, color) {
        var newText = document.createElement("a");
        var lastText = dkConsole.lastElementChild;
        newText.className = "DKConsole";
        lastText.innerHTML = lastText.innerHTML.slice(0, -4);
        newText.innerHTML = text + "<br>";
        if (color !== undefined) {
            newText.style.color = color;
        } else {//newText.style.color = "white";
        }
        dkConsole.appendChild(newText);
    }

    return dkConsole;
}
