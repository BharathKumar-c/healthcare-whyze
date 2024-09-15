const express = require('express');
const search = require('./search');
const caseStudy = require('./case_study');
const saveProject = require('./save_project');
const cors = require('cors');
const { validateUser } = require('./../middleware');

const app = express();
app.use(cors());

var bodyparser = require('body-parser');
app.use(bodyparser.json({ limit: '500mb' }));
app.use(
  bodyparser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

app.get('/', async (_, res) => {
  res.send('Server running');
});

app.use('/search', search);
app.use('/case-study', caseStudy);
app.use('/save-project', validateUser, saveProject);

module.exports = app;
