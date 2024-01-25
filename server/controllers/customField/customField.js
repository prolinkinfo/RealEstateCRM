const CustomField = require("../../model/schema/customField");

const index = async (req, res) => {
    try {
        const result = await CustomField.find(req.query);
        return res.send(result);
    } catch (err) {
        console.error('Failed', err);
        return res.status(400).json({ message: 'Failed', error: err.toString() });
    }
};

const add = async (req, res) => {
    try {
        const result = await CustomField.updateOne({ _id: req.body.moduleId }, { $push: { fields: { $each: req.body.fields } } });

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Fields added successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to add fields', result });
        }

    } catch (err) {
        console.error('Failed to create Custom Field:', err);
        return res.status(400).json({ success: false, message: 'Failed to Create Field', error: err.toString() });
    }
};

const editWholeFieldsArray = async (req, res) => {
    try {
        let result = await CustomField.updateOne({ _id: req.params.id }, { $set: { fields: req.body } });

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Fields updated successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to update fields', result });
        }

    } catch (err) {
        console.error('Failed to Update Custom Field:', err);
        return res.status(400).json({ success: false, message: 'Failed to Update Custom fields', error: err.toString() });
    }
};

const editSingleField = async (req, res) => {
    try {
        const moduleId = req.body.moduleId;
        const fieldId = req.params.id;

        let result = await CustomField.updateOne(
            { _id: moduleId, 'fields._id': fieldId },
            { $set: { 'fields.$': req.body.updatedField } }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Field updated successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to update field', result });
        }

    } catch (err) {
        console.error('Failed to Update Custom Field:', err);
        return res.status(400).json({ success: false, message: 'Failed to Update Custom Field', error: err.toString() });
    }
};

const view = async (req, res) => {
    try {
        const customFieldDoc = await CustomField.findOne({ _id: req.params.id });
        if (!customFieldDoc) return res.status(404).json({ success: false, message: "No Data Found." });
        return res.send(customFieldDoc);
    } catch (err) {

        console.error('Failed to display:', err);
        return res.status(400).json({ success: false, message: 'Failed to display', error: err.toString() });
    }
};

const deleteField = async (req, res) => {
    try {
        const moduleId = req.query.moduleId;
        const fieldId = req.params.id;

        const result = await CustomField.updateOne(
            { _id: moduleId },
            {
                $pull: {
                    fields: {
                        _id: fieldId
                    }
                }
            }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Field removed successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to remove field', result });
        }

    } catch (err) {
        console.error("Failed to delete field ", err);
        return res.status(404).json({ success: false, message: "Failed to remove field", error: err.toString() });
    }
};

const deleteManyFields = async (req, res) => {
    try {
        const moduleId = req.body.moduleId;
        const fieldsIds = req.body.fieldsIds;

        const result = await CustomField.updateOne(
            { _id: moduleId },
            {
                $pull: {
                    fields: { _id: { $in: fieldsIds } }
                }
            }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Fields removed successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to remove fields', result });
        }

    } catch (err) {
        console.error("Failed to delete fields ", err);
        return res.status(404).json({ success: false, message: "Failed to remove fields", error: err.toString() });
    }
};


const createNewModule = async (req, res) => {
    try {
        const moduleName = req.body.moduleName;

        const existingModule = await CustomField.findOne({ moduleName: { $regex: new RegExp(`^${moduleName}$`, 'i') } }).exec();

        if (existingModule) {
            return res.status(400).json({ success: false, message: `Module name already exist` });
        }

        const newModule = new CustomField({ moduleName, fields: req.body.fields || [] });
        await newModule.save();

        return res.status(200).json({ message: "Module added successfully", data: newModule });

    } catch (err) {
        console.error('Failed to create module:', err);
        return res.status(400).json({ success: false, message: 'Failed to Create module', error: err.toString() });
    }
};

const addHeading = async (req, res) => {
    try {
        const result = await CustomField.updateOne({ _id: req.body.moduleId }, { $push: { headings: { $each: req.body.headings } } });

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Headings added successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to add headings', result });
        }

    } catch (err) {
        console.error('Failed to create Custom Heading:', err);
        return res.status(400).json({ success: false, message: 'Failed to Create Heading', error: err.toString() });
    }
};

const editSingleHeading = async (req, res) => {
    try {
        const moduleId = req.body.moduleId;
        const headingId = req.params.id;

        let result = await CustomField.updateOne(
            { _id: moduleId, 'headings._id': headingId },
            { $set: { 'headings.$': req.body.updatedHeading } }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Heading updated successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to update heading', result });
        }

    } catch (err) {
        console.error('Failed to Update Custom Heading:', err);
        return res.status(400).json({ success: false, message: 'Failed to Update Custom Heading', error: err.toString() });
    }
};

const editWholeHeadingsArray = async (req, res) => {
    try {
        let result = await CustomField.updateOne({ _id: req.params.id }, { $set: { headings: req.body } });

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Headings updated successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to update headings', result });
        }

    } catch (err) {
        console.error('Failed to Update Custom Headings:', err);
        return res.status(400).json({ success: false, message: 'Failed to Update Custom Headings', error: err.toString() });
    }
};

const deleteHeading = async (req, res) => {
    try {
        const moduleId = req.query.moduleId;
        const headingId = req.params.id;

        const result = await CustomField.updateOne(
            { _id: moduleId },
            {
                $pull: {
                    headings: {
                        _id: headingId
                    }
                },
                $set: {
                    'fields.$[elem].belongsTo': null
                }
            },
            {
                arrayFilters: [
                    { 'elem.belongsTo': headingId }
                ]
            }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Heading removed successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to remove heading', result });
        }

    } catch (err) {
        console.error("Failed to delete heading ", err);
        return res.status(404).json({ success: false, message: "Failed to remove heading", error: err.toString() });
    }
};

const deleteManyHeadings = async (req, res) => {
    try {
        const moduleId = req.body.moduleId;
        const headingsIds = req.body.headingsIds;

        const result = await CustomField.updateOne(
            { _id: moduleId },
            {
                $pull: {
                    headings: { _id: { $in: headingsIds } }
                },
                $set: {
                    'fields.$[elem].belongsTo': null
                }
            },
            {
                arrayFilters: [
                    { 'elem.belongsTo': { $in: headingsIds } }
                ]
            }
        );

        if (result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Headings removed successfully", result });
        } else {
            return res.status(404).json({ message: 'Failed to remove headings', result });
        }

    } catch (err) {
        console.error("Failed to delete headings ", err);
        return res.status(404).json({ success: false, message: "Failed to remove headings", error: err.toString() });
    }
};


module.exports = { index, add, editWholeFieldsArray, editSingleField, view, deleteField, deleteManyFields, createNewModule, addHeading, editSingleHeading, editWholeHeadingsArray, deleteHeading, deleteManyHeadings };