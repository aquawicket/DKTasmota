"use strict";

function DKLoadCSSFile(file) {
    let head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
    link.id = file;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = file;
    link.media = 'all';
    head.appendChild(link);
}

function DKLoadJSFile(file, callback) {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.id = file;
    script.src = file;
    head.appendChild(script);
    script.onload = callback;
}

function DKLoadHtmlFile(file, callback) {
    DKSendRequest(file, function DKSendRequestCallback(success, url, data) {
        if (!success) {
            dkconsole.error("!success");
        }
        callback && callback(data);
    });
}

function DKSendSuperRequest(url, callback) {
    superagent.get(url).timeout({
        response: 18000,
        // Wait 18 seconds for the server to start sending,
        deadline: 20000,
        // but allow 20 seconds for the file to finish loading.
    }).then(function DKSendSuperRequestSuccessCallback(res) {
        callback(true, res);
    }, function DKSendSuperRequestFailCallback(res) {
        callback(false, res);
    });
}

function DKSendRequest(url, callback) {
    if (!url) {
        dkconsole.error(LastStackCall() + " url invalid");
    }
    if (callback.length < 3) {
        dkconsole.error(LastStackCall() + " callback requires 3 arguments");
    }
    let xhr = "";
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {}
    try {
        xhr = new ActiveXObject("Msxml3.XMLHTTP");
    } catch (e) {}
    try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}

    if (!xhr) {
        dkconsole.error("DKSendRequest(" + url + "): Error creating xhr object");
        return false;
    }

    xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                callback(true, url, xhr.responseText);
            } else {
                /*
                dkconsole.log("xhr.readyState: "+xhr.readyState);
                dkconsole.log("xhr.status: "+xhr.status);
                dkconsole.log("xhr.response: "+xhr.response);
                dkconsole.log("xhr.responseText: "+xhr.responseText);
                */
                //dkconsole.error(StackToConsoleString());
                return false;
             }
        }
    }

    xhr.open("GET", url, true);
    xhr.timeout = 20000;

    xhr.onabort = function(event){
        dkconsole.error(event.type);
        callback(false, url, event.type);
        return false;
    }
    xhr.ontimeout = function(event){
        let errorType = "Error";
        if(event.type == "timeout"){
            errorType = "net::ERR_CONNECTION_TIMED_OUT";
        }
        dkconsole.error("GET <a href=' "+ url +" ' target='_blank' style='color:rgb(213,213,213)'>"+url+"</a> "+errorType);
        callback(false, url, event.type);
        return false;
    };
    xhr.onerror = function(event){
        let errorType = "Error";
        if(event.type == "timeout"){
            errorType = "net::ERR_CONNECTION_TIMED_OUT";
        }
        dkconsole.error("GET <a href=' "+ url +" ' target='_blank' style='color:rgb(213,213,213)'>"+url+"</a> "+errorType);
        callback(false, url, event.type);
        return false;
    };

    try {
        xhr.send();
    }catch(e){
        dkconsole.log("Catching errors from send in async doesn't work");
        dkconsole.error(StackToConsoleString(e.stack));
    }
}

/////////////////////////////////////////
function SaveToLocalStorage(name, string) {
    if (!name || !string) {
        return;
    }
    localStorage.setItem(name, string);
}

///////////////////////////////////
function LoadFromLocalStorage(name) {
    if (!name) {
        return;
    }
    return localStorage.getItem(name);
}

//////////////////////////////
function CenterWindow(element) {
    let winW = window.innerWidth;
    let winH = window.innerHeight;
    let eleW = element.width;
    let eleH = element.height;
    let eleX = (winW / 2) - (eleW / 2);
    let eleY = (winH / 2) - (eleH / 2);
    element.style.left = eleX + "px";
    element.style.top = eleY + "px";
    return debugDiv;
}
