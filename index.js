'use strict'

require('dotenv').config();

const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const router = require('./routes/routes.js');
const app = new koa();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app
  .use(logger())
  .use(cors())
  .use(bodyParser())
  .use(router.routes());

// Server connection
app.listen(PORT, (err) => {
  if (err) console.error('❌ Unable to connect the server: ', err);
  console.log(`🌍 Server listening on port ${PORT} - ${ENV} environment`);
});