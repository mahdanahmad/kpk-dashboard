app.directive('autofocus', ['$timeout', ($timeout) => ({
	restrict: 'A',
	link: (scope, elem, attrs) => {
		if (attrs.autofocus == 'true') {
			$timeout(() => { elem.focus(); });
		}
    }
})]);

app.directive('typeEverywhere', ['$document', ($document) => ({
	require: 'ngModel',
	restrict: 'A',
	scope: { ngModel: '=' },
	link: (scope, elem, attrs) => {
		$document.bind('keypress', (e) => {
			let keyCode	= e.which || e.keyCode;
			let tagName	= angular.element($document[0].activeElement)[0].tagName;

			if (!_.includes([13], keyCode) && !_.includes(['INPUT', 'TEXTAREA'], tagName)) {
				// console.log('Got keypress:', String.fromCharCode(keyCode), keyCode);
				// if (_.isNil(scope.ngModel)) { scope.ngModel = ''; }
				scope.ngModel += String.fromCharCode(keyCode);
				elem.focus();
			}
		});
	}
})]);
