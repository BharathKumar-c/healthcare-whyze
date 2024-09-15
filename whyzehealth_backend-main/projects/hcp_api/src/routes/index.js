const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const PatientRoutes = require('./patient');
const HcpRoutes = require('./hcp');

const app = express();
app.use(cors());

app.use(bodyparser.json({ limit: '500mb' }));
app.use(
  bodyparser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

app.get('/', async (_, res) => {
  res.send('Hcp Server running V2');
});

app.use('/patient/v2', PatientRoutes);

app.use('/hcp', HcpRoutes);

module.exports = app;
