const _				= require('lodash');
const fs			= require('fs');
const csv			= require('fast-csv');
const async			= require('async');
const moment		= require('moment');

const { spawn }		= require('child_process');

const kpk			= require('../models/kpk_cache');
const cities		= require('../models/cities');
const filelogs		= require('../models/filelogs');
const provinces		= require('../models/provinces');
const categories	= require('../models/categories');

const dateFormat	= 'YYYY-MM-DD';

let out				= fs.openSync('./public/out.log', 'a');
let err				= fs.openSync('./public/err.log', 'a');

String.prototype.titlecase	= function() { return this.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()); }

module.exports.bulk = (inputfile, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Insert bulk data success.';
	let result          = null;

	async.waterfall([
		(flowCallback) => {
			flowCallback(!_.includes(inputfile.mimetype, 'csv') ? 'Your file is not supported' : null);
		},
		(flowCallback) => {
			fs.readFile(inputfile.path, (err, file) => flowCallback(err));
		},
		(flowCallback) => {
			filelogs.insertOne({ filename: inputfile.originalname }, (err, result) => flowCallback(err));
		},
		(flowCallback) => {
			spawn('node', ['scripts/newdata.js', inputfile.path], {
				cwd: './',
				stdio: [ 'ignore', out, err ],
				detached: true}
			).unref();

			flowCallback(null);
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

module.exports.logs	= (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get all logs success.';
	let result          = null;

	const limit			= !_.isNil(input.limit)		? _.toInteger(input.limit)	: 0;
	const offset		= !_.isNil(input.offset)	? _.toInteger(input.offset)	: 0;

	let dateFormat		= 'MMMM D, YYYY. HH:mm';

	async.waterfall([
		(flowCallback) => {
			filelogs.rawAggregate([
				{ '$project': { _id: 0, filename: 1, created_at: 1 } }
			], {}, (err, result) => flowCallback(err, result.map((o) => _.assign(o, { 'created_at' : moment(o.created_at).format(dateFormat) }))));
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
}
