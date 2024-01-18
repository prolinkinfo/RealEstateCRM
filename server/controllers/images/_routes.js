const express = require('express');
const img = require('./imagesController.js');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get("/", img.index);
router.get("/view/:id", auth, img.view);
router.post("/change-authImg", auth, img.upload.single('authImg'), img.addAuthImg);
router.put("/change-authImg/:id", auth, img.upload.single('authImg'), img.UpdateAuthImg);
router.put("/change-logoImg/:id", auth, img.upload.fields([{ name: 'logoSmImg', maxCount: 1 }, { name: 'logoLgImg', maxCount: 1 }]), img.changeLogoImg);
router.delete('/delete/:id', auth, img.deleteData);
router.put('/isActive/:id', auth, img.setActiveImg);
router.post("/add-auth-logo-img", auth, img.upload.fields([{ name: 'authImg', maxCount: 1 }, { name: 'logoSmImg', maxCount: 1 }, { name: 'logoLgImg', maxCount: 1 }]), img.addAuthAndLogoImg);
router.put("/change-auth-logo-img/:id", auth, img.upload.fields([{ name: 'authImg', maxCount: 1 }, { name: 'logoSmImg', maxCount: 1 }, { name: 'logoLgImg', maxCount: 1 }]), img.updateAuthAndLogoImg);

router.use("/authImg", express.static('uploads/images'));
router.use("/logoImg", express.static('uploads/images'));

module.exports = router;