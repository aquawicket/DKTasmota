//Requires DKError.js
"use strict";

// https://developer.mozilla.org/en-US/docs/Web/API/console
const consoleLimit = 100;
let dkconsole;

//intercept console with dkconsole
const console_log = console.log;
const console_info = console.info;
const console_debug = console.debug;
const console_warn = console.warn;
const console_error = console.error;
const console_trace = console.trace;
const console_assert = console.assert;
const console_group = console.group;
(function() {
    console.log = function() {
        dkconsole.log.apply(this, Array.prototype.slice.call(arguments));
        console_log.apply(this, Array.prototype.slice.call(arguments));
    }
    console.info = function() {
        dkconsole.info.apply(this, Array.prototype.slice.call(arguments));
        console_info.apply(this, Array.prototype.slice.call(arguments));
    }
    console.debug = function() {
        dkconsole.debug.apply(this, Array.prototype.slice.call(arguments));
        console_debug.apply(this, Array.prototype.slice.call(arguments));
    }
    console.warn = function() {
        dkconsole.warn.apply(this, Array.prototype.slice.call(arguments));
        console_warn.apply(this, Array.prototype.slice.call(arguments));
    }
    console.error = function() {
        dkconsole.error.apply(this, Array.prototype.slice.call(arguments));
        console_error.apply(this, Array.prototype.slice.call(arguments));
    }
    console.trace = function() {
        dkconsole.trace.apply(this, Array.prototype.slice.call(arguments));
        console_trace.apply(this, Array.prototype.slice.call(arguments));
    }
    console.assert = function() {
        dkconsole.assert.apply(this, Array.prototype.slice.call(arguments));
        console_assert.apply(this, Array.prototype.slice.call(arguments));
    }
    console.group = function() {
        dkconsole.group.apply(this, Array.prototype.slice.call(arguments));
        console_group.apply(this, Array.prototype.slice.call(arguments));
    }
}());

window.onerror = function(msg, url, lineNo, columnNo, error) {
    dkconsole.error(StackToConsoleString(error.stack));
    return false;
}

//https://stackoverflow.com/a/49560222/688352
//https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
window.onunhandledrejection = function(e) {
    dkconsole.error("Error: window.onunhandledrejection<br>  " + e.reason.message);
    return false;
}

function StackToConsoleString(stack) {
    let stk;
    if (!stack) {
        stk = StackToJSON(GetStack());
    } else {
        stk = StackToJSON(stack);
    }

    //Remove the call to this function from the stack
    for (let s = 1; s < stk.length; s++) {
        if (stk[s].func === "StackToConsoleString") {
            stk.splice(s, 1);
        }
    }

    let str = stk[0].msg+"<br>";
    for (let s = 1; s < stk.length; s++) {
        str += "  at " + stk[s].func + " ";
        str += "(<a href='" + stk[s].filePath + "' target='_blank' style='color:rgb(213,213,213)'>" + stk[s].file + ":" + stk[s].lineNum + "</a>)<br>";
    }
    return str;
}

function CreateDKConsole(parent, id, top, bottom, left, right, width, height) {
    DKLoadCSSFile("dkconsole.css");
    const dkconsoleFrame = document.createElement("div");
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
    const cmdbox = document.createElement("input");
    cmdbox.type = "text";
    cmdbox.style.position = "absolute";
    cmdbox.style.left = "0px";
    cmdbox.style.bottom = "0px";
    cmdbox.style.right = "0px";
    cmdbox.style.height = "20px";
    cmdbox.style.width = "100%";
    cmdbox.onkeydown = function cmdboxOnKeydownCallback(event) {
        const key = event.charCode || event.keyCode;
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

    dkconsole.message = function(msg, style) {
        const msgDiv = document.createElement("div");
        msgDiv.style.width = "100%";
        msgDiv.style.fontSize = "12px";
        msgDiv.style.fontFamily = "Consolas, Lucinda, Console, Courier New, monospace";
        msgDiv.style.whiteSpace = "pre-wrap";
        msgDiv.style.boxSizing = "border-box";
        msgDiv.style.padding = "2px";
        msgDiv.style.paddingLeft = "20px";
        msgDiv.style.borderStyle = "solid";
        msgDiv.style.borderWidth = "1px";
        msgDiv.style.borderTopWidth = "0px";

        const msgText = document.createElement("span");
        msgText.className = "dkconsole";
        msgText.innerHTML = msg;

        if (style === "red") {
            msgText.style.color = "rgb(255,128,128)";
            msgDiv.style.backgroundColor = "rgb(41,0,0)";
            msgDiv.style.borderColor = "rgb(92,0,0)";
        } else if (style === "yellow") {
            msgText.style.color = "rgb(255,221,158)";
            msgDiv.style.backgroundColor = "rgb(51,43,0)";
            msgDiv.style.borderColor = "rgb(102,85,0)";
        } else if (style === "blue") {
            msgText.style.color = "rgb(77,136,255)";
            msgDiv.style.backgroundColor = "rgb(36,36,36)";
            msgDiv.style.borderColor = "rgb(58,58,58)";
        } else if (style === "green") {
            msgText.style.color = "rgb(128,255,128)";
            msgDiv.style.backgroundColor = "rgb(0,41,0)";
            msgDiv.style.borderColor = "rgb(0,92,0)";
        } else {
            msgText.style.color = "rgb(213,213,213)";
            msgDiv.style.backgroundColor = "rgb(36,36,36)";
            msgDiv.style.borderColor = "rgb(58,58,58)";
        }

        dkconsole.appendChild(msgDiv);
        msgDiv.appendChild(msgText);
        dkconsole.scrollTop = dkconsole.scrollHeight;

        //Limit the number of lines to the dkconsole
        if (dkconsole.childElementCount > consoleLimit) {
            dkconsole.removeChild(dkconsole.firstChild);
        }
    }

    dkconsole.log = function(str) {
        dkconsole.message(str);
    }

    dkconsole.info = function(str) {
        dkconsole.message(str);
    }

    dkconsole.debug = function(str) {
        dkconsole.message(str, "blue");
    }

    dkconsole.warn = function(str) {
        dkconsole.message(str, "yellow");
    }

    dkconsole.error = function(str) {
        dkconsole.message(str, "red");
    }

    dkconsole.trace = function(inStr) {
        const outStr = StackToConsoleString();
        dkconsole.message(outStr, "yellow");
    }

    dkconsole.group = function(str) {
        dkconsole.message(str);
    }

    return dkconsole;
}
