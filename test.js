
console.log("Starting HummingBird Weather Sensor");


var five = require("johnny-five");
var Edison = require("edison-io");
var sleep = require("sleep");

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('assert');
var url = 'mongodb://192.168.2.111:27017/hummingbird';


var insertDocument = function(db, wd1, callback) {
    db.collection('weatherdata').insertOne(wd1, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a weather data information.");
        callback(result);
    });
};


var board = new five.Board ({
  io: new Edison()
});


var http = require('http');
var fs = require('fs');


var current_humidity = 0;
var current_temperature = 0;

board.on("ready", function() {

var temperature = new five.Temperature({
  controller: "HTU21D"
});

var humidity = new five.Hygrometer({
   controller: "HTU21D"
});


    humidity.on("data", function() {

        current_humidity = this.relativeHumidity;
        console.log("Humidity is " + this.relativeHumidity);

        //sleep.sleep(15);


    });

    temperature.on("data", function() {


        current_temperature = this.fahrenheit;


    sleep.sleep(15);

      console.log("The temperature is " + current_temperature);


        if (current_humidity != 0 && current_temperature!=0) {


            console.log("Logging current temperature to database");
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                insertDocument(db, {
                    "temperature": current_temperature,
                    "humidity": current_humidity,
                    "date": new Date()
                }, function () {

                    db.close();
                });
            });
        }


    });

});







