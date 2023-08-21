import * as yup from 'yup'
const currentYear = new Date().getFullYear()

export const propertySchema = yup.object({
    // 1. basicPropertyInformation:
    propertyType: yup.string().required(),
    propertyAddress: yup.string().required(),
    listingPrice: yup.string().required(),
    squareFootage: yup.string().required(),
    numberofBedrooms: yup.number().required(),
    numberofBathrooms: yup.number().required(),
    yearBuilt: yup.number().min(1000).max(currentYear).required(),
    propertyDescription: yup.string().required(),
    //2. Property Features and Amenities:
    lotSize: yup.string(),
    parkingAvailability: yup.string(),
    appliancesIncluded: yup.string(),
    heatingAndCoolingSystems: yup.string(),
    flooringType: yup.string(),
    exteriorFeatures: yup.string(),
    communityAmenities: yup.string(),
    //3. Media and Visuals:
    propertyPhotos: yup.string(),
    virtualToursOrVideos: yup.string(),
    floorPlans: yup.string(),
    propertyDocuments: yup.string(),
    //4. Listing and Marketing Details:
    listingStatus: yup.string(),
    listingAgentOrTeam: yup.string(),
    listingDate: yup.string(),
    marketingDescription: yup.string(),
    multipleListingService: yup.string(),
    //5. Property History:
    previousOwners: yup.number().min(0),
    purchaseHistory: yup.string(),
    //6. Financial Information:
    propertyTaxes: yup.string(),
    homeownersAssociation: yup.string(),
    mortgageInformation: yup.string(),
    //7. Contacts Associated with Property:
    sellers: yup.string(),
    buyers: yup.string(),
    propertyManagers: yup.string(),
    contractorsOrServiceProviders: yup.string(),
    //8. Property Notes and Comments:
    internalNotesOrComments: yup.string(),
    //9. Custom Fields
})