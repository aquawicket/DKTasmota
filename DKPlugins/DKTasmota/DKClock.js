////////////////////
function UpdateClock()
{
	//Update date and time clock
    var currentdate = new Date(); 
    var datetime = (currentdate.getMonth()+1)+"/"
                  + currentdate.getDate()+"/"
                  + currentdate.getFullYear()+"  "  
                  + currentdate.getHours()+":"  
                  + currentdate.getMinutes()+":" 
                  + currentdate.getSeconds();
    if(document.getElementById("clock")){
        document.getElementById("clock").innerHTML = datetime;
    }
}

/////////////////////////////
function CreateClock(parent){
    var clock = document.createElement("a");
    clock.id = "clock";
    clock.style.position = "absolute";
    clock.style.top = "2px";
    clock.style.right = "5px";
    parent.appendChild(clock);
    window.setInterval(UpdateClock, 1000); //FIXME: not working
}