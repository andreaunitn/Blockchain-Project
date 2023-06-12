var mongoose = require('mongoose');

const perDb = mongoose.connection.useDb("PersonalDB");

// set up a mongoose model
const perSchema = mongoose.Schema({
    fiscalCode: String,
    name: String,
    surname: String,
    birthYear: Number,
	residenceRegion: String,
})

module.exports = perDb.model('personal', perSchema)