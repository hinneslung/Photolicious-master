(function() {
	var app = angular.module('storeUpload', []);

	app.controller('UploadController', function($scope){
		var firebaseUrl = 'https://amber-inferno-8172.firebaseio.com/';

		// This function uploads data into Firebase
		function handleFileSelect(evt) {
			var f = evt.target.files[0];
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					var filePayload = e.target.result;
					// Generate a location that can't be guessed using the file's contents and a random number
					var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
					var f = new Firebase(firebaseUrl + 'images/' + hash + '/src');

					f.set(filePayload, function() {
						// Update the location bar so the URL can be shared with others
						window.location.hash = hash;
					});

					f.once('value', function(snap) {
						var img64 = snap.val();
						var image = new Image();

						var length = 900;
						var minified = MinifyJpeg.minify(img64, length);
						var enc = "data:image/jpeg;base64," + MinifyJpeg.encode64(minified);

						image.src = enc;
						image.onload = function() {
							EXIF.getData(image, function() {
								var Make = EXIF.getTag(image, "Make");
								var Model = EXIF.getTag(image, "Model");
								var DateTime = EXIF.getTag(image, "DateTime");
								var ExposureTime = EXIF.getTag(image, "ExposureTime");
								var ISOSpeedRatings = EXIF.getTag(image, "ISOSpeedRatings");
								var FNumber = EXIF.getTag(image, "FNumber");
								var PixelXDimension = EXIF.getTag(image, "PixelXDimension");
								var PixelYDimension = EXIF.getTag(image, "PixelYDimension");
								var FocalLength = EXIF.getTag(image, "FocalLength");

								// Manipulating GPS coordinate
								var lat = EXIF.getTag(image, "GPSLatitude");
								var lon = EXIF.getTag(image, "GPSLongitude");
								if (lat != null && lon != null){
									var latRef = EXIF.GPSLatitudeRef || "N";
									var lonRef = EXIF.GPSLongitudeRef || "W";
									lat = (lat[0] + lat[1]/60 + lat[2]/3600) * (latRef == "N" ? 1 : -1);
									lon = (lon[0] + lon[1]/60 + lon[2]/3600) * (lonRef == "W" ? -1 : 1);
								} else {
									// Some images might not have GPS location detail, set it to -999 then
									lat = -90;
									lon = -90;
								}

								var fb = new Firebase(firebaseUrl + 'images/' + hash);
								//adding Metadata into firebase
								fb.update({
									"make": Make,
									"Model": Model,
									"DateTime": DateTime,
									"ExposureTime":ExposureTime,
									"ISOSpeedRatings":ISOSpeedRatings,
									"FNumber":FNumber,
									"PixelXDimension":PixelXDimension,
									"PixelYDimension":PixelYDimension,
									"FocalLength":FocalLength,
									"Latitude":lat,
									"Longitude":lon,
									"src":enc
								});

								hash = "" + hash;
								var firebaseRef = new Firebase("https://amber-inferno-8172.firebaseio.com/geoFire");
								var geoFire = new GeoFire(firebaseRef);
								console.log("hash: "+ hash);
								geoFire.set(hash, [lat,lon]).then(function() {
									console.log("Provided key has been added to GeoFire");
								}, function(error) {
									console.log("Error: " + error);
								});

							});
						};

					});

				};
			})(f);

			reader.readAsDataURL(f);



		}


		var firebaseRef = new Firebase('https://amber-inferno-8172.firebaseio.com/');
		firebaseRef.child('images').on('child_added', function(snapshot) {
			var image64 = snapshot.val();
			var data = "<img src=\'" + image64.src + "\'/>";
			document.getElementById('result').innerHTML += data;

		});


		$(function() {
			document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);
		});

	});
})();
