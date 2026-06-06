const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
	email:{
		type: String,
		lowercase: true,
		required: true
	},

	password: {
		type: String,
		required: true
	}
});

const Investor = mongoose.model('Investor', investorSchema);
module.exports = {
	Investor
}
