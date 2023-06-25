const express = require('express');
const router = express.Router();
const Uni = require('../../models/university');
const verifyToken = require('../../middleware/auth');

// ---------------------------------------------------------
// route to get university career information
// ---------------------------------------------------------
router.get('', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if (!req.query.fiscalCode) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the university career information
	let uni = await Uni.findOne({"fiscalCode": req.query.fiscalCode});
	if (uni == null) {
		res.status(404).json({
			success: false,
			message: 'University Career information not found'
		});
		return;
	}

	res.status(200).json({
		fiscalCode: uni.fiscalCode,
		averageRating: uni.averageRating,
		credits: uni.credits,
		uniYear: uni.uniYear,
		offCourse: uni.offCourse,
		self: "/api/v1/university/" + uni.fiscalCode
	});
});

module.exports = router;