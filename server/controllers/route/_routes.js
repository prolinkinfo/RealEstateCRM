const express = require('express');
const route = require('./route');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, route.index)

module.exports = router