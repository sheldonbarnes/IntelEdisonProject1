/**
 * Created by sheldonbarnes on 10/28/15.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('assert');
var url = 'mongodb://192.168.2.111:27017/hummingbird';

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;


var current_temp = 1.111111;
var current_humidity = 2.2222222;

app.listen(port);

var weatherdata = [];



var findWeatherData = function(res,db, callback) {

    //var query =  {"temperature": {$gt: 71.50}};
    var cursor =db.collection('weatherdata').find().sort({"date":-1}).limit(20);

    var arrayData = [];
    //var bigDoc = "Hello ";
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


var findRecentTemp = function(res,db, callback) {

    var cursor =db.collection('weatherdata').find({}, {"temperature":1,_id:0}).sort({"date":-1}).limit(20);

    var arrayData = [];
    var goodArray = [];

    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.log(doc);
            console.log(doc.temperature);
            goodArray.push(doc.temperature);
            //res.write(JSON.stringify(doc));
            arrayData.push(doc);
        } else {
            res.write(JSON.stringify(goodArray));
            res.end();
            callback();
        }

    });



};
console.log('Server started at http://localhost:' + port);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/getweather', function (req, res) {


    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findWeatherData(res,db, function() {
            db.close();
        });


    });


});

app.get('/api/getrecenttemp', function (req, res) {


    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findRecentTemp(res,db, function() {
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

