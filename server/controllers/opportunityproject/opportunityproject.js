const mongoose = require('mongoose');
const OpportunityProject = require('../../model/schema/opportunityproject')

const index = async (req, res) => {
    const query = req.query;
    query.deleted = false;
    let result = await OpportunityProject.find(query);
    return res.send(result);
};

const add = async (req, res) => {
    try {
        const result = new OpportunityProject(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create :', err);
        res.status(400).json({ err, error: 'Failed to create' });
    }
}
const view = async (req, res) => {
    try {
        let result = await OpportunityProject.findOne({ _id: req.params.id, deleted: false });

        if (!result) return res.status(404).json({ message: "No Data Found." });

        return res.status(200).json(result);

    } catch (error) {
        console.error('Failed :', error);
        res.status(400).json({ success: false, message: 'Failed to display ', err: error });
    }
};

const edit = async (req, res) => {
    try {
        let result = await OpportunityProject.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create OpportunityProject:', err);
        res.status(400).json({ error: 'Failed to create OpportunityProject : ', err });
    }
}

const deleteData = async (req, res) => {
    try {
        console.log(req.params.id)
        const result = await OpportunityProject.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result: result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}
const deleteMany = async (req, res) => {
    try {
        const result = await OpportunityProject.updateMany({ _id: { $in: req.body }}, { $set: { deleted: true } });
        console.log(result)
        if (result?.matchedCount > 0 && result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Opportunity Project Removed successfully", result });
        }
        else {
            return res.status(404).json({ success: false, message: "Failed to remove Opportunity Project" })
        }

    } catch (err) {
        return res.status(404).json({ success: false, message: "error", err });
    }
}
// const deleteMany = async (req, res) => {
//     try {
//         // if(process.env.DEFAULT_USERS.includes(username)){
//         //     return res.status(400).json({ message: `You don't have access to change ${username}` })
//         // }
//         // const updatedUsers = await User.updateMany({ _id: { $in: req.body }, role: { $ne: 'superAdmin' } }, { $set: { deleted: true } });

//         const userIds = req.body; // Assuming req.body is an array of user IDs
//         const users = await OpportunityProject.find({ _id: { $in: userIds } });

//         // Check for default users and filter them out
//         const defaultUsers = process.env.DEFAULT_USERS;
//         const filteredUsers = users.filter(user => !defaultUsers.includes(user.username));

//         // Further filter out superAdmin users
//         const nonSuperAdmins = filteredUsers.filter(user => user.role !== 'superAdmin');
//         const nonSuperAdminIds = nonSuperAdmins.map(user => user._id);

//         if (nonSuperAdminIds.length === 0) {
//             return res.status(400).json({ message: "No users to delete or all users are protected." });
//         }

//         // Update the 'deleted' field to true for the remaining users
//         const updatedUsers = await OpportunityProject.updateMany({ _id: { $in: nonSuperAdminIds } }, { $set: { deleted: true } });


//         res.status(200).json({ message: "done", updatedUsers })
//     } catch (err) {
//         res.status(404).json({ message: "error", err })
//     }
// }
module.exports = { index, add, view, edit, deleteData , deleteMany }