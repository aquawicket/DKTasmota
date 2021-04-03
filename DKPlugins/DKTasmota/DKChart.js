"use strict";

//https://www.chartjs.org/
//https://www.chartjs.org/docs/latest/axes/cartesian/time.html
//DKLoadJSFile("https://momentjs.com/downloads/moment.min.js", function() {
//    DKLoadJSFile("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js");
//});
DKLoadJSFile("moment.min.js", function() {
    DKLoadJSFile("Chart.min.js");
});

let lineChart;

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
    let ctx = chartCanvas.getContext('2d');
    chartDiv.appendChild(chartCanvas);

    //FIXME - do proper refreshing on resize    
    DKAddResizeHandler(chartCanvas, function(){
        //dkconsole.info("chartCanvas resized: x:"+chartCanvas.style.width+" y:"+chartCanvas.style.height);
        chartCanvas.style.height = "100%";
    });

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
                point: {
                    radius: 0.6
                }
            }
        }
    });

    /*
    let clearButton = document.createElement("button");
    clearButton.id = "clearButton";
    clearButton.innerHTML = "Clear";
    clearButton.style.position = "absolute";
    clearButton.style.top = "5px";
    clearButton.style.left = "5px";
    clearButton.style.height = "18px";
    clearButton.style.width = "40px";
    clearButton.style.padding = "0px";
    clearButton.style.cursor = "pointer";
    clearButton.onclick = ClearDatasets();
    chartDiv.appendChild(clearButton);
    */

    InitializeDevices(function() {
        AddDatasets();
        LoadDatasets();
    });
}

function AddDatasets() {
    AddDataset("A Tent Water Walls", "rgb(10,30,50)", Device("003")?.ip, "switch1", true);
    AddDataset("A Tent Exhaust Fan", "rgb(10,30,90)", Device("011")?.ip, "switch1", true);
    AddDataset("A Tent Temperature", "rgb(200, 0, 0)", Device("013")?.ip, "sensor1", false);
    AddDataset("A Tent Humidity", "rgb(0, 0, 200)", Device("013")?.ip, "sensor2", false);
    AddDataset("A Tent DewPoint", "rgb(0,150,150)", Device("013")?.ip, "sensor3", true);
    
    AddDataset("B Tent Temperature", "rgb(200, 0, 0)", Device("013")?.ip, "sensor1", false);
    AddDataset("B Tent Humidity", "rgb(0, 0, 200)", Device("013")?.ip, "sensor2", false);
    AddDataset("B Tent DewPoint", "rgb(0,150,150)", Device("013")?.ip, "sensor3", true);
    AddDataset("B Tent Exhaust Fan", "rgb(150,0,150)", Device("005")?.ip, "switch1", true);
    AddDataset("B Tent Water Walls", "rgb(90,0,150)", Device("007")?.ip, "switch1", true);
    AddDataset("B Tent Heater", "rgb(150,0,50)", Device("006")?.ip, "switch1", true);
    AddDataset("B Tent Co2", "rgb(10,60,10)", Device("008")?.ip, "switch1", true);
    
    AddDataset("Shed Water A", "rgb(150,40,40)", Device("002")?.ip, "switch1", true);
    AddDataset("Shed Water B", "rgb(30,0,90)", Device("001")?.ip, "switch1", true); 

    AddDataset("Veg Tent Temperature", "rgb(200, 20, 20)", Device("015")?.ip, "sensor1", false);
    AddDataset("Veg Tent Exhaust", "rgb(10,60,10)", Device("012")?.ip, "switch1", true);
    AddDataset("Veg Tent Co2", "rgb(100,60,10)", Device("010")?.ip, "switch1", true);  
}

function UpdateChartDevice(ip, identifier, data) {
    if (!ip) {
        dkconsole.error("ip invalid");
        return;
    }

    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        if (ip === lineChart.data.datasets[n].ip && identifier === lineChart.data.datasets[n].identifier) {
            if (identifier.includes("switch")) {
                const ex = lineChart.data.datasets[n].data;
                if (ex.length && data === ex[ex.length - 1].y) {
                    ex.pop();
                } else {
                    ex.push({
                        t: new Date(),
                        y: data
                    });
                }
                ex.push({
                    t: new Date(),
                    y: data
                });
            }
            if (identifier.includes("sensor")) {
                const tData = lineChart.data.datasets[n].data;
                if (tData.length && parseFloat(data) === tData[tData.length - 1].y) {
                    tData.pop();
                }
                tData.push({
                    t: new Date(),
                    y: parseFloat(data)
                });
            }
        }
    }

    lineChart.update();
    SaveDatasets(ip);

    //agressive file saving. Saving every minute of every device
    let currentdate = new Date();
    let stamp = (currentdate.getMonth() + 1) + "_" + currentdate.getDate() + "_" + currentdate.getFullYear();
    const entry = JSON.stringify({
        t: currentdate,
        y: data
    });
    //if (`${window.location.protocol}` != "file:") {
    PHP_StringToFile("data/" + stamp + "_" + ip + ".txt", entry, "FILE_APPEND");
    //}
}

function AddDataset(label, borderColor, ip, identifier, hidden) {
    let dataset = {};
    dataset.ip = ip;
    dataset.label = label;
    dataset.identifier = identifier;
    dataset.data = [];
    dataset.lineTension = 0;
    dataset.fill = false;
    dataset.borderColor = borderColor;
    dataset.hidden = hidden;
    lineChart.data.datasets.push(dataset);
    lineChart.update();
}

function SaveDatasets(ip) {
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        if (lineChart.data.datasets[n].ip === ip) {
            let data = JSON.stringify(lineChart.data.datasets[n].data);
            DKSaveToLocalStorage(lineChart.data.datasets[n].label, data);
        }
    }
}

function LoadDatasets() {
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        let data = DKLoadFromLocalStorage(lineChart.data.datasets[n].label);
        lineChart.data.datasets[n].data = JSON.parse(data);
    }
    lineChart.update();
}

function ClearDatasets() {
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        lineChart.data.datasets[n].data = [];
    }
}
