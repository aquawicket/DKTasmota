var myConfig;

////////////////////////////////////////////////////////
function CreateChart(parent, top, bottom, left, right) {
    DKLoadJSFile("https://cdn.zingchart.com/zingchart.min.js", function() {
        var myChart = document.createElement("div");
        myChart.id = "myChart";
        myChart.style.position = "absolute";
        myChart.style.width = "90%";
        myChart.style.top = "300px";
        myChart.style.left = "5%";
        myChart.style.height = "500px";
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
    });
}

//////////////////////////////
function UpdateChart(values) {
    myConfig.series[0].values.push(values[0]);
    myConfig.series[1].values.push(values[1]);
    zingchart.render({
        id: 'myChart',
        data: myConfig,
        height: '70%',
        width: '100%'
    });
}
