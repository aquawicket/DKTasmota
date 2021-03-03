"use strict";
//https://www.chartjs.org/
DKLoadJSFile("https://momentjs.com/downloads/moment.min.js", function() {
    DKLoadJSFile("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js");
});
//
var lineChart;

function CreateChart2(parent, id, top, bottom, left, right, width, height) {
    const chartDiv = document.createElement("div");
    chartDiv.id = id;
    chartDiv.style.position = "absolute";
    chartDiv.style.backgroundColor = "black";
    chartDiv.style.top = top;
    chartDiv.style.bottom = bottom;
    chartDiv.style.left = left;
    chartDiv.style.right = right;
    chartDiv.style.width = width;
    chartDiv.style.height = height;
    parent.appendChild(chartDiv);
    const chartCanvas = document.createElement("canvas");
    chartCanvas.width = "100%";
    chartCanvas.height = "100%";
    var ctx = chartCanvas.getContext('2d');
    chartDiv.appendChild(chartCanvas);

    lineChart = new Chart(ctx,{
        type: "line",
        data: {
            //labels: ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00"],
            datasets: [{
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
            }]
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
}

function UpdateChart2(humidity, temperature, dewPoint) {
    lineChart.data.datasets[0].data.push({
        t: new Date(),
        y: parseFloat(temperature)
    });
    lineChart.data.datasets[1].data.push({
        t: new Date(),
        y: parseFloat(humidity)
    });
    lineChart.update();
}
