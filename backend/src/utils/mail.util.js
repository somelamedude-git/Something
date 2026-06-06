const nodemailer = require('nodemailer');
require('dotenv').config({path: '../.env'});
const crypto = require('crypto');
const { TempUser } = require('../models/temp.model.js');
const { Email } = require('../models/email_col.js');
const sendEmail = async(options)=>{
	const transporter = nodemailer.createTransport({
		process: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});

	const mailOptions = {
		from: `${process.env.FROM_NAME}<${process.env.EMAIL_USER}>`,
		to: options.email,
		subject: options.subject,
		text: options.message
	};

	await transporter.sendMail(mailOptions);
}

const verifyMail = async(req, res)=>{
	const hashedToken = crypto
	.createHash('sha256')
	.update(req.params.token)
	.digest('hex');

	const tempuser = await TempUser.findOne({mailToken: hashedToken, mailTokenExp: {$gt: Date.now()}});

	const emailReg = tempuser.email;
	await Email.create({
		email: emailReg
	});

	await Email.save();

}





