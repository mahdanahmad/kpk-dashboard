app.controller('AuthController', ['$scope', '$rootScope', '$location', 'localStorageService', function ($scope, $rootScope, $location, localStorageService) {
    'use strict';

	$scope.username	= localStorageService.get('username');
	$scope.password	= '';

	$scope.errormsg	= '';

	$scope.signin	= () => {
		console.log($scope.username);
		console.log($scope.password);
	}

	$scope.disabled	= () => ((_.isEmpty($scope.username) || _.isNil($scope.username)) || (_.isEmpty($scope.password) || _.isNil($scope.password)));
	// $scope.disabled	= () => (false);

}]);
