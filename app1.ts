/**
 * Created by sheldonbarnes on 10/28/15.
 */


/**
 * Created by sheldonbarnes on 10/28/15.
 */

import MongoClient = require('mongodb').MongoClient;
import assert = require('assert');
var ObjectId = require('assert');
var url = 'mongodb://192.168.2.111:27017/hummingbird';

import express = require('express');

var app = express();
var port = process.env.PORT || 8080;


var current_temp = 1.111111;
var current_humidity = 2.2222222;

app.listen(port);

var weatherobject = {temperature:0, humidity:0, weatherdate: new Date()}

var weatherdata = [];


var findWeatherData = function(res,db, callback) {

    var query =  {"temperature": {$gt: 71.50}};
    var cursor =db.collection('weatherdata').find().sort({"date":-1}).limit(20);

    var arrayData = [];
    var bigDoc = "Hello ";
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            //console.log(doc);
            //res.write(JSON.stringify(doc));
            arrayData.push(doc);
        } else {
            res.write(JSON.stringify(arrayData));
            res.end();
            callback();
        }

    });



};

console.log('Server started at http://localhost:' + port);

app.get('/api/getweather', function (req, res) {


    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findWeatherData(res,db, function() {
            db.close();
        });


    });


});

var insertDocument = function(db, wd1, callback) {
    db.collection('weatherdata').insertOne(wd1, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a weather data information.");
        callback(result);
    });
};

app.get('/api/temphum/:temperature/:humidity', function (req, res) {

    current_temp = +req.params.temperature;
    current_humidity = +req.params.humidity;

    weatherdata.push({temperature:current_temp, humidity:current_humidity, weatherdate: new Date()});

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, {"temperature":current_temp, "humidity":current_humidity, "date": new Date() } , function() {

            db.close();
        });
    });

    console.log(weatherdata[0]);
    res.send('Temperature recorded');

});

export var App = app;