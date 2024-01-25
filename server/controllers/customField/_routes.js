const express = require("express");
const auth = require("../../middelwares/auth");
const customField = require("./customField");

const router = express.Router();

router.get('/', auth, customField.index);
router.post('/add', auth, customField.add);
router.use("/add-module", auth, customField.createNewModule);
router.put('/change-fields/:id', auth, customField.editWholeFieldsArray);
router.put('/change-single-field/:id', auth, customField.editSingleField);
router.get('/view/:id', auth, customField.view);
router.delete('/delete/:id', auth, customField.deleteField);
router.post('/deleteMany', auth, customField.deleteManyFields);
router.post("/add-heading", auth, customField.addHeading);
router.put('/change-headings/:id', auth, customField.editWholeHeadingsArray);
router.put('/change-single-heading/:id', auth, customField.editSingleHeading);
router.delete('/delete-heading/:id', auth, customField.deleteHeading);
router.post('/deleteMany-headings', auth, customField.deleteManyHeadings);

module.exports = router;