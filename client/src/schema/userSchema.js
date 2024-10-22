import * as yup from 'yup'

export const userSchema = yup.object({
    firstName: yup.string().required("First Name Is required"),
    lastName: yup.string(),
    // phoneNumber: yup.string().required("Phone Number Is required").matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
    phoneNumber: yup.number().typeError("Invalid Phone Number").min(1000000000, 'Phone Number is invalid').max(999999999999, 'Phone Number is invalid').required('Phone Number is Required'),
    username: yup.string().email("Email must be a valid email").required("Email Is required"),
})