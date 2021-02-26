//////////////////////////////
DKLoadCSSFile = function(file) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = file;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = file;
    link.media = 'all';
    head.appendChild(link);
}

///////////////////////////////////////
DKLoadJSFile = function(file, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.id = file;
    script.src = file;
    head.appendChild(script);
    script.onload = callback;
}

/////////////////////////////////////////
DKLoadHtmlFile = function(file, callback) {
    DKSendRequest(file, function(success, url, data) {
        success && callback && callback(data);
        //TESTME
    });
}

////////////////////////////////////////////
DKSendSuperRequest = function(url, callback) {
    superagent.get(url).timeout({
        response: 18000,
        // Wait 18 seconds for the server to start sending,
        deadline: 20000,
        // but allow 20 seconds for the file to finish loading.
    }).then(function(res) {
        callback(true, res);
    }, function(res) {
        callback(false, res);
    });
}

///////////////////////////////////////
DKSendRequest = function(url, callback) {
    var xhr = "";
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
        dkConsole.error("DKSendRequest(" + url + "): Error creating xhr object");
        return false;
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                callback(true, url, xhr.responseText);
            }
        }
    }

    xhr.open("GET", url, true);
    xhr.timeout = 20000;
    xhr.addEventListener('timeout', function(event) {
        callback(false, url, "DKSendRequest(" + url + ") -> Timed out");
    });
    xhr.addEventListener('error', function(event) {
        callback(false, url, "DKSendRequest(" + url + ")-> ERROR");
    });
    xhr.send();
}

////////////////////////////////////////
function setCookie(cookieString, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookieString;
    // + expires + ";path=/";

}

////////////////////
function getCookie() {
    return document.cookie;
}

//////////////////////////////
function CenterWindow(element) {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var eleW = element.width;
    var eleH = element.height;
    var eleX = (winW / 2) - (eleW / 2);
    var eleY = (winH / 2) - (eleH / 2);
    element.style.left = eleX + "px";
    element.style.top = eleY + "px";
    return debugDiv;
}

/*
//////////////////////////////////////////
dkConsole.log("loading external page");
body = document.getElementsByTagName("body")[0];
var frame = document.createElement("div");
frame.style.position = "fixed";
frame.style.top = "20px";
frame.style.bottom = "20px";
frame.style.left = "20px";
frame.style.right = "20px";
frame.style.backgroundColor = "black";
frame.innerHTML = data;
body.appendChild(frame);
close.style.height = "20px";
close.style.backgroundColor = "grey";
close.style.cursor = "pointer";
close.innerHTML = " X";
frame.appendChild(close);
close.onclick = function(){
body.removeChild(frame);
*/
