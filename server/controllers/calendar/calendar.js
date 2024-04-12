const Email = require('../../model/schema/email');
const PhoneCall = require('../../model/schema/phoneCall');
const Task = require('../../model/schema/task');
const MeetingHistory = require('../../model/schema/meeting');
const User = require('../../model/schema/user');

const index = async (req, res) => {
    try {
        const query = { ...req.query, deleted: false };
        const userDetails = await User.findOne({ _id: req.user.userId }).populate({ path: 'roles' });

        const callData = await PhoneCall.find(query);
        const emailData = await Email.find(query);
        const meetingData = await MeetingHistory.find(query);
        const taskData = await Task.find(query);

        let taskDetails = [];
        let callDetails = [];
        let meetingDetails = [];
        let emailDetails = [];

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

        if (mergedRoles && mergedRoles.length > 0) {
            for (const item of mergedRoles) {
                switch (item.title) {
                    case "Calls":
                        if (item.view) {
                            callDetails = callData.map(item => ({
                                id: item._id,
                                title: item.senderName,
                                start: item.startDate,
                                backgroundColor: "green",
                                groupId: "call"
                            }));
                        }
                        break;

                    case "Emails":
                        if (item.view) {
                            emailDetails = emailData.map(item => ({
                                id: item._id,
                                title: item.subject,
                                start: item.startDate,
                                end: item.endDate,
                                backgroundColor: "blue",
                                groupId: "email"
                            }));
                        }
                        break;

                    case "Meetings":
                        if (item.view) {
                            meetingDetails = meetingData.map(item => ({
                                id: item._id,
                                title: item.agenda,
                                start: item.dateTime,
                                backgroundColor: "red",
                                groupId: "meeting"
                            }));
                        }
                        break;

                    case "Tasks":
                        if (item.view) {
                            taskDetails = taskData.map(item => ({
                                id: item._id,
                                title: item.title,
                                start: item.start,
                                end: item.end,
                                textColor: item.textColor,
                                backgroundColor: item.backgroundColor,
                                borderColor: item.borderColor,
                                url: item.url,
                                allDay: item.allDay,
                                groupId: "task"
                            }));
                        }
                        break;

                    default:
                        break;
                }
            }
        } else {
            callDetails = callData.map(item => ({
                id: item._id,
                title: item.senderName,
                start: item.startDate,
                backgroundColor: "green",
                groupId: "call"
            }));

            emailDetails = emailData.map(item => ({
                id: item._id,
                title: item.subject,
                start: item.startDate,
                end: item.endDate,
                backgroundColor: "blue",
                groupId: "email"
            }));

            meetingDetails = meetingData.map(item => ({
                id: item._id,
                title: item.agenda,
                start: item.dateTime,
                backgroundColor: "red",
                groupId: "meeting"
            }));

            taskDetails = taskData.map(item => ({
                id: item._id,
                title: item.title,
                start: item.start,
                end: item.end,
                textColor: item.textColor,
                backgroundColor: item.backgroundColor,
                borderColor: item.borderColor,
                url: item.url,
                allDay: item.allDay,
                groupId: "task"
            }));
        }

        const result = [...taskDetails, ...callDetails, ...meetingDetails, ...emailDetails];
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = { index };
