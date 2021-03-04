"use strict";
let DEBUG = 0;

////////////////////////////////////////////////////////////////////////
function CreateDebugBox(parent, top, bottom, left, right, width, height) {
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

// Call TestStackTrace("moe", "larry", "curly"); to test
////////////////////////////////
function TestStackTrace(a, b, c) {
    let stack = StackToJSON(GetStack());
    dkconsole.log(JSON.stringify(stack));

    //Try to catch an error
    let e = new Error();
    throw e;
}
