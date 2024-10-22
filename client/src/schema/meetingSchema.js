import * as yup from 'yup'

export const MeetingSchema = yup.object({
    agenda: yup.string().required("Agenda Is required"),
    attendes: yup.array().of(yup.string().trim()),
    attendesLead: yup.array().of(yup.string().trim()),
    location: yup.string(),
    related: yup.string(),
    dateTime: yup.string().required("Date Time Is required"),
    notes: yup.string(),
    createFor: yup.string(),
    createdBy: yup.string(),
})