const express = require("express");
const routes = require("./route");

const app = express();

app.use("/", routes);

module.exports = app;
