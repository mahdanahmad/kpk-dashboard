const _				= require('lodash');
const fs			= require('fs');
const csv			= require('fast-csv');
const async			= require('async');
const moment		= require('moment');

const kpk			= require('../models/kpk_cache');
const cities		= require('../models/cities');
const provinces		= require('../models/provinces');
const categories	= require('../models/categories');

const dateFormat	= 'YYYY-MM-DD';

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
			fs.readFile(inputfile.path, (err, file) => {
				if (err) { flowCallback(err) } else {

					flowCallback(null);
				}
			})
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
