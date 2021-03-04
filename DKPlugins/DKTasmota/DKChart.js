"use strict";

//https://www.chartjs.org/
//https://www.chartjs.org/docs/latest/axes/cartesian/time.html
DKLoadJSFile("https://momentjs.com/downloads/moment.min.js", function() {
    DKLoadJSFile("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js");
});

var lineChart;

function CreateChart(parent, id, top, bottom, left, right, width, height) {
    const chartDiv = document.createElement("div");
    chartDiv.id = id;
    chartDiv.style.zIndex = "-2";
    chartDiv.style.position = "absolute";
    chartDiv.style.backgroundColor = "rgb(150,150,150)";
    chartDiv.style.top = top;
    chartDiv.style.bottom = bottom;
    chartDiv.style.left = left;
    chartDiv.style.right = right;
    chartDiv.style.width = width;
    chartDiv.style.height = height;
    parent.appendChild(chartDiv);

    const chartCanvas = document.createElement("canvas");
    chartCanvas.style.zIndex = "-1";
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
            datasets: [/*{
                label: "Temperature",
                data: [],
                fill: false,
                borderColor: "rgb(200, 0, 0)",
                lineTension: 0.1,
            }, {
                label: "Humidity",
                data: [],
                fill: false,
                borderColor: "rgb(0, 0, 200)",
                lineTension: 0.1
            }, {
                label: "Dew Point",
                data: [],
                fill: false,
                borderColor: "rgb(0, 200, 200)",
                lineTension: 0.1
            }*/
            ]
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

    //Save Button
    const saveButton = document.createElement("button");
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
    const loadButton = document.createElement("button");
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

    function UpdateChart(humidity, temperature, dewPoint) {
        dkconsole.debug(LastStackCall());
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
    }

    function AddDataset(name, color) {
        dkconsole.log(LastStackCall());
        var dataset = {};
        dataset.label = name;
        dataset.data = [];
        dataset.fill = false;
        dataset.borderColor = color;
        dataset.lineTension = 0.1;
        lineChart.data.datasets.push(dataset);
        lineChart.update();
    }

    function SaveDatasets() {
        //To Local Storage? To big? Let's try it anyway :)
        //Then maybe real time saveing and loaing with a set gistory length.
        //Auto export weeks to files? months?
        dkconsole.debug(LastStackCall());
        let datasets
        for (let d = 0; d < lineChart.data.datasets.length; d++) {
            datasets = JSON.stringify(lineChart.data.datasets[d].data);
        }

        //if (!datasets.includes(??)) {
        //    datasets = datasets + ?? + "^";
        SaveToLocalStorage("datasets", datasets);
        //}
    }

    function LoadDatasets() {
        dkconsole.debug(LastStackCall());
    }

    function AutoSave() {
        dkconsole.debug(LastStackCall());
        JSON.stringify(lineChart.data.datasets[2].data);
    }

}
