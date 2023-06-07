var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('call', new Schema({ 
	name: String,
    description: String,
    ISEE: Number,
    residenceRegion: String,
    credits: Number,
    averageRating: Number,
    birthYear: Number,
    endDate: Date
}));

    