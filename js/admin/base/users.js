app.controller('UsersController', ['$scope', '$timeout', 'localStorageService', 'fetcher', 'dialog', function ($scope, $timeout, localStorageService, fetcher, dialog) {
    'use strict';

	$scope.data		= [];
	$scope.search	= { username: '' };

	let init = () => {
		fetcher.getUsers((result) => {
			if (result.response == 'OK' && result.status_code == 200) {
				$scope.data	= result.result;
			} else {
				dialog.error(result.message);
			}
		});
	}

	$scope.edit		= (id) => {
		fetcher.getUser(id, (abel) => {
			if (abel.response == 'OK' && abel.status_code == 200) {
				dialog.user(abel.result, (res) => {
					if (res) {
						if (res.password == '') { delete res.password; } else { res.password = CryptoJS.SHA256(res.password).toString(); }
						fetcher.putUser(id, res, (result) => {
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
		dialog.confirm('Are you sure you wanna delete user ' + name + '?', (res) => {
			if (res) {
				fetcher.deleteUser(id, (result) => {
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
		dialog.user(null, (res) => {
			if (res) {
				fetcher.postUser(_.assign(res, { password: CryptoJS.SHA256(res.password).toString() }), (result) => {
					if (result.response == 'OK' && result.status_code == 200) {
						init();
					} else {
						dialog.error(result.message);
					}
				});
			}
		});
	}

	$scope.isCurrent	= (id) => (localStorageService.get('_id') !== id);
	init();
}]);
