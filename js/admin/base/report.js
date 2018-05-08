app.controller('ReportController', ['$scope', '$timeout', 'localStorageService', 'fetcher', 'dialog', function ($scope, $timeout, localStorageService, fetcher, dialog) {
    'use strict';

	$scope.data		= [];
	$scope.search	= { delik: '' };

	let init = () => {
		fetcher.getReports((result) => {
			if (result.response == 'OK' && result.status_code == 200) {
				$scope.data	= result.result;
			} else {
				dialog.error(result.message);
			}
		});
	}

	$scope.edit		= (id) => {
		fetcher.getReport(id, (abel) => {
			if (abel.response == 'OK' && abel.status_code == 200) {
				dialog.report(abel.result, (res) => {
					if (res) {
						fetcher.putReport(id, res, (result) => {
							if (result.response == 'OK' && result.status_code == 200) {
								init();
							} else {
								dialog.error(result.message);
							}
						});
					}
				});
			} else {
				dialog.error(abel.message);
			}
		});
	}

	$scope.delete	= (id, name) => {
		dialog.confirm('Are you sure you wanna delete type ' + name + '?', (res) => {
			if (res) {
				fetcher.deleteReport(id, (result) => {
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
		dialog.report(null, (res) => {
			if (res) {
				fetcher.postReport(res, (result) => {
					if (result.response == 'OK' && result.status_code == 200) {
						init();
					} else {
						dialog.error(result.message);
					}
				});
			}
		});
	}

	init();
}]);
