app.controller('CategoriesController', ['$scope', '$timeout', 'localStorageService', 'fetcher', 'dialog', function ($scope, $timeout, localStorageService, fetcher, dialog) {
    'use strict';

	$scope.data		= [];
	$scope.search	= { name: '' };

	let init = () => {
		fetcher.getCategories((result) => {
			if (result.response == 'OK' && result.status_code == 200) {
				$scope.data	= result.result;
			}
		});
	}

	$scope.delete	= (id, name) => {
		dialog.confirm('Are you sure you wanna delete category ' + name + '?', (result) => { console.log(result); });
	}

	init();
}]);
