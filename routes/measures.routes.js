'use strict';

const router = require('koa-router')();
const db = require('../models').db;
db.setup();
const MeasuresController = require('../controllers/measures.controller');
const measuresController = new MeasuresController(db.Measure);

// Measure routes
router.get('/', measuresController.getMeasures);

module.exports = router;