(function() {
    var app = angular.module('store',
        ['ngRoute', 'ui.bootstrap', 'ngMap',
	        'storeHome', 'storeMediaCard', 'storeCommon', 'storeUpload', 'storeDetails']
    );

	//API factory
	app.factory('apiService', apiService);

	//Routing
	app.config(function ($routeProvider, $locationProvider) {

		$routeProvider
			.when('/', {
				controller: 'HomeController',
				templateUrl: 'views/home.html'
			})
			.when('/upload', {
				controller: 'UploadController',
				templateUrl: 'views/upload.html'
			})
			.when('/details/:key', {
				controller: 'DetailsController',
				templateUrl: 'views/details.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	});

})();
