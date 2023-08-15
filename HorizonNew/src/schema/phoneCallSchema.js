import * as yup from 'yup'



export const phoneCallSchema = yup.object({
    sender: yup.string().required(),
    recipient: yup.string().required(),
    callDuration: yup.string(),
    callNotes: yup.string(),
    createBy: yup.string().required()
})