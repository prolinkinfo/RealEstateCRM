import * as yup from 'yup'

export const addFiledSchema = yup.object({
    // 1. Basic Information
    name: yup.string().min(2).required('Name is required'),
    label: yup.string().min(2).required('Label is required'),
    type: yup.string().required('Type is required'),
    // message: yup.string().required('Message is required'),
    // MinValue: yup.string().required('Min Value is required'),
    // MaxValue: yup.string().required('Max Value is required'),

})