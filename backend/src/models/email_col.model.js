const mongoose = require('mongoose');

const emailCollectionSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true
	}
}, {timestamps: true});

const Email = mongoose.model('Email', emailCollectionSchema);

module.exports = {
	Email
}
