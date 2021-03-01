//"use strict";
var DEBUG = 1;
//function DKDEBUG() {// DKDEBUG should be a function you can put anywhere.
// It should give you options of a stack trace, last function and variable values

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

///////////////////
function isStrict() {
    var x = true;
    eval("var x=false");
    return x;
}

////////////////////////////////
function GetArguments(func)
{
     var argsString = "";
     var count = 0;;
     var fn = window[func]
     if(!fn){
        dkconsole.error("GetArguments("+func+"): fn invalid");
        return ""; 
     }
     argsString += new RegExp('(?:'+fn.name+'\\s*|^)\\s*\\((.*?)\\)').exec(fn.toString().replace(/\n/g, ''))[1].replace(/\/\*.*?\*\//g, '').replace(/ /g, '');
     if(isStrict()){ return argsString; }
     if(!fn.arguments){ return argsString; }
     var args = argsString.split(",");
     for (let val of fn.arguments) {
        if (count > 0) {
            args[count] = " "+args[count];
        }
        args[count] += " = "+val;
        count++;
    }
    argsString = args.toString();
    return argsString;
}

///////////////////
function GetStack() {
    var e = new Error();
    if (!e.stack)
        try {
            // IE requires the Error to actually be throw or else the Error's 'stack'
            // property is undefined.
            throw e;
        } catch (e) {
            if (!e.stack) {
                return 0;
                // IE < 10, likely
            }
        }
    var stack = e.stack.toString().split(/\r\n|\n/);
    return stack;
}

/////////////////////
function StackTrace() {
    dkconsole.log("***** STACK TRACE *****", "orange");
    var stack = GetStack();
    stack.shift();
    var files = [];

    for (var s = 0; s < stack.length; s++) {
       
        var stackString = stack[s].trim();
        stackString = stackString.replace("at ","");
        stackString = stackString.replace("(","");
        stackString = stackString.replace(")","");
       
        var func = stackString.split(" ").shift();
        stackString = stackString.replace(func,"");

        var charNum = stackString.split(":").pop();
        stackString = stackString.replace(":"+charNum,"");

        var lineNum = stackString.split(":").pop();
        stackString = stackString.replace(":"+lineNum,"");
    
        var file = stackString.split("/").pop();
        
        var args = GetArguments(func);
        dkconsole.log(file+" "+lineNum+" "+func+"("+args+")", "orange");
    }
}

function TestStackTrace(a, b, c)
{
    StackTrace();

    /*
    var func = TestStackTrace;
    while(func){
        dkconsole.log(func.name);
        for (let val of func.arguments) {
            dkconsole.log(val);
            if(typeof val === 'object' && val !== null){
                dkconsole.log(val.type)
            }
        }
    
        func = func.caller;
    }
    */
}