const express = require('express');
const auth = require("../../middelwares/auth");
const validation = require('./validation');

const router = express.Router();

router.get('/', auth, validation.index);
router.post('/add', auth, validation.add);
router.get('/view/:id', auth, validation.view);
router.put('/change-validations/:id', auth, validation.editWholeValidationsArray);
router.put('/change-single-field/:id', auth, validation.editSingleValidationsField);
router.delete('/delete/:id', auth, validation.deleteValidationsField);
router.delete('/deleteMany', auth, validation.deleteManyValidationsFields);

module.exports = router;