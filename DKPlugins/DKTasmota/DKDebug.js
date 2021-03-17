"use strict";

//A Convienient Debug Button Function
const showDebugButton = 1;
function DebugButtonOnClick() {
    PHP_StringToFile("test.txt", "Appended string\n", "FILE_APPEND", function(rVal) {
        dkconsole.log("characters written: " + rVal);
    });
    PHP_GetTime(function(rVal) {
        dkconsole.log(rVal);
    });
}

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
        Debug2();
    }
    parent.appendChild(debugButton);
    return debugButton;
}

function Debug2() {


    let keyName = 'lastName'
    let obj = {
        firstName: 'allan',
        lastName: 'smith'
    }
    FindObject(obj, keyName, "smith");
    let keyName2 = 'ip';
    FindObject(devices, keyName2, "test");

    let breakpoint = 0;
/*
    Throw(e);
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
