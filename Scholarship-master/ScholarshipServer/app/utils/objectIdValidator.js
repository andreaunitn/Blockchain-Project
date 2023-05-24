const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Checks if a string is a valid ObjectId
 * @param {String} id 
 * @returns {boolean} true if valid, false otherwise
 */
const isObjectIdValid = id => ObjectId.isValid(id) ? String(new ObjectId(id) === id) ? true : false : false;

// isValid() is not enough, we also need to do String(new ObjectID()) control

module.exports = isObjectIdValid;