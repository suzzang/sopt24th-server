var express = require('express');
var router = express.Router();

router.use('/training', require('./training/index'))

module.exports = router;