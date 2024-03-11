const multer = require('multer');
const DocumentSchema = require('../../model/schema/document')
const fs = require('fs');
const mongoose = require('mongoose');


const index = async (req, res) => {
    try {
        const query = req.query
        if (query.createBy) {
            query.createBy = new mongoose.Types.ObjectId(query.createBy);
        }


        const result = await DocumentSchema.aggregate([
            { $unwind: '$file' },
            { $match: { 'file.deleted': false } },
            { $match: query },
            {
                $lookup: {
                    from: 'User', // Replace 'users' with the actual name of your users collection
                    localField: 'createBy',
                    foreignField: '_id', // Assuming the 'createBy' field in DocumentSchema corresponds to '_id' in the 'users' collection
                    as: 'creatorInfo'
                }
            },
            { $unwind: { path: '$creatorInfo', preserveNullAndEmptyArrays: true } },
            { $match: { 'creatorInfo.deleted': false } },
            {
                $group: {
                    _id: '$_id',  // Group by the document _id (folder's _id)
                    folderName: { $first: '$folderName' }, // Get the folderName (assuming it's the same for all files in the folder)
                    createByName: { $first: { $concat: ['$creatorInfo.firstName', ' ', '$creatorInfo.lastName'] } },
                    files: { $push: '$file' }, // Push the matching files back into an array
                }
            },
            { $project: { creatorInfo: 0 } },
        ]);

        res.send(result);
    }
    catch (err) {
        console.error(err);
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = 'uploads/document/';
        fs.mkdirSync(folderPath, { recursive: true }); // Create the directory if it doesn't exist
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uploadDir = 'uploads/document/';
        const filePath = uploadDir + file.originalname;

        if (fs.existsSync(filePath)) {
            // File with the same name already exists, generate a new filename
            const timestamp = Date.now() + Math.floor(Math.random() * 90);
            cb(null, file.originalname.split('.')[0] + '-' + timestamp + '.' + file.originalname.split('.')[1]);
        } else {
            // File doesn't exist, use the original filename
            cb(null, file.originalname);
        }
        // cb(null, file.originalname);
    },
});



const upload = multer({ storage: storage });

const file = async (req, res) => {
    try {
        const { filename, folderName, createBy } = req.body;

        const url = req.protocol + '://' + req.get('host');

        const files = req.files.map((file) => ({
            fileName: filename || file.filename,
            path: file.path,
            img: `${url}/api/document/images/${file.filename}`,
            createOn: new Date(),
        }));

        // Check if the folder exists in the database
        let folder = await DocumentSchema.findOne({ folderName });

        if (!folder) {
            // DocumentSchema does not exist, create a new folder and add the file
            folder = new DocumentSchema({
                folderName,
                file: files, // Directly assign the files array
                createBy
            });
        } else {
            folder.file.push(...files); // Use spread operator to add elements of the files array
        }

        // Save the folder in the database
        await folder.save();

        res.json({ message: 'Folder and files added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err, error: req });
    }
}

const addDocumentContact = async (req, res) => {
    try {
        const { filename, folderName, linkContact, createBy } = req.body;

        if (!linkContact) {
            return res.status(404).json({ message: 'Select valid contact ' });
        }

        const url = req.protocol + '://' + req.get('host');

        const files = req.files.map((file) => ({
            fileName: filename || file.filename,
            path: file.path,
            linkContact: linkContact,
            linkLead: null,
            img: `${url}/api/document/images/${file.filename}`,
            createOn: new Date(),
        }));

        // Check if the folder exists in the database
        let folder = await DocumentSchema.findOne({ folderName });

        if (!folder) {
            // DocumentSchema does not exist, create a new folder and add the file
            folder = new DocumentSchema({
                folderName,
                file: files, // Directly assign the files array
                createBy
            });
        } else {
            folder.file.push(...files); // Use spread operator to add elements of the files array
        }

        // Save the folder in the database
        await folder.save();

        res.json({ message: 'Folder and files added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err, error: req });
    }
}

const addDocumentLead = async (req, res) => {
    try {
        const { filename, folderName, linkLead, createBy } = req.body;

        if (!linkLead) {
            return res.status(404).json({ message: 'Select valid contact ' });
        }

        const url = req.protocol + '://' + req.get('host');

        const files = req.files.map((file) => ({
            fileName: filename || file.filename,
            path: file.path,
            linkContact: null,
            linkLead: linkLead,
            img: `${url}/api/document/images/${file.filename}`,
            createOn: new Date(),
        }));

        // Check if the folder exists in the database
        let folder = await DocumentSchema.findOne({ folderName });

        if (!folder) {
            // DocumentSchema does not exist, create a new folder and add the file
            folder = new DocumentSchema({
                folderName,
                file: files, // Directly assign the files array
                createBy
            });
        } else {
            folder.file.push(...files); // Use spread operator to add elements of the files array
        }

        // Save the folder in the database
        await folder.save();

        res.json({ message: 'Folder and files added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err, error: req });
    }
}

const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the folder exists in the database
        const folder = await DocumentSchema.findOne({ 'file._id': id });

        if (!folder) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Find the file with the specified fileName within the folder
        const file = folder.file.find((f) => f._id.toString() === id);


        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(file.path, file.name);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: error.message });
    }
}

const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the folder exists in the database
        const folder = await DocumentSchema.findOne({ 'file._id': id });
        if (!folder) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Find the file with the specified fileName within the folder
        const file = folder.file.find((f) => f._id.toString() === id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Set the 'deleted' flag to true for the file to soft delete it
        file.deleted = true;

        // Save the updated document
        await folder.save();
        res.status(200).json({ message: "File deleted successfully.", document: folder });

    } catch (err) {
        res.status(500).json({ message: "Error deleting file.", error: err });
    }
};

const LinkDocument = async (req, res) => {
    try {
        const { id } = req.params;
        let { linkContact, linkLead } = req.body

        if (!linkContact && !linkLead) {
            return res.status(404).json({ message: 'Select valid contact or lead ' });
        }

        // Check if the folder exists in the database
        const folder = await DocumentSchema.findOne({ 'file._id': id });
        if (!folder) {
            return res.status(404).json({ message: 'File not found' });
        }

        const file = folder.file.find((f) => f._id.toString() === id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (linkContact) {
            file.linkContact = linkContact;
            file.linkLead = null;
        }
        if (linkLead) {
            file.linkLead = linkLead;
            file.linkContact = null;
        }

        // Save the updated document
        const savedFolder = await folder.save();

        res.status(200).json({ message: "File link successfully.", document: savedFolder });
    } catch (err) {
        res.status(500).json({ message: "Error Link file.", error: err });
    }
};

module.exports = { file, upload, index, downloadFile, addDocumentContact, addDocumentLead, deleteFile, LinkDocument }