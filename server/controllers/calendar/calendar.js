const Email = require('../../model/schema/email');
const PhoneCall = require('../../model/schema/phoneCall');
const Task = require('../../model/schema/task');
const MeetingHistory = require('../../model/schema/meeting');

const index = async (req, res) => {
    const query = req.query;
    query.deleted = false;

    try {
        const taskData = await Task.find(query);
        const taskDetails = taskData?.map(item => ({
            id: item?._id,
            title: item?.title,
            start: item?.start,
            end: item?.end,
            textColor: item?.textColor,
            backgroundColor: item?.backgroundColor,
            borderColor: item?.borderColor,
            url: item?.url,
            allDay: item?.allDay,
            groupId: "task"
        }));

        const callData = await PhoneCall.find(query);
        const callDetails = callData?.map(item => ({
            id: item?._id,
            title: item?.senderName,
            start: item?.startDate,
            backgroundColor: "green",
            groupId: "call"
        }));

        const meetingData = await MeetingHistory.find(query);
        const meetingDetails = meetingData?.map(item => ({
            id: item?._id,
            title: item?.agenda,
            start: item?.dateTime,
            backgroundColor: "red",
            groupId: "meeting"
        }));

        const emailData = await Email.find(query);
        const emailDetails = emailData?.map(item => ({
            id: item?._id,
            title: item?.subject,
            start: item?.startDate,
            end: item?.endDate,
            backgroundColor: "blue",
            groupId: "email"
        }));

        const result = [...taskDetails, ...callDetails, ...meetingDetails, ...emailDetails];
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = { index };
