import * as yup from 'yup'

export const addFiledSchema = yup.object({
    name: yup.string().min(2).required('Name is required'),
    label: yup.string().min(2).required('Label is required'),
    type: yup.string().required('Type is required'),
})