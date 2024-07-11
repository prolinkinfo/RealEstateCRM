const customField = require('../../model/schema/customField');
const RoleAccess = require('../../model/schema/roleAccess');
const User = require('../../model/schema/user');

const index = async (req, res) => {
    try {
        const query = req.query;
        query.deleted = false;
        let result = await customField.find(query);
        result.sort((a, b) => {
            return a.no - b.no;
        });

        let response = result.map((item) => ({
            _id: item._id,
            updatedDate: item.updatedDate,
            deleted: item.deleted,
            moduleName: item.moduleName,
            icon: item.icon,
            createdDate: item.createdDate
        }));

        let user = await User.findOne({ _id: req.user.userId, deleted: false }).populate({
            path: 'roles'
        }).exec()

        const mergedRoles = user?.roles?.reduce((acc, current) => {
            current?.access?.forEach(permission => {
                const existingPermission = acc.find(item => item.title === permission.title);
                if (existingPermission) {
                    Object.keys(permission).forEach(key => {
                        if (permission[key] === true) {
                            existingPermission[key] = true;
                        }
                    });
                } else {
                    acc.push(permission);
                }
            });
            return acc;
        }, []);

        // return res.status(200).json(response);
        return res.status(200).json(response);

    } catch (err) {
        console.error('Error :', err);
        return res.status(400).json({ err, error: 'Something wents wrong' });
    }
}

module.exports = { index }