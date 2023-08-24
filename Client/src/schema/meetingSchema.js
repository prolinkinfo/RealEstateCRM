import * as yup from 'yup'

export const MeetingSchema = yup.object({
    agenda: yup.string().required("Field Is required"),
    attendes: yup.array().of(yup.string().trim()),
    location: yup.string(),
    dateTime: yup.string(),
    notes: yup.string(),
    createFor: yup.string(),
    createdBy: yup.string(),
})