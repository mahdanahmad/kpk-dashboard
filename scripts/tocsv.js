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

let filepath		= 'public/' + data_table + '.csv';
let base_params		= { headers: true, strictColumnHandling: true, trim: true, quote: "'", delimiter: ',' };

let date_format		= 'DD/MM/YY HH.mm.ss'

MongoClient.connect(db_url, (err, client) => {
	if (err) throw err;
	let db	= client.db(process.env.DB_DATABASE);

	async.waterfall([
		(flowCallback) => {
			db.collection(data_table).find({}).toArray().then((result) => {
				csv
					.writeToPath(filepath, result.map((o) => {
						let additional	= {};
						additional['date (' + date_format + ')'] = moment(o.date).format(date_format);

						return _.chain(o).assign(additional).omit(['_id', 'date']).value()
					}), {headers: true})
					.on("finish", () => {
						flowCallback();
					});
			});
		}
	], (err) => {
		if (err) throw err;

		client.close();
	});
});

String.prototype.toQuery = function() { return '(?=.*(' + this.toLowerCase().replace(/['"]+/g, '').split(' or ').map((o) => (o.trim())).join('|') + '))'; };
