import * as yup from 'yup'

export const userSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string(),
    phoneNumber: yup.string().required(),
    username: yup.string().email().required(),
})