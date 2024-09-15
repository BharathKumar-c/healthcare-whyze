const express = require('express');
const account = require('./account');
const invite = require('./invite');
const hospital = require('./hospital');
const dashboard = require('./dashboard');
const { validateAdmin } = require('../../middleware');

const app = express();

app.use('/account', account); // admin/account

app.use('/invite', validateAdmin, invite); // admin/invite

app.use('/hospital', validateAdmin, hospital); // admin/hospital

app.use('/dashboard', validateAdmin, dashboard); // admin/dashboard

module.exports = app;
