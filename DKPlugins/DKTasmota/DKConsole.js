"use strict";
// https://developer.mozilla.org/en-US/docs/Web/API/console

(function() {
    var log = console.log;
    var info = console.info;
    var debug = console.debug;
    var warn = console.warn;
    var error = console.error;
    var trace = console.trace;
    var assert = console.assert;
    var group = console.group;
    console.log = function() {
        //dkconsole.log(JSON.stringify(arguments));
        dkconsole.log.apply(this, Array.prototype.slice.call(arguments));
        log.apply(this, Array.prototype.slice.call(arguments));
    }
    console.info = function() {
        //dkconsole.info(JSON.stringify(arguments));
        dkconsole.info.apply(this, Array.prototype.slice.call(arguments));
        info.apply(this, Array.prototype.slice.call(arguments)); //call origial
    }
    console.debug = function() {
        //dkconsole.debug(JSON.stringify(arguments));
        dkconsole.debug.apply(this, Array.prototype.slice.call(arguments));
        debug.apply(this, Array.prototype.slice.call(arguments)); //call origial
    }
    console.warn = function() {
        //dkconsole.warn(JSON.stringify(arguments));
        dkconsole.warn.apply(this, Array.prototype.slice.call(arguments));
        warn.apply(this, Array.prototype.slice.call(arguments)); //call origial
    }
    console.error = function() {
        //dkconsole.error(JSON.stringify(arguments));
        dkconsole.error.apply(this, Array.prototype.slice.call(arguments));
        error.apply(this, Array.prototype.slice.call(arguments)); //call origial
    }
    console.trace = function() {
        //dkconsole.trace(JSON.stringify(arguments));
        dkconsole.trace.apply(this, Array.prototype.slice.call(arguments));
        //trace.apply(this, Array.prototype.slice.call(arguments)); //call origial
    }
    console.assert = function() {
        //dkconsole.assert(JSON.stringify(arguments));
        dkconsole.assert.apply(this, Array.prototype.slice.call(arguments));
        //assert.apply(this, Array.prototype.slice.call(arguments)); //call origial
    }
    console.group = function() {
        //dkconsole.group(JSON.stringify(arguments));
        dkconsole.group.apply(this, Array.prototype.slice.call(arguments));
        //group.apply(this, Array.prototype.slice.call(arguments)); //call origial
    }
}());

//https://stackoverflow.com/a/49560222/688352
window.onerror = function(msg, url, lineNo, columnNo, error) {
    dkconsole.error(msg + "," + url + "," + lineNo + "," + columnNo + "," + error);
    return false;
}

var dkconsole;

/////////////////////////////////////////////////////////////////////////////
function CreateDKConsole(parent, id, top, bottom, left, right, width, height) {
    DKLoadCSSFile("dkconsole.css");
    var dkconsoleFrame = document.createElement("div");
    dkconsoleFrame.style.padding = "0px";
    dkconsoleFrame.style.margin = "0px";
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
    dkconsole.style.padding = "0px";
    dkconsole.style.backgroundColor = "rgb(36,36,36)";
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
            dkconsole.debug("RUN Javascript -> " + cmdbox.value);

            try {
                eval(cmdbox.value);
            } catch (x) {
                dkconsole.error(x.stack);
            }

            cmdbox.value = "";
        }
    }
    dkconsoleFrame.appendChild(cmdbox);

    /////////////////////////////////////////
    dkconsole.message = function(msg, style) {
        var msgDiv = document.createElement("div");
        msgDiv.style.width = "100%";
        msgDiv.style.fontSize = "12px";
        msgDiv.style.fontFamily = "Consolas, Lucinda, Console, Courier New, monospace";
        msgDiv.style.whiteSpace = "pre-wrap";
        msgDiv.style.boxSizing = "border-box";
        msgDiv.style.padding = "3px";
        msgDiv.style.paddingLeft = "20px";
        msgDiv.style.borderStyle = "solid";
        msgDiv.style.borderWidth = "1px";
        msgDiv.style.borderTopWidth = "0px";
        
        var msgText = document.createElement("span");
        msgText.className = "dkconsole";
        msgText.innerHTML = msg;

        if(style === "error"){
            msgText.style.color = "rgb(255,128,128)";
            msgDiv.style.backgroundColor = "rgb(41,0,0)";
            msgDiv.style.borderColor = "rgb(92,0,0)";
        }
        else if(style === "warn"){
            msgText.style.color = "rgb(255,221,158)";
            msgDiv.style.backgroundColor = "rgb(51,43,0)";
            msgDiv.style.borderColor = "rgb(102,85,0)";
        }
        else if(style === "debug"){
            msgText.style.color = "rgb(77,136,255)";
            msgDiv.style.backgroundColor = "rgb(36,36,36)";
            msgDiv.style.borderColor = "rgb(58,58,58)";
        }
        else if(style === "green"){
            msgText.style.color = "rgb(128,255,128)";
            msgDiv.style.backgroundColor = "rgb(0,41,0)";
            msgDiv.style.borderColor = "rgb(0,92,0)";
        }
        else{
            msgText.style.color = "rgb(213,213,213)";
            msgDiv.style.backgroundColor = "rgb(36,36,36)";
            msgDiv.style.borderColor = "rgb(58,58,58)";
        }

        dkconsole.appendChild(msgDiv);
        msgDiv.appendChild(msgText);
        dkconsole.scrollTop = dkconsole.scrollHeight;
    }
    
    /////////////////////////////
    dkconsole.log = function(str) {
        dkconsole.message(str, "log");
    }

    //////////////////////////////
    dkconsole.info = function(str) {
        dkconsole.message(str, "info");
    }

    ///////////////////////////////
    dkconsole.debug = function(str) {
        dkconsole.message(str, "debug");
    }

    //////////////////////////////
    dkconsole.warn = function(str) {
        dkconsole.message(str, "warn");
    }

    ////////////////////////////////////////////////////
    dkconsole.error = function(str) {
        dkconsole.message(str, "error");
    }

    ///////////////////////////////
    dkconsole.group = function(str) {
        dkconsole.message(str);
    }

    ///////////////////////////////
    dkconsole.trace = function(str) {
        dkconsole.message(str, "warn");
    }

    //TODO: merge this into doconsole.massage
    ////////////////////////////////////
    /*
    dkconsole.add = function(str, style) {
        var newText = document.createElement("a");
        var lastText = dkconsole.lastElementChild;
        newText.className = "dkconsole";
        lastText.innerHTML = lastText.innerHTML.slice(0, -4);
        newText.innerHTML = str;
        if (color !== undefined) {
            newText.style.color = color;
        } else {
            newText.style.color = "rgb(213,213,213)";
        }
        dkconsole.appendChild(newText);
    }
    */

    return dkconsole;
}
