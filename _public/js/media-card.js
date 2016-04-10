(function() {
	var app = angular.module('storeMediaCard', []);

	app.directive("mediaCard", function() {
		return {
			restrict: 'E',
			templateUrl: "/templates/media-card.html",
			scope: {
				media: '='
			},
			controller: function($scope) {
				console.log($scope.media);
			}
		};
	});
})();
