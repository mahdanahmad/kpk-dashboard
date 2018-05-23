app.controller('LogsController', ['$scope', '$timeout', 'localStorageService', 'fetcher', 'dialog', function ($scope, $timeout, localStorageService, fetcher, dialog) {
    'use strict';

	$scope.data		= [];

	let init = () => {
		fetcher.getFiles((result) => {
			if (result.response == 'OK' && result.status_code == 200) {
				$scope.data	= result.result;
			} else {
				dialog.error(result.message);
			}
		});
	}

	init();
}]);
