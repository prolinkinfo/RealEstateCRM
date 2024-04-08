const express = require('express');
const calender = require('./calendar')
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', calender.index)


module.exports = router