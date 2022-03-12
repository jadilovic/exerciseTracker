const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Please enter user role'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
