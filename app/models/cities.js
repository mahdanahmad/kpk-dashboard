const Model     = require('./model');

const table     = 'cities';
const fillable  = ['city_id', 'province_id', 'city_name', 'old_id'];
const required  = ['city_id', 'province_id', 'city_name', 'old_id'];
const preserved	= ['city_id', 'province_id', 'city_name', 'old_id'];
const hidden	= ['province_id', 'old_id'];

class Collection extends Model {
	constructor() {
		super(table, fillable, required, preserved, hidden, []);
	}
}

module.exports = new Collection();
