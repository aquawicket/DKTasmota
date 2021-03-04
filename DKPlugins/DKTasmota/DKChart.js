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
    chartDiv.style.backgroundColor = "rgb(150,150,150)";
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
            }
        }
    });

    AddDataset("Temperature", "rgb(200, 0, 0)");
    AddDataset("Humidity", "rgb(0, 0, 200)");
    AddDataset("DewPoint", "rgb(0,150,150)");
    AddDataset("ExhaustFan", "rgb(150,0,150)");

    //Save Button
    let saveButton = document.createElement("button");
    saveButton.id = "saveButton";
    saveButton.innerHTML = "Save";
    saveButton.style.zIndex = "2";
    saveButton.style.position = "absolute";
    saveButton.style.top = "5px";
    saveButton.style.left = "5px";
    saveButton.style.height = "20px";
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
    loadButton.style.left = "51px";
    loadButton.style.height = "20px";
    loadButton.style.cursor = "pointer";
    loadButton.onclick = function loadButtonOnclickCallback() {
        LoadDatasets();
    }
    chartDiv.appendChild(loadButton);
}
function UpdateChart(humidity, temperature, dewPoint) {
    if (!humidity || !temperature || !dewPoint) {
        return;
    }
    lineChart.data.datasets[0].data.push({
        t: new Date(),
        y: parseFloat(temperature)
    });
    lineChart.data.datasets[1].data.push({
        t: new Date(),
        y: parseFloat(humidity)
    });
    lineChart.data.datasets[2].data.push({
        t: new Date(),
        y: parseFloat(dewPoint)
    });
    lineChart.update();
    SaveDatasets(); 
}

function UpdateChartSwitch(hostname, state) {
    //console.debug(LastStackCall()+": hostname:"+hostname+" state:"+state);
    if(hostname === "Device005"){
        lineChart.data.datasets[3].data.push({
            t: new Date(),
            y: state
        });
    }
}

function AddDataset(name, color) {
    var dataset = {};
    dataset.label = name;
    dataset.data = [];
    dataset.fill = false;
    dataset.borderColor = color;
    //dataset.lineTension = 0.1;
    lineChart.data.datasets.push(dataset);
    lineChart.update();
}

function SaveDatasets() {
    for (let d = 0; d < lineChart.data.datasets.length; d++) {
        let data = JSON.stringify(lineChart.data.datasets[d].data);
        SaveToLocalStorage(lineChart.data.datasets[d].label, data);
    }
}

function LoadDatasets() {
    for (let d = 0; d < lineChart.data.datasets.length; d++) {
        let data = LoadFromLocalStorage(lineChart.data.datasets[d].label);
        lineChart.data.datasets[d].data = JSON.parse(data);
    }
    lineChart.update();
}

/*
function CreateCanvasButton() {

    let canvas = document.getElementById("chartCanvas");
    //Function to get the mouse position
    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    //Function to check whether a point is inside a rectangle
    function isInside(pos, rect) {
        return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
    }

    var context = canvas.getContext('2d');
    //The rectangle should have x,y,width,height properties
    var rect = {
        x: 250,
        y: 350,
        width: 200,
        height: 100
    };
    
    //Binding the click event on the canvas
    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);

        if (isInside(mousePos, rect)) {
            alert('clicked inside rect');
        } else {
            alert('clicked outside rect');
        }
    }, false);
}
*/