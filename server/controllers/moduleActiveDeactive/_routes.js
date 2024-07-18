const express = require('express');
const moduleActiveDeactive = require('./moduleActiveDeactive');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, moduleActiveDeactive.index)
router.put('/edit', auth, moduleActiveDeactive.Edit)

module.exports = router