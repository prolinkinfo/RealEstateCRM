const express = require('express');
const property = require('./property');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, property.index)
router.post('/add', auth, property.add)
router.post('/addMany', auth, property.addMany)
router.get('/view/:id', auth, property.view)
router.put('/edit/:id', auth, property.edit)
router.delete('/delete/:id', auth, property.deleteData)
router.post('/deleteMany', auth, property.deleteMany)
router.post('/add-property-photos/:id', property.upload.array('property', 10), property.propertyPhoto)
router.post('/add-virtual-tours-or-videos/:id', property.virtualTours.array('property', 10), property.VirtualToursorVideos)
router.post('/add-floor-plans/:id', property.FloorPlansStorage.array('property', 10), property.FloorPlans)
router.post('/add-property-documents/:id', property.PropertyDocumentsStorage.array('property', 10), property.PropertyDocuments)

router.use('/property-documents', express.static('uploads/Property/property-documents'));
router.use('/floor-plans', express.static('uploads/Property/floor-plans'));
router.use('/virtual-tours-or-videos', express.static('uploads/Property/virtual-tours-or-videos'));
router.use('/property-photos', express.static('uploads/Property/PropertyPhotos'));
// router.post('/file', property.upload.array('file', 10), property.file)
// router.post('/file', property.upload.single('file'), property.file)

module.exports = router