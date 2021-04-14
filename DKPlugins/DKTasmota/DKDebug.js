"use strict";

//A Convienient Debug Function
function DKDebug_Func() {
    console.log("DEBUG BUTTON");


    //throw new Error( 'No worries. Just testing...' );
    /*
    if(1){
        return error("testing errors");
    }
    */
    
    DKPhp_Call("Debug_Func", "one", "two", "three", function(rval){
        console.log(rval);
    });
    

    //HP_Debug_Func("one", "two", "three", function(rval) {
    //    console.log(rval);
    //});
    

    /*
    PHP_GetRemoteAddress(function(rval) {
        console.log(rval);
    });
    */

    /*
    const test = document.createElement("div");
    test.id = "test";
    test.style.width = "300rem";
    test.style.height = "300rem";
    test.style.backgroundColor = "rgb(0,0,0)";
    document.body.appendChild(test);
    DKFrame_Html("test");
    */

    //var result =  1+11+8*9+2/14*8-4;
    //console.log("it's "+result+" ...  computers never lie");

    /*
    DKGui_ConfirmBox("do this?", function(){
        console.log("confirm callback");
    });
    */

    /*
    const resizableDiv = document.createElement("div");
    resizableDiv.style.width = "5rem";
    resizableDiv.style.height = "5rem";
    resizableDiv.style.resize = "both";
    resizableDiv.style.overflow = "auto";
    resizableDiv.style.border = "solid 2rem blue";
    document.body.appendChild(resizableDiv);
    DKDrag_AddResizeHandler(resizableDiv, function(){
        console.info("resized: x:"+resizableDiv.style.width+" y:"+resizableDiv.style.height);
    });
    //only works on window object
    //resizableDiv.onresize = function() {
    //    console.info("resized: x:" + resizableDiv.style.width + " y:" + resizableDiv.style.height);
    //}
    */

    /*
    //Update time on all devices
    const dateInMilliseconds = GetDateInMilliseconds();
    for (let n = 0; n < devices.length; n++) {
        const cmnd = "timezone -7";
        const url = "http://" + devices[n].ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
        DK_SendRequest(url, function(success, url, data) {//console.log("DK_SendRequest("+success+","+url+","+data+")");
        });

        cmnd = "time 4 " + dateInMilliseconds;
        url = "http://" + devices[n].ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
        DK_SendRequest(url, function(success, url, data) {
            console.log("DK_SendRequest(" + success + "," + url + "," + data + ")");
        });
    }
    */

    /*
    //Get time from all devices
    for (let n = 0; n < devices.length; n++) {
        const cmnd = "time";
        const url = "http://" + devices[n].ip + "/cm?cmnd=" + encodeURIComponent(cmnd).replace(";", "%3B");
        DK_SendRequest(url, function(success, url, data) {
            //console.log("DK_SendRequest("+success+","+url+","+data+")");
            console.log("" + data + "");
        });
    }
    */

    //DKCreateFramedWindow("testWindow", 300, 300);

    /*
    // Test console
    console.log("console.log Test");
    console.log("console.log Test");
    console_log("console_log Test");
    */

    /*
    //Test PHP functions
    PHP_StringToFile("test.txt", "Appended string\n", "FILE_APPEND", function(rVal) {
        console.log("characters written: " + rVal);
    });
    PHP_GetTime(function(rVal) {
        console.log(rVal);
    });
    */

    /*
    //FindObject() Test
    const keyName = 'lastName'
    const obj = {
        firstName: 'allan',
        lastName: 'smith'
    }
    FindObject(obj, keyName, "smith");
    const keyName2 = 'ip';
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
