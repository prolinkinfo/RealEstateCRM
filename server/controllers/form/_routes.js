const express = require('express');
const form = require('./form');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, form.index);
router.get('/view/:id', auth, form.view);
router.post('/add', auth, form.add);
router.put('/edit/:id', auth, form.edit);
router.delete('/delete/:id', auth, form.deleteField);
router.post('/deleteMany', auth, form.deleteManyField);

module.exports = router