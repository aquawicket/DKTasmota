//////////////////////////////
function PHP_GetTime(callback) {
    CallPhpFunc(arguments);
}

/////////////////////////////////////////////////////
function PHP_StringToFile(file, data, mode, callback) {
    CallPhpFunc(arguments);
}

function noCB(rVal) {}

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
    let url = "/DK.php?" + data;
    DKSendRequest(url, function(success, url, rVal) {
        if (args && typeof (args[args.length - 1]) === "function") {
            args[args.length - 1](rVal);
        } else {//console.log(rVal);
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
