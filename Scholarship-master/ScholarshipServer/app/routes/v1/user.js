const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const verifyToken = require('../../middleware/auth');
const requestPromise = require('request-promise');


// ---------------------------------------------------------
// route to get personal information
// ---------------------------------------------------------
router.get('/getAllInfo', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.query.address) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}


	// find the user information 
	let user = await User.findOne({"address": req.query.address});
	if (user == null) {
		res.status(404).json({
			success: false,
			message: 'User information not found'
		});
		return;
	}

	let uniInfo = (await requestPromise("http://localhost:8080/api/v1/university?fiscalCode=" + user.fiscalCode)
	.then(response => JSON.parse(response)));

	let ecoInfo = (await requestPromise("http://localhost:8080/api/v1/economic?fiscalCode=" + user.fiscalCode)
	.then(response => JSON.parse(response)));

	let personalInfo = (await requestPromise("http://localhost:8080/api/v1/personal?fiscalCode=" + user.fiscalCode)
	.then(response => JSON.parse(response)));

	let userInfo = {
		fiscalCode: user.fiscalCode,
		name: personalInfo.name,
		surname: personalInfo.surname,
		birthYear: personalInfo.birthYear,
		residenceRegion: personalInfo.residenceRegion,
		ISEE: ecoInfo.ISEE,
		fiscalCode: uniInfo.fiscalCode,
		averageRating: uniInfo.averageRating,
		credits: uniInfo.credits,
		offCourse: uniInfo.offCourse
	}

	res.status(200).json({
		user: userInfo,
		self: "/api/v1/user/getAllInfo/" + user.fiscalCode
	});
});


// ---------------------------------------------------------
// route to get personal information
// ---------------------------------------------------------
router.post('/login', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.body.address) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the user information 
	let user = await User.findOne({"address": req.body.address});
	if (user == null) {
		res.status(404).json({
			success: false,
			message: 'User information not found'
		});
		return;
	}

	res.status(200).json({
		address: user.address,
		fiscalCode: user.fiscalCode,
		self: "/api/v1/user/" + user.fiscalCode
	});
});

router.post('/signUp', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.body.fiscalCode || !req.body.address) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the user information 
	let user = await User.find({ $or:[{"address": req.body.address}, {"fiscalCode": req.body.fiscalCode}]});
	if (user.length != 0) {
		console.log(user);
		res.status(409).json({
			success: false,
			message: 'User already exists with the same fiscalCode or address'
		});
		return;
	}

	const newUser = await User.create({
		fiscalCode: req.body.fiscalCode, 
		address: req.body.address, 
	});

	if (newUser == null) {
		res.status(409).json({
			success: false,
			message: 'Problem in the creation'
		});
		return;
	}

	res.status(200).json({
		address: user.address,
		fiscalCode: user.fiscalCode,
		self: "/api/v1/user/" + user.fiscalCode
	});
});

module.exports = router;