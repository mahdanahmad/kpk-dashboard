app.controller('AuthController', ['$scope', '$state', 'localStorageService', 'fetcher', function ($scope, $state, localStorageService, fetcher) {
    'use strict';

	const defmsg	= "Hello there! Insert your credetial below to start managing this dashboard.";

	$scope.username	= localStorageService.get('username');
	$scope.password	= '';

	$scope.msg		= defmsg;
	$scope.iserror	= false;

	$scope.signin	= () => {
		let data	= { username: $scope.username, password: CryptoJS.SHA256($scope.password).toString() };

		fetcher.postAuth(data, (result) => {
			if (result.response == 'OK' && result.status_code == 200) {
				localStorageService.set('_id', result.result);
				localStorageService.set('username', $scope.username);

				$state.go('base');
			} else {
				$scope.iserror	= true;
				$scope.msg		= result.message;
			}
		});
	}

	$scope.disabled	= () => ((_.isEmpty($scope.username) || _.isNil($scope.username)) || (_.isEmpty($scope.password) || _.isNil($scope.password)));
}]);
