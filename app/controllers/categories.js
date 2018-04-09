const _				= require('lodash');
const async			= require('async');

const categories	= require('../models/categories');

/**
 * Display a listing of the resource.
 *
 * @return Response
 */
module.exports.index = (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get all data success.';
	let result          = null;

	const limit			= !_.isNil(input.limit)		? _.toInteger(input.limit)	: 0;
	const offset		= !_.isNil(input.offset)	? _.toInteger(input.offset)	: 0;

	async.waterfall([
		(flowCallback) => {
			categories.findAll({}, { limit, offset }, (err, result) => flowCallback(err, result));
		}
	], (err, asyncResult) => {
		if (err) {
			response    = 'FAILED';
			status_code = 400;
			message     = err;
		} else {
			result      = asyncResult;
		}
		callback({ response, status_code, message, result });
	});
};

/**
 * Store a newly created resource in storage.
 *
 * @param  Request  $input
 * @return Response
 */
module.exports.store = (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Insert new data success.';
	let result          = null;

	async.waterfall([
		(flowCallback) => {
			let ascertain	= {};
			categories.insertOne(_.assign(input, ascertain), (err, result) => flowCallback(err, result));
		},
	], (err, asyncResult) => {
		if (err) {
			response    = 'FAILED';
			status_code = 400;
			message     = err;
		} else {
			result      = asyncResult;
		}
		callback({ response, status_code, message, result });
	});
};

/**
 * Display the specified resource.
 *
 * @param  int	$id
 * @return Response
 */
module.exports.show = (id, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get data with id ' + id + ' success.';
	let result          = null;

	async.waterfall([
		(flowCallback) => {
			categories.find(id, (err, result) => flowCallback(err, result));
		}
	], (err, asyncResult) => {
		if (err) {
			response    = 'FAILED';
			status_code = 400;
			message     = err;
		} else {
			result      = asyncResult;
		}
		callback({ response, status_code, message, result });
	});
};

/**
 * Update the specified resource in storage.
 *
 * @param  int  $id
 * @param  Request  $request
 * @return Response
 */
module.exports.update = (id, input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Update data with id ' + id + ' success.';
	let result			= null;

	async.waterfall([
		(flowCallback) => {
			categories.find(id, (err, result) => flowCallback(err, result));
		},
		(checked, flowCallback) => {
			if (checked) {
				let ascertain	= {};
				categories.update(checked._id, _.assign(input, ascertain), (err, result) => flowCallback(err, result))
			} else {
				flowCallback('Data with id ' + id + ' not found.');
			}
		}
	], (err, asyncResult) => {
		if (err) {
			response    = 'FAILED';
			status_code = 400;
			message     = err;
		} else if (_.isEmpty(asyncResult)) {
			message += ' No data changed.';
		} else {
			message += ' Changed data : {' + asyncResult.join(', ') + '}';
		}
		callback({ response, status_code, message, result });
	});
};

/**
 * Remove the specified resource from storage.
 *
 * @param  	int	$id
 * @return	Response
 */
module.exports.destroy = (id, input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Remove data with id ' + id + ' success.';
	let result          = null;

	async.waterfall([
		(flowCallback) => {
			categories.find(id, (err, result) => flowCallback(err, result));
		},
		(checked, flowCallback) => {
			if (checked) {
				categories.delete(checked._id, (err, result) => flowCallback(err, null))
			} else {
				flowCallback('Data with id ' + id + ' not found.');
			}
		}
	], (err, asyncResult) => {
		if (err) {
			response    = 'FAILED';
			status_code = 400;
			message     = err;
		} else {
			result      = asyncResult;
		}
		callback({ response, status_code, message, result });
	});
};
