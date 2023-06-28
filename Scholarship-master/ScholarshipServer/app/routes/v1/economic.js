const express = require('express');
const router = express.Router();
const Eco = require('../../models/economic');

// ---------------------------------------------------------
// route to get economic information
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

	// find the economic information
	let eco = await Eco.findOne({"fiscalCode": req.query.fiscalCode});
	if (eco == null) {
		res.status(404).json({
			success: false,
			message: 'Economic information not found'
		});
		return;
	}

	res.status(200).json({
		fiscalCode: eco.fiscalCode,
		ISEE: eco.ISEE,
		self: "/api/v1/economic/" + eco.fiscalCode
	});
});

module.exports = router;