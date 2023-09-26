const express = require('express');
const auth = require('../../middelwares/auth');
const payment = require('./payment')

const router = express.Router();


router.post('/add', auth, payment.add)

module.exports = router