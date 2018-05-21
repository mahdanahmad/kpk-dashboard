require('dotenv').config();

const fs			= require('fs');
const csv			= require('fast-csv');
const MongoDB		= require('mongodb');
const _				= require('lodash');
const async			= require('async');
const moment		= require('moment');

const MongoClient	= MongoDB.MongoClient;
const ObjectID		= MongoDB.ObjectID;

const auth			= (process.env.DB_USERNAME !== '' || process.env.DB_PASSWORD !== '') ? process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' : '';
const db_url		= 'mongodb://' + auth + process.env.DB_HOST + ':' + process.env.DB_PORT;

const data_table	= 'kpk_data';
const cache_table	= 'kpk_cache';

let filepath		= '';

MongoClient.connect(db_url, (err, client) => {
	if (err) throw err;
	let db	= client.db(process.env.DB_DATABASE);

	async.waterfall([
		(flowCallback) => {
			fs.stat((process.argv[2] || ''), (err, stat) => {
				if (err) { flowCallback(err) } else {
					filepath	= process.argv[2];
					flowCallback();
				}
			})
		},
		(flowCallback) => {
			
			flowCallback();
		}
	], (err) => {
		if (err) throw err;
		client.close();
	});
});

String.prototype.toQuery = function() { return '(?=.*(' + this.toLowerCase().replace(/['"]+/g, '').split(' or ').map((o) => (o.trim())).join('|') + '))'; };
