'use strict';

require('dotenv').config();
require('./db.js')();
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
  .use(router.routes())
  .use(router.allowedMethods());

// Server connection
app.listen(PORT, (err) => {
  // eslint-disable-next-line
  if (err) console.error('❌ Unable to connect the server: ', err);
  // eslint-disable-next-line
  console.log(`🌍 Server listening on port ${PORT} - ${ENV} environment`);
});