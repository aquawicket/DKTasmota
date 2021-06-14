console.log("TestPlugin/js")

const div = document.createElement("div");
div.style.position = "absolute";
div.style.top = "25px";
div.style.left = "5px";
div.style.bottom = "5px";
div.style.right = "5px";
//div.style.width = "50%";
//div.style.height = "95%";
div.style.backgroundColor = "rgb(250,250,250)";
document.body.appendChild(div);

const textarea = document.createElement("textarea");
textarea.style.position = "absolute";
textarea.style.top = "0px";
textarea.style.left = "0px";
textarea.style.bottom = "0px";
textarea.style.right = "000px";
textarea.style.width = "100%";
textarea.style.height = "100%";
textarea.style.fontSize = "12px";
textarea.style.color = "rgb(200,200,200)";
textarea.style.backgroundColor = "rgb(30,30,30)";
div.appendChild(textarea);

const button = document.createElement("buttom");
button.style.position = "absolute";
button.style.top = "2px";
button.style.left = "2px";
//button.style.bottom = "0px";
//button.style.right = "000px";
button.style.width = "100px";
button.style.height = "20px";
//button.style.fontSize = "12px";
//button.style.color = "rgb(200,200,200)";
//button.style.backgroundColor = "rgb(30,30,30)";
button.innerHTML = "Run Code";
button.onclick = function(){
	console.log("test");
}
document.body.appendChild(button);

button.addEventListener("click", OnRunCodeClick, true);

function OnRunCodeClick(){
	console.log("click")
}