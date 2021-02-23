//////////////////////////////////////
function CreateVPDCalculator(parent) {
    DKLoadHtmlFile("VPDCalculator.html", function(success, url, data) {
        if (!success) {
            return;
        }
        var vpdDiv = document.createElement("div");
        vpdDiv.innerHTML = data;
        vpdDiv.position = "absolute";
        vpdDiv.style.backgroundColor = "grey";
        vpdDiv.style.top = "30px";
        vpdDiv.style.left = "100px";
        vpdDiv.style.width = "400px";
        vpdDiv.style.height = "600px";
        vpdDiv.style.margin = "auto";
        parent.appendChild(vpdDiv);
    });
}
