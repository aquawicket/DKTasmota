"use strict";
let DEBUG = 0;

//A Convienient Debug Button Function
/////////////////////////////
const showDebugButton = 1;
function DebugButtonOnClick() {
    PHP_StringToFile("test.txt", "Appended string\n", "FILE_APPEND", PHP_return);
    PHP_GetTime(PHP_return);
}

function PHP_return(rVal)
{
    console.log(rVal);
}

function PHP_GetTime()
{
    CallPhpFunc();
}

/////////////////////////////////////////////////////
function PHP_StringToFile(file, data, mode, callback) {
    CallPhpFunc(arguments);
}

function CallPhpFunc(args) {
    let funcName = GetCurrentFunctionName(1).replace("PHP_", "");
    let jsonData = {
        func: funcName,
        args: []
    };
    for (let n = 0; args && n < args.length; n++) {
        if (typeof (args[n]) === "function") {
            continue;
        }
        let newArg = new Object;
        newArg[typeof (args[n])] = args[n];
        jsonData.args.push(newArg);
    }
    //console.log(JSON.stringify(jsonData));
    let data = "x=" + encodeURIComponent(JSON.stringify(jsonData));
    let url = "http://192.168.1.78:8000/DK.php?" + data;
    DKSendRequest(url, function(success, url, data) {
        if (args && typeof (args[args.length - 1]) === "function") {
            args[args.length - 1](data);
        }
        else{
            PHP_return(data);
        }
    });
}

/*
///////////////////////////////////////
function CallPhpFunction(str, callback) {
    let func = str.split("(").shift();
    str = str.replace(func, "");
    str = str.replace("(", "");
    str = str.replace(")", "");
    let arg = str.split(",");
    let jsonData = {
        func: func,
        args: []
    };
    for (let n = 0; n < arg.length; n++) {
        arg[n] = arg[n].trim();
        let newArg = new Object;
        newArg[typeof (arg[n])] = arg[n];
        jsonData.args.push(newArg);
    }
    let data = "x=" + encodeURIComponent(JSON.stringify(jsonData));
    let url = "http://192.168.1.78:8000/DK.php?" + data;
    DKSendRequest(url, function(success, url, data) {
        callback(data);
    });
}
*/

function CreateDebugBox(parent, id, top, bottom, left, right, width, height) {
    let debugDiv = document.createElement("div");
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

function CreateDebugButton(parent, id, top, bottom, left, right, width, height) {
    if (!showDebugButton) {
        return;
    }
    let debugButton = document.createElement("button");
    debugButton.innerHTML = "DEBUG";
    debugButton.style.position = "absolute";
    debugButton.style.top = top;
    debugButton.style.bottom = bottom;
    debugButton.style.left = left;
    debugButton.style.right = right;
    debugButton.style.width = width;
    debugButton.style.height = height;
    debugButton.onclick = function() {
        DebugButtonOnClick();
    }
    ;
    parent.appendChild(debugButton);
    return debugButton;
}

////////////////////////////////
function TestStackTrace(a, b, c) {

    DKSendRequest("DKFile.php", function() {
        dkconsole.debug("finnished writing the file");
    });

    //dkconsole.trace();

    //let e = new Error();
    //throw e;
}
