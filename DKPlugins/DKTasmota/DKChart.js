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
            utc: true,
            timezone: -8,
            series: [{
                values: []
            }, {
                values: []
            }]
        };

        zingchart.render({
            id: 'myChart',
            data: myConfig,
            height: '70%',
            width: '100%'
        });

        callback();
    });
}

////////////////////////////////////
function UpdateChart(Temp, Humidity) {
    dkConsole.log("Temp = "+parseFloat(Temp));            //Temp.toFixed(1)?
    dkConsole.log("Humidity = "+parseFloat(Humidity));    //Humidity.toFixed(1)?
    myConfig.series[1].values.push(parseFloat(Temp));     //Temp.toFixed(1)?
    myConfig.series[0].values.push(parseFloat(Humidity)); //Humidity.toFixed(1)?
    zingchart.render({
        id: 'myChart',
        data: myConfig,
        height: '70%',
        width: '100%'
    });
}
