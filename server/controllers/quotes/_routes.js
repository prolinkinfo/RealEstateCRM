const express = require('express');
const quotes = require('./quotes');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, quotes.index)
router.post('/add', auth, quotes.add)
router.post('/addMany', auth, quotes.addMany)
router.get('/view/:id', auth, quotes.view)
router.put('/edit/:id', auth, quotes.edit)
router.post('/convertToInvoice', auth, quotes.convertToInvoice)
router.delete('/delete/:id', auth, quotes.deleteData)
router.post('/deleteMany', auth, quotes.deleteMany)

module.exports = router