import * as yup from 'yup'

export const textMsgSchema = yup.object({
    sender: yup.string().min(999999999, 'Phone number is invalid').max(999999999999, 'Phone number is invalid').required("Field Is required"),
    to: yup.string().min(999999999, 'Phone number is invalid').max(999999999999, 'Phone number is invalid').required("Field Is required"),
    message: yup.string(),
    createFor: yup.string().required("Field Is required")
})