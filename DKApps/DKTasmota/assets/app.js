const assets = CPP_DKAssets_LocalAssets();
//const url = "http://www.google.com/";
//const url = "chrome://gpu";
//const url = "http://127.0.0.1:2393"
const url = assets+"DKTasmota.html"

CPP_DKFile_MkDir("DKPhp_running")
CPP_DKFile_Copy(assets+"DKPhp/php.exe", assets+"DKPhp_running/php_local.exe", false)
CPP_DKFile_Copy(assets+"DKPhp/php.exe", assets+"DKPhp_running/php_web.exe", false)
CPP_DKFile_Copy(assets+"DKPhp/php8ts.dll", assets+"DKPhp_running/php8ts.dll", false)
//CPP_DK_System(assets+"DKPhp_running/php_local.exe -S 127.0.0.1:2393")
//CPP_DK_System(assets+"DKPhp_running/php_web.exe -S 192.168.1.210:2393")

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