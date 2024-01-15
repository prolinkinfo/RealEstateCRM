const express = require('express');
const img = require('./imagesController.js');

const router = express.Router();

router.get("/", img.index);
router.post("/change-authImg", img.upload.single('authImg'), img.addAuthImg);
router.put("/change-authImg/:id", img.upload.single('authImg'), img.UpdateAuthImg);
router.put("/change-logoImg/:id", img.upload.fields([{ name: 'logoSmImg', maxCount: 1 }, { name: 'logoLgImg', maxCount: 1 }]), img.changeLogoImg);
router.delete('/delete/:id', img.deleteData);
router.put('/isActive/:id', img.setActiveImg);

router.use("/authImg", express.static('uploads/images'));
router.use("/logoImg", express.static('uploads/images'));

module.exports = router;