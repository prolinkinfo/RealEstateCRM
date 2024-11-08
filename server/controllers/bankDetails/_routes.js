const express = require('express');
const bankDetails = require('./bankDetails');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, bankDetails.index)
router.post('/add', auth, bankDetails.add)

module.exports = router