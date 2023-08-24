import * as yup from 'yup'

export const userSchema = yup.object({
    firstName: yup.string().required("Field Is required"),
    lastName: yup.string(),
    phoneNumber: yup.string().required("Field Is required"),
    username: yup.string().email().required("Field Is required"),
})