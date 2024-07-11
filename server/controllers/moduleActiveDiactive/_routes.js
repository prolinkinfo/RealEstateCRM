const express = require('express');
const moduleActiveDiactive = require('./moduleActiveDiactive');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, moduleActiveDiactive.index)
router.put('/edit', auth, moduleActiveDiactive.Edit)

module.exports = router