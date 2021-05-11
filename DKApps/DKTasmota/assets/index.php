<?php
function isAllowed($ip){
    $whitelist = array('localhost','127.0.0.1','192.168.1.*','172.58.30.155');
    // If the ip is matched, return true
    if(in_array($ip, $whitelist)) {
        return true;
    }
    foreach($whitelist as $i){
        $wildcardPos = strpos($i, "*");
        // Check if the ip has a wildcard
        if($wildcardPos !== false && substr($ip, 0, $wildcardPos) . "*" == $i) {
            return true;
        }
    }
    return false;
}

if (! isAllowed($_SERVER['REMOTE_ADDR'])) {
    header("HTTP/1.1 404 Not Found");
        echo "404 Not Found";
}else{
	echo "<html>
    <head>
        <title>Tasmota Device Manager PHP</title>
        <script id=\"DK/DK.js\" src=\"DK/DK.js\"></script>
        <script id=\"myapp.js\" src=\"myapp.js\" onload=\"myapp.loadFiles()\"></script>
    </head>
    <body onload=\"myapp.loadApp()\"></body>
    </html>";
}
?>