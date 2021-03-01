"use strict";
// https://www.zingchart.com/

var myConfig;

/////////////////////////////////////////////////////////////////////////
function CreateChart(parent, id, top, bottom, left, right, width, height, callback) {
    DKLoadJSFile("https://cdn.zingchart.com/zingchart.min.js", function() {
        var myChart = document.createElement("div");
        myChart.id = "myChart";
        myChart.style.position = "absolute";
        myChart.style.top = top;
        myChart.style.bottom = bottom;
        myChart.style.left = left;
        myChart.style.right = right;
        myChart.style.width = width;
        myChart.style.height = height;
        parent.appendChild(myChart);
        var d = new Date();
        var millisec = d.getTime();
        myConfig = {
            type: "line",
            bottom: "10px",
            x: "1%",
         y : "25%",
         height: "100%",
            'scale-x': {
                'min-value': millisec,
                step: "1minute",
                transform: {
                    type: "date",
                    all: "%m/%d/%Y<br>%h:%i:%s %A"
                },
                item: {
                    'font-size': 9
                }
            },
            /*
            legend: {
                draggable: true,
            },
            */
            /*
            scaleY: {
                // Scale label with unicode character
                label: {
                    text: 'Temperature (°F)'
                }
            },
            */
            utc: true,
            timezone: -8,
            series: [{
                text: 'Temperature',
                values: [],
            }, {
                values: []
            }, {
                values: []
            }]
        };

        zingchart.render({
            id: 'myChart',
            data: myConfig,
            height: '100%',
            width: '100%'
        });

        callback && callback();
    });
}

/////////////////////////////////////////////////////
function UpdateChart(humidity, temperature, dewPoint) {
    dkconsole.debug("temperature = " + parseFloat(temperature));
    dkconsole.debug("humidity = " + parseFloat(humidity));
    dkconsole.debug("dewPoint = " + parseFloat(dewPoint));
    myConfig.series[0].values.push(parseFloat(humidity));
    myConfig.series[1].values.push(parseFloat(temperature));
    myConfig.series[2].values.push(parseFloat(dewPoint));
    zingchart.render({
        id: 'myChart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });
}
