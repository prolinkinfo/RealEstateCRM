import * as yup from 'yup'

// export const addFiledSchema = yup.object({
//     name: yup.string().min(2).required('Name is required'),
//     label: yup.string().min(2).required('Label is required'),
//     type: yup.string().required('Type is required'),
// })

const nameValidation = yup
    .string()
    .min(2)
    .matches(/^[A-Za-z0-9_-]+$/, 'Name can only contain letters, numbers, underscores, and dashes')
    .required('Name is required');

// Custom validation function for the label field
const labelValidation = yup
    .string()
    .min(2)
    .test('first-letter-capital', 'First letter of label must be capital', value => {
        return /^[A-Z]/.test(value);
    })
    .required('Label is required');

// Define the schema using the custom validations
export const addFiledSchema = yup.object({
    name: nameValidation,
    label: labelValidation,
    type: yup.string().required('Type is required')
    // belongsTo: yup.string().required('Belongs To is required'),
});