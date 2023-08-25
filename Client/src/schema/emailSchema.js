import * as yup from 'yup'

export const emailSchema = yup.object({
    sender: yup.string().required("Sender Is required"),
    recipient: yup.string().email().required("Recipient Is required"),
    cc: yup.string().email(),
    bcc: yup.string().email(),
    relatedToContact: yup.string(),
    relatedToLead: yup.string(),
    subject: yup.string(),
    message: yup.string(),
    createBy: yup.string(),
    createByLead: yup.string()
})
