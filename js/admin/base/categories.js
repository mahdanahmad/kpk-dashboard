app.controller('CategoriesController', ['$scope', '$timeout', 'localStorageService', 'fetcher', 'dialog', function ($scope, $timeout, localStorageService, fetcher, dialog) {
    'use strict';

	$scope.data		= [];
	$scope.search	= { name: '' };

	let init = () => {
		fetcher.getCategories((result) => {
			if (result.response == 'OK' && result.status_code == 200) {
				$scope.data	= result.result;
			} else {
				dialog.error(result.message);
			}
		});
	}

	$scope.edit		= (id) => {
		fetcher.getCategory(id, (abel) => {
			if (abel.response == 'OK' && abel.status_code == 200) {
				dialog.category(abel.result, (res) => {
					fetcher.putCategory(id, res, (result) => {
						if (result.response == 'OK' && result.status_code == 200) {
							init();
						} else {
							dialog.error(result.message);
						}
					});
				});
			} else {
				dialog.error(abel.message);
			}
		});
	}

	$scope.delete	= (id, name) => {
		dialog.confirm('Are you sure you wanna delete category ' + name + '?', (res) => {
			if (res) {
				fetcher.deleteCategory(id, (result) => {
					if (result.response == 'OK' && result.status_code == 200) {
						init();
					} else {
						dialog.error(result.message);
					}
				});
			}
		});
	}

	$scope.new		= () => {
		dialog.category(null, (res) => {
			fetcher.postCategory(res, (result) => {
				if (result.response == 'OK' && result.status_code == 200) {
					init();
				} else {
					dialog.error(result.message);
				}
			});
		});
	}

	init();
}]);
