const assets = CPP_DKAssets_LocalAssets()
const url = assets+"DKTasmota.html"

if(CPP_DK_GetOS() == "Windows"){
	CPP_DKFile_ChDir(assets+"DKPhp/")
	const batch = assets+"DKPhp/RunPhpServers.bat"
	CPP_DK_System(batch)
}

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
})
