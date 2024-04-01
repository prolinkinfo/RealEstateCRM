const express = require('express');
const auth = require('../../middelwares/auth');
const meeting = require('./meeting')

const router = express.Router();

router.get('/', auth, meeting.index)
router.get('/view/:id', auth, meeting.view)
router.post('/add', auth, meeting.add)
router.delete('/delete/:id', auth, meeting.deleteData)
router.post('/deleteMany', auth, meeting.deleteMany)

module.exports = router