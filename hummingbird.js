/**
 * Created by sheldonbarnes on 10/29/15.
 */

(function () {

    var app = angular.module('Hummingbird', []);

    var MainController = function ($scope, $http) {

        console.log('Hello world');


        $scope.deletedCount = 0;

        var onGetWeatherDataComplete = function (response) {
            console.log('Getting Accounts');
            $scope.weatherData = response.data;
            console.log(response);

        };




        $scope.getWeatherData = function () {
            console.log('Calling web services to get weather data');
            $http.get("http://192.168.2.111:8080/api/getweather").then(onGetWeatherDataComplete);

        }

        $scope.getWeatherData();

    };

    app.controller("HummingbirdController", MainController);
}());