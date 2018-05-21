app.controller('UploadController', ['$scope', '$timeout', 'localStorageService', 'fetcher', 'dialog', function ($scope, $timeout, localStorageService, fetcher, dialog) {
    'use strict';

	// $scope.file	= null;

	$scope.$watch('file', function () {
        if ($scope.file) {
			console.log($scope.file);
		} else if (_.isNull($scope.file)) {
			dialog.error('Your file format is not supported.');
		}
    });
}]);
