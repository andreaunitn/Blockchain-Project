const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const tokenChecker = require('./utils/tokenGenerator.js');
const user = require('./routes/v1/user.js');
const per = require('./routes/v1/personal.js');
const eco = require('./routes/v1/economic.js');
const uni = require('./routes/v1/university.js');

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

/* Default 404 handler */
app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Not found' });
});


module.exports = app;