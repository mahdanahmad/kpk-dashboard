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

const init_root		= 'public/initialdata/';
const init_tables	= ['cities', 'provinces', 'countries'];
const kpk_table		= 'kpk_data';

const palette		= ['#d17076', '#eb6090', '#f3a6be', '#98e2e1', '#17a5a3', '#fac999', '#e6790d', '#b24201', '#eac8b5', '#f3f0e2', '#c1ccd4', '#fbe5ad', '#e2c408', '#fdb360', '#af9b95', '#a4bfd9', '#5b92cb', '#787fa0', '#8e9fbb', '#ebf0f7'];

let base_params		= { headers: true, strictColumnHandling: true, trim: true, quote: "'" };

let reports			= fs.readFileSync(init_root + 'kategori.csv', 'utf-8').split('\n').map((o) => (o.trim())).filter(Boolean);
let fallback		= JSON.parse(fs.readFileSync(init_root + 'fallback.json'));
let mapped			= { cities: {}, provinces: {} }

function getID(data, state) {
	data = _.toLower(data);
	return _.chain(mapped[state]).get((_.chain(fallback[state]).keys().includes(data).value() ? fallback[state][data] : data), 'NULL').value();
}

MongoClient.connect(db_url, (err, client) => {
	if (err) throw err;
	let db	= client.db(process.env.DB_DATABASE);

	async.waterfall([
		(flowCallback) => {
			db.dropDatabase((err, result) => flowCallback(err));
		},
		(flowCallback) => {
			async.each(init_tables, (tablename, eachCallback) => {
				let data = [];

				csv
					.fromPath(init_root + '' + tablename + '.csv', base_params)
					.on('data', (row) => { data.push(row); })
					.on('end', () => {
						if (_.includes(['provinces', 'cities'], tablename)) {
							let col_name		= tablename == 'provinces' ? 'province_name' : 'city_name';
							let col_id			= tablename == 'provinces' ? 'province_id' : 'city_id';
							mapped[tablename]	= _.chain(data).keyBy((o) => _.toLower(o[col_name])).mapValues(col_id).value()
						}
						db.collection(tablename).insertMany(data, (err, result) => eachCallback(err)); }
					);
			}, (err) => flowCallback(err));
		},
		(flowCallback) => {
			db.collection('reports').insertMany(reports.map((o) => ({ delik: o })), (err, result) => flowCallback(err));
		},
		(flowCallback) => {
			let data = [];

			csv
				.fromPath(init_root + 'taksonomi.csv', _.assign(base_params, { delimiter: ';' }))
				.on('data', (row) => { data.push(row); })
				.on('end', () => {
					db.collection('categories').insertMany(data.map((o, i) => (_.assign(o, { color: palette[i] }))), (err, result) => flowCallback(err));
				});
		},
		(flowCallback) => {
			let data	= [];

			csv
				.fromPath(init_root + 'kpk.csv', _.assign(base_params, { delimiter: ';' }))
				.on('data', (row) => {
					let province_id	= getID(row.Provinsi, 'provinces');

					if (province_id !== 'NULL') {
						data.push({
							date: moment(row.Tanggal, 'DD/MM/YY HH:mm').format('YYYY-MM-DD'),
							context: [row.Delik, row.Instansi].join(' ').toLowerCase().replace('\'', ''),
							source: 'kpk',
							city_id: getID(row['Kabupaten/Kota'], 'cities'),
							province_id,
						});
					}
				})
				.on('end', () => { db.collection(kpk_table).insertMany(data, (err) => flowCallback(err)); })
		},
		(flowCallback) => {
			let data	= [];

			csv
				.fromPath(init_root + 'ombudsman.csv', _.assign(base_params, { delimiter: ';' }))
				.on('data', (row) => {
					let province_id	= getID(row.propinsi_terlapor, 'provinces');

					if (province_id !== 'NULL') {
						data.push({
							date: moment(row.Tanggal, 'DD/MM/YY HH:mm').format('YYYY-MM-DD'),
							context: [row.jabatan_terlapor, row.id_dugaan_maladministrasi].join(' ').toLowerCase().replace('\'', ''),
							source: 'ombudsman',
							city_id: getID(row.kota_kab_terlapor, 'cities'),
							province_id,
						});
					}
				})
				.on('end', () => { db.collection(kpk_table).insertMany(data, (err) => flowCallback(err)); })
		},
	], (err) => {
		if (err) throw err;
		client.close();
	});
});
