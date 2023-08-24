import * as yup from 'yup'

export const emailSchema = yup.object({
    sender: yup.string().email().required("Field Is required"),
    recipient: yup.string().email().required("Field Is required"),
    cc: yup.string().email(),
    bcc: yup.string().email(),
    subject: yup.string(),
    message: yup.string(),
    createBy: yup.string().required("Field Is required")
})
