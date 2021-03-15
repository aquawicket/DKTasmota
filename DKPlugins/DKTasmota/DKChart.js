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
                point: {
                    radius: 0.6
                }
            }
        }
    });

    AddDataset("Temperature", "rgb(200, 0, 0)", temperatureIp, "sensor1", false);
    AddDataset("Humidity", "rgb(0, 0, 200)", temperatureIp, "sensor2", false);
    AddDataset("DewPoint", "rgb(0,150,150)", temperatureIp, "sensor3", true);
    AddDataset("ExhaustFan", "rgb(150,0,150)", exhaustFanIp, "switch1", true);
    AddDataset("WaterWalls", "rgb(90,0,150)", waterWallsIp, "switch1", true);
    AddDataset("Heater", "rgb(150,0,50)", heaterIp, "switch1", true);
    AddDataset("ShedWaterA", "rgb(150,40,40)", shedWaterAIp, "switch1", true);
    AddDataset("ShedWaterB", "rgb(30,0,90)", shedWaterBIp, "switch1", true);
    AddDataset("WaterStation", "rgb(10,30,50)", waterStationIp, "switch1", true);
    AddDataset("VegTentFan", "rgb(100,60,10)", VegTentFanIp, "switch1", true);
    LoadDatasets();

    //Save Button
    let clearButton = document.createElement("button");
    clearButton.id = "clearButton";
    clearButton.innerHTML = "Clear";
    clearButton.style.zIndex = "2";
    clearButton.style.position = "absolute";
    clearButton.style.top = "5px";
    clearButton.style.left = "5px";
    clearButton.style.height = "18px";
    clearButton.style.width = "40px";
    clearButton.style.padding = "0px";
    clearButton.style.cursor = "pointer";
    clearButton.onclick = function clearButtonOnclickCallback() {
        ClearDatasets();
    }
    chartDiv.appendChild(clearButton);
}

function UpdateChartDevice(ip, identifier, data) {
    if (!ip) {
        return;
    }

    for (let i = 0; i < lineChart.data.datasets.length; i++) {
        if (ip === lineChart.data.datasets[i].ip && identifier === lineChart.data.datasets[i].identifier) {
            if (identifier.includes("switch")) {
                const ex = lineChart.data.datasets[i].data;
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
                //break;
            }
            if (identifier.includes("sensor")) {
                //temperature
                const tData = lineChart.data.datasets[i].data;
                if (tData.length && parseFloat(data) === tData[tData.length - 1].y) {
                    tData.pop();
                }
                tData.push({
                    t: new Date(),
                    y: parseFloat(data)
                });
                //break;
            }
            /*
            if (type === "sensor2") {
                //humidity
                const hData = lineChart.data.datasets[i].data;
                if (hData.length && parseFloat(data) === hData[hData.length - 1].y) {
                    hData.pop();
                }
                hData.push({
                    t: new Date(),
                    y: parseFloat(data)
                });
                break;
            }
            if (type === "sensor3") {
                //dewPoint
                const dData = lineChart.data.datasets[i].data;
                if (dData.length && parseFloat(data) === dData[dData.length - 1].y) {
                    dData.pop();
                }
                dData.push({
                    t: new Date(),
                    y: parseFloat(data)
                });
                break;
            }
            */
        }
    }

    /*
    if (ip === "192.168.1.99") {
        //Temperature/Humidity sensor
        var json = JSON.parse(data);
        //temperature
        if (json.sensor1
        ) {
            const tData = lineChart.data.datasets[0].data;
            if (tData.length && parseFloat(json.sensor1 //temperature
            ) === tData[tData.length - 1].y) {
                tData.pop();
            }
            tData.push({
                t: new Date(),
                y: parseFloat(json.sensor1 //temperature
                )
            });
        }
        if (json.sensor2 //humidity
        ) {
            const hData = lineChart.data.datasets[1].data;
            if (hData.length && parseFloat(json.sensor2 //humidity
            ) === hData[hData.length - 1].y) {
                hData.pop();
            }
            hData.push({
                t: new Date(),
                y: parseFloat(json.sensor2 //humidity
                )
            });
        }
        if (json.sensor3 //dewPoint
        ) {
            const dData = lineChart.data.datasets[2].data;
            if (dData.length && parseFloat(json.sensor3 //dewPoint
            ) === dData[dData.length - 1].y) {
                dData.pop();
            }
            dData.push({
                t: new Date(),
                y: parseFloat(json.sensor3 //dewPoint
                )
            });
        }
    }
    if (ip === "192.168.1.64") {
        //ExhaustFan
        const ex = lineChart.data.datasets[3].data;
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
    if (ip === "192.168.1.177") {
        //WaterWalls
        const ww = lineChart.data.datasets[4].data;
        if (ww.length && data === ww[ww.length - 1].y) {
            ww.pop();
        } else {
            ww.push({
                t: new Date(),
                y: data
            });
        }
        ww.push({
            t: new Date(),
            y: data
        });
    }
    if (ip === "192.168.1.163") {
        //Heater
        const he = lineChart.data.datasets[5].data;
        if (he.length && data === he[he.length - 1].y) {
            he.pop();
        } else {
            he.push({
                t: new Date(),
                y: data
            });
        }
        he.push({
            t: new Date(),
            y: data
        });
    }
    */
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
    var dataset = {};
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
    for (let d = 0; d < lineChart.data.datasets.length; d++) {
        if (lineChart.data.datasets[d].ip === ip) {
            let data = JSON.stringify(lineChart.data.datasets[d].data);
            SaveToLocalStorage(lineChart.data.datasets[d].label, data);
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

function ClearDatasets() {
    for (let d = 0; d < lineChart.data.datasets.length; d++) {
        lineChart.data.datasets[d].data = [];
    }
}
