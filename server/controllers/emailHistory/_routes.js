const express = require('express');
const auth = require('../../middelwares/auth');
const email = require('./email')

const router = express.Router();

router.get('/', auth, email.index)
router.get('/view/:id', auth, email.view)
router.post('/add', auth, email.add)

module.exports = router