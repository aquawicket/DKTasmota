/////////////////////////////////////////////////////////////////////////////
function CreateVPDCalculator(parent, top, bottom, left, right, width, height) {
    DKLoadHtmlFile("VPDCalculator.html", function(success, url, data) {
        if (!success) {
            return;
        }
        var vpdDiv = document.createElement("div");
        vpdDiv.innerHTML = data;
        vpdDiv.position = "absolute";
        vpdDiv.style.backgroundColor = "grey";
        vpdDiv.style.top = top;
        vpdDiv.style.bottom = bottom;
        vpdDiv.style.left = left;
        vpdDiv.style.right = right;
        vpdDiv.style.width = width;
        vpdDiv.style.height = height;
        vpdDiv.style.margin = "auto";
        parent.appendChild(vpdDiv);
    });
}
