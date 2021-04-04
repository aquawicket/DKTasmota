//http://www.steves-internet-guide.com/using-javascript-mqtt-client-websockets/

"use strict";

DKLoadJSFile("mqttws31.min.js");

var mqtt;
var reconnectTimeout = 2000;
var host = "192.168.1.78";
var port = 9001;

function onMQTTConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Mqtt Connected ");
    //mqtt.subscribe("sensor1");
    message = new Paho.MQTT.Message("Hello World");
    message.destinationName = "sensor1";
    mqtt.send(message);
}

function MQTTconnect() {
    console.log("connecting to " + host + " " + port);
    var x = Math.floor(Math.random() * 10000);
    var cname = "orderform-" + x;
    mqtt = new Paho.MQTT.Client(host,port,cname);
    //document.write("connecting to "+ host);
    var options = {

        timeout: 3,
        onSuccess: onMQTTConnect,

    };

    mqtt.connect(options);
    //connect
}