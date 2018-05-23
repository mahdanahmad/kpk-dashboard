const Model     = require('./model');

const table     = 'filelogs';
const fillable  = ['filename'];
const required  = ['filename'];
const preserved	= [];
const hidden	= [];

class Collection extends Model {
	constructor() {
		super(table, fillable, required, preserved, hidden, []);
	}
}

module.exports = new Collection();
