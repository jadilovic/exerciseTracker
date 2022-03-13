const mongoose = require('mongoose');

const ExerciseSchema = mongoose.Schema(
	{
		description: {
			type: String,
			required: [true, 'Please enter description'],
		},
		duration: {
			type: Number,
			required: [true, 'Please enter duration'],
		},
		date: {
			type: Date,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please enter user'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Exercise', ExerciseSchema);
