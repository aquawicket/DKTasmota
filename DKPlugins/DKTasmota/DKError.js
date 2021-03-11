"use strict";

window.onerror = function(msg, url, lineNo, columnNo, error) {
    if (!error) {
        return;
    }
    dkconsole.error(msg);
    return false;
}

//https://stackoverflow.com/a/49560222/688352
//https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
window.onunhandledrejection = function(event) {
    dkconsole.error(event);
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

    let str = stk[0].msg + "<br>";
    for (let s = 1; s < stk.length; s++) {
        str += "  at " + stk[s].func + " ";
        str += "(<a href='" + stk[s].filePath + "' target='_blank' style='color:rgb(213,213,213)'>" + stk[s].file + ":" + stk[s].lineNum + "</a>)<br>";
    }
    return str;
}

function isStrict() {
    if (eval("var __temp = null"),
    (typeof __temp === "undefined")) {
        return true;
    }
    return false;
}

function GetStack() {
    let e = new Error();
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
    //Remove the call to this function from the stack
    let lines = e.stack.split('\n');
    lines.splice(1, 1);
    let stack = lines.join('\n');

    return stack;
}

function StackToJSON(stack) {
    if (!stack || typeof stack !== "string") {
        dkconsole.error("StackToJSON(): invalid stack");
        return false;
    }

     //split the call stack lines into an array
    let lines = stack.toString().split(/\r\n|\n/);

    //The first line should be the call stack message
    let msg = lines[0];
    let jsonStack = [{
        msg
    }];
    for (let s = 1; s < lines.length; s++) {
        //FIXME: the original line should not be altered,
        //altering the line could mess up the extraction
        let line = lines[s].trim();
        line = line.replace("at ", "");
        line = line.replace("(", "");
        line = line.replace(")", "");

        let func = line.split(" ").shift();

        // some stack lines don't have a valid function name
        /*
        if (IsValidVarName(func)) {//func = "<i>anonymous</i>";
        } else {
            line = line.replace(func, "");
        }
        */

        let charNum = line.split(":").pop();
        line = line.replace(":" + charNum, "");

        let lineNum = line.split(":").pop();
        line = line.replace(":" + lineNum, "");

        let file = line.split("/").pop();

        let filePath = line.trim();
        jsonStack.push({
            func,
            file,
            lineNum,
            charNum,
            filePath
        });
    }
    return jsonStack;
}

function LastStackCall() {
    let stack = StackToJSON(GetStack());
    let n;
    for (let s = 1; s < stack.length; s++) {
        if (stack[s].func === "LastStackCall") {
            n = s + 1;
            break;
        }
    }
    if (!n) {
        dkconsole.error("LastStackCall(): could not find 'LastStackCall' in the stack");
        return;
    }

    let str = "LastStackCall: " + stack[n].func;
    str += "(<a href='" + stack[n].filePath + "' target='_blank' style='color:rgb(213,213,213)'>" + stack[n].file + ":" + stack[n].lineNum + "</a>)";
    return str;
}

function GetArguments(func, getArgValues) {
    let argsString = "";
    let count = 0;
    let fn = window[func];
    if (!fn) {
        dkconsole.error(LastStackCall() + "<br>" + "  at if(!fn)");
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
    let args = argsString.split(",");
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

function GetCurrentFunctionName(n) {
    return new Error().stack.split('\n')[2 + n].trim().split(" ")[1];
}
