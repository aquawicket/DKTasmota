"use strict";
//https://www.chartjs.org/
//https://www.chartjs.org/docs/latest/axes/cartesian/time.html
//dk.create("https://momentjs.com/downloads/moment.min.js", function() {
//    dk.create("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js");
//});

dk.chart = new Object;

dk.chart.init = function dk_chart_init(){
    dk.create("DKTasmota/moment.min.js");
    dk.create("DKTasmota/Chart.min.js");
    this.lineChart;
}


dk.chart.create = function dk_chart_create(parent, id, top, bottom, left, right, width, height) {
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
    dk.gui.addResizeHandler(chartCanvas, function() {
        //console.debug("chartCanvas resized: x:"+chartCanvas.style.width+" y:"+chartCanvas.style.height);
        chartCanvas.style.height = "100%";
        //this.lineChart.resize("100%","100%");
    });

    this.lineChart = new Chart(ctx,{
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

    //DKTasmota_InitializeDevices(function() {
    //    dk.chart.addDatasets();
    //    dk.chart.loadDatasets();
    //});
}

dk.chart.addDatasets = function dk_chart_addDatasets() {
    dk.tasmota.device("014") && dk.chart.addDataset("A Tent Temperature", "rgb(200, 0, 0)", dk.tasmota.device("014").ip, "sensor1", true);
    dk.tasmota.device("014") && dk.chart.addDataset("A Tent Humidity", "rgb(0, 0, 200)", dk.tasmota.device("014").ip, "sensor2", true);
    dk.tasmota.device("014") && dk.chart.addDataset("A Tent DewPoint", "rgb(0,150,150)", dk.tasmota.device("014").ip, "sensor3", true);
    dk.tasmota.device("011") && dk.chart.addDataset("A Tent Exhaust Fan", "rgb(10,30,90)", dk.tasmota.device("011").ip, "switch1", true);
    dk.tasmota.device("003") && dk.chart.addDataset("A Tent Water Walls", "rgb(10,30,50)", dk.tasmota.device("003").ip, "switch1", true);
    //dk.chart.addDataset("A Tent Heater", "rgb(150,0,50)", dk.tasmota.device("???").ip, "switch1", true);
    //dk.chart.addDataset("A Tent Co2", "rgb(10,60,10)", dk.tasmota.device("???").ip, "switch1", true);
    //dk.chart.addDataset("A Tent Lights", "rgb(100,60,10)", dk.tasmota.device("???").ip, "switch1", true);

    dk.tasmota.device("013") && dk.chart.addDataset("B Tent Temperature", "rgb(200, 0, 0)", dk.tasmota.device("013").ip, "sensor1", true);
    dk.tasmota.device("013") && dk.chart.addDataset("B Tent Humidity", "rgb(0, 0, 200)", dk.tasmota.device("013").ip, "sensor2", true);
    dk.tasmota.device("013") && dk.chart.addDataset("B Tent DewPoint", "rgb(0,150,150)", dk.tasmota.device("013").ip, "sensor3", true);
    dk.tasmota.device("005") && dk.chart.addDataset("B Tent Exhaust Fan", "rgb(150,0,150)", dk.tasmota.device("005").ip, "switch1", true);
    dk.tasmota.device("007") && dk.chart.addDataset("B Tent Water Walls", "rgb(90,0,150)", dk.tasmota.device("007").ip, "switch1", true);
    dk.tasmota.device("006") && dk.chart.addDataset("B Tent Heater", "rgb(150,0,50)", dk.tasmota.device("006").ip, "switch1", true);
    dk.tasmota.device("008") && dk.chart.addDataset("B Tent Co2", "rgb(10,60,10)", dk.tasmota.device("008").ip, "switch1", true);
    //dk.tasmota.device("0") && dk.chart.addDataset("B Tent Lights", "rgb(100,60,10)", dk.tasmota.device("???").ip, "switch1", true);

    dk.tasmota.device("002") && dk.chart.addDataset("Shed Water A", "rgb(150,40,40)", dk.tasmota.device("Shed Water A").ip, "switch1", true);
    dk.tasmota.device("001") && dk.chart.addDataset("Shed Water B", "rgb(30,0,90)", dk.tasmota.device("Shed Water B").ip, "switch1", true);
    dk.tasmota.device("016") && dk.chart.addDataset("Shed Temp", "rgb(30,0,90)", dk.tasmota.device("Shed Temp").ip, "sensor1", true);

    dk.tasmota.device("015") && dk.chart.addDataset("Veg Tent Temperature", "rgb(200, 20, 20)", dk.tasmota.device("015").ip, "sensor1", true);
    dk.tasmota.device("015") && dk.chart.addDataset("Veg Tent Humidity", "rgb(0, 0, 200)", dk.tasmota.device("015").ip, "sensor2", true);
    dk.tasmota.device("015") && dk.chart.addDataset("Veg Tent DewPoint", "rgb(0,150,150)", dk.tasmota.device("015").ip, "sensor3", true);
    dk.tasmota.device("012") && dk.chart.addDataset("Veg Tent Exhaust Fan", "rgb(10,60,10)", dk.tasmota.device("012").ip, "switch1", true);
    dk.tasmota.device("009") && dk.chart.addDataset("Veg Tent Water Walls", "rgb(90,0,150)", dk.tasmota.device("009").ip, "switch1", true);
    dk.tasmota.device("010") && dk.chart.addDataset("Veg Tent Co2", "rgb(100,60,10)", dk.tasmota.device("Veg Tent Co2").ip, "switch1", true);
    dk.tasmota.device("004") && dk.chart.addDataset("Veg Tent Lights", "rgb(100,60,10)", dk.tasmota.device("004").ip, "switch1", true);
}

dk.chart.updateDevice = function dk_chart_updateDevice(device, identifier, data) {
    if (!device)
        return error("device invalid");

    dk.chart.addDatasets();
    dk.chart.loadDatasets();

    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (device.ip === this.lineChart.data.datasets[n].ip && identifier === this.lineChart.data.datasets[n].identifier) {
            if (identifier.includes("switch")) {
                const ex = this.lineChart.data.datasets[n].data;
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
                const tData = this.lineChart.data.datasets[n].data;
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

    this.lineChart.update();
    dk.chart.saveDatasets(device.ip);
    dk.chart.appendDatasetToServer(device.user.name, data);
}

dk.chart.selectChart = function dk_chart_selectChart(ip) {
    let borderColor;
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip) {
            this.lineChart.data.datasets[n].hidden = false;
            /*!borderColor && (*/
            borderColor = this.lineChart.data.datasets[n].borderColor
            //);
        } else {
            this.lineChart.data.datasets[n].hidden = true;
        }
    }
    this.lineChart.update();
    return borderColor;
}

dk.chart.toggleChart = function dk_chart_toggleChart(ip) {
    let borderColor;
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip) {
            this.lineChart.data.datasets[n].hidden ? this.lineChart.data.datasets[n].hidden = false : this.lineChart.data.datasets[n].hidden = true;
            !this.lineChart.data.datasets[n].hidden && !borderColor && (borderColor = this.lineChart.data.datasets[n].borderColor);
        }
    }
    this.lineChart.update();
    return borderColor;
}

dk.chart.addDataset = function dk_chart_addDataset(label, borderColor, ip, identifier, hidden) {
    if (!ip)
        return error("ip invalid");

    //no duplicates
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].label === label) {
            return false;
        }
    }

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
            this.lineChart.data.datasets.push(devices[n].dataset);
        }
    }
    */

    this.lineChart.data.datasets.push(dataset);
    this.lineChart.update();
}

dk.chart.appendDatasetToServer = function dk_chart_appendDatasetToServer(label, data) {
    const currentdate = new Date();
    const stamp = (currentdate.getMonth() + 1) + "_" + currentdate.getDate() + "_" + currentdate.getFullYear();
    const entry = JSON.stringify({
        t: currentdate,
        y: data
    });

    var prefix = "";
    prefix = dk.file.online_assets;
    dk.php.stringToFile(prefix + "/"+stamp + "_" + label + ".txt", entry, "FILE_APPEND", function(rval) {//rval && console.log(rval);
    });
}

dk.chart.saveDatasetToServer = function dk_chart_saveDatasetToServer(ip) {//TODO
/*
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip) {
            const data = JSON.stringify(this.lineChart.data.datasets[n].data);
            //dk.saveToLocalStorage(this.lineChart.data.datasets[n].label, data);
        }
    }
    */
}

dk.chart.loadDatasetsFromServer = function dk_chart_loadDatasetsFromServer() {//TODO
/*
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        const data = dk.loadFromLocalStorage(this.lineChart.data.datasets[n].label);
        this.lineChart.data.datasets[n].data = JSON.parse(data);
    }
    this.lineChart.update();
    */
}

dk.chart.saveDatasets = function dk_chart_saveDatasets(ip) {
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip) {
            const data = JSON.stringify(this.lineChart.data.datasets[n].data);
            dk.saveToLocalStorage(this.lineChart.data.datasets[n].label, data);
        }
    }
}

dk.chart.loadDatasets = function dk_chart_loadDatasets() {
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        const data = dk.loadFromLocalStorage(this.lineChart.data.datasets[n].label);
        this.lineChart.data.datasets[n].data = JSON.parse(data);
    }
    this.lineChart.update();
}

dk.chart.clearDatasets = function dk_chart_clearDatasets() {
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        this.lineChart.data.datasets[n].data = [];
        dk.removeFromLocalStorage(this.lineChart.data.datasets[n].label)
    }
    this.lineChart.update();
}
