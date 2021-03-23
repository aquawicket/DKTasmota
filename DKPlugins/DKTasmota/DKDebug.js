"use strict";

//A Convienient Debug Button Function
const showDebugButton = 1;
function DebugButtonOnClick() {

    let resizableDiv = document.createElement("div");
    resizableDiv.style.width = "5px";
    resizableDiv.style.height = "5px";
    resizableDiv.style.resize = "both";
    resizableDiv.style.overflow = "auto";
    resizableDiv.style.border = "solid 2px blue";
    document.body.appendChild(resizableDiv);

    DKAddResizeHandler(resizableDiv, function(){
        dkconsole.info("resized: x:"+resizableDiv.style.width+" y:"+resizableDiv.style.height);
    });


//TODO  //https://github.com/juggle/resize-observer 
//https://stackoverflow.com/a/48718956/688352
function DKAddResizeHandler(element, callback){
    var observer = new MutationObserver(function(mutations){
        callback && callback();
    });
    observer.observe(element, { attributes: true  });
}









    /*
    //Update time on all devices
    let dateInMilliseconds = GetDateInMilliseconds();
    for (let n = 0; n < devices.length; n++) {
        let cmnd = "timezone -7";
        let url = "http://" + devices[n].ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
        DKSendRequest(url, function(success, url, data) {//console.log("DKSendRequest("+success+","+url+","+data+")");
        });

        cmnd = "time 4 " + dateInMilliseconds;
        url = "http://" + devices[n].ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
        DKSendRequest(url, function(success, url, data) {
            console.log("DKSendRequest(" + success + "," + url + "," + data + ")");
        });
    }
    */

    /*
    //Get time from all devices
    for (let n = 0; n < devices.length; n++) {
        let cmnd = "time";
        let url = "http://" + devices[n].ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
        DKSendRequest(url, function(success, url, data) {
            //console.log("DKSendRequest("+success+","+url+","+data+")");
            console.log("" + data + "");
        });
    }
    */

    //DKCreateWindow("testWindow", 300, 300);

    /*
    // Test DKConsole
    dkconsole.log("dkconsole.log Test");
    console.log("console.log Test");
    console_log("console_log Test");
    */

    /*
    //Test PHP functions
    PHP_StringToFile("test.txt", "Appended string\n", "FILE_APPEND", function(rVal) {
        dkconsole.log("characters written: " + rVal);
    });
    PHP_GetTime(function(rVal) {
        dkconsole.log(rVal);
    });
    */

    /*
    //FindObject() Test
    let keyName = 'lastName'
    let obj = {
        firstName: 'allan',
        lastName: 'smith'
    }
    FindObject(obj, keyName, "smith");
    let keyName2 = 'ip';
    FindObject(devices, keyName2, "test");
    */

    /*
    //Test only pushing new values to objects
    const data1 = {
        a: 1,
        b: 2,
        c: 3
    };
    const data2 = {
        a: 1,
        bb: 2,
        c: 3,
        e: "temp",
        f: null
    };

    let myData = [];
    const onDataReceived = function(input) {
        if (myData.length) {
            for (let value in input) {
                let skipUndefineds = (myData.length - 1);
                while (skipUndefineds && !myData[skipUndefineds][value]) {
                    skipUndefineds--;
                }
                if (myData[skipUndefineds][value] === input[value]) {
                    //This variable is the same value as it's last occurence, there is no need to store it"
                    //Let's just remove it before we save the object to save space"
                    delete input[value];
                }
            }
        }
        myData.push(input);
    }
    */
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
    debugButton.onclick = DebugButtonOnClick;
    parent.appendChild(debugButton);
    return debugButton;
}
