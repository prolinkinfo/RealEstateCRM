const { default: mongoose } = require("mongoose");
const CustomField = require("../../model/schema/customField");

const index = async (req, res) => {
    try {
        const result = await CustomField.find(req.query);
        return res.send(result);
    } catch (err) {
        return res.status(400).json({ error: 'Failed', err });
    }
};

const add = async (req, res) => {
    try {
        const existingModule = await CustomField?.findOne({ moduleName: req.body.moduleName });

        if (existingModule) {
            const result = await CustomField.updateOne({ moduleName: req.body.moduleName }, { $push: { fields: { $each: req.body.fields } } });
            return res.status(200).json(result);
        } else {
            const newCustomFieldModule = new CustomField(req.body);
            await newCustomFieldModule.save();
            return res.status(200).json(newCustomFieldModule);
        }

    } catch (err) {
        console.error('Failed to create Custom Field:', err);
        return res.status(400).json({ success: false, message: 'Failed to Create Field', error: err });
    }
};

const edit = async (req, res) => {
    try {
        let result = await CustomField.updateOne({ _id: req.params.id }, { $set: { fields: req.body.fields } });
        return res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Custom Field:', err);
        return res.status(400).json({ success: false, message: 'Failed to Update Custom Field', error: err });
    }
};

const view = async (req, res) => {
    try {
        const customFieldDoc = await CustomField.findOne({ _id: req.params.id });
        if (!customFieldDoc) return res.status(404).json({ success: false, message: "No Data Found." })
        return res.send(customFieldDoc);
    } catch (err) {
        console.error('Failed to display:', err);
        return res.status(400).json({ success: false, message: 'Failed to display', error: err });
    }
};

module.exports = { index, add, edit, view };