import * as yup from 'yup'

export const emailSchema = yup.object({
    sender: yup.string().email().required("Sender Is required"),
    recipient: yup.string().email().required("Recipient Is required"),
    cc: yup.string().email(),
    bcc: yup.string().email(),
    subject: yup.string(),
    message: yup.string(),
    createBy: yup.string().required("Create By Is required")
})
