const Validation = require('../../model/schema/validation');

const index = async (req, res) => {
    try {
        const query = req.query;
        let result = await Validation.find(query);
        return res.send(result);
    } catch (err) {
        console.error('Error :', err);
        return res.status(400).json({ success: false, message: 'Something wents wrong', error: err.toString() });
    }
};

const add = async (req, res) => {
    try {

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
        const validationDoc = await Validation.findOne({ _id: req.params.id });
        if (!validationDoc) return res.status(404).json({ success: false, message: "No Data Found." });
        return res.send(validationDoc);
    } catch (err) {

        console.error('Failed to display:', err);
        return res.status(400).json({ success: false, message: 'Failed to display', error: err.toString() });
    }
};

const editWholeValidationsArray = async (req, res) => {
    try {
        let result = await Validation.updateOne({ _id: req.params.id }, { $set: { validations: req.body } });

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

const editSingleValidationsField = async (req, res) => {
    try {
        const validationId = req.body.validationId;
        const fieldId = req.params.id;

        let result = await Validation.updateOne(
            { _id: validationId, 'validations._id': fieldId },
            { $set: { 'validations.$': req.body.updatedValidationField } }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Validation field updated successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to update field', result });
        }

    } catch (err) {
        console.error('Failed to Update validations Field:', err);
        return res.status(400).json({ success: false, message: 'Failed to Update validations Field', error: err.toString() });
    }
};

const deleteValidationsField = async (req, res) => {
    try {
        const validationId = req.query.validationId;
        const fieldId = req.params.id;

        const result = await Validation.updateOne(
            { _id: validationId },
            {
                $pull: {
                    validations: {
                        _id: fieldId
                    }
                }
            }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Validdations field removed successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to remove validations field', result });
        }

    } catch (err) {
        console.error("Failed to delete field ", err);
        return res.status(404).json({ success: false, message: "Failed to remove validations field", error: err.toString() });
    }
};

const deleteManyValidationsFields = async (req, res) => {
    try {
        const validationId = req.query.validationId;
        const fieldsIds = req.body;

        const result = await Validation.updateOne(
            { _id: validationId },
            {
                $pull: {
                    validations: { _id: { $in: fieldsIds } }
                }
            }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Validations fields removed successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to remove validations fields', result });
        }

    } catch (err) {
        console.error("Failed to delete field ", err);
        return res.status(404).json({ success: false, message: "Failed to remove field", error: err.toString() });
    }
};


module.exports = { index, add, view, editWholeValidationsArray, editSingleValidationsField, deleteValidationsField, deleteManyValidationsFields };