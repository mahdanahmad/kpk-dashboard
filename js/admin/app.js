var angular	= angular;
var app		= angular.module('app', ['ui.router', ('ct.ui.router.extras.core'), 'permission', 'permission.ui', 'LocalStorageModule', 'angular-loading-bar', 'ngAnimate', '720kb.tooltips', 'ngDialog', 'minicolors', 'ngFileUpload']);

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
            data        : { permissions: { except: ['isAuthorized'], redirectTo: 'base.categories' } }
        })
        .state('base', {
            url         : '/',
            templateUrl : 'base.html',
            controller  : 'BaseController',
			abstract    : true,
            data        : { permissions: { only: ['isAuthorized'], redirectTo: 'auth' } }
        })
	        .state('base.categories', {
	            url         : 'categories',
	            templateUrl : 'categories.html',
	            controller  : 'CategoriesController'
	        })
	        .state('base.report', {
	            url         : 'report',
	            templateUrl : 'report.html',
	            controller  : 'ReportController'
	        })
	        .state('base.upload', {
	            url         : 'upload',
	            templateUrl : 'upload.html',
	            controller  : 'UploadController'
	        })
	        .state('base.logs', {
	            url         : 'logs',
	            templateUrl : 'logs.html',
	            controller  : 'LogsController'
	        })
	        .state('base.users', {
	            url         : 'users',
	            templateUrl : 'users.html',
	            controller  : 'UsersController',
				data        : { permissions: { only: ['isSuper'], redirectTo: 'base.categories' } }
	        })

	localStorageServiceProvider.setPrefix('kpk-dashboard');
	cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
}]);

app.controller('MainController', ['$scope', '$rootScope', '$location', 'localStorageService', function ($scope, $rootScope, $location, localStorageService) {
    'use strict';

}]);

app.run(['PermPermissionStore', 'localStorageService', '$templateCache', function(PermPermissionStore, localStorageService, $templateCache) {
    PermPermissionStore.definePermission('isAuthorized', () => (!_.isNull(localStorageService.get('_id'))));
    PermPermissionStore.definePermission('isSuper', () => (localStorageService.get('super')));

}]);
