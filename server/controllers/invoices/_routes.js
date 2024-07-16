const express = require('express');
const invoices = require('./invoices');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, invoices.index)
router.post('/add', auth, invoices.add)
router.post('/addMany', auth, invoices.addMany)
router.get('/view/:id', auth, invoices.view)
router.put('/edit/:id', auth, invoices.edit)
router.delete('/delete/:id', auth, invoices.deleteData)
router.post('/deleteMany', auth, invoices.deleteMany)

module.exports = router