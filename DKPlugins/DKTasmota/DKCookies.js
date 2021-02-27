//DKCookies.js

///////////////////////
function DKGetCookies() {
    var cookies = getCookie().split("^");
    /*
    for (n = 0; n < cookies.length - 1; n++) {
        var ip = cookies[n];
        AddDevice(ip);
    }
    */
    // return an array of cookies
    dkConsole.debug("DKGetCookies() -> "+cookies);
    return cookies;
}

////////////////////////////
function DKAddCookie(string) {
    dkconsole.debug("DKAddCookie("+string+")");
    /*
    if (!cookieString.includes(ip)) {
        cookieString = cookieString + ip + "^";
        setCookie(cookieString, 30);
    }
    */
}
