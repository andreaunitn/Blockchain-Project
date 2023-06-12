var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('requestCall', new Schema({ 
	name: String,
    address: String,
    dateTime: Date,
    result: Boolean,
    message: String
}));

    