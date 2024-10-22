import * as yup from 'yup'

export const moduleAddSchema = yup.object({
    moduleName: yup.string().min(2).required('Name is required'),
})