console.log("loading app.js");
CPP_DKDuktape_Create("DKWindow");
CPP_DKDuktape_Create("DKRml");
CPP_DKDuktape_Create("DKSDLText");

location.href = CPP_DKAssets_LocalAssets()+"/index.html";
//location.href = CPP_DKAssets_LocalAssets()+"/DKTasmota/index.html";
//location.href = CPP_DKAssets_LocalAssets()+"/DKWebTest/index.html";