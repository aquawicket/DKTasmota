"use strict";

///////////////////
function isStrict() {
    if (eval("var __temp = null"),
    (typeof __temp === "undefined")) {
        return true;
    }
    return false;
}

///////////////////
function GetStack() {
    var e = new Error();
    if (!e.stack)
        try {
            // old browsers need the Error thrown to fill the stack
            throw e;
        } catch (e) {
            if (!e.stack) {
                return 0;
                // browser too old
            }
        }
    return e.stack;
}

///////////////////////////
function StackToJSON(stack) {
    var stackLines = stack.toString().split(/\r\n|\n/);
    var msg = stackLines[0];
    var json = [{
        msg
    }];
    for (var s = 1; s < stackLines.length; s++) {
        var line = stackLines[s].trim();
        line = line.replace("at ", "");
        line = line.replace("(", "");
        line = line.replace(")", "");

        var func = line.split(" ").shift();
        line = line.replace(func, "");

        var charNum = line.split(":").pop();
        line = line.replace(":" + charNum, "");

        var lineNum = line.split(":").pop();
        line = line.replace(":" + lineNum, "");

        var file = line.split("/").pop();

        var filePath = line.trim();
        json.push({
            func,
            file,
            lineNum,
            charNum,
            filePath
        });
    }
    return json;
}

////////////////////////
function LastStackCall() {
    var stack = StackToJSON(GetStack());
    var n;
    for (var s = 1; s < stack.length; s++) {
        if (stack[s].func === "LastCall") {
            n = s + 1;
            break;
        }
    }
    if (!n) {
        dkconsole.error("LastCall(): could not find 'LastCall' in the stack");
        return;
    }

    var str = "  at " + stack[n].func + " ";
    str += "(<a href='" + stack[n].filePath + ":" + stack[n].lineNum + "' style='color:rgb(213,213,213)'>" + stack[n].file + ":" + stack[n].lineNum + "</a>)<br>";
    return str;
}

/////////////////////////////////////////
function GetArguments(func, getArgValues) {
    var argsString = "";
    var count = 0;
    var fn = window[func];
    if (!fn) {
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
