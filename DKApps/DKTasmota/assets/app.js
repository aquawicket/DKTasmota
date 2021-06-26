const assets = CPP_DKAssets_LocalAssets();
//const url = "http://www.google.com/";
//const url = "chrome://gpu";
//const url = "http://127.0.0.1:2393"
const url = assets+"DKTasmota.html"


CPP_DKFile_ChDir(assets+"DKPhp/");
const batch = assets+"DKPhp/RunPhpServers.bat";
CPP_DK_System(batch);


//CPP_DK_Create("DKWindow")
//CPP_DK_Create("DKRml")
//CPP_DK_Create("DKSDLText")
//location.href = url

const USE_CEF = 1
const width = 800
const height = 600
CPP_DK_Create("DKCef,Cef,0,0,"+width+","+height+","+url)
CPP_DKCef_NewBrowser("Cef",0,0,width,height,url)
//CPP_DKCef_ShowDevTools(0)
window.addEventListener("keydown", function mykeydown(event){
	if(event.key === "F12")
		CPP_DKCef_ShowDevTools(0)	
}


window.addEventListener("keydown", function mykeydown(event){
	console.log("app.js: window.onkeydown() ")
	console.log("event.type: "+event.type)
	console.log("event.altKey: "+event.altKey)
	console.log("event.char: "+event.char)     //OBSOLETE
	console.log("event.charCode: "+event.charCode)
	console.log("event.code: "+event.code)
	console.log("event.ctrlKey: "+event.ctrlKey)
	console.log("event.isCOmposition: "+event.isComposision)
	console.log("event.key: "+event.key)
	console.log("event.keyCode: "+event.keyCode)
	console.log("event.keyIdentifier: "+event.keyIdentifier)
	console.log("event.locale: "+event.locale)
	console.log("event.location: "+event.location)
	console.log("event.metaKey: "+event.metaKey)
	console.log("event.repeat: "+event.repeat)
	console.log("event.shiftKey: "+event.shiftKey)
	console.log("event.which: "+event.which)
})

window.addEventListener("mousedown", function mymousedowndown(){
	console.log("mousedown")
})