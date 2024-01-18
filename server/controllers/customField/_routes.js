const express = require("express");
const auth = require("../../middelwares/auth");
const customField = require("./customField");

const router = express.Router();

router.get('/', auth, customField.index);
router.post('/add', auth, customField.add);
router.put('/edit/:id', auth, customField.edit);
router.get('/view/:id', auth, customField.view);

module.exports = router;