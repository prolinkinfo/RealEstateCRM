const express = require('express');
const reporting = require('./reporting');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, reporting.index)
router.post('/index', auth, reporting.data)


module.exports = router