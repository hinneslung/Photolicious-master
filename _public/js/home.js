(function() {
	var app = angular.module('storeHome', []);

	app.controller('HomeController', function($scope, apiService, NgMap){
		$scope.self = $scope;

		$scope.positions = [];
		$scope.medias = [];

		$scope.weather = {};

		NgMap.getMap().then(function(map) {
			console.log(map.getCenter());
			console.log('markers', map.markers);
			console.log('shapes', map.shapes);

			var nightMapType = new google.maps.ImageMapType({
				getTileUrl: function(tile, zoom) {
					tile = getNormalizedCoord(tile, zoom);
					if(!tile)
						return null;
					var resolution = String('000000'+256*Math.pow(2,zoom)).slice(-6);
					var yCoo = padTileCoordinate(tile.y,zoom);
					var xCoo = padTileCoordinate(tile.x,zoom);
					var subDir = resolution + (zoom==10 ? '/' + yCoo.toString().substring(0,2) : '');

					// var http_get = httpGet('http://www.youcanseethemilkyway.com/light-pollution/get.php?subDir=' + subDir +'&jpg=' + resolution + '_' + yCoo + '_' + xCoo + '.jpg');
					var http_get = 1;
					if(http_get == 1){
						return 'http://www.youcanseethemilkyway.com/light-pollution/img/' + subDir + '/' + resolution + '_' + yCoo + '_' + xCoo + '.jpg'
					} else {
						return 'http://blue-marble.de/google/tiles_n2012/' + subDir + '/' + resolution + '_' + yCoo + '_' + xCoo + '.jpg'
					}
				},
				tileSize: new google.maps.Size(256, 256),
				maxZoom: maxZoom,
				name: "Night"
			});
		});

		getNearbyImageIds(38.9836313, -76.9424164, 10);
		getWeather(38.9836313, -76.9424164);

		$scope.dragEnd = function(event) {
			console.log(event.latLng.lat());
			console.log(event.latLng.lng());

			$scope.positions = [];
			$scope.medias = [];

			getNearbyImageIds(event.latLng.lat(), event.latLng.lng(), 2000);
			getWeather(event.latLng.lat(), event.latLng.lng());
		};

		function getWeather(lat, lng) {
			apiService.getForecast(lat, lng).success(function(data) {
				console.log(data);
				$scope.weather.currently = data.currently;
				$scope.weather.hourly = data.hourly.data;
			});
		}

		function getNearbyImageIds(lat, lng, radius) {
			var firebaseRef = new Firebase("https://amber-inferno-8172.firebaseio.com/geoFire");
			var geoFire = new GeoFire(firebaseRef);

			var geoQuery = geoFire.query({
				center: [lat, lng],
				radius: radius
			});

			geoQuery.on("key_entered", function(key, location, distance) {
				console.log( key + " " + location + " " + distance + " km away)");

				$scope.positions.push(location);
				$scope.$apply();
				getImageById(key, distance);
			});
		}

		function getImageById(key, distance) {
			new Firebase('https://amber-inferno-8172.firebaseio.com/images/' + key).once('value', function(snap) {
				console.log('I fetched an image!', snap.val());

				if (distance > 100)
					return;

				for (var i = 0; i < $scope.medias.length; i++)
					if ($scope.medias[i].key === key)
						return;

				var image64 = snap.val();

				var image = new Image();
				image.src = image64.src;
				image.key = key;
				image.distance = distance;

				$scope.medias.push(image);
				$scope.medias.sort(
					function(x, y) { return x.distance > y.distance; }
				);
				$scope.$apply();
			});
		}
	});
})();
