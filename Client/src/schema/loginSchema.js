import * as yup from 'yup'

export const loginSchema = yup.object({
    username: yup.string().email().required("Field Is required"),
    password: yup.string().required("Field Is required")
})