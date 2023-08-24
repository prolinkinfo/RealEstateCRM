import * as yup from 'yup'

export const textMsgSchema = yup.object({
    sender: yup.string().min(999999999, 'Phone number is invalid').max(999999999999, 'Phone number is invalid').required(),
    to: yup.string().min(999999999, 'Phone number is invalid').max(999999999999, 'Phone number is invalid').required(),
    message: yup.string(),
    createFor: yup.string().required()
})