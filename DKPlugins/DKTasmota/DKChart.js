"use strict";

//https://www.chartjs.org/
//https://www.chartjs.org/docs/latest/axes/cartesian/time.html
//DKLoadJSFile("https://momentjs.com/downloads/moment.min.js", function() {
//    DKLoadJSFile("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js");
//});
DKLoadJSFile("moment.min.js", function() {
    DKLoadJSFile("Chart.min.js");
});

var lineChart;

function CreateChart(parent, id, top, bottom, left, right, width, height) {
    let chartDiv = document.createElement("div");
    chartDiv.id = id;
    chartDiv.style.position = "absolute";
    chartDiv.style.backgroundColor = "rgb(70,70,70)";
    chartDiv.style.top = top;
    chartDiv.style.bottom = bottom;
    chartDiv.style.left = left;
    chartDiv.style.right = right;
    chartDiv.style.width = width;
    chartDiv.style.height = height;
    parent.appendChild(chartDiv);

    let chartCanvas = document.createElement("canvas");
    chartCanvas.id = "chartCanvas";
    chartCanvas.style.position = "absolute";
    chartCanvas.style.left = "0px";
    chartCanvas.style.top = "0px";
    chartCanvas.style.width = "100%";
    chartCanvas.style.height = "100%";
    var ctx = chartCanvas.getContext('2d');
    chartDiv.appendChild(chartCanvas);

    lineChart = new Chart(ctx,{
        type: "line",
        data: {
            datasets: []
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                }]
            },
            elements: {
                    point:{
                        radius: 0.5
                    }
                }
        }
    });

    AddDataset("Temperature", "rgb(200, 0, 0)", "Device013");
    AddDataset("Humidity", "rgb(0, 0, 200)", "Device013");
    AddDataset("DewPoint", "rgb(0,150,150)", "Device013");
    AddDataset("ExhaustFan", "rgb(150,0,150)", "Device005");
    lineChart.data.datasets[lineChart.data.datasets.length-1].hidden = true;
    AddDataset("WaterWalls", "rgb(90,0,150)", "Device007");
    lineChart.data.datasets[lineChart.data.datasets.length-1].hidden = true;
    AddDataset("Heater", "rgb(150,0,50)", "Device006");
    lineChart.data.datasets[lineChart.data.datasets.length-1].hidden = true;
    LoadDatasets();

    //Save Button
    let saveButton = document.createElement("button");
    saveButton.id = "saveButton";
    saveButton.innerHTML = "Save";
    saveButton.style.zIndex = "2";
    saveButton.style.position = "absolute";
    saveButton.style.top = "5px";
    saveButton.style.left = "5px";
    saveButton.style.height = "18px";
    saveButton.style.width = "40px";
    saveButton.style.padding = "0px";
    saveButton.style.cursor = "pointer";
    saveButton.onclick = function saveButtonOnclickCallback() {
        SaveDatasets();
    }
    chartDiv.appendChild(saveButton);

    //Load Button
    let loadButton = document.createElement("button");
    loadButton.id = "loadButton";
    loadButton.innerHTML = "Load";
    loadButton.style.zIndex = "2";
    loadButton.style.position = "absolute";
    loadButton.style.top = "5px";
    loadButton.style.left = "45px";
    loadButton.style.height = "18px";
    loadButton.style.width = "40px";
    loadButton.style.padding = "0px";
    loadButton.style.cursor = "pointer";
    loadButton.onclick = function loadButtonOnclickCallback() {
        LoadDatasets();
    }
    chartDiv.appendChild(loadButton);
}

function UpdateChartDevice(hostname, data) {
    //console.debug(LastStackCall() + ": hostname:" + hostname + " data:" + data);
    if (!hostname) {
        return;
    }
    if (hostname === "Device013") {
        //Temperature/Humidity sensor
        if(!data){ return; }
        var json = JSON.parse(data);
        if(json.temperature){
            lineChart.data.datasets[0].data.push({
                t: new Date(),
                y: parseFloat(json.temperature)
            });
        }
        if(json.humidity){
            lineChart.data.datasets[1].data.push({
                t: new Date(),
                y: parseFloat(json.humidity)
            });
        }
        if(json.dewPoint){
            lineChart.data.datasets[2].data.push({
                t: new Date(),
                y: parseFloat(json.dewPoint)
            });
        }
    }
    if (hostname === "Device005") {
        //ExhaustFan
        lineChart.data.datasets[3].data.push({
            t: new Date(),
            y: data
        });
    }
    if (hostname === "Device007") {
        //WaterWalls
        lineChart.data.datasets[4].data.push({
            t: new Date(),
            y: data
        });
    }
    if (hostname === "Device006") {
        //Heater
        lineChart.data.datasets[5].data.push({
            t: new Date(),
            y: data
        });
    }
    lineChart.update();
    SaveDatasets(hostname);

    let currentdate = new Date();
    let stamp = (currentdate.getMonth() + 1) + "_" + currentdate.getDate() + "_" + currentdate.getFullYear() + "_" + currentdate.getHours();
    const entry = JSON.stringify({t:currentdate,y:data});
    PHP_StringToFile("data/"+stamp+hostname+".txt", entry, "FILE_APPEND");
}

function AddDataset(name, color, hostname) {
    var dataset = {};
    dataset.hostname = hostname;
    dataset.label = name;
    dataset.data = [];
    dataset.fill = false;
    dataset.borderColor = color;
    lineChart.data.datasets.push(dataset);
    lineChart.update();
}

function SaveDatasets(hostname) {
    for (let d = 0; d < lineChart.data.datasets.length; d++) {
        if(lineChart.data.datasets[d].hostname === hostname){
            let data = JSON.stringify(lineChart.data.datasets[d].data);
            SaveToLocalStorage(lineChart.data.datasets[d].label, data);
            //PHP_StringToFile(stamp+hostname+".txt", data);
        }
    }
}

function LoadDatasets() {
    for (let d = 0; d < lineChart.data.datasets.length; d++) {
        let data = LoadFromLocalStorage(lineChart.data.datasets[d].label);
        lineChart.data.datasets[d].data = JSON.parse(data);
    }
    lineChart.update();
}
