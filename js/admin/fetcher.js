app.factory('fetcher', ['$http', '$httpParamSerializer', function($http, $httpParamSerializer) {
	let baseURL	= '/api/';

	let config  = {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	};

	return {
		postAuth: (data, callback) => { $http.post(baseURL + 'auth', data, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },

		getCategories: (callback) => { $http.get(baseURL + 'categories', config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		getCategory: (id, callback) => { $http.get(baseURL + 'categories/' + id, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		postCategory: (data, callback) => { $http.post(baseURL + 'categories', data, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		putCategory: (id, data, callback) => { $http.put(baseURL + 'categories/' + id, data, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		deleteCategory: (id, callback) => { $http.delete(baseURL + 'categories/' + id, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },

	};
}]);
