import * as yup from 'yup'

export const leadSchema = yup.object({
    // Lead Information:
    leadName: yup.string().required("Field Is required"),
    leadEmail: yup.string().email().required("Field Is required"),
    leadPhoneNumber: yup.string().min(999999999, 'Phone number is invalid').max(999999999999, 'Phone number is invalid').required("Field Is required"),
    leadAddress: yup.string().required("Field Is required"),
    // Lead Source and Details:
    leadSource: yup.string(),
    leadStatus: yup.string(),
    leadSourceDetails: yup.string(),
    leadCampaign: yup.string(),
    leadSourceChannel: yup.string(),
    leadSourceMedium: yup.string(),
    leadSourceCampaign: yup.string(),
    leadSourceReferral: yup.string(),
    // Lead Assignment and Ownership:
    leadAssignedAgent: yup.string(),
    leadOwner: yup.string(),
    leadCommunicationPreferences: yup.string(),
    // Lead Dates and Follow-up:
    leadCreationDate: yup.date().required("Field Is required"),
    leadConversionDate: yup.date().required("Field Is required"),
    leadFollowUpDate: yup.date().required("Field Is required"),
    leadFollowUpStatus: yup.string(),
    // Lead Scoring and Nurturing:
    leadScore: yup.number().required("Field Is required"),
    leadNurturingWorkflow: yup.string(),
    leadEngagementLevel: yup.string(),
    leadConversionRate: yup.number().required("Field Is required"),
    leadNurturingStage: yup.string(),
    leadNextAction: yup.string(),
})
