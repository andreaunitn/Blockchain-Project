const express = require('express');
const router = express.Router();
const User = require('../../models/user');
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

	// find the user information 
	let user = await User.findOne({"fiscalCode": req.query.fiscalCode});
	if (user == null) {
		res.status(404).json({
			success: false,
			message: 'User information not found'
		});
		return;
	}

	res.status(200).json({
		fiscalCode: user.fiscalCode,
		name: user.name,
		surname: user.surname,
		self: "/api/v1/user/" + user.fiscalCode
	});
});

module.exports = router;