var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var entries = require('../services/entryDatabase.js');

//router.get("/", orders.showIndex);
//router.get("/entry", orders.createOrder);

router.get("/entries", entries.showEntryAll);
router.post("/entries", entries.addEntry);
router.post("/entries/:id/update", entries.updateEntry);
//router.delete("/entries/:id", entries.deleteEntry);

module.exports = router;