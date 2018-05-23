app.controller('UploadController', ['$scope', '$timeout', 'localStorageService', 'fetcher', 'dialog', function ($scope, $timeout, localStorageService, fetcher, dialog) {
    'use strict';

	// $scope.file	= null;

	$scope.$watch('file', function () {
        if ($scope.file) {
			console.log($scope.file);
			// fetcher.postBulk($scope.file, (result) => {
			// 	if (result.response == 'OK' && result.status_code == 200) {
			// 		dialog.notif('Upload success. Step back and enjoy your coffee while we\'re caching them.' )
			// 	} else {
			// 		dialog.error(result.message);
			// 	}
			// });
		} else if (_.isNull($scope.file)) {
			dialog.error('Your file format is not supported.');
		}
    });
}]);
