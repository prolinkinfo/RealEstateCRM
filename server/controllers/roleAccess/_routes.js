const express = require('express');
const roleAccess = require('./roleAccess');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, roleAccess.index)
router.post("/add", auth, roleAccess.add)
router.put('/edit/:id', auth, roleAccess.edit)

module.exports = router