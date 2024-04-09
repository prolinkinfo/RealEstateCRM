import * as yup from 'yup'

export const emailSchema = yup.object({
    sender: yup.string().required("Sender Is required"),
    recipient: yup.string().email().required("Recipient Is required"),
    cc: yup.string().email(),
    bcc: yup.string().email(),
    relatedToContact: yup.string(),
    relatedToLead: yup.string(),
    subject: yup.string().required("Subject Is required"),
    message: yup.string(),
    startDate: yup.date().required("Start Date Is required"),
    createBy: yup.string(),
    createByLead: yup.string(),
}).test('createBy-or-createByLead-required', 'Recipient Is required', function (value) {
    if (!value.createBy && !value.createByLead) {
        return this.createError({
            path: 'createBy',
            message: 'Recipient Is required',
        });
    }
});
