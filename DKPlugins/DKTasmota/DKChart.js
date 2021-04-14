"use strict";

//https://www.chartjs.org/
//https://www.chartjs.org/docs/latest/axes/cartesian/time.html
//DK_Create("https://momentjs.com/downloads/moment.min.js", function() {
//    DK_Create("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js");
//});
//DK_Create("DKTasmota/moment.min.js", function() {
//    DK_Create("DKTasmota/Chart.min.js");
//});

let lineChart;

function DKChart_Create(parent, id, top, bottom, left, right, width, height) {
    const chartDiv = document.createElement("div");
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

    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = "chartCanvas";
    chartCanvas.style.position = "absolute";
    chartCanvas.style.left = "0rem";
    chartCanvas.style.top = "0rem";
    chartCanvas.style.width = "100%";
    chartCanvas.style.height = "100%";
    const ctx = chartCanvas.getContext('2d');
    chartDiv.appendChild(chartCanvas);

    //FIXME - do proper refreshing on resize    
    DKGui_AddResizeHandler(chartCanvas, function() {
        //console.debug("chartCanvas resized: x:"+chartCanvas.style.width+" y:"+chartCanvas.style.height);
        chartCanvas.style.height = "100%";
        //lineChart.resize("100%","100%");
    });

    lineChart = new Chart(ctx,{
        type: "line",
        data: {
            datasets: []
        },
        options: {
            legend: {
                display: false,
            },
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
    const clearButton = document.createElement("button");
    clearButton.id = "clearButton";
    clearButton.innerHTML = "Clear";
    clearButton.style.position = "absolute";
    clearButton.style.top = "5rem";
    clearButton.style.left = "5rem";
    clearButton.style.height = "18rem";
    clearButton.style.width = "40rem";
    clearButton.style.padding = "0rem";
    clearButton.style.cursor = "pointer";
    clearButton.onclick = ClearDatasets();
    chartDiv.appendChild(clearButton);
    */

    DKTasmota_InitializeDevices(function() {
        DKChart_AddDatasets();
        DKChart_LoadDatasets();
    });
}

function DKChart_AddDatasets() {
    Device("014") && DKChart_AddDataset("A Tent Temperature", "rgb(200, 0, 0)", Device("014").ip, "sensor1", true);
    Device("014") && DKChart_AddDataset("A Tent Humidity", "rgb(0, 0, 200)", Device("014").ip, "sensor2", true);
    Device("014") && DKChart_AddDataset("A Tent DewPoint", "rgb(0,150,150)", Device("014").ip, "sensor3", true);
    Device("011") && DKChart_AddDataset("A Tent Exhaust Fan", "rgb(10,30,90)", Device("011").ip, "switch1", true);
    Device("003") && DKChart_AddDataset("A Tent Water Walls", "rgb(10,30,50)", Device("003").ip, "switch1", true);
    //DKChart_AddDataset("A Tent Heater", "rgb(150,0,50)", Device("???").ip, "switch1", true);
    //DKChart_AddDataset("A Tent Co2", "rgb(10,60,10)", Device("???").ip, "switch1", true);
    //DKChart_AddDataset("A Tent Lights", "rgb(100,60,10)", Device("???").ip, "switch1", true);

    Device("013") && DKChart_AddDataset("B Tent Temperature", "rgb(200, 0, 0)", Device("013").ip, "sensor1", true);
    Device("013") && DKChart_AddDataset("B Tent Humidity", "rgb(0, 0, 200)", Device("013").ip, "sensor2", true);
    Device("013") && DKChart_AddDataset("B Tent DewPoint", "rgb(0,150,150)", Device("013").ip, "sensor3", true);
    Device("005") && DKChart_AddDataset("B Tent Exhaust Fan", "rgb(150,0,150)", Device("005").ip, "switch1", true);
    Device("007") && DKChart_AddDataset("B Tent Water Walls", "rgb(90,0,150)", Device("007").ip, "switch1", true);
    Device("006") && DKChart_AddDataset("B Tent Heater", "rgb(150,0,50)", Device("006").ip, "switch1", true);
    Device("008") && DKChart_AddDataset("B Tent Co2", "rgb(10,60,10)", Device("008").ip, "switch1", true);
    //Device("0") && DKChart_AddDataset("B Tent Lights", "rgb(100,60,10)", Device("???").ip, "switch1", true);

    Device("002") && DKChart_AddDataset("Shed Water A", "rgb(150,40,40)", Device("Shed Water A").ip, "switch1", true);
    Device("001") && DKChart_AddDataset("Shed Water B", "rgb(30,0,90)", Device("Shed Water B").ip, "switch1", true);
    Device("016") && DKChart_AddDataset("Shed Temp", "rgb(30,0,90)", Device("Shed Temp").ip, "sensor1", true);

    Device("015") && DKChart_AddDataset("Veg Tent Temperature", "rgb(200, 20, 20)", Device("015").ip, "sensor1", true);
    Device("015") && DKChart_AddDataset("Veg Tent Humidity", "rgb(0, 0, 200)", Device("015").ip, "sensor2", true);
    Device("015") && DKChart_AddDataset("Veg Tent DewPoint", "rgb(0,150,150)", Device("015").ip, "sensor3", true);
    Device("012") && DKChart_AddDataset("Veg Tent Exhaust Fan", "rgb(10,60,10)", Device("012").ip, "switch1", true);
    Device("009") && DKChart_AddDataset("Veg Tent Water Walls", "rgb(90,0,150)", Device("009").ip, "switch1", true);
    Device("010") && DKChart_AddDataset("Veg Tent Co2", "rgb(100,60,10)", Device("Veg Tent Co2").ip, "switch1", true);
    Device("004") && DKChart_AddDataset("Veg Tent Lights", "rgb(100,60,10)", Device("004").ip, "switch1", true);
}

function DKChart_UpdateDevice(device, identifier, data) {
    if (!device)
        return error("device invalid");

    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        if (device.ip === lineChart.data.datasets[n].ip && identifier === lineChart.data.datasets[n].identifier) {
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
    DKChart_SaveDatasets(device.ip);
    DKChart_AppendDatasetToServer(device.user.name, data);
}

function DKChart_SelectChart(ip) {
    let borderColor;
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        if (lineChart.data.datasets[n].ip === ip) {
            lineChart.data.datasets[n].hidden = false;
            /*!borderColor && (*/
            borderColor = lineChart.data.datasets[n].borderColor
            //);
        } else {
            lineChart.data.datasets[n].hidden = true;
        }
    }
    lineChart.update();
    return borderColor;
}

function DKChart_ToggleChart(ip) {
    let borderColor;
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        if (lineChart.data.datasets[n].ip === ip) {
            lineChart.data.datasets[n].hidden ? lineChart.data.datasets[n].hidden = false : lineChart.data.datasets[n].hidden = true;
            !lineChart.data.datasets[n].hidden && !borderColor && (borderColor = lineChart.data.datasets[n].borderColor);
        }
    }
    lineChart.update();
    return borderColor;
}

function DKChart_AddDataset(label, borderColor, ip, identifier, hidden) {
    if (!ip)
        return error("ip invalid");

    const dataset = {};
    dataset.ip = ip;
    dataset.label = label;
    dataset.identifier = identifier;
    dataset.data = [];
    dataset.lineTension = 0;
    dataset.fill = false;
    dataset.borderColor = borderColor;
    dataset.hidden = hidden;

    /*
    for(let n=0; n<devices.length; n++){
        if(devices[n].ip === ip){
            devices[n].dataset = {};
            devices[n].dataset.ip = ip;
            devices[n].dataset.label = label;
            devices[n].dataset.identifier = identifier;
            devices[n].dataset.data = [];
            devices[n].dataset.lineTension = 0;
            devices[n].dataset.fill = false;
            devices[n].dataset.borderColor = borderColor;
            devices[n].dataset.hidden = hidden;
            lineChart.data.datasets.push(devices[n].dataset);
        }
    }
    */

    lineChart.data.datasets.push(dataset);
    lineChart.update();
}

function DKChart_AppendDatasetToServer(label, data) {
    const currentdate = new Date();
    const stamp = (currentdate.getMonth() + 1) + "_" + currentdate.getDate() + "_" + currentdate.getFullYear();
    const entry = JSON.stringify({
        t: currentdate,
        y: data
    });
    PHP_StringToFile(online_assets + "\\" + stamp + "_" + label + ".txt", entry, "FILE_APPEND", function(rval) {
        //if (rval)
            //console.log(rval);
    });
}

function DKChart_SaveDatasetToServer(ip) {
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        if (lineChart.data.datasets[n].ip === ip) {
            const data = JSON.stringify(lineChart.data.datasets[n].data);
            //DK_SaveToLocalStorage(lineChart.data.datasets[n].label, data);
        }
    }
}

function DKChart_LoadDatasetsFromServer() {
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        const data = DK_LoadFromLocalStorage(lineChart.data.datasets[n].label);
        lineChart.data.datasets[n].data = JSON.parse(data);
    }
    lineChart.update();
}

function DKChart_SaveDatasets(ip) {
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        if (lineChart.data.datasets[n].ip === ip) {
            const data = JSON.stringify(lineChart.data.datasets[n].data);
            DK_SaveToLocalStorage(lineChart.data.datasets[n].label, data);
        }
    }
}

function DKChart_LoadDatasets() {
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        const data = DK_LoadFromLocalStorage(lineChart.data.datasets[n].label);
        lineChart.data.datasets[n].data = JSON.parse(data);
    }
    lineChart.update();
}

function DKChart_ClearDatasets() {
    for (let n = 0; n < lineChart.data.datasets.length; n++) {
        lineChart.data.datasets[n].data = [];
    }
}
