const express = require('express');
const sites = require('./sites');

const app = express();

app.use('/sites', sites);

module.exports = app;
