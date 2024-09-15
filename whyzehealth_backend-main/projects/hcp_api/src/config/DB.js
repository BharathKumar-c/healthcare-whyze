/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB}`;

mongoose.set('strictQuery', true);

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err));
