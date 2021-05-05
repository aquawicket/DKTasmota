console.log("loading app.js");

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


//CPP_DK_Create("DKWindow");
//CPP_DK_Create("DKRml");
//CPP_DK_Create("DKSDLText");
//location.href = CPP_DKAssets_LocalAssets()+"/index.html";

//location.href = CPP_DKAssets_LocalAssets()+"/DKWebTest/index.html";
