"use strict";

function DKLoadCSSFile(file) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = file;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = file;
    link.media = 'all';
    head.appendChild(link);
}

function DKLoadJSFile(file, callback) {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
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

    xhr.onreadystatechange = function XMLHttpRequestReadystatechangeCallback() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                callback(true, url, xhr.responseText);
            } else {
                dkconsole.trace();
            }
        }
    }

    xhr.open("GET", url, true);
    xhr.timeout = 20000;
    xhr.addEventListener('timeout', function XMLHttpRequestTimeoutCallback(event) {
        callback(false, url, "DKSendRequest(" + url + ") -> Timed out");
    });
    xhr.addEventListener('error', function XMLHttpRequestErrorCallback(event) {
        callback(false, url, "DKSendRequest(" + url + ")-> ERROR");
    });
    xhr.send();
}

/////////////////////////////////////////
function SaveToLocalStorage(name, string) {
    localStorage.setItem(name, string);
}

///////////////////////////////////
function LoadFromLocalStorage(name) {
    return localStorage.getItem(name);
}

//////////////////////////////
function CenterWindow(element) {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const eleW = element.width;
    const eleH = element.height;
    const eleX = (winW / 2) - (eleW / 2);
    const eleY = (winH / 2) - (eleH / 2);
    element.style.left = eleX + "px";
    element.style.top = eleY + "px";
    return debugDiv;
}
