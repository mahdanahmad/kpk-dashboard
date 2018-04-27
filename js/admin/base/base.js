app.controller('BaseController', ['$scope', '$state', '$location', 'localStorageService', 'fetcher', function ($scope, $state, $location, localStorageService, fetcher) {
    'use strict';


	$scope.menus	= [
		{ title: 'Categories', icon: 'files-o', state: 'categories' },
		{ title: 'Report Types', icon: 'tags', state: 'report' },
		{ title: 'Upload Data', icon: 'cloud-upload', state: 'upload' },
		{ title: 'Users', icon: 'users', state: 'users' },
	];

	$scope.active		= '';
	$scope.setActive	= (selected) => { $scope.active = selected; }

	$scope.logout		= () => {
		localStorageService.remove('id', 'role');
		$state.go('auth');
	};
}]);
