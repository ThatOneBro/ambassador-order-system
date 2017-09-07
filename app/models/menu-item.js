var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var menuItemSchema = Schema({
	name: {
		type: String,
		required: true
	},
	description: String,
	price: {
		type: Currency,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	popular: {
		type: Boolean,
		default: false
	},
	spicy: {
		type: Boolean,
		default: false
	},
	veg: {
		type: Boolean,
		default: false
	},
	pickup: {
		type: Boolean,
		default: false
	},
	sizes: [{
		size: String,
		price: Currency
	}]
});

module.exports = menuItemSchema;
