var mongoose = require('mongoose');

const ecoDb = mongoose.connection.useDb("EconomicDB");

// set up a mongoose model
const ecoSchema = mongoose.Schema({
    fiscalCode: String,
    ISEE: Number
})

module.exports = ecoDb.model('economic', ecoSchema)
