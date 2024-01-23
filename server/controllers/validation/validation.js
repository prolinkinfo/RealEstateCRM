const Validation = require('../../model/schema/validation');

const index = async (req, res) => {
    try {
        const query = req.query;
        query.deleted = false;
        let result = await Validation.find(query);
        return res.send(result);
    } catch (err) {
        console.error('Error :', err);
        return res.status(400).json({ success: false, message: 'Something wents wrong', error: err.toString() });
    }
};

const add = async (req, res) => {
    try {
        if (!req.body?.name) {
            return res.status(400).json({ success: false, message: `Validation name is required` });
        }

        let existingValidation = await Validation.findOne({ name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } });
        if (existingValidation) {
            return res.status(400).json({ success: false, message: `Validation name already exist` });
        }

        req.body.createdDate = new Date();

        const validation = new Validation(req.body);
        await validation.save();
        return res.status(200).json({ message: "Validation added successfully", result: validation });

    } catch (err) {
        console.error('Failed to add validation:', err);
        return res.status(400).json({ success: false, message: 'Failed to add validation', error: err.toString() });
    }
};

const view = async (req, res) => {
    try {
        const validationDoc = await Validation.findOne({ _id: req.params.id, deleted: false });
        if (!validationDoc) return res.status(404).json({ success: false, message: "No Data Found." });
        return res.send(validationDoc);
    } catch (err) {

        console.error('Failed to display:', err);
        return res.status(400).json({ success: false, message: 'Failed to display', error: err.toString() });
    }
};

const editWholeValidationsArray = async (req, res) => {
    try {
        let result = await Validation.updateOne({ _id: req.params.id }, { $set: req.body });

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Validations updated successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to update validations', result });
        }

    } catch (err) {
        console.error('Failed to Update validations:', err);
        return res.status(400).json({ success: false, message: 'Failed to Update validations', error: err.toString() });
    }
};

const deleteValidationDocument = async (req, res) => {
    try {
        const validationId = req.params.id;
        const result = await Validation.updateOne(
            { _id: validationId },
            {
                $set: { deleted: true }
            }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Validdation removed successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to remove validation', result });
        }

    } catch (err) {
        console.error("Failed to delete field ", err);
        return res.status(404).json({ success: false, message: "Failed to remove validation", error: err.toString() });
    }
}

const deleteManyValidationDocuments = async (req, res) => {
    try {
        const validationIds = req.body;
        console.log("validationIds ", validationIds);
        const result = await Validation.updateMany(
            { _id: { $in: validationIds } },
            {
                $set: { deleted: true }
            }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Validations removed successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to remove validations', result });
        }

    } catch (err) {
        console.error("Failed to remove validations ", err);
        return res.status(404).json({ success: false, message: "Failed to remove validations", error: err.toString() });
    }
};

module.exports = { index, add, view, editWholeValidationsArray, deleteValidationDocument, deleteManyValidationDocuments };