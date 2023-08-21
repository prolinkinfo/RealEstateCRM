import * as yup from 'yup'

export const loginSchema = yup.object({
    username: yup.string().email().required(),
    password: yup.string().required()
})