import * as yup from 'yup'

export const leadSchema = yup.object({
    // Lead Information:
    leadName: yup.string().required("Lead Name Is required"),
    leadEmail: yup.string().email().required("Lead Email Is required"),
    leadPhoneNumber: yup.number().min(1000000000, 'Phone number is invalid').max(999999999999, 'Phone number is invalid').required("Lead Phone Number Is required"),
    leadAddress: yup.string().required("Lead Address Is required"),
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
    leadCreationDate: yup.date().required("Lead Creation Date Is required"),
    leadConversionDate: yup.date().required("Lead Conversion Date Is required"),
    leadFollowUpDate: yup.date().required("lead Follow Up Date  Is required"),
    leadFollowUpStatus: yup.string(),
    // Lead Scoring and Nurturing:
    leadScore: yup.number().required("Lead Score Is required").min(0, "Lead Score Is invalid"),
    leadNurturingWorkflow: yup.string(),
    leadEngagementLevel: yup.string(),
    leadConversionRate: yup.number().required("lead Conversion Rate Is required"),
    leadNurturingStage: yup.string(),
    leadNextAction: yup.string(),
})
