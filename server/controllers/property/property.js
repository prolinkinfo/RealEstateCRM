const { Property } = require('../../model/schema/property')
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const { Contact } = require('../../model/schema/contact');


const index = async (req, res) => {
    const query = req.query
    query.deleted = false;
    // let result = await Property.find(query)
    let allData = await Property.find(query).populate({
        path: 'createBy',
        match: { deleted: false } // Populate only if createBy.deleted is false
    }).exec()

    const result = allData.filter(item => item.createBy !== null);
    res.send(result)
}

const add = async (req, res) => {
    try {
        req.body.createdDate = new Date();
        const user = new Property(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to create Property:', err);
        res.status(400).json({ error: 'Failed to create Property' });
    }
}

const addMany = async (req, res) => {
    try {
        const data = req.body;
        const insertedProperty = await Property.insertMany(data);
        res.status(200).json(insertedProperty);
    } catch (err) {
        console.error('Failed to create Property :', err);
        res.status(400).json({ error: 'Failed to create Property' });
    }
};

const edit = async (req, res) => {
    try {
        let result = await Property.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Property:', err);
        res.status(400).json({ error: 'Failed to Update Property' });
    }
}

const view = async (req, res) => {
    const { id } = req.params
    let property = await Property.findOne({ _id: id })
    let result = await Contact.find({ deleted: false })

    let filteredContacts = result.filter((contact) => contact.interestProperty.includes(id));

    if (!property) return res.status(404).json({ message: "no Data Found." })
    res.status(200).json({ property, filteredContacts })
}

const deleteData = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", property })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const property = await Property.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", property })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

// const storage = multer.diskStorage({
// destination: function (req, file, cb) {
//     const uploadDir = 'uploads/Property/PropertyPhotos';
//     fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
// },
// filename: function (req, file, cb) {
//     const uploadDir = 'uploads/Property';
//     const filePath = path.join(uploadDir, file.originalname);

//     // Check if the file already exists in the destination directory
//     if (fs.existsSync(filePath)) {
//         // For example, you can append a timestamp to the filename to make it unique
//         const timestamp = Date.now() + Math.floor(Math.random() * 90);
//         cb(null, file.originalname.split('.')[0] + '-' + timestamp + '.' + file.originalname.split('.')[1]);
//     } else {
//         cb(null, file.originalname);
//     }
// },
// });

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = 'uploads/Property/PropertyPhotos';
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uploadDir = 'uploads/Property/PropertyPhotos';
            const filePath = path.join(uploadDir, file.originalname);

            // Check if the file already exists in the destination directory
            if (fs.existsSync(filePath)) {
                // For example, you can append a timestamp to the filename to make it unique
                const timestamp = Date.now() + Math.floor(Math.random() * 90);
                cb(null, file.originalname.split('.')[0] + '-' + timestamp + '.' + file.originalname.split('.')[1]);
            } else {
                cb(null, file.originalname);
            }
        },
    })
});

const propertyPhoto = async (req, res) => {
    try {
        const { id } = req.params

        if (!req.files || req.files.length === 0) {
            res.status(400).send('No files uploaded.');
            return;
        }
        const url = req.protocol + '://' + req.get('host');

        const file = req?.files.map((file) => ({
            img: `${url}/api/property/property-photos/${file.filename}`,
            createOn: new Date(),
        }));
        // Update the "photos" field for the existing document
        // await Property.updateOne({ _id: id }, { $set: { propertyPhotos: file } });
        await Property.updateOne({ _id: id }, { $push: { propertyPhotos: { $each: file } } });
        res.send('File uploaded successfully.');
    } catch (err) {
        console.error('Failed to create Property:', err);
        res.status(400).json({ error: 'Failed to create Property' });
    }
}
// --
const virtualTours = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = 'uploads/Property/virtual-tours-or-videos';
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uploadDir = 'uploads/Property/virtual-tours-or-videos';
            const filePath = path.join(uploadDir, file.originalname);

            // Check if the file already exists in the destination directory
            if (fs.existsSync(filePath)) {
                // For example, you can append a timestamp to the filename to make it unique
                const timestamp = Date.now() + Math.floor(Math.random() * 90);
                cb(null, file.originalname.split('.')[0] + '-' + timestamp + '.' + file.originalname.split('.')[1]);
            } else {
                cb(null, file.originalname);
            }
        },
    })
});

const VirtualToursorVideos = async (req, res) => {
    try {
        const { id } = req.params

        if (!req.files || req.files.length === 0) {
            res.status(400).send('No files uploaded.');
            return;
        }
        const url = req.protocol + '://' + req.get('host');

        const file = req?.files.map((file) => ({
            img: `${url}/api/property/virtual-tours-or-videos/${file.filename}`,
            createOn: new Date(),
        }));

        await Property.updateOne({ _id: id }, { $push: { virtualToursOrVideos: { $each: file } } });
        res.send('File uploaded successfully.');
    } catch (err) {
        console.error('Failed to create Property:', err);
        res.status(400).json({ error: 'Failed to create Property' });
    }
}

const FloorPlansStorage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = 'uploads/Property/floor-plans';
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uploadDir = 'uploads/Property/floor-plans';
            const filePath = path.join(uploadDir, file.originalname);

            // Check if the file already exists in the destination directory
            if (fs.existsSync(filePath)) {
                // For example, you can append a timestamp to the filename to make it unique
                const timestamp = Date.now() + Math.floor(Math.random() * 90);
                cb(null, file.originalname.split('.')[0] + '-' + timestamp + '.' + file.originalname.split('.')[1]);
            } else {
                cb(null, file.originalname);
            }
        },
    })
});

const FloorPlans = async (req, res) => {
    try {
        const { id } = req.params

        if (!req.files || req.files.length === 0) {
            res.status(400).send('No files uploaded.');
            return;
        }
        const url = req.protocol + '://' + req.get('host');

        const file = req?.files.map((file) => ({
            img: `${url}/api/property/floor-plans/${file.filename}`,
            createOn: new Date(),
        }));

        await Property.updateOne({ _id: id }, { $push: { floorPlans: { $each: file } } });
        res.send('File uploaded successfully.');
    } catch (err) {
        console.error('Failed to create Property:', err);
        res.status(400).json({ error: 'Failed to create Property' });
    }
}
// --
const PropertyDocumentsStorage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = 'uploads/Property/property-documents';
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uploadDir = 'uploads/Property/property-documents';
            const filePath = path.join(uploadDir, file.originalname);

            // Check if the file already exists in the destination directory
            if (fs.existsSync(filePath)) {
                // For example, you can append a timestamp to the filename to make it unique
                const timestamp = Date.now() + Math.floor(Math.random() * 90);
                cb(null, file.originalname.split('.')[0] + '-' + timestamp + '.' + file.originalname.split('.')[1]);
            } else {
                cb(null, file.originalname);
            }
        },
    })
});

const PropertyDocuments = async (req, res) => {
    try {
        const { id } = req.params

        if (!req.files || req.files.length === 0) {
            res.status(400).send('No files uploaded.');
            return;
        }
        const url = req.protocol + '://' + req.get('host');

        const file = req?.files.map((file) => ({
            filename: file.filename,
            img: `${url}/api/property/property-documents/${file.filename}`,
            createOn: new Date(),
        }));

        await Property.updateOne({ _id: id }, { $push: { propertyDocuments: { $each: file } } });
        res.send('File uploaded successfully.');
    } catch (err) {
        console.error('Failed to create Property:', err);
        res.status(400).json({ error: 'Failed to create Property' });
    }
}



module.exports = { index, add, addMany, view, edit, deleteData, deleteMany, upload, propertyPhoto, virtualTours, VirtualToursorVideos, FloorPlansStorage, FloorPlans, PropertyDocumentsStorage, PropertyDocuments }