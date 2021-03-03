"use strict";

//https://stackoverflow.com/a/9337047/688352
function IsValidVarName(name) {
    try {
        Function('var ' + var_name);
    } catch (e) {
        return false;
    }
    return true;
}

function IsValidCallStack(stack){
    //TODO
}

function IsValidEmail(email){
    //TODO
}