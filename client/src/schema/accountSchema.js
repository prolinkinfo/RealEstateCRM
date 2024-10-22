import * as yup from 'yup'

export const accountSchema = yup.object({
    name: yup.string().required("Account Name Is required"),
    officePhone: yup.string().matches(/^\d{10}$/, 'Office Number must be exactly 10 digits').notRequired(),
    alternatePhone: yup.string().matches(/^\d{10}$/, 'Office Number must be exactly 10 digits').notRequired(),
    website: yup.string().url('Enter a valid URL').notRequired(),
    emailAddress: yup.string().email('Enter a valid Email Address').notRequired(),
    nonPrimaryEmail: yup.string().email('Enter a valid Email Address').notRequired(),
    shippingPostalcode: yup.string().matches(/^\d{6}$/, 'Shipping Postal Code must be exactly 6 digits').notRequired(),
    billingPostalcode: yup.string().matches(/^\d{6}$/, 'Billing Postal Code must be exactly 6 digits').notRequired(),
})