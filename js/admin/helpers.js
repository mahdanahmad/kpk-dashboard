app.factory('dialog', ['ngDialog', function(ngDialog) {
	'use strict';

	let createDialog = (content, template, controller, width, showClose, additionalClass) => (
		ngDialog.open({
			template: 'dialogs/' + template + '.html',
			className: 'ngdialog-theme-default' + (additionalClass ? (' ' + additionalClass) : ''),
			data: { content: content },
			width: width ? width : 450,
			showClose: showClose ? showClose : false,
			controller
		})
	);

	return {
		confirm: (content, callback) => {
			let dialog	= createDialog(content, 'confirm', ['$scope', ($scope) => { }]);
			dialog.closePromise.then((data) => { callback(data.value == 'yes'); });
		},
		notif: (content) => {
			let dialog	= createDialog(content, 'notif', ['$scope', '$sce', ($scope, $sce) => { $scope.trust = (string) => ($sce.trustAsHtml(string)); }], 600);
			// dialog.closePromise.then((data) => { callback(); });
		},
		error: (content) => {
			let dialog	= createDialog(content, 'error', ['$scope', ($scope) => { }]);
			// dialog.closePromise.then((data) => { callback(); });
		},
	}

}]);
