(function() {
	var app = angular.module('storeDetails', []);

	app.controller('DetailsController', function($scope, $routeParams, apiService){

		var firebaseRef = new Firebase('https://amber-inferno-8172.firebaseio.com/images');

		var key = $routeParams.key;

		firebaseRef.child(key).on("value", function(snapshot) {
			var image_object = snapshot.val();
			var imgElement = document.getElementById("photo");
			var detailsElement = document.getElementById("details");

			imgElement.src = image_object.src;

			var str="";
			str += "      <h2><b><u> EXIF <\/u><\/b><\/h2>";
			str += "      MAKE: " + image_object.make + "<br>";
			str += "      MODEL: " + image_object.Model + "<br>";
			str += "      DATE/TIME: " + image_object.DateTime + "<br>";
			str += "      EXPOSURE TIME: " + 1/image_object.ExposureTime + "<br>";
			str += "      F-NUMBER: " + "f/" + image_object.FNumber + "<br>";
			str += "      ISO-SPEED-RATINGS: " + "1/" +image_object.ISOSpeedRatings + "<br>";
			str += "      FOCAL-LENGTH: " + image_object.FocalLength + "<br>";
			str += "      PIXEL: " + image_object.PixelXDimension + " x " + image_object.PixelYDimension + " px <br>";



			// 41°25'N and 120°58'W

			if (image_object.Latitude != -90){
				var n = image_object.Latitude.toFixed(2).replace('.', '°');
				var w = image_object.Longitude.toFixed(2).replace('.', '°');
				var coor = "      COORDINATES : " + n +"'N  " + w + "'W<br>";
				str += coor;
			}

			detailsElement.innerHTML = str;


			function getWeatherHistory(lat, lng, time) {
				apiService.getForecast(lat, lng, time).success(function(data) {
					console.log(data);
					$scope.weather.currently = data.currently;
				});
			}

		}, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
	});
})();
