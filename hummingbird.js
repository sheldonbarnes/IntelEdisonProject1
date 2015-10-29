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

        var onGetRecentTemperaturesComplete = function (response) {
            console.log('Getting Accounts');
            $scope.recenttemps = response.data;
            console.log(response.data);

            $scope.renderChart();

        };

        $scope.getWeatherData = function () {
            console.log('Calling web services to get weather data');
            $http.get("http://192.168.2.111:8080/api/getweather").then(onGetWeatherDataComplete);

        };

        $scope.getRecentTemperatures = function () {
            console.log('Calling web services to get weather data');
            $http.get("http://192.168.2.111:8080/api/getrecenttemp").then(onGetRecentTemperaturesComplete);
            //$http.get("http://192.168.2.111:8080/api/getrecenttemp").then(onGetRecentTemperaturesComplete);

        };

        $scope.getWeatherData();
        $scope.getRecentTemperatures();

        $scope.renderChart = function() {
            var data = {
                labels: ["1", "2", "3", "4", "5", "6", "7","8","9","10"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: $scope.recenttemps

                    }
                ]
            };

            console.log('Rending chart with data ' + data);
            var ctx = document.getElementById("myChart").getContext("2d");
            var options = {

                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,

                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",

                //Number - Width of the grid lines
                scaleGridLineWidth : 1,

                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,

                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,

                //Boolean - Whether the line is curved between points
                bezierCurve : true,

                //Number - Tension of the bezier curve between points
                bezierCurveTension : 0.4,

                //Boolean - Whether to show a dot for each point
                pointDot : true,

                //Number - Radius of each point dot in pixels
                pointDotRadius : 4,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 1,

                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius : 20,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 2,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill : true,

                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

            };

            var myLineChart = new Chart(ctx).Line(data, options);


        }



    };

    app.controller("HummingbirdController", MainController);
}());