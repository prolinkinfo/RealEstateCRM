const mongoose = require('mongoose');

const fetchSchemaFields = async () => {
    const CustomFieldModel = mongoose.model('CustomField');
    return await CustomFieldModel.find({ moduleName: "Properties" });
};

const propertySchema = new mongoose.Schema({
    // //1. basicPropertyInformation:
    // propertyType: String,
    // propertyAddress: String,
    // listingPrice: String,
    // squareFootage: String,
    // numberofBedrooms: Number,
    // numberofBathrooms: Number,
    // yearBuilt: Number,
    // propertyDescription: String,
    // //2. Property Features and Amenities:
    // lotSize: String,
    // parkingAvailability: String,
    // appliancesIncluded: String,
    // heatingAndCoolingSystems: String,
    // flooringType: String,
    // exteriorFeatures: String,
    // communityAmenities: String,
    // //3. Media and Visuals:
    propertyPhotos: [],
    virtualToursOrVideos: [],
    floorPlans: [],
    propertyDocuments: [],
    // //4. Listing and Marketing Details:
    // listingStatus: String,
    // listingAgentOrTeam: String,
    // listingDate: String,
    // marketingDescription: String,
    // multipleListingService: String,
    // //5. Property History:
    // previousOwners: Number,
    // purchaseHistory: String,
    // //6. Financial Information:
    // propertyTaxes: String,
    // homeownersAssociation: String,
    // mortgageInformation: String,
    // //7. Contacts Associated with Property:
    // sellers: String,
    // buyers: String,
    // photo: String,
    // propertyManagers: String,
    // contractorsOrServiceProviders: String,
    // //8. Property Notes and Comments:
    // internalNotesOrComments: String,
    deleted: {
        type: Boolean,
        default: false,
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const initializePropertySchema = async () => {
    const schemaFieldsData = await fetchSchemaFields();
    schemaFieldsData[0]?.fields?.forEach((item) => {
        propertySchema.add({ [item.name]: item?.backendType });
    });
};

const Property = mongoose.model('Properties', propertySchema, 'Properties');
module.exports = { Property, initializePropertySchema };
