const Model     = require('./model');

const table     = 'delik';
const fillable  = ['nama'];
const required  = ['nama'];
const preserved	= [];
const hidden	= [];

class Collection extends Model {
	constructor() {
		super(table, fillable, required, preserved, hidden, []);
	}
}

module.exports = new Collection();
