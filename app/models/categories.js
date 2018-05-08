const Model     = require('./model');

const table     = 'categories';
const fillable  = ['name', 'description', 'id', 'query', 'remarks', 'order', 'icon', 'color'];
const required  = ['name', 'query'];
const preserved	= [];
const hidden	= [];

class Collection extends Model {
	constructor() {
		super(table, fillable, required, preserved, hidden, []);
	}
}

module.exports = new Collection();
