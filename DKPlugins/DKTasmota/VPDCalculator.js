"use strict";

dk.vpdcalc = DKPlugin(DKVpdCalc)

function DKVpdCalc() {}

DKVpdCalc.prototype.create = function DKVpdCalc_create(parent, top, bottom, left, right, width, height) {
    //DKLoadHtmlFile("VPDCalculator.html", function(success, url, data) {
    //if (!success)
    //return error("!success");

    const vpdDiv = document.createElement("div");
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
    //});
}

DKVpdCalc.prototype.calcVpd = function DKVpdCalc_calcVpd(airTemp, leafTempOffsetF, humidity, tempsInF) {
    let tempF;
    if (tempsInF) {
        tempF = airTemp;
    } else {
        tempF = (airTemp * 9) / 5 + 32;
    }
    const leafTemp = tempF + leafTempOffsetF;
    const vpd = 3.386 * (Math.exp(17.863 - 9621 / (leafTemp + 460)) - (humidity / 100) * Math.exp(17.863 - 9621 / (tempF + 460)));
    return vpd;
}

// returns temp in F
DKVpdCalc.prototype.calcTemp = function DKVpdCalc_calcTemp(vpdAir, rh) {
    let t = 9621 / (17.863 - Math.log(vpdAir / ((1 - rh / 100) * 3.386))) - 460;
    return t;
}

// assumes temp in F
DKVpdCalc.prototype.calcRh = function DKVpdCalc_calcRh(vpdAir, tempF) {
    let rh = 100 * (1 - vpdAir / (3.386 * Math.exp(17.863 - 9621 / (tempF + 460))));
    return rh;
}

DKVpdCalc.prototype.convertAirTemp = function DKVpdCalc_convertAirTemp(temp, fToC) {
    if (fToC) {
        return (temp - 32) * 5 / 9;
    } else {
        return temp * 9 / 5 + 32;
    }
}

DKVpdCalc.prototype.convertLeafTemp = function DKVpdCalc_convertLeafTemp(temp, fToC) {
    if (fToC) {
        return temp * 5 / 9;
    } else {
        return temp * 9 / 5;
    }
}

DKVpdCalc.prototype.calculate = function DKVpdCalc_calculate() {
    let tempCVal;
    // = Number(document.getElementById('tempCInput').value);
    let tempFVal;
    // = Number(document.getElementById('tempFInput').value);
    let rhVal;
    // = Number(document.getElementById('rhInput').value);
    let leafTempFVal;
    // = Number(document.getElementById('leafTempFInput').value);
    let vpdAirVal;
    // = Number(document.getElementById('vpdAirInput').value);

    // console.log("calcstart");
    var solveFor;
    // = document.querySelector('input[name = "solve"]:checked').value;
    if (solveFor == "vpd") {
        // console.log("vpd");  
        //let inputs = document.getElementsByTagName('input');
        //Array.from(inputs).forEach(function(input) {
        //    input.disabled = false;
        //});
        //document.getElementById('vpdAirInput').disabled = true;
        //document.getElementById('vpdLeafInput').disabled = true;

        vpdAir = calcVpd(tempCVal, 0, rhVal, false).toFixed(2);
        vpdLeaf = calcVpd(tempCVal, leafTempFVal, rhVal, false).toFixed(2);
        //document.getElementById('vpdAirInput').value = vpdAir;
        //document.getElementById('vpdLeafInput').value = vpdLeaf;
    }
    if (solveFor == "temp") {
        // console.log("temp");
        //let inputs = document.getElementsByTagName('input');
        //Array.from(inputs).forEach(function(input) {
        //    input.disabled = false;
        //});
        //document.getElementById('tempCInput').disabled = true;
        //document.getElementById('tempFInput').disabled = true;

        let tempF = calcTemp(vpdAirVal, rhVal).toFixed(1);
        let tempC = convertAirTemp(tempF, true).toFixed(1);

        //document.getElementById('tempCInput').value = tempC;
        //document.getElementById('tempFInput').value = tempF;
    }
    if (solveFor == "rh") {
        // console.log("rh");
        //let inputs = document.getElementsByTagName('input');
        //Array.from(inputs).forEach(function(input) {
        //    input.disabled = false;
        //});
        //document.getElementById('rhInput').disabled = true;

        let rh = calcRh(vpdAirVal, tempFVal).toFixed(1);
        //document.getElementById('rhInput').value = rh;
    }

    // console.log("calculate- tempC: "  + tempCVal + ", tempF: " + tempFVal + ", rhVal: " + rhVal + ", leafTempFVal: " + leafTempFVal + ", vpdAir: " + vpdAir + ", vpdLeaf: " + vpdLeaf );
}

/*
window.onload = calculate();
document.getElementById('tempFInput').addEventListener('input', function() {
    document.getElementById('tempCInput').value = convertAirTemp(document.getElementById('tempFInput').value, true).toFixed(1);
});
document.getElementById('tempCInput').addEventListener('input', function() {
    document.getElementById('tempFInput').value = convertAirTemp(document.getElementById('tempCInput').value, false).toFixed(1);
});
document.getElementById('leafTempFInput').addEventListener('input', function() {
    document.getElementById('leafTempCInput').value = convertLeafTemp(document.getElementById('leafTempFInput').value, true).toFixed(1);
});
document.getElementById('leafTempCInput').addEventListener('input', function() {
    document.getElementById('leafTempFInput').value = convertLeafTemp(document.getElementById('leafTempCInput').value, false).toFixed(1);
});

let inputs = document.getElementsByTagName('input');
Array.from(inputs).forEach(function(input) {
    input.addEventListener('input', calculate);
    // input.addEventListener('blur', (e) => {
    //   input.value = Number(event.target.value).toFixed(1);
    // })
});
*/
