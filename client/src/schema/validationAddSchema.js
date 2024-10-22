import * as yup from 'yup'

export const validationAddSchema = yup.object({
    name: yup.string().min(2).required('Name is required'),
})