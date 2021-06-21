//var url = "http://www.google.com/";
//var url = "chrome://gpu";
//var url = "http://127.0.0.1:2393"
var url = CPP_DKAssets_LocalAssets()+"DKTasmota.html"


//CPP_DK_Create("DKWindow")
//CPP_DK_Create("DKRml")
//CPP_DK_Create("DKSDLText")
//location.href = url


var USE_CEF = 1
var width = 800
var height = 600
CPP_DK_Create("DKCef,Cef,0,0,"+width+","+height+","+url)
CPP_DKCef_NewBrowser("Cef",0,0,width,height,url)
CPP_DKCef_ShowDevTools(0)

/*
let assets = CPP_DKAssets_LocalAssets();
CPP_DKFile_ChDir(assets+"DKPhp/");
let str = assets+"DKPhp/RunPhpServers.bat";
console.log(str);
CPP_DK_System(str);
CPP_DK_Sleep(1000);
//CPP_DK_System(str);
let short_path = CPP_DKFile_GetShortName("C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe");
CPP_DK_Execute(short_path +" "+assets+"dktasmota.html");
CPP_DK_Sleep(1000);
CPP_DK_Exit();
*/
