'use strict'
require('dotenv').config();
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new koa();
const port = process.env.PORT || 3000;

app
  .use(bodyParser())
  .listen(port);

console.log(`Server listening on port ${port}`);
