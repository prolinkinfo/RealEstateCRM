const express = require("express");
const auth = require("../../middelwares/auth");
const customField = require("./customField");
const img = require('../../controllers/images/imagesController');

const router = express.Router();

router.get('/', auth, customField.index);
router.post("/add-module", auth, img.upload.single('icon'), customField.createNewModule);
router.put("/change-icon/:id", auth, img.upload.single('icon'), customField.changeIcon);
router.put("/change-module-name/:id", auth, customField.changeModuleName);
router.delete("/module/:id", auth, customField.deletmodule);
router.post("/deleteMany-Module", auth, customField.deleteManyModule);

router.post('/add', auth, customField.add);
router.get('/view/:id', auth, customField.view);
router.put('/change-fields/:id', auth, customField.editWholeFieldsArray);
router.put('/change-single-field/:id', auth, customField.editSingleField);
router.delete('/delete/:id', auth, customField.deleteField);
router.post('/deleteMany', auth, customField.deleteManyFields);

router.post("/add-heading", auth, customField.addHeading);
router.put('/change-single-heading/:id', auth, customField.editSingleHeading);
router.put('/change-headings/:id', auth, customField.editWholeHeadingsArray);
router.delete('/delete-heading/:id', auth, customField.deleteHeading);
router.post('/deleteMany-headings', auth, customField.deleteManyHeadings);

router.put('/change-belongsTo/:id', auth, customField.changeFieldsBelongsTo);

router.put('/change-table-field/:id', auth, customField.changeIsTableField);
router.put('/change-table-fields', auth, customField.changeIsTableFields);
router.put('/change-view-fields', auth, customField.changeIsViewFields);

router.use("/icon", express.static('uploads/images'));

module.exports = router;