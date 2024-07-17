const mongoose = require("mongoose");
const CustomField = require("../../model/schema/customField");
const RoleAccess = require('../../model/schema/roleAccess');

const index = async (req, res) => {
    try {
        const query = req.query
        query.deleted = false;
        let result = await CustomField.find(query);
        let filteredResult = result.map(item => ({
            ...item.toObject(), // Convert Mongoose document to plain object
            fields: item?.fields?.filter(field => !field.isDefault && !field.delete)
        }));
        filteredResult.sort((a, b) => {
            return a.no - b.no;
        });
        return res.send(filteredResult);
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
                const labelName = req.body.fields?.[0]?.label;
                const fieldType = req.body.fields?.[0]?.backendType || "Mixed";


                // Check if the field name already exists in the schema (case-insensitive)
                const caseInsensitiveMatch = Object.keys(existingSchema.paths)?.find(path => {
                    return path.toLowerCase() === fieldName.toLowerCase() || path.toLowerCase() === labelName.toLowerCase();
                });
                const caseInsensitiveMatchlabel = Object.keys(existingSchema.paths)?.find(path => {
                    return path.toLowerCase() === labelName.toLowerCase();
                });

                // Check for duplicate name in dynamic fields (case-insensitive)
                const existingField = await CustomField.findOne({
                    _id: req.body.moduleId,
                    'fields.name': { $regex: new RegExp(`^${req.body?.fields[0]?.name}$`, 'i') },
                });

                const existingLabel = await CustomField.findOne({
                    _id: req.body.moduleId,
                    'fields.label': { $regex: new RegExp(`^${req.body?.fields[0]?.label}$`, 'i') },
                });

                if (caseInsensitiveMatch || existingField) {
                    return res.status(409).json({ success: false, message: `Field with Name '${fieldName}' already exists` });
                } else if (caseInsensitiveMatchlabel || existingLabel) {
                    return res.status(409).json({ success: false, message: `Label Name ${labelName} already exists` });
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

                // if (isFieldNameChanged) {
                //     // Check if the updatedFieldName exists in the dynamic fields
                //     customFieldBeforeUpdate?.fields?.forEach((field) => {
                //         if (field._id !== fieldId) {
                //             nameAlreadyExists = field?.name?.toLowerCase() === updatedFieldName?.toLowerCase();
                //         }
                //     });
                //     console.log("nameAlreadyExists ", nameAlreadyExists);

                //     // Check if the updatedFieldName exists in the schema
                //     const existingFieldInSchema = Object.keys(existingSchema.paths).find(pathName => pathName.toLowerCase() === updatedFieldName?.toLowerCase());

                //     if (nameAlreadyExists || (existingFieldInSchema && updatedFieldName.toLowerCase() !== existingField.name.toLowerCase())) {
                //         return res.status(409).json({ success: false, message: 'Duplicate name found in schema' });
                //     }
                // }

                function isDuplicateName(name, existingNames) {
                    const lowerCaseName = name.toLowerCase();
                    return existingNames.some(existingName => existingName.toLowerCase() === lowerCaseName);
                }

                if (isFieldNameChanged) {
                    // Check if the updatedFieldName exists in the dynamic fields
                    nameAlreadyExists = isDuplicateName(updatedFieldName, customFieldBeforeUpdate?.fields?.map(field => field.name));

                    // Check if the updatedFieldName exists in the schema
                    const existingFieldInSchema = Object.keys(existingSchema.paths);
                    if (isDuplicateName(updatedFieldName, existingFieldInSchema) && updatedFieldName.toLowerCase() !== existingField.name.toLowerCase()) {
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

async function getNextAutoIncrementValue() {
    const no = await CustomField.countDocuments({});
    return no + 1;
}

const createNewModule = async (req, res) => {
    try {
        const moduleName = req.body.moduleName;
        const url = req?.body?.isDefault ? "" : req.protocol + '://' + req?.get('host');
        const file = `${url}/api/custom-field/icon/${req?.file?.filename}`;

        const existingModule = await CustomField.findOne({ moduleName: { $regex: new RegExp(`^${moduleName}$`, 'i') } }).exec();

        if (existingModule) {
            return res.status(400).json({ success: false, message: `Module name not available !` });
        }
        const nextAutoIncrementValue = await getNextAutoIncrementValue();

        const fields = [
            {
                "name": "createBy",
                "label": "createBy",
                "type": "text",
                "fixed": false,
                "delete": false,
                "isDefault": true,
                "belongsTo": null,
                "backendType": "Mixed",
                "isTableField": true,
                "options": [],
                "validation": [
                    {
                        "require": true,
                        "message": "",
                    },
                ],
            },
            {
                "name": "updatedDate",
                "label": "updatedDate",
                "type": "text",
                "fixed": false,
                "delete": false,
                "isDefault": true,
                "belongsTo": null,
                "backendType": "Mixed",
                "isTableField": true,
                "options": [],
                "validation": [
                    {
                        "require": true,
                        "message": "",
                    },
                ],
            },
            {
                "name": "createdDate",
                "label": "createdDate",
                "type": "text",
                "fixed": false,
                "delete": false,
                "isDefault": true,
                "belongsTo": null,
                "backendType": "Mixed",
                "isTableField": true,
                "options": [],
                "validation": [
                    {
                        "require": true,
                        "message": "",
                    },
                ],
            },
            {
                "name": "deleted",
                "label": "deleted",
                "type": "text",
                "fixed": false,
                "delete": false,
                "isDefault": true,
                "belongsTo": null,
                "backendType": "Mixed",
                "isTableField": true,
                "options": [],
                "validation": [
                    {
                        "require": true,
                        "message": "",
                    },
                ],
            },
        ]
        if (req.body.fields && req.body.fields.length > 0) {
            fields.push(...req.body.fields);
        }

        const newModule = new CustomField({ moduleName, icon: req?.file?.filename ? file : "", fields: fields, headings: req.body.headings || [], no: nextAutoIncrementValue, createdDate: new Date() });

        const schemaFields = {
            createBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            updatedDate: {
                type: Date,
                default: Date.now
            },
            createdDate: {
                type: Date,
            },
            deleted: {
                type: Boolean,
                default: false,
            },
        };

        const moduleSchema = new mongoose.Schema(schemaFields);
        if (!mongoose.models[moduleName]) {
            mongoose.model(moduleName, moduleSchema, moduleName);
        } else if (mongoose.models[moduleName] && !req?.body?.isDefault) {
            return res.status(400).json({ success: false, message: `Module name already exist` });
        }

        const access = await RoleAccess.find()
        if (!access[0]?.access[moduleName]) {
            await RoleAccess.updateMany({},
                {
                    $push: {
                        access: {
                            "title": moduleName,
                            "create": false,
                            "update": false,
                            "delete": false,
                            "view": false
                        }
                    }
                }
            )
        }

        await newModule.save();
        return res.status(200).json({ message: "Module added successfully", data: newModule });

    } catch (err) {
        console.error('Failed to create module:', err);
        return res.status(400).json({ success: false, message: 'Failed to Create module', error: err.toString() });
    }
};

const changeIcon = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req?.file) {
            return res.status(400).send({ success: false, message: 'No icon uploaded.' });
        }

        const existingDocument = await CustomField.findOne({ _id: id });

        if (existingDocument) {
            const url = req.protocol + '://' + req.get('host');
            const file = `${url}/api/custom-field/icon/${req?.file?.filename}`;

            let result = await CustomField.findByIdAndUpdate({ _id: id }, { $set: { icon: file } }, { new: true });
            return res.send({ data: result, message: 'Icon updated successfully.' })
        }


    } catch (err) {
        console.error('Failed to update icon :', err);
        return res.status(400).json({ success: false, message: 'Failed to update icon' });
    }
};


const changeModuleName = async (req, res) => {
    try {
        const moduleName = req.body.moduleName;
        const oldModule = await CustomField.findOne({ _id: req.params.id });
        let result = await CustomField.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { moduleName: moduleName } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Module not found' });
        }

        await RoleAccess.updateMany(
            { "access.title": oldModule.moduleName }, // Filter criteria to find the documents
            { $set: { "access.$.title": moduleName } } // Update operation
        );

        // Function to change module name without losing data
        const changeModuleName = async (oldModuleName, newModuleName) => {

            // Check if the old module schema exists
            if (await mongoose.models[oldModuleName]) {

                // Get the old module model
                const OldModule = await mongoose.model(oldModuleName);

                // Define the new schema with the same fields
                const newModuleSchema = await new mongoose.Schema(OldModule.schema.obj);

                // Change the collection name in MongoDB
                await OldModule.collection.rename(`${newModuleName}`);

                // Change the model name to the new module name
                await mongoose.model(newModuleName, newModuleSchema, newModuleName);
                delete mongoose.models[oldModuleName];

                async function checkModuleExistence(moduleName) {
                    let exists = false;
                    while (!exists) {
                        if (mongoose.models[moduleName]) {
                            exists = true;
                        } else {
                            console.log(`Module ${moduleName} does not exist, waiting...`);
                            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                        }
                    }
                }
                await checkModuleExistence(newModuleName);

            } else {
                console.log(`Module ${oldModuleName} does not exist`)
            }
        };

        await changeModuleName(oldModule?.moduleName, moduleName);

        return res.status(200).json({ message: `Module name changed from ${oldModule?.moduleName} to ${moduleName}`, result });

    } catch (err) {
        console.error('Failed to create module:', err);
        return res.status(400).json({ success: false, message: 'Failed to Create module', error: err.toString() });
    }
};

const addHeading = async (req, res) => {
    try {
        const existingField = await CustomField.findOne({ _id: req.body.moduleId });

        if (existingField) {
            const headingExists = existingField.headings.some(heading => req.body.headings[0].heading.includes(heading.heading));

            if (!headingExists) {
                // If the heading doesn't exist, perform the update
                await CustomField.updateOne(
                    { _id: req.body.moduleId },
                    { $push: { headings: { $each: req.body.headings } } }
                );
                res.status(200).send('Headings added successfully');
            } else {
                // Handle the case where the heading already exists
                res.status(400).send('Heading already exists');
            }
        } else {
            res.status(404).send('Field not found');
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

const changeIsTableField = async (req, res) => {
    try {
        const moduleId = new mongoose.Types.ObjectId(req.body?.moduleId);
        const fieldId = new mongoose.Types.ObjectId(req.params?.id);

        const { isTableField } = req.body;

        let result = await CustomField.findOneAndUpdate(
            { _id: moduleId, 'fields._id': fieldId },
            { $set: { 'fields.$.isTableField': isTableField } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Field not found' });
        }

        const successMessage = isTableField
            ? 'Field will now be included in the table.'
            : 'Field will no longer be included in the table.';

        return res.status(200).json({ success: true, message: successMessage, result });

    } catch (err) {
        console.error('Failed to change table field status:', err);
        return res.status(400).json({ message: 'Failed to change table field status : ', error: err.toString() });
    }
};

const changeIsTableFields = async (req, res) => {
    try {
        const moduleId = new mongoose.Types.ObjectId(req.body?.moduleId);
        const updates = req.body?.updates;

        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({ success: false, message: `Invalid 'updates' format` });
        }

        // Create an array of update operations for each field
        const updateOperations = updates.map(({ fieldId, isTableField }) => ({
            updateOne: {
                filter: { _id: moduleId, 'fields._id': new mongoose.Types.ObjectId(fieldId) },
                update: { $set: { 'fields.$[field].isTableField': isTableField } },
                arrayFilters: [{ 'field._id': new mongoose.Types.ObjectId(fieldId) }],
            },
        }));

        // Update all fields in a single bulk operation
        let updateResult = await CustomField.bulkWrite(updateOperations);

        if (!updateResult) {
            return res.status(404).json({ success: false, message: 'Fields not found' });
        }

        if (updateResult.matchedCount > 0 && updateResult.modifiedCount > 0) {
            return res.status(200).json({ success: true, message: 'Updated successfully', updateResult });
        }
        else if (updateResult?.matchedCount > 0 && updateResult?.modifiedCount === 0) {
            return res.status(200).json({ success: true, message: "No changes made, already up-to-date" });
        } else {
            return res.status(400).json({ success: true, message: 'Failed to update', updateResult });
        }

    } catch (err) {
        console.error('Failed to change table fields :', err);
        return res.status(400).json({ success: false, message: 'Failed to change ', error: err.toString() });
    }
};

/* For future refrence */
// const changeIsViewFields = async (req, res) => {
//     try {
//         const moduleId = new mongoose.Types.ObjectId(req.body?.moduleId);
//         const update = req.body?.values;

//         if (!update || typeof update !== 'object') {
//             return res.status(400).json({ success: false, message: `Invalid 'update' format` });
//         }

//         const fieldIdToUpdate = new mongoose.Types.ObjectId(update.fieldId);
//         const isChecked = update.isChecked;

//         // Set isView: false for all fields in the module
//         const setFalseOperation = {
//             updateMany: {
//                 filter: { _id: moduleId },
//                 update: { $set: { 'fields.$[].isView': false } },
//             },
//         };

//         // If isChecked is true, set isView: true for the specified field
//         const setTrueOperation = isChecked ? {
//             updateOne: {
//                 filter: { _id: moduleId, 'fields._id': fieldIdToUpdate },
//                 update: { $set: { 'fields.$[field].isView': true } },
//                 arrayFilters: [{ 'field._id': fieldIdToUpdate }],
//             },
//         } : null;

//         // Combine operations
//         const bulkOperations = [setFalseOperation];
//         if (setTrueOperation) {
//             bulkOperations.push(setTrueOperation);
//         }

//         // Execute bulkWrite
//         let updateResult = await CustomField.bulkWrite(bulkOperations);

//         if (!updateResult) {
//             return res.status(404).json({ success: false, message: 'Fields not found' });
//         }

//         if (updateResult.matchedCount > 0 && updateResult.modifiedCount > 0) {
//             return res.status(200).json({ success: true, message: 'Updated successfully', updateResult });
//         } else if (updateResult?.matchedCount > 0 && updateResult?.modifiedCount === 0) {
//             return res.status(200).json({ success: true, message: "No changes made, already up-to-date" });
//         } else {
//             return res.status(400).json({ success: true, message: 'Failed to update', updateResult });
//         }

//     } catch (err) {
//         console.error('Failed to change table fields :', err);
//         return res.status(400).json({ success: false, message: 'Failed to change ', error: err.toString() });
//     }
// };
const changeIsViewFields = async (req, res) => {
    try {
        const moduleId = new mongoose.Types.ObjectId(req.body?.moduleId);
        const update = req.body?.values;

        if (!update || typeof update !== 'object') {
            return res.status(400).json({ success: false, message: `Invalid 'update' format` });
        }

        const fieldIdToUpdate = new mongoose.Types.ObjectId(update.fieldId);
        const isChecked = update.isChecked;

        // Set isView: false for all fields and isView: true for the specified field if isChecked is true
        const bulkOperations = [
            {
                updateMany: {
                    filter: { _id: moduleId },
                    update: { $set: { 'fields.$[].isView': false } }
                }
            },
            isChecked && {
                updateOne: {
                    filter: { _id: moduleId, 'fields._id': fieldIdToUpdate },
                    update: { $set: { 'fields.$[field].isView': true } },
                    arrayFilters: [{ 'field._id': fieldIdToUpdate }]
                }
            }
        ].filter(Boolean);  // Filter out null values if isChecked is false

        // Execute bulkWrite
        const updateResult = await CustomField.bulkWrite(bulkOperations);

        if (updateResult.matchedCount > 0 && updateResult.modifiedCount > 0) {
            return res.status(200).json({ success: true, message: 'Updated successfully', updateResult });
        } else if (updateResult.matchedCount > 0 && updateResult.modifiedCount === 0) {
            return res.status(200).json({ success: true, message: "No changes made, already up-to-date" });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to update', updateResult });
        }

    } catch (err) {
        console.error('Failed to change table fields :', err);
        return res.status(400).json({ success: false, message: 'Failed to change ', error: err.toString() });
    }
};

const deletmodule = async (req, res) => {
    try {
        const module = await CustomField.findByIdAndUpdate(req.params.id, { deleted: true });
        const accessName = await CustomField.findById(req.params.id);
        await RoleAccess.updateMany({}, {
            $pull: {
                access: { "title": accessName.moduleName } // remove the access object with matching title
            }
        });
        res.status(200).json({ message: "Module delete successfully", module })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}
const deleteManyModule = async (req, res) => {
    try {
        const module = await CustomField.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "Many module delete successfully", module })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const changeFieldsBelongsTo = async (req, res) => {
    try {
        const headingId = req.params.id;
        const moduleId = req.body?.moduleId;
        const updates = req.body?.updates;

        const headingExists = await CustomField.findOne({ _id: moduleId, 'headings._id': headingId });

        if (!headingExists) {
            return res.status(404).json({ success: false, message: "Module or Heading not found" });
        }

        const updateOperations = updates?.map(update => ({
            updateOne: {
                filter: { _id: moduleId, 'fields._id': new mongoose.Types.ObjectId(update.fieldId) },
                update: { $set: { 'fields.$[field].belongsTo': update.belongsTo } },
                arrayFilters: [{ 'field._id': new mongoose.Types.ObjectId(update.fieldId) }]
            }
        }));

        const result = await CustomField.bulkWrite(updateOperations);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Fields not found' });
        }

        return res.status(200).json({ message: 'Updated successfully', result });

    } catch (err) {
        console.error('Failed to change belongs fields :', err);
        return res.status(400).json({ success: false, message: 'Failed to change', error: err.toString() });
    }
};


module.exports = {
    index,
    add,
    editWholeFieldsArray,
    editSingleField,
    view,
    changeModuleName,
    deleteField,
    deleteManyFields,
    deletmodule,
    deleteManyModule,
    createNewModule,
    changeIcon,
    addHeading,
    editSingleHeading,
    editWholeHeadingsArray,
    deleteHeading,
    deleteManyHeadings,
    changeIsTableField,
    changeIsTableFields,
    changeIsViewFields,
    changeFieldsBelongsTo,
};