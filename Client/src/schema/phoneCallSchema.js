import * as yup from 'yup'



export const phoneCallSchema = yup.object({
    sender: yup.string().min(8).max(15).required(),
    recipient: yup.string().min(8).max(15).required(),
    callDuration: yup.string(),
    callNotes: yup.string(),
    createBy: yup.string().required()
})