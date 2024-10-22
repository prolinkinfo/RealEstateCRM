import * as yup from 'yup'

export const loginSchema = yup.object({
    username: yup.string().email().required("Email Is required"),
    password: yup.string().required("Password Is required")
})