const Model     = require('./model');

const table     = 'users';
const fillable  = ['username', 'password', 'role'];
const required  = ['username', 'password'];
const preserved	= ['username'];
const hidden	= ['password'];

class Collection extends Model {
	constructor() {
		super(table, fillable, required, preserved, hidden, []);
	}
}

module.exports = new Collection();
