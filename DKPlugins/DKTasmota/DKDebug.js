"use strict";
let DEBUG = 0;

//A Convienient Debug Button Function
/////////////////////////////
const showDebugButton = 1;
function DebugButtonOnClick() {
    PHP_StringToFile("test.txt", "Appended string\n", "FILE_APPEND", function(rVal){
        console.log("characters written: "+rVal);
    });
    PHP_GetTime(function(rVal){
        console.log(rVal);
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
