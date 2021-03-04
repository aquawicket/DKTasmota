"use strict";
let DEBUG = 0;

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
    let debugButton = document.createElement("button");
    debugButton.innerHTML = "DEBUG";
    debugButton.style.position = "absolute";
    debugButton.style.top = top;
    debugButton.style.bottom = bottom;
    debugButton.style.left = left;
    debugButton.style.right = right;
    debugButton.style.width = width;
    debugButton.style.height = height;
    debugButton.onclick = function(){
        TestStackTrace("moe", "larry", "curly")
    };
    parent.appendChild(debugButton);
    return debugButton;
}

// Call TestStackTrace("moe", "larry", "curly"); to test
////////////////////////////////
function TestStackTrace(a, b, c) {
    let stack = StackToJSON(GetStack());
    dkconsole.log(JSON.stringify(stack));

    //Try to catch an error
    let e = new Error();
    throw e;
}
