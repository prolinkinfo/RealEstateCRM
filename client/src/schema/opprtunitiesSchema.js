import * as yup from 'yup'

export const opprtunitiesSchema = yup.object({
    opportunityName: yup.string().required("Opportunity Name Is required"),
    type: yup.string(),
    leadSource: yup.string(),
    currency: yup.string(),
    opportunityAmount: yup.string().required("Opportunity Amount Is required"),
    amount: yup.string(),
    expectedCloseDate: yup.string().required("Expected Close Date Is required"),
    nextStep: yup.string(),
    salesStage: yup.string().required("Sales Stage Is required"),
    probability: yup.string(),
    description: yup.string(),
    createBy: yup.string(),
})