
function DKDEBUG() {
	// DKDEBUG should be a function you can put anywhere.
	// It should give you options of a stack trace, last function and variable values
	
	
    //dkConsole.log(console.trace());
    /*
	var args = "";
    var count = 0;
    for (let val of DKDEBUG.caller.arguments) {
        args = args + val;
        if (count < DKDEBUG.caller.arguments.length - 1) {
            args += ", "
        }
        count++;
    }
	*/
	
    //dkConsole.log(":DEBUG:", "orange");
    //dkConsole.log(DKDEBUG.caller.name + "(" + args + ")", "orange");
    //dkConsole.log(DKDEBUG.caller.arguments.callee, "orange");
}

////////////////////////////////////////////////////////////////////////
function CreateDebugBox(parent, top, bottom, left, right, width, height) {
    var debugDiv = document.createElement("div");
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
