const Model     = require('./model');

const table     = 'reports';
const fillable  = ['delik'];
const required  = ['delik'];
const preserved	= [];
const hidden	= [];

class Collection extends Model {
	constructor() {
		super(table, fillable, required, preserved, hidden, []);
	}
}

module.exports = new Collection();
