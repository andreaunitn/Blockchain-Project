var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('user', new Schema({ 
	address: String,
	fiscalCode: String
}));
