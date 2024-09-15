require('dotenv').config();
require('./config/db');
const app = require('./app');
const port = 3000;

var bodyparser = require('body-parser');
app.use(bodyparser.json({ limit: '500mb' }));
app.use(
  bodyparser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

app.listen(port, () => {
  console.info(`listening on http://localhost:${port}`);
});
