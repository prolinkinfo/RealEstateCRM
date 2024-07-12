import * as yup from 'yup'

export const accountSchema = yup.object({
    name: yup.string().required("Account Name Is required"),
})