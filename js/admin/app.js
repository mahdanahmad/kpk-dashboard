var angular	= angular;
var app		= angular.module('app', ['ui.router', ('ct.ui.router.extras.core'), 'permission', 'permission.ui', 'LocalStorageModule', 'angular-loading-bar', 'ngAnimate']);

app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', 'localStorageServiceProvider', 'cfpLoadingBarProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider, cfpLoadingBarProvider) {
    'use strict';

	// use the HTML5 History API
    // $locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise( function($injector) {
		let $state = $injector.get("$state");
		$state.go('auth');
	});

	$stateProvider
        .state('auth', {
            url         : '/auth',
            templateUrl : 'auth.html',
            controller  : 'AuthController',
            // data        : { permissions: { except: ['isAuthorized'], redirectTo: 'dashboard.statistic' } }
        })

	localStorageServiceProvider.setPrefix('kpk-dashboard');
	cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
}]);

app.controller('MainController', ['$scope', '$rootScope', '$location', 'localStorageService', function ($scope, $rootScope, $location, localStorageService) {
    'use strict';

}]);

app.run(['PermPermissionStore', 'localStorageService', '$templateCache', function(PermPermissionStore, localStorageService, $templateCache) {
    PermPermissionStore.definePermission('isAuthorized', () => (!_.isNull(localStorageService.get('id'))));

}]);
