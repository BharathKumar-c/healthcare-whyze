const express = require('express');
const account = require('./account');
const lifestyle = require('./lifestyle');
const patient = require('./patientDetails');
const medication = require('./medication');
const fcm = require('./fcm');
const hi = require('./hi');
const condition = require('./condition');
const patientDoctorConnection = require('./doctorConnection');
const allergies = require('./allergies');
const familyhistory = require('./familydetails');
const verification = require('./verification');
const vaccine = require('./vaccine');
const tenant = require('./tenant');
const preference = require('./preference');
const faq = require('./faq');
const reaction = require('./reaction');
const trailAppointment = require('./patientTrailAppointment');
const casedetails = require('./case');
const linkExistingAccount = require('./linkExistingAccount');
const { validatePatient } = require('../../middleware');

const app = express();

app.use('/account', account); // patient/v2/account

app.use('/', patient); // patient/v2/

app.use('/lifestyle', validatePatient, lifestyle); // patient/v2/lifestyle
app.use('/allergies', validatePatient, allergies); // patient/v2/allergies
app.use('/fh', validatePatient, familyhistory); // patient/v2/fh
app.use('/medication', validatePatient, medication); // patient/v2/medication
app.use('/tenant', tenant);
app.use('/fcm', validatePatient, fcm); // patient/v2/fcm
app.use('/faq', faq);
app.use('/case', casedetails);
app.use('/reaction', reaction);
app.use('/hi', validatePatient, hi); // patient/v2/hi

app.use('/condition', validatePatient, condition); // patient/v2/condition

app.use('/hcp-connect', validatePatient, patientDoctorConnection); // patient/v2/hcp-connect

app.use('/verification', validatePatient, verification); // patient/v2/verification

app.use('/vaccine', validatePatient, vaccine); // patient/v2/vaccine

app.use('/preference', validatePatient, preference); // patient/v2/preference

app.use('/link-existing-account', validatePatient, linkExistingAccount); // patient/v2/linkExistingAccount

app.use('/book-appointment', validatePatient, trailAppointment); // patient/v2/book-appointment

module.exports = app;
