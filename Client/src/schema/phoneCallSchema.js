import * as yup from 'yup'

export const phoneCallSchema = yup.object({
    sender: yup.string().required("Sender Is required"),
    recipient: yup.number().min(99999999, 'Phone number is invalid length').max(999999999999, 'Phone number is invalid').required("Recipient Is required"),
    callDuration: yup.string(),
    callNotes: yup.string(),
    createBy: yup.string()
})