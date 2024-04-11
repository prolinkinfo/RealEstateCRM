const mongoose = require('mongoose');
const Task = require('../../model/schema/task')
const { Lead } = require('../../model/schema/lead');
const user = require('../../model/schema/user');

const index = async (req, res) => {
    try {
        const { query } = req;
        query.deleted = false;

        const [taskData, leadData] = await Promise.all([
            Task.find(query),
            Lead.find(query)
        ]);
        const userDetails = await user.findOne({ _id: req.user.userId }).populate({
            path: 'roles'
        })
        const mergedRoles = userDetails?.roles?.reduce((acc, current) => {
            current?.access?.forEach(permission => {
                const existingPermissionIndex = acc.findIndex(item => item.title === permission.title);
                if (existingPermissionIndex !== -1) {
                    const updatedPermission = { ...acc[existingPermissionIndex] };
                    Object.keys(permission).forEach(key => {
                        if (permission[key] === true) {
                            updatedPermission[key] = true;
                        }
                    });
                    acc[existingPermissionIndex] = updatedPermission;
                } else {
                    acc.push(permission);
                }
            });
            return acc;
        }, []);

        let response = { taskData, leadData }

        if (mergedRoles && mergedRoles.length > 0) {
            for (const item of mergedRoles) {

                if (item.title === "Tasks" && item.view === false) {
                    delete response.taskData
                }
                if (item.title === "Leads" && item.view === false) {
                    delete response.leadData

                }
            }
        }

        res.json({ data: response });
    } catch (error) {
        console.error('Error in index function:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { index }