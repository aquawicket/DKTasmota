//DKCookies.js

///////////////////////
function DKGetCookies() {
    var cookies = getCookie().split("^");
    for (n = 0; n < cookies.length - 1; n++) {
        //Do something with the cookie 
        //var ip = cookies[n];
        //AddDevice(ip);
    }
    // return an array of the cookies
    dkConsole.debug("DKGetCookies() -> "+cookies);
    return cookies;
}

////////////////////////////
function DKAddCookie(string) {
    dkconsole.debug("DKAddCookie("+string+")");
    
    //if the cookie doesn't exist, add it
    /*
    if (!cookieString.includes(ip)) {
        cookieString = cookieString + ip + "^";
        setCookie(cookieString, 30);
    }
    */
}
