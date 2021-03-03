"use strict";
// https://tasmota.github.io/docs/Commands/

let tasmotaDeviceCount;
let devicesScanned;

//return all local network device IPs that respond to /cm?cmnd=CORS 
function GetTasmotaDevices(ipPrefix, callback)
{
	tasmotaDeviceCount = 0;
    devicesScanned = 0;
	//scan 192.168.1.1 thru 192.168.1.254
	if(!ipPrefix){ ipPrefix = "192.168.1."; }
	let corsWrite = 1;
	let cmnd;
    for(let n = 1; n < 255; n++){
	    let ip = ipPrefix+n;
        cmnd = "CORS";
        if(corsWrite){
            cmnd += ` ${window.location.protocol}//${window.location.hostname}`;
            if(window.location.port && window.location.port !== ""){
                cmnd += `:${window.location.port}`;
            }
        }
        //let url = "http://"+ip+"/cm?cmnd="+cmnd; //Un-encodeURIComponent
        let url = "http://"+ip+"/cm?cmnd="+encodeURIComponent(cmnd).replace(";", "%3B"); 
        dkconsole.debug(url);  
	    DKSendSuperRequest(url, function DKSendSuperRequestCallback(success, data){ //send request using superAgent
	        dkconsole.log("pinged "+ip);
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