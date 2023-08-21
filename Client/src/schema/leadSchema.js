import * as yup from 'yup'

export const leadSchema = yup.object({
    // Lead Information:
    leadName: yup.string().required(),
    leadEmail: yup.string().email().required(),
    leadPhoneNumber: yup.string().min(8).max(15).required(),
    leadAddress: yup.string().required(),
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
    leadCreationDate: yup.date().required(),
    leadConversionDate: yup.date().required(),
    leadFollowUpDate: yup.date().required(),
    leadFollowUpStatus: yup.string(),
    // Lead Scoring and Nurturing:
    leadScore: yup.number().required(),
    leadNurturingWorkflow: yup.string(),
    leadEngagementLevel: yup.string(),
    leadConversionRate: yup.number().required(),
    leadNurturingStage: yup.string(),
    leadNextAction: yup.string(),
})
