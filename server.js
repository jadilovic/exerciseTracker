const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./User');
require('dotenv').config();
const bodyParser = require('body-parser');
// connect DB
const connectDB = require('./connect');
const Exercise = require('./Exercise');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users', (req, res) => {
	const userInput = req.body.username;

	const createUser = async (input) => {
		const newUser = await User.create({ username: input });
		res.json({ username: newUser.username, _id: newUser._id });
	};

	if (userInput) {
		createUser(userInput);
	} else {
		res.json({ error: 'invalid input' });
	}
});

app.post('/api/users/:_id/exercises', (req, res) => {
	const userId = req.params._id;
	const description = req.body.description;
	const duration = req.body.duration;
	const enteredDate = req.body.date;

	const createExercise = async (username) => {
		let date = '';
		if (enteredDate) {
			date = new Date(enteredDate).toDateString();
			console.log(date);
			if (date === 'Invalid Date') {
				date = new Date(0).toDateString();
				console.log(date);
			}
		} else {
			date = new Date(0).toDateString();
		}
		const exercise = await Exercise.create({
			description,
			duration,
			enteredDate: date,
			createdBy: userId,
		});
		res.json({
			_id: exercise.createdBy,
			username,
			date,
			duration: Number(duration),
			description,
		});
	};

	const getUser = async (id) => {
		const userObject = await User.findById(id).exec();
		if (userObject) {
			createExercise(userObject.username);
		} else {
			res.json({ error: 'user id not valid' });
		}
	};

	if (
		userId !== '' &&
		description !== '' &&
		!isNaN(duration) &&
		duration !== ''
	) {
		getUser(userId);
	} else {
		res.json({ error: 'invalid input' });
	}
});

app.get('/api/users/:_id/logs', (req, res) => {
	const userId = req.params._id;

	const findExercises = async (user_id, userName) => {
		const exercises = await Exercise.find({ createdBy: user_id });
		const exerciseList = [];
		exercises.forEach((exercise) => {
			exerciseList.push({
				description: exercise.description,
				duration: exercise.duration,
				date: exercise.enteredDate,
			});
		});
		console.log(exerciseList);
		res.json({
			username: userName,
			count: exerciseList.length,
			_id: user_id,
			log: exerciseList,
		});
	};

	const getUser = async (id) => {
		const userObject = await User.findById(id).exec();
		if (userObject) {
			findExercises(userObject._id, userObject.username);
		} else {
			res.json({ error: 'user id not valid' });
		}
	};

	if (userId) {
		getUser(userId);
	} else {
		res.json({ err: 'please enter user id' });
	}
});

app.get('/api/users', (req, res) => {
	const getUsers = async () => {
		const users = await User.find({});
		res.json(users);
	};
	getUsers();
});

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
