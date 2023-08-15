const Lead = require('../../model/schema/lead')

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;
    let result = await Lead.find(query)
    res.send(result)
}

const add = async (req, res) => {
    try {
        const user = new Lead(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to create Lead:', err);
        res.status(400).json({ error: 'Failed to create Lead' });
    }
}

const edit = async (req, res) => {
    try {
        let result = await Lead.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Lead:', err);
        res.status(400).json({ error: 'Failed to Update Lead' });
    }
}

const view = async (req, res) => {
    let lead = await Lead.findOne({ _id: req.params.id })
    if (!lead) return res.status(404).json({ message: "no Data Found." })
    res.status(200).json(lead)
}

const deleteData = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", lead })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const lead = await Lead.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", lead })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { index, add, view, edit, deleteData, deleteMany }