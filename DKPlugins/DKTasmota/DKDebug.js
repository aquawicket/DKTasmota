"use strict";
var DEBUG = 0;

////////////////////////////////////////////////////////////////////////
function CreateDebugBox(parent, top, bottom, left, right, width, height) {
    var debugDiv = document.createElement("div");
    debugDiv.style.position = "absolute";
    debugDiv.style.backgroundColor = "Grey";
    debugDiv.style.top = top;
    debugDiv.style.bottom = bottom;
    debugDiv.style.left = left;
    debugDiv.style.right = right;
    debugDiv.style.width = width;
    debugDiv.style.height = height;
    parent.appendChild(debugDiv);
    return debugDiv;
}

///////////////////
function isStrict() {
    if (eval("var __temp = null"),
    (typeof __temp === "undefined")) {
        return true;
    }
    return false;
}

/////////////////////////////////////////
function GetArguments(func, getArgValues) {
    var argsString = "";
    var count = 0;
    var fn = window[func];
    if (!fn) {
        //don't call dkconsole.error from here, infinate loop
        dkconsole.error(`ERROR: DKDebug.js:35 GetArguments(${func}): fn invalid`);
        return "";
    }
    argsString += new RegExp('(?:' + fn.name + '\\s*|^)\\s*\\((.*?)\\)').exec(fn.toString().replace(/\n/g, ''))[1].replace(/\/\*.*?\*\//g, '').replace(/ /g, '');
    if (isStrict()) {
        return argsString;
    }

    if (!getArgValues) {
        return argsString;
    }
    if (!fn.arguments) {
        return argsString;
    }
    var args = argsString.split(",");
    for (let val of fn.arguments) {
        if (count > 0) {
            args[count] = " " + args[count];
        }
        args[count] += " = " + val;
        count++;
    }
    argsString = args.toString();
    return argsString;
}

///////////////////
function GetStack() {
    var e = new Error();
    if (!e.stack)
        try {
            // IE requires the Error to actually be throw or else the Error's 'stack'
            // property is undefined.
            throw e;
        } catch (e) {
            if (!e.stack) {
                return 0;
                // IE < 10, likely
            }
        }
    var stack = e.stack.toString().split(/\r\n|\n/);
    return stack;
}

/////////////////////
function StackTrace() {
    dkconsole.warn("***** STACK TRACE *****");
    var stack = GetStack();
    for (var s = 3; s < stack.length; s++) {
        var stackString = stack[s].trim();
        stackString = stackString.replace("at ", "");
        stackString = stackString.replace("(", "");
        stackString = stackString.replace(")", "");

        var func = stackString.split(" ").shift();
        stackString = stackString.replace(func, "");

        var charNum = stackString.split(":").pop();
        stackString = stackString.replace(":" + charNum, "");

        var lineNum = stackString.split(":").pop();
        stackString = stackString.replace(":" + lineNum, "");

        var file = stackString.split("/").pop();

        var args = GetArguments(func);
        dkconsole.warn(file + ":" + lineNum + " " + func + "(" + args + ")");
    }
}

////////////////////////////
function LastCall(stackLine) {
    var stack = GetStack();
    stack.shift();

    for (var i = 0; i < stack.length; i++) {
        var stackString = stack[stackLine].trim();
        stackString = stackString.replace("at ", "");
        stackString = stackString.replace("(", "");
        stackString = stackString.replace(")", "");
        var func = stackString.split(" ").shift();
        if (func == "LastCall") {
            stackline = i + 1;
        }
    }

    if (!stackLine) {
        stackLine = 2;
    }
    var stackString = stack[stackLine].trim();
    stackString = stackString.replace("at ", "");
    stackString = stackString.replace("(", "");
    stackString = stackString.replace(")", "");

    var func = stackString.split(" ").shift();
    stackString = stackString.replace(func, "");

    var charNum = stackString.split(":").pop();
    stackString = stackString.replace(":" + charNum, "");

    var lineNum = stackString.split(":").pop();
    stackString = stackString.replace(":" + lineNum, "");

    var file = stackString.split("/").pop();

    var args = GetArguments(func);
    var line = file + ":" + lineNum + " " + func + "(" + args + ")";
    return line;
}

////////////////////////////////
function TestStackTrace(a, b, c) {

    if (DEBUG) {
        StackTrace();
        console.log("█console.log");
        console.info("█console.info");
        console.debug("█console.debug");
        console.warn("█console.warn");
        console.error("█console.error");
        //console.trace("█console.trace");
        //console.group("█console.group");

        var e = new Error();
        throw e;
    }
}
