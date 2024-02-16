const express = require('express');
const task = require('./task');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, task.index)
router.post('/add', auth, task.add)
router.get('/view/:id', auth, task.view)
router.put('/edit/:id', auth, task.edit)
router.put('/changeStatus/:id', auth, task.changeStatus)
router.delete('/delete/:id', auth, task.deleteData)
router.post('/deleteMany', auth, task.deleteMany)

module.exports = router