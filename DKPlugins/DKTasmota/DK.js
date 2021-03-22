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

function DKLoadImage(url) {
    var img = new Image();
    img.src = url;
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
        dkconsole.error("url invalid");
    }
    if (callback.length < 3) {
        dkconsole.error("callback requires 3 arguments");
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
        dkconsole.error("Error creating xhr object");
        return false;
    }

    xhr.open("GET", url, true);
    xhr.timeout = 20000;

    //Possible error codes
    //https://github.com/richardwilkes/cef/blob/master/cef/enums_gen.go
    xhr.onabort = function(event) {
        //console.log("XMLHttpRequest.onreadystatechange(" + event + ")");
        dkconsole.error("GET <a href=' " + url + " ' target='_blank' style='color:rgb(213,213,213)'>" + url + "</a> onabort");
        callback(false, url, event.type);
        return false;
    }
    xhr.onerror = function(event) {
        //console.log("XMLHttpRequest.onerror(" + event + ")");
        dkconsole.error("GET <a href=' " + url + " ' target='_blank' style='color:rgb(213,213,213)'>" + url + "</a> onerror");
        callback(false, url, event.type);
        return false;
    }
    xhr.onload = function(event) {//console.log("XMLHttpRequest.onload(" + event + ")");
    }
    xhr.onloadend = function(event) {//console.log("XMLHttpRequest.onloadend(" + event + ")");
    }
    xhr.onloadstart = function(event) {//console.log("XMLHttpRequest.onloadstart(" + event + ")");
    }
    xhr.onprogress = function(event) {//console.log("XMLHttpRequest.onprogress(" + event + ")");
    }
    xhr.onreadystatechange = function(event) {
        //console.log("XMLHttpRequest.onreadystatechange(" + event + ")");
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                callback(true, url, xhr.responseText);
            } else {
                //dkconsole.error("GET <a href=' " + url + " ' target='_blank' style='color:rgb(213,213,213)'>" + url + "</a> onreadystatechange");
                callback(false, url, event);
                return false;
            }
        }
    }
    xhr.ontimeout = function(event) {
        dkconsole.error("GET <a href=' " + url + " ' target='_blank' style='color:rgb(213,213,213)'>" + url + "</a> net::ERR_CONNECTION_TIMED_OUT");
        callback(false, url, event.type);
        return false;
    }

    xhr.send();
}

/////////////////////////////////////////
function SaveToLocalStorage(name, string) {
    if (!name) {
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

function RemoveFromLocalStorage(name) {
    localStorage.removeItem(name);
}

function DKCreateWindow(id, width, height) {
    let win = document.createElement('div');
    win.id = id;
    win.style.position = "absolute";
    //win.style.top = top;
    //win.style.bottom = bottom;
    //win.style.left = left;
    //win.style.right = right;
    win.style.width = width;
    win.style.height = height;
    win.style.overflow = "auto";
    win.setAttribute('border', '1');
    win.style.backgroundColor = "rgb(80,80,80)";
    win.style.borderColor = "rgb(58,58,58)";
    win.style.borderStyle = "solid";
    win.style.borderWidth = "1px";
    win.style.boxSizing = "border-box";
    document.body.appendChild(win);
    CenterWindow(win);

    let winClose = document.createElement('div');
    winClose.id = win.id + "Close";
    winClose.style.position = "absolute";
    winClose.style.right = "5px";
    winClose.style.top = "3px";
    winClose.innerHTML = "X";
    winClose.style.cursor = "pointer";
    winClose.onclick = function ScanDevicesOnclickCallback() {
        win.remove();
    }
    win.appendChild(winClose);
    return win;
}

//////////////////////////////
function CenterWindow(element) {
    let winW = window.innerWidth;
    let winH = window.innerHeight;
    let eleW = parseInt(element.style.width);
    let eleH = parseInt(element.style.height);
    let eleX = (winW / 2) - (eleW / 2);
    let eleY = (winH / 2) - (eleH / 2);
    element.style.left = eleX + "px";
    element.style.top = eleY + "px";
    return element;
}

function CreateButton(parent, id, top, left, witdh, height, onclick) {
    let button = document.createElement("button");
    button.id = id;
    button.innerHTML = "Button";
    //button.style.zIndex = "2";
    button.style.position = "absolute";
    button.style.top = top;
    button.style.left = left;
    button.style.height = height;
    button.style.width = width;
    button.style.padding = "0px";
    button.style.cursor = "pointer";
    button.onclick = onclick;
    parent.appendChild(button);
    return button;
}
