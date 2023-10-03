const express = require('express');
const payment = require('./payment')

const router = express.Router();


router.post('/add', payment.add)
router.get('/', payment.index)

module.exports = router