// https://tasmota.github.io/docs/Commands/

let tasmotaDeviceCount = 0;
let devicesScanned = 0;

//return all local network device IPs that respond to /cm?cmnd=CORS 
GetTasmotaDevices = function(ipPrefix, callback)
{
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