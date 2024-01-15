const Img = require('../../model/schema/imagesSchema');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const index = async (req, res) => {
    const query = req.query;
    query.deleted = false;
    let result = await Img.find(query);
    return res.send(result);
};

const addAuthImg = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, message: 'No file uploaded.' });
        }

        const url = req.protocol + '://' + req.get('host');
        const file = `${url}/api/images/authImg/${req?.file?.filename}`;
        const createdDate = new Date();

        const newImgDocument = new Img({ authImg: file, createdDate });
        await newImgDocument.save();
        return res.send({ data: newImgDocument, message: 'Auth image uploaded successfully' });

    } catch (err) {
        console.error('Failed to add auth Image:', err);
        fs.unlinkSync(path.join(__dirname, '../../uploads/images/', req?.file?.filename));
        return res.status(400).json({ success: false, message: 'Failed to add auth image' });
    }
}

const UpdateAuthImg = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).send({ success: false, message: 'No files uploaded.' });
        }

        const existingDocument = await Img.findOne({ _id: id });

        if (existingDocument) {
            const url = req.protocol + '://' + req.get('host');

            const file = `${url}/api/images/authImg/${req?.file?.filename}`;

            await Img.updateOne({ _id: id }, { $set: { authImg: file } });
            return res.send({ path: file, message: 'File uploaded successfully.' });

        } else {
            fs.unlinkSync(path.join(__dirname, '../../uploads/images/', req?.file?.filename));
            return res.status(404).send({ success: false, message: 'No Data Found.' });
        }

    } catch (err) {
        console.error('Failed to create AuthImg:', err);
        fs.unlinkSync(path.join(__dirname, '../../uploads/images/', req?.file?.filename));
        return res.status(400).json({ success: false, message: 'Failed to update auth Image' });
    }
};

const changeLogoImg = async (req, res) => {  // add, edit
    try {
        const { id } = req.params;

        if (!req?.files?.logoLgImg && !req?.files?.logoSmImg) {
            return res.status(400).send({ success: false, message: 'No logo files uploaded.' });
        }

        const { logoLgImg, logoSmImg } = req?.files;

        const existingDocument = await Img.findOne({ _id: id });

        if (existingDocument) {
            const url = req.protocol + '://' + req.get('host');
            let smFile = '';
            let lgFile = '';

            if (logoLgImg && logoSmImg) {
                smFile = `${url}/api/images/logoImg/${logoSmImg?.[0]?.filename}`;
                lgFile = `${url}/api/images/logoImg/${logoLgImg?.[0]?.filename}`;
            } else {
                smFile = `${url}/api/images/logoImg/${logoSmImg ? logoSmImg?.[0]?.filename : logoLgImg?.[0]?.filename}`;
                lgFile = `${url}/api/images/logoImg/${logoSmImg ? logoSmImg?.[0]?.filename : logoLgImg?.[0]?.filename}`;
            }

            await Img.updateOne({ _id: id }, { $set: { logoSmImg: smFile, logoLgImg: lgFile } });
            return res.send({ smLogoPath: smFile, lgLogoPath: lgFile, message: 'File uploaded successfully.' });
        }
        else {
            req?.files && Object.values(req?.files).forEach((fileArray) => {
                if (fileArray?.[0]?.filename) {
                    const filePath = path.join(__dirname, '../../uploads/images/', fileArray?.[0]?.filename);
                    fs.unlinkSync(filePath);
                }
            });

            return res.status(404).send({ success: false, message: 'No Data Found.' });
        }

    } catch (err) {
        console.error('Failed to set logo images :', err);

        req?.files && Object.values(req?.files).forEach((fileArray) => {
            if (fileArray?.[0]?.filename) {
                const filePath = path.join(__dirname, '../../uploads/images/', fileArray?.[0]?.filename);
                fs.unlinkSync(filePath);
            }
        });

        return res.status(400).json({ success: false, message: 'Failed to set logo imges' });
    }
};

const setActiveImg = async (req, res) => {
    try {
        const { isActive } = req.body;
        const imageData = await Img.findByIdAndUpdate(req.params.id, { isActive: isActive }, { new: true });

        if (!imageData) {
            return res.status(404).send({ success: false, message: "No Data Found" })
        }

        return res.status(200).json({ message: "done", data: imageData });

    } catch (err) {

    }
}

const deleteData = async (req, res) => {
    try {
        const imageData = await Img.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });

        if (!imageData) {
            return res.status(404).send({ success: false, message: "No Data Found" })
        }

        return res.status(200).json({ message: "done", data: imageData });

    } catch (err) {
        return res.status(404).json({ success: false, message: "error", err });
    }
};

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = 'uploads/images/';
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uploadDir = 'uploads/images';
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


module.exports = { index, upload, addAuthImg, UpdateAuthImg, changeLogoImg, deleteData, setActiveImg };