const mongoose = require("mongoose");
const CustomField = require("../../model/schema/customField");

const index = async (req, res) => {
    try {
        const result = await CustomField.find(req.query);
        return res.send(result);
    } catch (err) {
        console.error('Failed', err);
        return res.status(400).json({ success: false, message: 'Failed', error: err.toString() });
    }
};

const add = async (req, res) => {
    try {
        if (!mongoose.connection.db) {
            throw new Error('MongoDB connection not established');
        }

        if (!req.body?.moduleId) {
            return res.status(400).send({ success: false, message: "moduleId is required" });
        }

        const customField = await CustomField.findOne({ _id: req.body?.moduleId });
        const collectionName = customField?.moduleName;

        const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();

        if (collectionExists) {
            const ExistingModel = mongoose.models[collectionName];
            const existingSchema = ExistingModel?.schema;

            if (existingSchema) {
                const fieldName = req.body.fields?.[0]?.name;
                const fieldType = req.body.fields?.[0]?.backendType || "Mixed";

                // Check if the field name already exists in the schema (case-insensitive)
                const caseInsensitiveMatch = Object.keys(existingSchema.paths)?.find(path => {
                    return path.toLowerCase() === fieldName.toLowerCase();
                });

                // Check for duplicate name in dynamic fields (case-insensitive)
                const existingField = await CustomField.findOne({
                    _id: req.body.moduleId,
                    'fields.name': { $regex: new RegExp(`^${req.body?.fields[0]?.name}$`, 'i') }
                });

                if (caseInsensitiveMatch || existingField) {
                    return res.status(409).json({ success: false, message: `Field with name '${fieldName}' already exists` });
                }

                // Add fields in CustomField collection
                const updateResult = await CustomField.updateOne(
                    { _id: req.body?.moduleId },
                    {
                        $push: {
                            fields: { ...req.body.fields[0], backendType: fieldType }
                        }
                    }
                );

                if (updateResult?.modifiedCount > 0) {
                    existingSchema?.add({ [fieldName]: fieldType || 'Mixed' });     // Add fields in existingSchema
                    return res.status(200).json({ message: 'Fields added successfully' });
                } else {
                    return res.status(404).json({ success: false, message: 'Failed to add fields' });
                }
            } else {
                return res.status(404).json({ success: false, message: 'Model/schema not found for collection' });
            }
        } else {
            return res.status(404).send({ success: false, message: "Collection not exists" });
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
            return res.status(404).json({ success: false, message: 'Failed to update fields', result });
        }

    } catch (err) {
        console.error('Failed to Update Custom Field:', err);
        return res.status(400).json({ success: false, message: 'Failed to Update Custom fields', error: err.toString() });
    }
};

const editSingleField = async (req, res) => {
    try {
        const moduleId = req.body?.moduleId;
        const fieldId = req.params?.id;

        if (!req.body?.moduleId) {
            return res.status(400).send({ success: false, message: "moduleId is required" });
        }

        const customFieldBeforeUpdate = await CustomField.findOne({ _id: moduleId }).select("moduleName fields");
        const collectionName = customFieldBeforeUpdate?.moduleName;

        const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();

        if (collectionExists) {
            const ExistingModel = mongoose.models[collectionName];
            const existingSchema = ExistingModel?.schema;
            let nameAlreadyExists = false;

            if (existingSchema) {
                const existingField = customFieldBeforeUpdate.fields.find(field => field._id.toString() === fieldId);

                if (!existingField) {
                    return res.status(404).json({ success: false, message: 'Field not found' });
                }

                const updatedFieldName = req.body?.updatedField?.name;
                const updatedFieldBcType = req.body?.updatedField?.backendType || "Mixed";
                const isFieldNameChanged = updatedFieldName && updatedFieldName !== existingField.name;

                if (isFieldNameChanged) {
                    // Check if the updatedFieldName exists in the dynamic fields
                    customFieldBeforeUpdate?.fields?.forEach((field) => {
                        if (field._id !== fieldId) {
                            nameAlreadyExists = field?.name?.toLowerCase() === updatedFieldName?.toLowerCase();
                        }
                    });

                    // Check if the updatedFieldName exists in the schema
                    const existingFieldInSchema = Object.keys(existingSchema.paths).find(pathName => pathName.toLowerCase() === updatedFieldName?.toLowerCase());

                    if (nameAlreadyExists || (existingFieldInSchema && updatedFieldName.toLowerCase() !== existingField.name.toLowerCase())) {
                        return res.status(409).json({ success: false, message: 'Duplicate name found in schema' });
                    }
                }

                // Update field in CustomField collection
                const updateResult = await CustomField.updateOne(
                    { _id: moduleId, 'fields._id': fieldId },
                    { $set: { 'fields.$': req.body?.updatedField } }
                );

                if (updateResult?.matchedCount > 0 && updateResult?.modifiedCount > 0) {
                    const selectedField = customFieldBeforeUpdate.fields.find(field => field._id.toString() === fieldId);

                    if (isFieldNameChanged) {
                        existingSchema.remove(selectedField?.name);
                        existingSchema.add({ [updatedFieldName]: updatedFieldBcType });
                    }

                    return res.status(200).json({ success: true, message: 'Field updated successfully', updateResult });

                } else if (updateResult?.matchedCount > 0 && updateResult?.modifiedCount === 0) {
                    return res.status(200).json({ success: true, message: "No changes made, document already up-to-date" });
                } else {
                    return res.status(404).json({ success: false, message: 'Failed to update field' });
                }
            } else {
                return res.status(404).json({ success: false, message: 'Model/schema not found for collection' });
            }
        } else {
            return res.status(404).send({ success: false, message: "Collection not exists" });
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
        const moduleId = req.query?.moduleId;
        const fieldId = req.params?.id;

        if (!req.query?.moduleId) {
            return res.status(400).send({ success: false, message: "moduleId is required" });
        }

        const customFieldBeforePull = await CustomField.findOne({ _id: moduleId });

        if (customFieldBeforePull) {
            const collectionName = customFieldBeforePull?.moduleName;
            const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();

            if (collectionExists) {
                const ExistingModel = mongoose.models[collectionName];
                const existingSchema = ExistingModel?.schema;

                if (existingSchema) {
                    const fieldsArray = customFieldBeforePull?.fields;
                    const selectedField = fieldsArray.find(field => field._id.toString() === fieldId);

                    // Remove the field from CustomField
                    const updatedCustomField = await CustomField.findOneAndUpdate(
                        { _id: moduleId },
                        {
                            $pull: {
                                fields: {
                                    _id: fieldId
                                }
                            }
                        },
                        { new: true }
                    );

                    if (updatedCustomField) {
                        // Remove the field from the schema
                        existingSchema?.remove(selectedField?.name);
                        return res.status(200).json({ message: "Field removed successfully" });
                    } else {
                        return res.status(400).json({ success: false, message: "Failed to remove field" })
                    }

                } else {
                    return res.status(404).json({ success: false, message: 'Model/schema not found for collection' });
                }
            } else {
                return res.status(404).json({ success: false, message: "Collection not exists" });
            }
        } else {
            return res.status(404).json({ success: false, message: 'Field not found' });
        }
    } catch (err) {
        console.error("Failed to delete field ", err);
        return res.status(404).json({ success: false, message: "Failed to remove field", error: err.toString() });
    }
};

const deleteManyFields = async (req, res) => {
    try {
        const moduleId = req.body?.moduleId;
        const fieldsIds = req.body?.fieldsIds;

        if (!req.body?.moduleId) {
            return res.status(400).send({ success: false, message: "moduleId is required" });
        }

        const customFieldBeforeUpdate = await CustomField.findOne({ _id: moduleId }).select("moduleName fields");

        if (customFieldBeforeUpdate) {
            const collectionName = customFieldBeforeUpdate?.moduleName;
            const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();

            if (collectionExists) {
                const ExistingModel = mongoose.models[collectionName];
                const existingSchema = ExistingModel?.schema;

                if (existingSchema) {
                    const updateResult = await CustomField.updateOne(
                        { _id: moduleId },
                        {
                            $pull: {
                                fields: { _id: { $in: fieldsIds } }
                            }
                        }
                    );

                    if (updateResult?.modifiedCount > 0) {
                        const fieldsArray = customFieldBeforeUpdate?.fields;

                        fieldsArray?.forEach(field => {
                            if (fieldsIds?.includes(field?._id.toString())) {
                                existingSchema?.remove(field?.name);
                            }
                        });

                        return res.status(200).json({ message: "Fields removed successfully" });

                    } else {
                        return res.status(404).json({ success: false, message: 'Failed to remove fields' });
                    }
                } else {
                    return res.status(404).json({ success: false, message: 'Model/schema not found for collection' });
                }
            } else {
                return res.status(404).json({ success: false, message: "Collection not exists" });
            }

        } else {
            return res.status(404).json({ success: false, message: 'Field not found' });
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

        const newModule = new CustomField({ moduleName, fields: req.body.fields || [], headings: req.body.headings || [] });
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
            return res.status(404).json({ success: false, message: 'Failed to add headings', result });
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
            return res.status(404).json({ success: false, message: 'Failed to update heading', result });
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
            return res.status(404).json({ success: false, message: 'Failed to update headings', result });
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
            return res.status(404).json({ success: false, message: 'Failed to remove heading', result });
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
            return res.status(404).json({ success: false, message: 'Failed to remove headings', result });
        }

    } catch (err) {
        console.error("Failed to delete headings ", err);
        return res.status(404).json({ success: false, message: "Failed to remove headings", error: err.toString() });
    }
};

module.exports = { index, add, editWholeFieldsArray, editSingleField, view, deleteField, deleteManyFields, createNewModule, addHeading, editSingleHeading, editWholeHeadingsArray, deleteHeading, deleteManyHeadings };