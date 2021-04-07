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
        //dkconsole.error("GET <a href=' " + url + " ' target='_blank' style='color:rgb(213,213,213)'>" + url + "</a> onerror");
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
                callback(false, url, event.type);
                return false;
            }
        }
    }
    xhr.ontimeout = function(event) {
        //dkconsole.error("GET <a href=' " + url + " ' target='_blank' style='color:rgb(213,213,213)'>" + url + "</a> net::ERR_CONNECTION_TIMED_OUT");
        callback(false, url, event.type);
        return false;
    }

    xhr.send();
}

function DKSaveToLocalStorage(name, string) {
    if (!name) {
        return;
    }
    localStorage.setItem(name, string);
}

function DKLoadFromLocalStorage(name) {
    if (!name) {
        return;
    }
    return localStorage.getItem(name);
}

function DKRemoveFromLocalStorage(name) {
    localStorage.removeItem(name);
}

function DKCreateButton(parent, id, top, left, width, height, onclick) {
    const button = document.createElement("button");
    button.id = id;
    button.innerHTML = id;
    //button.style.zIndex = "2";
    button.style.position = "absolute";
    button.style.top = top;
    button.style.left = left;
    button.style.height = height;
    if (width) {
        button.style.width = width;
    }
    button.style.padding = "0px";
    button.style.cursor = "pointer";
    button.onclick = onclick;
    parent.appendChild(button);
    return button;
}

/*
function DKConfirm(msg, callback) {
    const confirm = DKCreateWindow("DKConfirm", "200px", "100px");
    confirm.style.textAlign = "center";
    confirm.style.paddingTop = "20px";
    const message = document.createElement("span");
    message.innerHTML = msg;
    confirm.appendChild(message);
    const no = DKCreateButton(confirm, "No", "50px", "75px", "", "", function() {
        document.body.removeChild(confirm);
    });
    const yes = DKCreateButton(confirm, "Yes", "50px", "105px", "", "", function() {
        callback && callback();
        document.body.removeChild(confirm);
    });
}
*/

function DKIsOnline() {
    if (navigator.onLine)
        return true;
    else
        return false;
}

//TODO  //https://github.com/juggle/resize-observer
//TODO:  make this a CustomEvent
//https://stackoverflow.com/a/48718956/688352
function DKAddResizeHandler(element, callback) {
    var observer = new MutationObserver(function(mutations) {
        callback && callback();
    }
    );
    observer.observe(element, {
        attributes: true
    });
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
}
;
