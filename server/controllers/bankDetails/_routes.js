const express = require('express');
const bankDetails = require('./bankDetails');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, bankDetails.index)
router.post('/add', auth, bankDetails.add)
router.put('/edit/:id', auth, bankDetails.edit)
router.get('/view/:id', auth, bankDetails.view)
router.delete('/delete/:id', auth, bankDetails.deleteData)
router.post('/deleteMany', auth, bankDetails.deleteMany)

module.exports = router