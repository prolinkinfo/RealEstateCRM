const express = require('express');
const form = require('./form');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.post('/add', auth, form.add);
router.put('/edit/:id', auth, form.edit);

module.exports = router