const express = require('express');
const doctor = require('./doctor');
const tenant = require('./tenant');
const appointment = require('./appointment');
const account = require('./account');
const trials = require('./trials');
const { validateHcp } = require('../../middleware');

const app = express();

app.use('/doctor', validateHcp, doctor); // hcp/doctor
app.use('/appointment', appointment);
app.use('/tenant', tenant); // hcp/tenant
app.use('/account', account); // hcp/account
app.use('/trials', validateHcp, trials); // hcp/trials

module.exports = app;
