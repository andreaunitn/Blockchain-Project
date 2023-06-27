var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('call', new Schema({ 
    contractAddress: String,
	name: String,
    description: String,
    ISEE: Number,
    budget: Number,
    credits: [Number],
    funds: [Number],
    averageRating: Number,
    endDate: Date
}));

    