const RoleAccess = require('../../model/schema/roleAccess')

const index = async (req, res) => {
    try {
        const query = req.query;
        let result = await RoleAccess.find(query);
        res.send(result);
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

const edit = async (req, res) => {
    try {
        req.body.modifyDate = new Date();
        let result = await RoleAccess.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Role Access:', err);
        res.status(400).json({ error: 'Failed to Update Role Access' });
    }
}

module.exports = { index, edit }