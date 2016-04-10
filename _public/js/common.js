(function() {
    var app = angular.module('storeCommon', []);

    app.directive('dropzone', function(apiService) {
        return {
            restrict: 'C',
	        scope: {
		      delegate: "="
	        },
            link: function(scope, element, attrs) {
                var config = {
                    url: apiService.apiUploadUrl,
                    maxFilesize: 5,
	                acceptedFiles: "image/*",
                    autoProcessQueue: true,
	                addRemoveLinks: true
                };
                var eventHandlers = {
	                'removedfile': function (file) {
		                console.log(file.uploadedName);
		                var i = scope.delegate.fileNames.indexOf(file.uploadedName);
		                scope.delegate.fileNames.splice(i, 1);
		                apiService.deleteTempUpload(file.uploadedName).success(function() {

		                });
	                },
                    'success': function (file, response) {
	                    file.uploadedName = response.data.file_names[0];
	                    scope.delegate.fileNames.push.apply(scope.delegate.fileNames, response.data.file_names);
                    }
                };
                dropzone = new Dropzone(element[0], config);
	            scope.delegate.dropzone = dropzone;
                angular.forEach(eventHandlers, function(handler, event) {
                    dropzone.on(event, handler);
                });
                scope.processDropzone = function() {
                    dropzone.processQueue();
                };
	            scope.resetDropzone = function() {
		            dropzone.removeAllFiles();
	            };
            }
        }
    });
})();