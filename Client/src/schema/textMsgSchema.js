import * as yup from 'yup'

export const textMsgSchema = yup.object({
    sender: yup.string().min(8).max(15).required(),
    to: yup.string().min(8).max(15).required(),
    message: yup.string(),
    createFor: yup.string().required()
})