import * as yup from 'yup'

export const MeetingSchema = yup.object({
    agenda: yup.string().required("Field Is required"),
    attendes: yup.array().of(yup.string().trim()).min(1, "Field Is required").required("Field Is required"),
    location: yup.string(),
    related: yup.string(),
    dateTime: yup.string().required("Field Is required"),
    notes: yup.string(),
    createFor: yup.string(),
    createdBy: yup.string(),
})