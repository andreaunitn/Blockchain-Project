const app = require('./app/app.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

/**
 * https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment#4-listen-on-the-correct-port
 */

const port = process.env.PORT || 8080;

DB_URL="mongodb+srv://user:user@blockchaindb.8mkz91z.mongodb.net/OperaDB?retryWrites=true&w=majority"
/**
 * Configure mongoose
 */
// mongoose.Promise = global.Promise;
app.locals.db = mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {

    console.log("Connected to Database");

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

});
