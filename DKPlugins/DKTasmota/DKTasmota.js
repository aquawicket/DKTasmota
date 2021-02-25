///////////////////////////////////////////////////////////////////
//return all local network device IPs that respond to /cm?cmnd=CORS
//callback(ip, done);

GetTasmotaDevices = function(ipPrefix, callback)
{
	//scan 192.168.1.1 thru 192.168.1.254
	/*
	if(!window.location.hostname.includes("192.168.1.")){
		dkConsole.log("Please use ");
		dkConsole.add("<a href='http://192.168.1.78'>192.168.1.78</a>");
		dkConsole.add(" to access local devices");
		corsWrite = 0;
	}
	*/
	let tasmotaDeviceCount = 0;
    let devicesScanned = 0;
	let corsWrite = 0;
    for(let n = 1; n < 255; n++){
	    let ip = ipPrefix+n;
        let cmnd = "CORS";
        if(corsWrite){
            cmnd += ` ${window.location.protocol}//${window.location.hostname}`;
            if(window.location.port && window.location.port !== ""){
                cmnd += `:${window.location.port}`;
            }
        }
        //let url = "http://"+ip+"/cm?cmnd="+cmnd; //Un-encodeURIComponent
        let url = "http://"+ip+"/cm?cmnd="+encodeURIComponent(cmnd).replace(";", "%3B");   
	    DKSendSuperRequest(url, function(success, data){ //send request using superAgent
	        dkConsole.log("pinged "+ip);
	        if(success){
	        	devicesScanned += 1;
	        	tasmotaDeviceCount += 1;
	        	if(devicesScanned >= 254){
	        	    callback(ip, true);
	        	}
	        	else{
	        	    callback(ip, false);
	        	}
            }
	    	else{
	    		devicesScanned += 1;
	    		if(devicesScanned >= 254){
	    			ip = false;
	        	    callback(ip, true);
	        	}
	    	}
	    });
    }
}