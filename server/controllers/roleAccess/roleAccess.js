const customField = require('../../model/schema/customField');
const RoleAccess = require('../../model/schema/roleAccess');
const User = require('../../model/schema/user');

const index = async (req, res) => {
    try {
        const query = req.query;
        let result = await RoleAccess.find(query);
        return res.send(result);
    } catch (err) {
        console.error('Error :', err);
        return res.status(400).json({ err, error: 'Something wents wrong' });
    }
}

const add = async (req, res) => {
    try {
        const { roleName, description } = req.body;

        const existingRole = await RoleAccess.findOne({ roleName: { $regex: new RegExp(`^${roleName}$`, 'i') } }).exec();

        if (existingRole) {
            return res.status(400).json({ message: `${roleName} Role already exist` });
        }
        else {
            const createdDate = new Date();

            const titles = ['Email', 'Call', 'Meeting', 'Task', 'Property', 'Contact', 'Lead'];
            const customModules = Array.from(await customField.find(), item => item.moduleName);
            customModules.forEach(module => {
                if (!titles?.includes(module)) {
                    titles.push(module);
                }
            });

            const access = [];

            titles?.forEach((item) => {
                access.push({ title: item, create: false, update: false, delete: false, view: false });
            })

            const role = new RoleAccess({ roleName: roleName, description, access, createdDate });
            await role.save();
            return res.status(200).json({ message: `${roleName} Role created successfully` });
        }
    } catch (err) {
        console.error('Failed to create role:', err);
        return res.status(400).json({ message: `Failed to create role`, err: err.toString() });
    }
}

const edit = async (req, res) => {
    try {
        req.body.modifyDate = new Date();
        let result = await RoleAccess.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        return res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Role Access:', err);
        return res.status(400).json({ error: 'Failed to Update Role Access' });
    }
}

const roleAssignedUsers = async (req, res) => {
    try {
        let result = await User.find({ roles: { $in: [req.params.id] }, deleted: false });
        return res.send(result);

    } catch (err) {
        console.error('Error :', err);
        return res.status(400).json({ err, error: 'Something wents wrong' });
    }
}

const assignRoleToUsers = async (req, res) => {
    try {
        // const updatedUsers = await User.updateMany({ _id: { $in: req.body } }, { $addToSet: { roles: req.params.id } });    // add if not already exist
        // const updatedUsers2 = await User.updateMany({ _id: { $nin: req.body }, roles: req.params.id }, { $pull: { roles: req.params.id } });      // remove

        const bulkOperations = [];

        bulkOperations.push({
            updateMany: {
                filter: { _id: { $in: req.body }, deleted: false },
                update: { $addToSet: { roles: req.params.id } }
            }
        });

        bulkOperations.push({
            updateMany: {
                filter: { _id: { $nin: req.body }, deleted: false },
                update: { $pull: { roles: req.params.id } }
            }
        });

        const result = await User.bulkWrite(bulkOperations);
        return res.send({ message: "Role changed successfully", result });

    } catch (err) {
        console.error('Error :', err);
        return res.status(400).json({ err, error: 'Something wents wrong' });
    }
}

module.exports = { index, add, edit, roleAssignedUsers, assignRoleToUsers }