const express = require('express');
const user = require('./user');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.post('/admin-register', user.adminRegister)
router.get('/', auth, user.index)
router.post('/register', user.register)
router.post('/login', user.login)
router.post('/deleteMany', auth, user.deleteMany)
router.get('/view/:id', auth, user.view)
router.delete('/delete/:id', auth, user.deleteData)
router.put('/edit/:id', auth, user.edit)
router.put('/change-roles/:id', auth, user.changeRoles)



module.exports = router
