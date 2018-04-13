const _				= require('lodash');
const async			= require('async');
const moment		= require('moment');

const kpk			= require('../models/kpk_cache');
const cities		= require('../models/cities');
const provinces		= require('../models/provinces');
const categories	= require('../models/categories');
const reports		= require('../models/reports');

const db			= require('../connection');

const dateFormat	= 'YYYY-MM-DD';

String.prototype.titlecase	= function() { return this.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()); }

module.exports.categories = (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get categories data success.';
	let result          = null;

	const startDate		= (input.startDate	|| null);
	const endDate		= (input.endDate	|| null);
	const datasource	= (input.datasource	|| null);
	const province		= (input.province	|| null);
	const regency		= (input.regency	|| null);

	async.waterfall([
		(flowCallback) => {
			categories.findAll({}, {}, (err, result) => flowCallback(err, result.map((o) => (_.pick(o, ['id', 'name', 'color'])))));
		},
		(cate, flowCallback) => {
			let match	= {};
			if (startDate || endDate) {
				match.date	= {};
				if (startDate) { match.date.$gte = moment(startDate).startOf('day').toDate() }
				if (endDate) { match.date.$lt = moment(endDate).endOf('day').toDate() }
			}
			if (datasource) { match.source = { '$in': datasource.split(',').map((o) => _.trim(o).toLowerCase()) } }
			if (province) { match.province_id = province; }
			if (regency) { match.city_id = regency; }

			match.$or	= cate.map((o) => (_.fromPairs([[o.id + '.base', 1]])));

			kpk.rawAggregate([
				{ '$match': match },
				{ '$group': _.assign({ _id: null }, _.chain(cate).map((o) => ([o.id, { '$sum': '$' + o.id + '.base' }])).fromPairs().value() )}
			], {}, (err, result) => flowCallback(err, cate.map((o) => _.assign(o, { count: _.get(result, '[0][' + o.id + ']', 0) }))));
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

module.exports.map = (province_id, input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get map data success.';
	let result          = null;

	const active		= input.categories ? JSON.parse(input.categories)	: null;
	const startDate		= (input.startDate	|| null);
	const endDate		= (input.endDate	|| null);
	const datasource	= (input.datasource	|| null);

	async.waterfall([
		(flowCallback) => {
			categories.findAll((_.isArray(active) ? { id: { '$in': active } } : {} ), {}, (err, result) => flowCallback(err, result.map((o) => (_.pick(o, ['id', 'color'])))));
		},
		(cate, flowCallback) => {
			if (province_id) {
				cities.findAll({ province_id }, {}, (err, result) => flowCallback(err, cate, result.map((o) => ({ id: o.city_id, name: o.city_name.titlecase() }))))
			} else {
				provinces.findAll({}, {}, (err, result) => flowCallback(err, cate, result.map((o) => ({ id: o.province_id, name: o.province_name }))))
			}
		},
		(cate, locations, flowCallback) => {
			if (!_.isEmpty(cate)) {
				let match	= {};
				if (startDate || endDate) {
					match.date	= {};
					if (startDate) { match.date.$gte = moment(startDate).startOf('day').toDate() }
					if (endDate) { match.date.$lt = moment(endDate).endOf('day').toDate() }
				}
				if (datasource) { match.source = { '$in': datasource.split(',').map((o) => _.trim(o).toLowerCase()) } }
				if (province_id) { match.province_id = province_id; }

				match.$or	= cate.map((o) => (_.fromPairs([[o.id + '.base', 1]])));

				kpk.rawAggregate([
					{ '$match': match },
					{ '$group': _.assign({ _id: '$' + (province_id ? 'city_id' : 'province_id') }, _.chain(cate).map((o) => ([o.id, { '$sum': '$' + o.id + '.base' }])).fromPairs().value() )}
				], {}, (err, result) => {
					if (err) { flowCallback(err) } else {
						let colorMapped	= _.chain(cate).map((o) => ([o.id, o.color])).fromPairs().value();

						let colored		= _.chain(result).map((o) => ([o._id, _.chain(o).omit(['_id']).toPairs().maxBy((d) => (d[1])).value()])).fromPairs().value();
						let total		= _.chain(result).map((o) => ([o._id, _.chain(o).omit(['_id']).values().sum().value()])).fromPairs().value();

						flowCallback(null, _.chain(locations).map((o) => _.assign(o, { total: _.get(total, o.id, 0), color: (colorMapped[_.get(colored, o.id + '[0]', null)] || null), count: _.get(colored, o.id + '[1]', 0) })).orderBy('total', 'desc').value());
					}
				});
			} else {
				flowCallback(null, locations.map((o) => ({ id: o.id, name: o.name.titlecase(), total: 0, count: 0, color: null })))
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

module.exports.treemap	= (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get treemap data success.';
	let result          = null;

	const active		= input.categories ? JSON.parse(input.categories)	: null;
	const startDate		= (input.startDate	|| null);
	const endDate		= (input.endDate	|| null);
	const datasource	= (input.datasource	|| null);
	const province		= (input.province	|| null);
	const regency		= (input.regency	|| null);

	async.waterfall([
		(flowCallback) => {
			categories.findAll((_.isArray(active) ? { id: { '$in': active } } : {} ), {}, (err, result) => flowCallback(err, result.map((o) => (_.pick(o, ['id', 'name', 'color'])))));
		},
		(cate, flowCallback) => {
			reports.findAll({}, {}, (err, result) => flowCallback(err, cate, result));
		},
		(cate, reports, flowCallback) => {
			if (!_.isEmpty(cate)) {
				let match	= {};
				if (startDate || endDate) {
					match.date	= {};
					if (startDate) { match.date.$gte = moment(startDate).startOf('day').toDate() }
					if (endDate) { match.date.$lt = moment(endDate).endOf('day').toDate() }
				}
				if (datasource) { match.source = { '$in': datasource.split(',').map((o) => _.trim(o).toLowerCase()) } }
				if (province) { match.province_id = province; }
				if (regency) { match.city_id = regency; }

				match.$or	= cate.map((o) => (_.fromPairs([[o.id + '.base', 1]])));

				// let report_keys	= _.concat(reports.map((o) => (o._id)), 'base');
				let report_keys	= reports.map((o) => (o.id));
				kpk.rawAggregate([
					{ '$match': match },
					{ '$group': _.assign({ _id: null }, _.chain(cate).map((o) => ( _.chain(report_keys).map((d) => ([o.id + '-' + d, { $sum: '$' + o.id + '.' + d }])).value() )).flatten().fromPairs().value() )}
				], {}, (err, result) => flowCallback(err, { name: 'treemap', children: cate.map((o) => ({ name: o.name, color: o.color, children: _.chain(reports).map((d) => ({ name: d.delik, size: _.get(result, '[0][' + o.id + '-' + d.id + ']', 0) })).reject((d) => (d.size == 0)).orderBy('size', 'desc').value() })) }));
			} else {
				flowCallback(null, { name: 'treemap', children: [] });
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
}

module.exports.volume	= (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get volume data success.';
	let result          = null;

	const active		= input.categories ? JSON.parse(input.categories)	: null;
	const startDate		= (input.startDate	|| moment([2014]).startOf('year').format(dateFormat));
	const endDate		= (input.endDate	|| moment([2014]).endOf('year').format(dateFormat));
	const datasource	= (input.datasource	|| null);
	const province		= (input.province	|| null);
	const regency		= (input.regency	|| null);
	const time			= (input.time		|| 'daily');

	const timezone		= "+07:00";
	async.waterfall([
		(flowCallback) => {
			categories.findAll((_.isArray(active) ? { id: { '$in': active } } : {} ), {}, (err, result) => flowCallback(err, result.map((o) => (_.pick(o, ['id', 'color'])))));
		},
		(cate, flowCallback) => {
			if (!_.isEmpty(cate)) {
				let mappedColor	= _.chain(cate).keyBy('id').mapValues('color').value();

				let match	= {};
				if (startDate || endDate) {
					match.date	= {};
					if (startDate) { match.date.$gte = moment(startDate).startOf('day').toDate() }
					if (endDate) { match.date.$lt = moment(endDate).endOf('day').toDate() }
				}
				if (datasource) { match.source = { '$in': datasource.split(',').map((o) => _.trim(o).toLowerCase()) } }
				if (province) { match.province_id = province; }
				if (regency) { match.city_id = regency; }

				match.$or	= cate.map((o) => (_.fromPairs([[o.id + '.base', 1]])));

				let _id	= '';
				switch (time) {
					case 'monthly': _id = { $concat: [{ $dateToString: { format: "%Y-%m", date: "$date", timezone }}, '-01']}; break;
					case 'weekly': _id = { $dateToString: { format: "%Y-%m-%d", date: { $add: [moment(startDate).startOf('day').toDate(), { $multiply: [{ $floor: { $divide: [{ $subtract: ['$date', moment(startDate).startOf('day').toDate()] }, 7 * 24 * 60 * 60 * 1000] }}, 7 * 24 * 60 * 60 * 1000]}] }, timezone }}; break;
					default: _id = { $dateToString: { format: "%Y-%m-%d", date: "$date", timezone }};
				}

				kpk.rawAggregate([
					{ '$match': match },
					{ '$group': _.assign({ _id }, _.chain(cate).map((o) => ([o.id, { $sum: '$' + o.id + '.base' }])).fromPairs().value())}
				], {}, (err, result) => flowCallback(err, mappedColor, _.chain(result).keyBy('_id').mapValues((o) => (_.omit(o, ['_id']))).value()));
			} else {
				flowCallback(null, null);
			}
		},
		(color, data, flowCallback) => {
			if (color && data) {
				let diff	= moment(endDate, dateFormat).diff(moment(startDate, dateFormat), (time == 'monthly' ? 'months' : (time == 'weekly' ? 'weeks' : 'days'))) + 1;

				if (diff == _.size(data)) {
					flowCallback(null, { color, data: _.chain(data).map((o, key) => (_.assign(o, { date: key }) )).sortBy('date').value() })
				} else {
					let defaultData	= _.chain(color).keys().map((o) => ([o, 0])).fromPairs().value();
					flowCallback(null, { color, data: _.chain(diff).times((o) => (moment(startDate, dateFormat).add(o, 'days').format(dateFormat))).map((o) => (_.assign({ date: o }, (data[o] || defaultData)))).value() });
				}
			} else {
				flowCallback(null, { data: [], color: {} });
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
}

module.exports.keywords	= (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get keywords data success.';
	let result          = null;

	const active		= input.categories ? JSON.parse(input.categories)	: null;
	const startDate		= (input.startDate	|| moment([2014]).startOf('year').format(dateFormat));
	const endDate		= (input.endDate	|| moment([2014]).endOf('year').format(dateFormat));
	const datasource	= (input.datasource	|| null);
	const province		= (input.province	|| null);
	const regency		= (input.regency	|| null);
	const limit			= (input.limit		|| 10);

	async.waterfall([
		(flowCallback) => {
			categories.findAll((_.isArray(active) ? { id: { '$in': active } } : {} ), {}, (err, result) => flowCallback(err, result.map((o) => (_.pick(o, ['id', 'name'])))));
		},
		(cate, flowCallback) => {
			reports.findAll({}, {}, (err, result) => flowCallback(err, cate, result));
		},
		(cate, reports, flowCallback) => {
			if (!_.isEmpty(cate)) {
				let match	= {};
				if (startDate || endDate) {
					match.date	= {};
					if (startDate) { match.date.$gte = moment(startDate).startOf('day').toDate() }
					if (endDate) { match.date.$lt = moment(endDate).endOf('day').toDate() }
				}
				if (datasource) { match.source = { '$in': datasource.split(',').map((o) => _.trim(o).toLowerCase()) } }
				if (province) { match.province_id = province; }
				if (regency) { match.city_id = regency; }

				match.$or	= cate.map((o) => (_.fromPairs([[o.id + '.base', 1]])));

				async.parallel({
					keywords: (callback) => {
						kpk.rawAggregate([
							{ '$match': match },
							{ '$group': { _id: { $split: ['$keywords.category', '|'] }, count: { $sum: 1 } } },
							{ '$unwind': '$_id' },
							{ '$group': { _id: '$_id', count: { $sum: '$count' }}},
							{ '$sort': { count: -1 } },
							{ '$limit': parseInt(limit) },
							{ '$project': { _id: 0, key: '$_id', count: 1 } }
						], {}, (err, result) => callback(err, result));
					},
					topics: (callback) => {
						let report_keys	= reports.map((o) => (o.id));

						let mapped	= {
							report: _.chain(reports).map((o) => ([o.id, o.delik])).fromPairs().value(),
							cate: _.chain(cate).map((o) => ([o.id, o.name])).fromPairs().value(),
						}
						kpk.rawAggregate([
							{ '$match': match },
							{ '$group': _.assign({ _id: null }, _.chain(cate).map((o) => ( _.chain(report_keys).map((d) => ([o.id + '-' + d, { $sum: '$' + o.id + '.' + d }])).value() )).flatten().fromPairs().value() )}
						], {}, (err, result) => callback(err, _.chain(result).get('[0]', {}).omit(['_id']).map((size, key) => ({ key, size })).orderBy('size', 'desc').take(limit).map((o) => ({ key: mapped.report[o.key.split('-')[1]] + ' - ' + mapped.cate[o.key.split('-')[0]], id: o.key.replace('-', '.'), count: o.size })).value()));
					}
				}, (err, results) => {
					flowCallback(null, results);
				});
			} else {
				flowCallback(null, null);
			}
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
}

module.exports.bipartite	= (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get biPartite data success.';
	let result          = null;

	const active		= input.categories ? JSON.parse(input.categories)	: null;
	const startDate		= (input.startDate	|| null);
	const endDate		= (input.endDate	|| null);
	const datasource	= (input.datasource	|| null);
	const province		= (input.province	|| null);
	const regency		= (input.regency	|| null);

	async.waterfall([
		(flowCallback) => {
			categories.findAll((_.isArray(active) ? { id: { '$in': active } } : {} ), {}, (err, result) => flowCallback(err, result.map((o) => (_.pick(o, ['id', 'name', 'color'])))));
		},
		(cate, flowCallback) => {
			reports.findAll({}, {}, (err, result) => flowCallback(err, cate, result));
		},
		(cate, reports, flowCallback) => {
			if (!_.isEmpty(cate)) {
				let match	= {};
				if (startDate || endDate) {
					match.date	= {};
					if (startDate) { match.date.$gte = moment(startDate).startOf('day').toDate() }
					if (endDate) { match.date.$lt = moment(endDate).endOf('day').toDate() }
				}
				if (datasource) { match.source = { '$in': datasource.split(',').map((o) => _.trim(o).toLowerCase()) } }
				if (province) { match.province_id = province; }
				if (regency) { match.city_id = regency; }

				match.$or	= cate.map((o) => (_.fromPairs([[o.id + '.base', 1]])));

				// let report_keys	= _.concat(reports.map((o) => (o._id)), 'base');
				let report_keys	= reports.map((o) => (o.id));
				let mapped	= {
					report: _.chain(reports).map((o) => ([o.id, o.delik])).fromPairs().value(),
					cate: _.chain(cate).map((o) => ([o.id, o.name])).fromPairs().value(),
				}
				kpk.rawAggregate([
					{ '$match': match },
					{ '$group': _.assign({ _id: null }, _.chain(cate).map((o) => ( _.chain(report_keys).map((d) => ([o.id + '-' + d, { $sum: '$' + o.id + '.' + d }])).value() )).flatten().fromPairs().value() )}
				], {}, (err, result) => flowCallback(err, {
					data: _.chain(result).get('[0]', {}).omitBy((o) => (_.isNil(o) || o == 0)).map((o, key) => ([mapped.cate[key.split('-')[0]], mapped.report[key.split('-')[1]], o])).value(),
					color: _.chain(cate).keyBy('name').mapValues('color').value(),
				}));
			} else {
				flowCallback(null, null);
			}
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
}

module.exports.raw	= (input, callback) => {
	let response        = 'OK';
	let status_code     = 200;
	let message         = 'Get raw data success.';
	let result          = null;

	const active		= input.categories ? JSON.parse(input.categories)	: null;
	const startDate		= (input.startDate	|| moment([2014]).startOf('year').format(dateFormat));
	const endDate		= (input.endDate	|| moment([2014]).endOf('year').format(dateFormat));
	const datasource	= (input.datasource	|| null);
	const province		= (input.province	|| null);
	const regency		= (input.regency	|| null);

	const limit			= (input.limit		|| 10);
	const skip			= (input.offset		|| 0);

	const cate_id		= (input.id			|| null);
	const layer1_key	= (input.key		|| null);

	async.waterfall([
		(flowCallback) => {
			categories.findAll((_.isArray(active) ? { id: { '$in': active } } : {} ), {}, (err, result) => flowCallback(err, result.map((o) => (_.pick(o, ['id', 'name', 'color'])))));
		},
		(cate, flowCallback) => {
			if (!_.isEmpty(cate)) {
				let match	= {};
				if (startDate || endDate) {
					match.date	= {};
					if (startDate) { match.date.$gte = moment(startDate).startOf('day').toDate() }
					if (endDate) { match.date.$lt = moment(endDate).endOf('day').toDate() }
				}
				if (datasource) { match.source = { '$in': datasource.split(',').map((o) => _.trim(o).toLowerCase()) } }
				if (province) { match.province_id = province; }
				if (regency) { match.city_id = regency; }

				if (cate_id) { match[(_.includes(cate_id, '.') ? cate_id : cate_id + '.base' )] = 1; }
				if (layer1_key) { match['keywords.category'] = new RegExp(layer1_key); }

				match.$or	= cate.map((o) => (_.fromPairs([[o.id + '.base', 1]])));

				kpk.rawAggregate([
					{ '$match': match },
					{ '$limit': parseInt(limit) },
					{ '$skip': parseInt(skip) },
					{ '$project': { _id: 0, date: 1, source: 1, context: 1 }}
				], {}, (err, result) => flowCallback(err, result));
			} else {
				flowCallback(null, []);
			}
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
}
