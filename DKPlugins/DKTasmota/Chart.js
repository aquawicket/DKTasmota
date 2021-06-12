"use strict";
//https://www.chartjs.org/

dk.taschart = DKPlugin(TasChart)

function TasChart() {}

TasChart.prototype.create = function TasChart_create(chartCanvas) {
    
    dk.gui.createImageButton(chartCanvas.parentNode, "chartSettings", "DKGui/options.png", "2px", "", "", "2px", "15rem", "", this.openChartSettings);
    const ctx = chartCanvas.getContext('2d');
    this.lineChart = new Chart(ctx,{
        type: "line",
        data: {
            datasets: []
        },
        options: {
            //plugins: {
            legend: {
                display: false,
                //}
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
                    radius: 1.6
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
    //    dk.taschart.addDatasets();
    //    dk.taschart.loadDatasets();
    //});

    //FIXME
    dk.taschart.settings = {};
    dk.json.loadJsonFromFile("USER/chart_settings.js", function(json) {
        if (!json) {
            //console.log("json invalid");
            return false;
        }
        dk.taschart.settings = json;
    });
}

TasChart.prototype.openChartSettings = function openChartSettings() {
    const chartSettings = DKFrame.prototype.createNewWindow("Chart Settings", "200rem", "150rem");
    if (!chartSettings)
        return;
    dk.taschart.logToFile = document.createElement("input");
    //dk.taschart.settings.logToFile = false;
    dk.taschart.logToFile.type = "checkbox";
    dk.taschart.logToFile.id = "logToFile";
    if (dk.taschart.settings.logToFile === true)
        dk.taschart.logToFile.checked = true;
    else
        dk.taschart.logToFile.checked = false;
    dk.taschart.logToFile.onchange = function(event) {
        if (dk.taschart.logToFile.checked)
            dk.taschart.settings.logToFile = true;
        else
            dk.taschart.settings.logToFile = false;
        dk.json.saveJsonToFile(dk.taschart.settings, "USER/chart_settings.js");
    }
    chartSettings.appendChild(dk.taschart.logToFile);
    const logToFileLabel = document.createElement("label")
    logToFileLabel.for = dk.taschart.logToFile.id;
    logToFileLabel.innerHTML = "Log Devices to file";
    chartSettings.appendChild(logToFileLabel);
}

TasChart.prototype.addDatasets2 = function TasChart_addDatasets2() {
    dk.tasmota.device("014") && dk.taschart.addDataset("A Tent Temperature", "rgb(200, 0, 0)", dk.tasmota.device("014").ip, "sensor1", true);
    dk.tasmota.device("014") && dk.taschart.addDataset("A Tent Humidity", "rgb(0, 0, 200)", dk.tasmota.device("014").ip, "sensor2", true);
    dk.tasmota.device("014") && dk.taschart.addDataset("A Tent DewPoint", "rgb(0,150,150)", dk.tasmota.device("014").ip, "sensor3", true);
    dk.tasmota.device("011") && dk.taschart.addDataset("A Tent Exhaust Fan", "rgb(10,30,90)", dk.tasmota.device("011").ip, "switch1", true);
    dk.tasmota.device("003") && dk.taschart.addDataset("A Tent Water Walls", "rgb(10,30,50)", dk.tasmota.device("003").ip, "switch1", true);
    //dk.taschart.addDataset("A Tent Heater", "rgb(150,0,50)", dk.tasmota.device("???").ip, "switch1", true);
    //dk.taschart.addDataset("A Tent Co2", "rgb(10,60,10)", dk.tasmota.device("???").ip, "switch1", true);
    //dk.taschart.addDataset("A Tent Lights", "rgb(100,60,10)", dk.tasmota.device("???").ip, "switch1", true);

    dk.tasmota.device("013") && dk.taschart.addDataset("B Tent Temperature", "rgb(200, 0, 0)", dk.tasmota.device("013").ip, "sensor1", true);
    dk.tasmota.device("013") && dk.taschart.addDataset("B Tent Humidity", "rgb(0, 0, 200)", dk.tasmota.device("013").ip, "sensor2", true);
    dk.tasmota.device("013") && dk.taschart.addDataset("B Tent DewPoint", "rgb(0,150,150)", dk.tasmota.device("013").ip, "sensor3", true);
    dk.tasmota.device("005") && dk.taschart.addDataset("B Tent Exhaust Fan", "rgb(150,0,150)", dk.tasmota.device("005").ip, "switch1", true);
    dk.tasmota.device("007") && dk.taschart.addDataset("B Tent Water Walls", "rgb(90,0,150)", dk.tasmota.device("007").ip, "switch1", true);
    dk.tasmota.device("006") && dk.taschart.addDataset("B Tent Heater", "rgb(150,0,50)", dk.tasmota.device("006").ip, "switch1", true);
    dk.tasmota.device("008") && dk.taschart.addDataset("B Tent Co2", "rgb(10,60,10)", dk.tasmota.device("008").ip, "switch1", true);
    //dk.tasmota.device("0") && dk.taschart.addDataset("B Tent Lights", "rgb(100,60,10)", dk.tasmota.device("???").ip, "switch1", true);

    dk.tasmota.device("002") && dk.taschart.addDataset("Shed Water A", "rgb(150,40,40)", dk.tasmota.device("Shed Water A").ip, "switch1", true);
    dk.tasmota.device("001") && dk.taschart.addDataset("Shed Water B", "rgb(30,0,90)", dk.tasmota.device("Shed Water B").ip, "switch1", true);
    dk.tasmota.device("016") && dk.taschart.addDataset("Shed Temperature", "rgb(200,0,0)", dk.tasmota.device("Shed Temp").ip, "sensor1", true);
    dk.tasmota.device("016") && dk.taschart.addDataset("Shed Humidity", "rgb(0, 0, 200)", dk.tasmota.device("Shed Temp").ip, "sensor2", true);
    dk.tasmota.device("016") && dk.taschart.addDataset("Shed DewPoint", "rgb(0,150,150)", dk.tasmota.device("Shed Temp").ip, "sensor3", true);

    dk.tasmota.device("015") && dk.taschart.addDataset("Veg Tent Temperature", "rgb(200, 20, 20)", dk.tasmota.device("015").ip, "sensor1", true);
    dk.tasmota.device("015") && dk.taschart.addDataset("Veg Tent Humidity", "rgb(0, 0, 200)", dk.tasmota.device("015").ip, "sensor2", true);
    dk.tasmota.device("015") && dk.taschart.addDataset("Veg Tent DewPoint", "rgb(0,150,150)", dk.tasmota.device("015").ip, "sensor3", true);
    dk.tasmota.device("012") && dk.taschart.addDataset("Veg Tent Exhaust Fan", "rgb(10,60,10)", dk.tasmota.device("012").ip, "switch1", true);
    dk.tasmota.device("009") && dk.taschart.addDataset("Veg Tent Water Walls", "rgb(90,0,150)", dk.tasmota.device("009").ip, "switch1", true);
    dk.tasmota.device("010") && dk.taschart.addDataset("Veg Tent Co2", "rgb(100,60,10)", dk.tasmota.device("Veg Tent Co2").ip, "switch1", true);
    dk.tasmota.device("004") && dk.taschart.addDataset("Veg Tent Lights", "rgb(100,60,10)", dk.tasmota.device("004").ip, "switch1", true);
}

TasChart.prototype.addDatasets = function TasChart_addDatasets() {
    for (let n = 0; n < dk.tasmota.devices.length; n++) {
        if (!dk.tasmota.devices[n].Status)
            continue;
        const name = dk.tasmota.devices[n].Status.DeviceName;
        const color = dk.gui.randomRGB();
        //"rgb(000,000,150)";
        const ip = dk.tasmota.devices[n].StatusNET.IPAddress;
        const hidden = true;
        if (dk.tasmota.devices[n].StatusSTS.POWER)
            dk.taschart.addDataset(name + " Power", dk.gui.randomRGB(), ip, "switch1", hidden);
        if (dk.tasmota.devices[n].StatusSNS.SI7021) {
            dk.taschart.addDataset(name + " Temperature", dk.gui.randomRGB(), ip, "sensor1", hidden);
            dk.taschart.addDataset(name + " Humidity", dk.gui.randomRGB(), ip, "sensor2", hidden);
            dk.taschart.addDataset(name + " Dewpoint", dk.gui.randomRGB(), ip, "sensor3", hidden);
        }
    }
}

TasChart.prototype.updateDevice = function TasChart_updateDevice(device, identifier, data) {
    if (!device)
        return error("device invalid");
    if (!this.lineChart)
        return warn("this.lineChart invalid");

    dk.taschart.addDatasets();
    //dk.taschart.loadDatasets();
    //dk.taschart.loadDatasetsFromServer(device.ip);

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

            this.lineChart.update();
            dk.taschart.settings.logToFile && dk.taschart.appendDatasetToServer(this.lineChart.data.datasets[n].label, data);
        }
    }

    //this.lineChart.update();
    //dk.taschart.saveDatasetsToLocalStorage(device.ip);
    //dk.taschart.saveDatasetsToServer(device.ip);
    //dk.taschart.settings.logToFile && dk.taschart.appendDatasetToServer(device.user.name, data);
    //dk.taschart.settings.logToFile && dk.taschart.appendDatasetToServer(device.ip);
}

TasChart.prototype.selectChart = function TasChart_selectChart(ip) {
    let borderColor;
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip) {
            this.lineChart.data.datasets[n].hidden = false;
            borderColor = this.lineChart.data.datasets[n].borderColor
        } else {
            this.lineChart.data.datasets[n].hidden = true;
        }
    }
    this.lineChart.update();
    return borderColor;
}

TasChart.prototype.toggleChart = function TasChart_toggleChart(ip) {
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

TasChart.prototype.addDataset = function TasChart_addDataset(label, borderColor, ip, identifier, hidden) {
    if (!ip)
        return error("ip invalid");
    if (!this.lineChart)
        return error("this.lineChart invalid");

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
    //dk.taschart.loadDatasetsFromLocalStorage(ip);
    //dk.taschart.loadDatasetsFromServer(ip);
    this.lineChart.update();
}

TasChart.prototype.appendDatasetToServer = function TasChart_appendDatasetToServer(label, data) {
    const currentdate = new Date();
    const stamp = (currentdate.getMonth() + 1) + "_" + currentdate.getDate() + "_" + currentdate.getFullYear();
    const json = ({
        t: currentdate,
        y: data
    });
    const path = "USER/" + label + ".js";
    dk.json.saveJsonToFile(json, path, "FILE_APPEND"/*, console.debug*/
    );
}

TasChart.prototype.saveDatasetsToServer = function TasChart_saveDatasetsToServer(ip) {
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip || ip === "ALL") {
            const json = this.lineChart.data.datasets[n].data;
            const path = "USER/" + this.lineChart.data.datasets[n].label + ".js";
            const flags = 0;
            dk.json.saveJsonToFile(json, path, flags /*, console.debug*/
            );
        }
    }
}

TasChart.prototype.loadDatasetsFromServer = function TasChart_loadDatasetsFromServer(ip) {
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip || ip === "ALL") {
            let file = "USER/" + this.lineChart.data.datasets[n].label + ".js";
            /*
            dk.json.loadJsonFromFile(file, function(json) {
                dk.taschart.lineChart.data.datasets[n].data = json;
                dk.taschart.lineChart.update();
            })
            */
            dk.file.fileToString(file, function dk_file_fileToString_callback(str) {
                str = '[' + str + ']';
                let json;
                try {
                    json = JSON.parse(str);
                } catch (e) {
                    return error("JSON.parse() failed " + e);
                }
                dk.taschart.lineChart.data.datasets[n].data = json;
                dk.taschart.lineChart.update();
            });
        }
    }
}

TasChart.prototype.saveDatasetsToLocalStorage = function TasChart_saveDatasetsToLoaclStorage(ip) {
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip || ip === "ALL") {
            const data = JSON.stringify(this.lineChart.data.datasets[n].data);
            dk.json.saveToLocalStorage(this.lineChart.data.datasets[n].label, data);
        }
    }
}

TasChart.prototype.loadDatasetsFromLocalStorage = function TasChart_loadDatasetsFromLocalStorage(ip) {
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip || ip === "ALL") {
            const label = this.lineChart.data.datasets[n].label;
            //FIXME: this has to be JSON.parsed twice
            const json = JSON.parse(dk.json.loadFromLocalStorage(label));
            this.lineChart.data.datasets[n].data = json;
        }
    }
    this.lineChart.update();
}

TasChart.prototype.clearDatasets = function TasChart_clearDatasets(ip) {
    for (let n = 0; n < this.lineChart.data.datasets.length; n++) {
        if (this.lineChart.data.datasets[n].ip === ip || ip === "ALL") {
            this.lineChart.data.datasets[n].data = [];
            dk.removeFromLocalStorage(this.lineChart.data.datasets[n].label)
        }
    }
    this.lineChart.update();
}
