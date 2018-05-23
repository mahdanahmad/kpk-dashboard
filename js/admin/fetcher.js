app.factory('fetcher', ['$http', '$httpParamSerializer', 'Upload', function($http, $httpParamSerializer, Upload) {
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

		getReports: (callback) => { $http.get(baseURL + 'reports', config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		getReport: (id, callback) => { $http.get(baseURL + 'reports/' + id, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		postReport: (data, callback) => { $http.post(baseURL + 'reports', data, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		putReport: (id, data, callback) => { $http.put(baseURL + 'reports/' + id, data, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		deleteReport: (id, callback) => { $http.delete(baseURL + 'reports/' + id, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },

		getUsers: (callback) => { $http.get(baseURL + 'users', config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		getUser: (id, callback) => { $http.get(baseURL + 'users/' + id, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		postUser: (data, callback) => { $http.post(baseURL + 'users', data, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		putUser: (id, data, callback) => { $http.put(baseURL + 'users/' + id, data, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
		deleteUser: (id, callback) => { $http.delete(baseURL + 'users/' + id, config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },

		postBulk: (file, callback) => { Upload.upload({ url: baseURL + 'bulk', data: { file } }).then((success) => { callback(success.data); }, (error) => { callback(error.data) }) },
		getFiles: (callback) => { $http.get(baseURL + 'filelogs', config).then((success) => { callback(success.data); }, (error) => { callback(error.data); }); },
	};
}]);
