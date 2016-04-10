function apiService($http, $rootScope) {
	var apiUrl = "http://162.243.226.35/api/";
	var forecastApiUrl = "http://162.243.226.35/forecast/"


	var api = {apiUrl : apiUrl, forecastApiUrl:forecastApiUrl};

	api.getForecast = function(latitude, longitude) {
		return $http.get(forecastApiUrl + 'forecast?latitude=' + latitude + '&longitude=' + longitude);
	};

	api.getWeatherHistory = function(latitude, longitude, time) {
		return $http.get(forecastApiUrl + 'forecast?latitude=' + latitude + '&longitude=' + longitude + '&time=' + time);
	};

	return api;
}

//return $http.get(apiUrl + 'shops')
//    .success(function (data) {
//    })
//    .error(function (err) {
//    });