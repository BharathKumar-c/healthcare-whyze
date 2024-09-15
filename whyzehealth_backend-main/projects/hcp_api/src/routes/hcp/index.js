const express = require('express');
const doctor = require('./doctor');
const tenant = require('./tenant');
const appointment = require('./appointment');
const { validatePatient } = require('../../middleware');

const app = express();

app.use('/doctor', validatePatient, doctor); // hcp/doctor
app.use('/appointment', appointment);
app.use('/tenant', tenant); // hcp/tenant

module.exports = app;
