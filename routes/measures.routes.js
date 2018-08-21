'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');
const db = require('../models').db;
db.setup();
const MeasuresController = require('../controllers/measures.controller');
const measuresController = new MeasuresController(db.Measure);

// Measure routes
router.get('/', authMiddleware, measuresController.getMeasures);

module.exports = router;