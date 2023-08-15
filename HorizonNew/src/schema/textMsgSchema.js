import * as yup from 'yup'

export const textMsgSchema = yup.object({
    sender: yup.string().required(),
    to: yup.string().required(),
    message: yup.string(),
    createFor: yup.string().required()
})