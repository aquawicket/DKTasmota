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
    const e = new Error();
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
    //The first line is the message followed by the call stack.
    //So we will remove the second line
    const lines = e.stack.split('\n');
    lines.splice(1, 1);
    const stack = lines.join('\n');

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
    const lines = stack.toString().split(/\r\n|\n/);

    //The first line should be the call stack message
    const msg = lines[0];
    const json = [{
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

        
        

        const charNum = line.split(":").pop();
        line = line.replace(":" + charNum, "");

        const lineNum = line.split(":").pop();
        line = line.replace(":" + lineNum, "");

        const file = line.split("/").pop();

        const filePath = line.trim();
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
    const stack = StackToJSON(GetStack());
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
    const fn = window[func];
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
    const args = argsString.split(",");
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
