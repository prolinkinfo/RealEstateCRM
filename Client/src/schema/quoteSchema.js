import * as yup from 'yup'

export const quoteSchema = yup.object({
    title: yup.string().required("Title Is required"),
    quoteStage: yup.string().required("Quote Stage Is required"),
    validUntile: yup.string().required("Valid Untile Is required"),
    shippingPostalcode: yup.string().matches(/^\d{6}$/, 'Shipping Postal Code must be exactly 6 digits').notRequired(),
    billingPostalcode: yup.string().matches(/^\d{6}$/, 'Billing Postal Code must be exactly 6 digits').notRequired(),
})