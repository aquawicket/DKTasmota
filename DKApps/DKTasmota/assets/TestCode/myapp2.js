"use strict";

//**************************************
// TODO: start xconsole early and keep a backup of all messages to give to dk.console later..
// TODO: Create an easy TODO list check off/alarm/reminder type Plugin   check calander?
//**************************************
const MyApp = function() {};
const myapp = new MyApp;

myapp.loadFiles = function myapp_loadFiles() {
    //If you initiate any values here, they may fail.
    //This function should only load files, and make declarations, Not initiate variable values or make assignments.
    //myapp.loadApp()) will be called after this loads everything. This gives a chance to load assets without using a million callbacks.

    dk.create("DK/DKPlugin.js");
    DKPlugin("DK/DKTrace.js");
    dk.create("DK/DKErrorHandler.js");
    dk.create("DK/DKPhp.js");
    dk.create("DK/DKJson.js");
    dk.create("DKFile/DKFile.js");
    dk.create("DKDebug/DKDebug.js");
    dk.create("DKGui/DKConsole.js");
    dk.create("DKGui/DKGui.js");
    dk.create("DKGui/DKFrame.js");
    dk.create("DKGui/DKMenu.js");
    dk.create("DKGui/DKMessageBox.js");
    dk.create("DKGui/DKDrag.js");
    dk.create("DKGui/DKResize.js");
    dk.create("DKGui/DKClipboard.js");
    dk.create("DKGui/DKTable.js");
    dk.create("DKDevTools/DKDevToolsButton.js");
    //dk.create("DKCodeMirror/DKCodeMirror.js");
}

myapp.loadApp = function myapp_loadApp() {
    dk.errorCatcher(myapp, "myapp");
    dk.errorhandler.create();
}

myapp.loadGui = function myapp_loadGui() {
    console.log("dk: "+dk);
    dk.console.create(document.body, "", "0rem", "0rem", "0rem", "100%", "25%");
    console.debug("**** Tasmota device manager 0.1b ****");
}

DUKTAPE && myapp.loadFiles();
DUKTAPE && myapp.loadGui();
