const express = require('express');
const router = express.Router();
const Call = require('../../models/call');
const verifyToken = require('../../middleware/auth');

// ---------------------------------------------------------
// route to get all the calls
// ---------------------------------------------------------
router.get('/all', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	// find the call information 
	let calls = await Call.find({});
	res.status(200).json(calls.map(call => {
		return {
			name: call.name,
			description: call.description,
            ISEE: call.ISEE,
            residenceRegion: call.residenceRegion,
            credits: call.credits,
            averageRating: call.averageRating,
            birthYear: call.birthYear,
            endDate: call.endDate,
			self: "/api/v1/calls/" + call.name
		}
	}));
});

// ---------------------------------------------------------
// route to get the call selected
// ---------------------------------------------------------
router.get('', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.query.name) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the call information 
	let call = await Call.findOne({"name": req.query.name});
	res.status(200).json({
		name: call.name,
		description: call.description,
		ISEE: call.ISEE,
		residenceRegion: call.residenceRegion,
		credits: call.credits,
		averageRating: call.averageRating,
		birthYear: call.birthYear,
		endDate: call.endDate,
		self: "/api/v1/calls/" + call.name
	});
});

// ---------------------------------------------------------
// route to get the call selected
// ---------------------------------------------------------
router.post('', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if (!req.body.name || req.body.name == "" || !req.body.description || req.body.description == "" 
		|| !req.body.residenceRegion || req.body.residenceRegion == "") {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the call information 
	let call = await Call.findOne({"name": req.body.name});

	if(call != null){
		res.status(409).json({
			success: false,
			message: 'Another call has the same name'
		});
		return;
	}

	const newCall = await Call.create({
		name: req.body.name,
		description: req.body.description,
		ISEE: req.body.ISEE,
		residenceRegion: req.body.residenceRegion,
		credits: req.body.credits,
		averageRating: req.body.averageRating,
		birthYear: req.body.birthYear,
		endDate: req.body.endDate
	});

	res.status(200).json({
		success: true,
		message: "Created correctly",
		self: "/api/v1/calls/" + newCall.name
	});
});

module.exports = router;