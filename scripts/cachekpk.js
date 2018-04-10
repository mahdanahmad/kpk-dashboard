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

const cache_table	= 'kpk_cache';

MongoClient.connect(db_url, (err, client) => {
	if (err) throw err;
	let db	= client.db(process.env.DB_DATABASE);

	async.waterfall([
		(flowCallback) => {
			// db.collectionNames(cache_table, (err, names) => { console.log(names); flowCallback() });
			db.collection(cache_table).remove((err) => flowCallback(err));
		},
		(flowCallback) => {
			db.collection('categories').find().toArray((err, result) => flowCallback(err, result));
		},
		(categories, flowCallback) => {
			db.collection('reports').find().toArray((err, result) => flowCallback(err, categories, result));
		},
		(categories, reports, flowCallback) => {
			db.collection('kpk_data').find().toArray((err, result) => flowCallback(err, categories, reports, result));
		},
		(categories, reports, data, flowCallback) => {
			let query	= {
				key1	: _.chain(categories).map('query').join(' or ').split(' or ').uniq().map((o) => (o.replace(/['"]+/g, '').trim())).value(),
				key2	: _.chain(reports).map('delik').uniq().map((o) => (o.replace(/['"]+/g, '').trim())).value(),
				cate	: _.chain(categories).map((o) => ([o._id, new RegExp(o.query.toQuery())])).fromPairs().value(),
				delik	: _.chain(reports).map((o) => ([o._id, new RegExp(o.delik.toQuery())])).fromPairs().value()
			}

			db.collection(cache_table).insertMany(data.map((o) => _.assign(o, { keywords: {
				category: _.filter(query.key1, (d) => ((new RegExp(d.toLowerCase())).test(o.context.toLowerCase()))).join('|'),
				report: _.filter(query.key2, (d) => ((new RegExp(d.toLowerCase())).test(o.context.toLowerCase()))).join('|'),
			}},
			_.mapValues(query.cate, (d) => {
				let base	= d.test(o.context.toLowerCase()) ? 1 : 0;

				return (base ? _.assign({ base }, _.mapValues(query.delik, (m) => (m.test(o.context.toLowerCase()) ? 1 : 0))) : { base });
			}))), (err) => flowCallback(err));
		}
	], (err) => {
		if (err) throw err;
		client.close();
	});
});

String.prototype.toQuery = function() { return '(?=.*(' + this.toLowerCase().replace(/['"]+/g, '').split(' or ').map((o) => (o.trim())).join('|') + '))'; };
