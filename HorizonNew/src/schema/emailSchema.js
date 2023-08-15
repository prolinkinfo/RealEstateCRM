import * as yup from 'yup'

export const emailSchema = yup.object({
    sender: yup.string().required(),
    recipient: yup.string().required(),
    cc: yup.string(),
    bcc: yup.string(),
    subject: yup.string(),
    message: yup.string(),
    createBy: yup.string().required()
})
