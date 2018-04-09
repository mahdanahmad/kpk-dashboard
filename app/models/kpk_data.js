const Model     = require('./model');

const table     = 'kpk_data';
const fillable  = ['date', 'source', 'context', 'city_id', 'province_id'];
const required  = ['date', 'source', 'context', 'city_id'];
const preserved	= ['date', 'source', 'context', 'city_id', 'province_id'];
const hidden	= [];

class Collection extends Model {
	constructor() {
		super(table, fillable, required, preserved, hidden, []);
	}
}

module.exports = new Collection();
