var mongoose = require('mongoose');

const uniDb = mongoose.connection.useDb("UniversityDB");

// set up a mongoose model
const uniSchema = mongoose.Schema({
    fiscalCode: String,
    credits: Number,
	averageRating: Number,
	offCourse: Boolean 
})

module.exports = uniDb.model('uni', uniSchema)