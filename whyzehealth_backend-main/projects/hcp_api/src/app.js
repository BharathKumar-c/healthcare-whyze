require('dotenv').config();
require('./config/DB');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const swaggerDocs = require('./swagger');

const port = process.env.PORT || 7000;

const app = express();

app.use(cors());

app.use(
  bodyparser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

app.use('/', routes);

app.use('/health', (_, res) => res.sendStatus(200));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

module.exports = app;
