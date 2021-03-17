"use strict";

//A Convienient Debug Button Function
const showDebugButton = 1;
function DebugButtonOnClick() {
    DKCreateWindow("testWindow", 300, 300);
    dkconsole.log("dkconsole.log Test");
    console.log("console.log Test");
    console_log("console_log Test");
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
