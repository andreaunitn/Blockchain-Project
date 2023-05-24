const express = require('express');
const router = express.Router();
const Personal = require('../../models/personal');
const verifyToken = require('../../middleware/auth');

// ---------------------------------------------------------
// route to get personal information
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

	// find the personal information 
	let personal = await Personal.findOne({"fiscalCode": req.query.fiscalCode});
	if (personal == null) {
		res.status(404).json({
			success: false,
			message: 'Personal information not found'
		});
		return;
	}

	res.status(200).json({
		fiscalCode: personal.fiscalCode,
		birthYear: personal.birthYear,
		residenceRegion: personal.residenceRegion,
		self: "/api/v1/personal/" + personal.fiscalCode
	});
});

module.exports = router;