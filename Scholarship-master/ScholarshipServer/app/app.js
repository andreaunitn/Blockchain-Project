const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const user = require('./routes/v1/user.js');
const per = require('./routes/v1/personal.js');
const eco = require('./routes/v1/economic.js');
const uni = require('./routes/v1/university.js');
const call = require('./routes/v1/call.js');
const requestCall = require('./routes/v1/requestCall.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Manage user routing and middleware
*/
app.use('/api/v1/user', user);

/**
 * Manage Personal routing and middleware
*/
app.use('/api/v1/personal', per);

/**
 * Manage Economic routing and middleware
*/
app.use('/api/v1/economic', eco);

/**
 * Manage University routing and middleware
*/
app.use('/api/v1/university', uni);

/**
 * Manage calls routing and middleware
*/
app.use('/api/v1/call', call);

/**
 * Manage Request call routing and middleware
*/
app.use('/api/v1/requestCall', requestCall);

/* Default 404 handler */
app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Not found' });
});


module.exports = app;
