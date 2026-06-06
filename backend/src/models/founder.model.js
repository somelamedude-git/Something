const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true,
		lowercase: true
	},

	password:{
		type: String,
		required: true
	},

	username:{
		type: String,
		required: true
	},

	firm:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Firm'
	}
});

const Founder = mongoose.model('Founder', founderSchema);

module.exports = {
	Founder
}
