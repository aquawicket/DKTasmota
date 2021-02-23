//var dkConsole = new Object;
//////////////////////////////////////////////////////////
function CreateDKConsole(parent, top, bottom, left, right)
{
	DKLoadCSSFile("DKConsole.css");
	dkConsole = document.createElement("div");
	dkConsole.className = "DKConsole";
	dkConsole.style.position = "absolute";
	dkConsole.style.backgroundColor = "black";
	dkConsole.style.color = "white";
	dkConsole.style.fontColor = "white";
	dkConsole.style.top = top;
	dkConsole.style.bottom = "20px";//bottom;
	dkConsole.style.left = left;
	dkConsole.style.right = right;
	//dkConsole.style.x = x;
	//dkConsole.style.y = y;
	//dkConsole.style.width = width;
	//dkConsole.style.height = height;
	dkConsole.style.visibility = "visible";
    dkConsole.style.overflow = "auto";
	parent.appendChild(dkConsole);

	//command box
	var cmdbox = document.createElement("input");
	cmdbox.type = "text";
	cmdbox.style.position = "absolute";
	cmdbox.style.left = "0px";
	cmdbox.style.bottom = "0px";
	cmdbox.style.right = "0px";
	cmdbox.style.height = "20px";
	cmdbox.style.width = "100%";
	cmdbox.onkeydown = function(event){
		var key = event.charCode || event.keyCode;
		if(key === 13){ //enter
		    if(cmdbox.value === "clear" || cmdbox.value === "cls"){
		    	dkConsole.innerHTML = "";
		    	cmdbox.value = "";
		    	return;
		    }
			dkConsole.log("RUN Javascript -> "+cmdbox.value);
			eval(cmdbox.value);
			cmdbox.value = "";
		}
	}
	parent.appendChild(cmdbox);

	
    /////////////////////////////////////
    dkConsole.log = function(text, color)
    { 
	    var newText = document.createElement("a");
	    newText.className = "DKConsole";
        newText.innerHTML = text+"<br>";
        if(color !== undefined){
            newText.style.color = color;
        }
        else{
            //newText.style.color = "white"; //default anyway?
        }
        dkConsole.appendChild(newText);
        dkConsole.scrollTop = dkConsole.scrollHeight;
        //console.log(text); //mirror message to the console as well.
    }

    /////////////////////////////////////
    dkConsole.add = function(text, color)
    {
	    //console.debug("dkConsole.log("+text+","+color+")");
	    var newText = document.createElement("a");
	    var lastText = dkConsole.lastElementChild;
	    newText.className = "DKConsole";
        lastText.innerHTML = lastText.innerHTML.slice(0, -4);
        newText.innerHTML = text+"<br>";
        if(color !== undefined){
            newText.style.color = color;
        }
        else{
            //newText.style.color = "white";
        }
        dkConsole.appendChild(newText);
    }

	return dkConsole;
}