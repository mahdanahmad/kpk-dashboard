app.factory('fetcher', ['$http', '$httpParamSerializer', function($http, $httpParamSerializer) {
	let baseURL	= '/api/';

	let config  = {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	};

	return {
		postAuth: (data, callback) => { $http.post(baseURL + 'auth', data, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
	};
}]);
