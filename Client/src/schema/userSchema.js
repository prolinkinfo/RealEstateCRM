import * as yup from 'yup'

export const userSchema = yup.object({
    firstName: yup.string().required("First Name Is required"),
    lastName: yup.string(),
    phoneNumber: yup.string().required("Phone Number Is required"),
    username: yup.string().email().required("Email Is required"),
})