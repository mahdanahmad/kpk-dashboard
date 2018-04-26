require('dotenv').config();

const fs			= require('fs');
const _				= require('lodash');
const MongoDB		= require('mongodb');
const async			= require('async');
const SHA256		= require("crypto-js/sha256");

const MongoClient	= MongoDB.MongoClient;
const ObjectID		= MongoDB.ObjectID;

const auth			= (process.env.DB_USERNAME !== '' || process.env.DB_PASSWORD !== '') ? process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' : '';
const db_url		= 'mongodb://' + auth + process.env.DB_HOST + ':' + process.env.DB_PORT;

const user_table	= 'users';

const user_data		= {
	username		: 'admin',
	password		: SHA256('ketikaja').toString(),
	role			: 'super'
}

MongoClient.connect(db_url, (err, client) => {
	if (err) throw err;
	let db	= client.db(process.env.DB_DATABASE);

	async.waterfall([
		(flowCallback) => {
			db.collection(user_table).find(user_data).toArray((err, result) => flowCallback(err, _.isEmpty(result)));
		},
		(isEmpty, flowCallback) => {
			if (isEmpty) {
				db.collection(user_table).insertOne(user_data, (err, result) => flowCallback(err));
			} else {
				flowCallback();
			}
		},
	], (err) => {
		if (err) throw err;
		client.close();
	});
});

String.prototype.toQuery = function() { return '(?=.*(' + this.toLowerCase().replace(/['"]+/g, '').split(' or ').map((o) => (o.trim())).join('|') + '))'; };
