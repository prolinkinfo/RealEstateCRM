import * as yup from 'yup'

export const TaskSchema = yup.object({
    title: yup.string().required("Title Is required"),
    category: yup.string(),
    description: yup.string(),
    notes: yup.string(),
    // assignTo: yup.string(),
    // assignToLead: yup.string(),
    reminder: yup.string(),
    start: yup.string().required("Start Date Is required"),
    end: yup.string(),
    backgroundColor: yup.string(),
    borderColor: yup.string(),
    textColor: yup.string(),
    display: yup.string(),
    url: yup.string(),
    createBy: yup.string(),
})