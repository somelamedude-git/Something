const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
	investor:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Investor',
		required: true
	}],

	founders:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Founder',
			required: true
		}],

	stage:{
		type: String,
		enum: ['Pre-seed', 'seed', 'Series-A', 'Series-B', 'Series-C+', 'IPO']
	},

	committed:{
		type:Number,
		default: 0
	},

	trustPoints:{
		type:Number,
		default: 0
	},

	next:{
		type: String,
		required: true
	}
}, {timestamps: true});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = {
	Investment
}


