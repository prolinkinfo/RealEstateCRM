import * as yup from 'yup'

export const phoneCallSchema = yup.object({
    sender: yup.string().required("Sender Is required"),
    recipient: yup.string().required("Recipient Is required"),
    callDuration: yup.string().required("Call Duration is required"),
    callNotes: yup.string(),
    createBy: yup.string(),
    createByLead: yup.string(),
    category: yup.string(),
    startDate: yup.date().required("Start Date Is required"),
}).test('createBy-or-createByLead-required', 'Recipient Is required', function (value) {
    if (!value.createBy && !value.createByLead) {
        return this.createError({
            path: 'createBy',
            message: 'Recipient Is required',
        });
    }
});
