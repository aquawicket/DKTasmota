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

///////////////////////////
function StackToJSON(stack) {
    if(!stack || typeof stack !== "string"){
        console.error("StackToJSON(): stack invalid");
        return;
    }

    //FIXME: how do we validate, since stack is a string
    // it could potentially be anything. 

    //split the call stack lines into an array
    let lines = stack.toString().split(/\r\n|\n/);

    //The first line should be the call stack message
    let msg = lines[0];
    let json = [{
        msg
    }];
    for (let s = 1; s < lines.length; s++) {
        //FIXME: the original line should not be altered,
        //altering the line could mess up the extraction
        //if something is missing or out of place.
        let line = lines[s].trim();
        line = line.replace("at ", "");
        line = line.replace("(", "");
        line = line.replace(")", "");

        let func = line.split(" ").shift();
        
        // some stack lines don't have a function name
        if (IsValidVarName(func)) {
            //func = "<i>anonymous</i>";
        }
        else{
            line = line.replace(func, "");
        }

        
        

        let charNum = line.split(":").pop();
        line = line.replace(":" + charNum, "");

        let lineNum = line.split(":").pop();
        line = line.replace(":" + lineNum, "");

        let file = line.split("/").pop();

        let filePath = line.trim();
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
    let stack = StackToJSON(GetStack());
    let n;
    for (let s = 1; s < stack.length; s++) {
        if (stack[s].func === "LastStackCall") {
            n = s + 1;
            break;
        }
    }
    if (!n) {
        console.error("LastStackCall(): could not find 'LastStackCall' in the stack");
        return;
    }

    let str = "LastStackCall: "+stack[n].func;
    str += "(<a href='" + stack[n].filePath + "' target='_blank' style='color:rgb(213,213,213)'>" + stack[n].file + ":" + stack[n].lineNum + "</a>)";
    return str;
}

/////////////////////////////////////////
function GetArguments(func, getArgValues) {
    let argsString = "";
    let count = 0;
    let fn = window[func];
    if (!fn) {
        console.error(LastStackCall() + "<br>" + "  at if(!fn)");
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
