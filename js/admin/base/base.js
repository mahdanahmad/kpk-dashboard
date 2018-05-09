app.controller('BaseController', ['$scope', '$state', '$location', 'localStorageService', 'fetcher', function ($scope, $state, $location, localStorageService, fetcher) {
    'use strict';

	$scope.super	= 0;

	fetcher.getUser(localStorageService.get('_id'), (result) => {
		$scope.super	= _.get(result, 'result.super', 0);
		localStorageService.set('super', _.get(result, 'result.super', 0));
	});

	$scope.menus	= [
		{ title: 'Categories', icon: 'files-o', state: 'categories' },
		{ title: 'Report Types', icon: 'tags', state: 'report' },
		{ title: 'Upload Data', icon: 'cloud-upload', state: 'upload' },
		{ title: 'Users', icon: 'users', state: 'users' },
	];

	$scope.active		= $location.url().split('/')[1];
	$scope.setActive	= (selected) => { $scope.active = selected; $state.go('base.' + selected); }

	$scope.logout		= () => {
		localStorageService.remove('_id', 'super');
		$state.go('auth');
	};
}]);
