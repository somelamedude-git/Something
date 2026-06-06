const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},

	firm_type:{
		type: String,
		enum: ['VC', 'Angel group', 'Accelerator', 'Family Office', 'Corporate VC']
	},

	founded_year:{
		type: Date,
		requried: true
	},

	website_url:{
		type: String
	},

	linkedIn_url:{
		type: String,
		required: true
	},

	twitter_url:{
		type: String,
		required: true
	},

	description:{
		type: String,
		required: true
	},

	investment_focus:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tag'
		}],

	stage_focus:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Stage'
	}],

	startups_invested_in:{
		type: Number,
		required: true,
		default: 0
	},

	notable_investments:[{
		type: String
	}]
}, {timestamps: true});

const Firm = mongoose.model('Firm', firmSchema);

module.exports={
	Firm
}
