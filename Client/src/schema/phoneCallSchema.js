import * as yup from 'yup'



export const phoneCallSchema = yup.object({
    sender: yup.string().min(999999999, 'Phone number is invalid').max(999999999999, 'Phone number is invalid').required("Sender Is required"),
    recipient: yup.string().min(999999999, 'Phone number is invalid').max(999999999999, 'Phone number is invalid').required("Recipient Is required"),
    callDuration: yup.string(),
    callNotes: yup.string(),
    createBy: yup.string().required("createBy Is required")
})