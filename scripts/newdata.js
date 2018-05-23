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
let base_params		= { headers: true, strictColumnHandling: true, trim: true, quote: "'", delimiter: ';' };

let date_format		= 'DD/MM/YY HH.mm.ss'

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
			db.collection('categories').find().toArray((err, result) => flowCallback(err, result));
		},
		(categories, flowCallback) => {
			db.collection('reports').find().toArray((err, result) => flowCallback(err, categories, result));
		},
		(categories, reports, flowCallback) => {
			let data	= [];
			let cache	= [];

			let query	= {
				key1	: _.chain(categories).map('query').join(' or ').split(' or ').uniq().map((o) => (o.replace(/['"]+/g, '').trim())).value(),
				key2	: _.chain(reports).map('delik').uniq().map((o) => (o.replace(/['"]+/g, '').trim())).value(),
				cate	: _.chain(categories).map((o) => ([o.id, new RegExp(o.query.toQuery())])).fromPairs().value(),
				delik	: _.chain(reports).map((o) => ([o.id, new RegExp(o.delik.toQuery())])).fromPairs().value()
			}

			csv
				.fromPath(filepath, base_params)
				.on('data', (row) => {
					let current	= {
						date: moment(row['date (' + date_format + ')'], date_format).toDate(),
						context: row.context.toLowerCase(),
						source: row.source,
						city_id: row.city_id,
						province_id: row.province_id,
					};

					data.push(_.clone(current));
					cache.push(_.assign(current, { keywords: {
						category: _.filter(query.key1, (d) => ((new RegExp(d.toLowerCase())).test(current.context.toLowerCase()))).join('|'),
						report: _.filter(query.key2, (d) => ((new RegExp(d.toLowerCase())).test(current.context.toLowerCase()))).join('|'),
					}},
					_.mapValues(query.cate, (d) => {
						let base	= d.test(current.context.toLowerCase()) ? 1 : 0;

						return (base ? _.assign({ base }, _.mapValues(query.delik, (m) => (m.test(current.context.toLowerCase()) ? 1 : 0))) : { base });
					})));
				})
				.on('end', () => {
					async.parallel([
						(callback) => { db.collection(data_table).insertMany(data, (err) => callback(err)); },
						(callback) => { db.collection(cache_table).insertMany(cache, (err) => callback(err)); }
					], (err) => flowCallback(err));
				})
		},
	], (err) => {
		if (err) throw err;
		fs.unlink(filepath, (err) => { if (err) throw err; });
		client.close();
	});
});

String.prototype.toQuery = function() { return '(?=.*(' + this.toLowerCase().replace(/['"]+/g, '').split(' or ').map((o) => (o.trim())).join('|') + '))'; };
