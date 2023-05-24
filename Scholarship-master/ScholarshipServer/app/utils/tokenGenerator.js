const jwt = require("jsonwebtoken");

/**
 * Generates a token given a user
 * @param {User} user usermodel
 */
const generateToken = (user) => {
	var payload = {
		permissions: user.permissions,
		username: user.username,
		user_id: user._id
	};

	var options = {
		expiresIn: 86400 // expires in 24 hours
	};

	return jwt.sign(payload, process.env.TOKEN_SECRET, options);
};

module.exports = generateToken;