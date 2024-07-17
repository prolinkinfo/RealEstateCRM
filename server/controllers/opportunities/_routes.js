const express = require('express');
const auth = require('../../middelwares/auth');
const opportunities = require('./opportunities')

const router = express.Router();

router.get('/', auth, opportunities.index)
router.get('/view/:id', auth, opportunities.view)
router.post('/add', auth, opportunities.add)
router.post('/addMany', auth, opportunities.addMany)
router.put('/edit/:id', auth, opportunities.edit)
router.delete('/delete/:id', auth, opportunities.deleteData)
router.post('/deleteMany', auth, opportunities.deleteMany)

module.exports = router