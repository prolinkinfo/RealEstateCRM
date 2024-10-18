const express = require('express')
const auth = require('../../middelwares/auth');
const opportunityproject = require('./opportunityproject')

const router = express.Router()
router.get("/", opportunityproject.index);
router.post('/addMany', auth, opportunityproject.addMany)
router.get('/view/:id', auth, opportunityproject.view)
router.post('/add', auth, opportunityproject.add)
router.put('/edit/:id', auth, opportunityproject.edit)
router.delete('/delete/:id', auth, opportunityproject.deleteData)
router.post('/deleteMany', auth, opportunityproject.deleteMany)

module.exports = router