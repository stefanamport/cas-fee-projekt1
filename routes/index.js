var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var entries = require('../services/entryDatabase.js');

router.get("/entries", entries.showEntryAll);
router.post("/entries", entries.addEntry);
router.post("/entries/:id/update", entries.updateEntry);

module.exports = router;