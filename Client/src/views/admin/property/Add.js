import { CloseIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormLabel, Grid, GridItem, Heading, IconButton, Input, Select, Text, Textarea } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useState } from 'react';
import { propertySchema } from 'schema';
import { postApi } from 'services/api';
import { generateValidationSchema } from 'utils';
import CustomForm from 'utils/customForm';
import * as yup from 'yup'

const Add = (props) => {
    const [isLoding, setIsLoding] = useState(false)

    // const initialValues = {
    //     //1. basicPropertyInformation:
    //     propertyType: "",
    //     propertyAddress: "",
    //     listingPrice: "",
    //     squareFootage: "",
    //     numberofBedrooms: "",
    //     numberofBathrooms: "",
    //     yearBuilt: "",
    //     propertyDescription: "",
    //     //2. Property Features and Amenities:
    //     lotSize: "",
    //     parkingAvailability: "",
    //     appliancesIncluded: "",
    //     heatingAndCoolingSystems: "",
    //     flooringType: "",
    //     exteriorFeatures: "",
    //     communityAmenities: "",
    //     //3. Media and Visuals:
    //     propertyPhotos: [],
    //     virtualToursOrVideos: [],
    //     floorPlans: [],
    //     propertyDocuments: [],
    //     //4. Listing and Marketing Details:
    //     listingStatus: "",
    //     listingAgentOrTeam: "",
    //     listingDate: "",
    //     marketingDescription: "",
    //     multipleListingService: "",
    //     //5. Property History:
    //     previousOwners: "",
    //     purchaseHistory: "",
    //     //6. Financial Information:
    //     propertyTaxes: "",
    //     homeownersAssociation: "",
    //     mortgageInformation: "",
    //     //7. Contacts Associated with Property:
    //     sellers: "",
    //     buyers: "",
    //     propertyManagers: "",
    //     contractorsOrServiceProviders: "",
    //     //8. Property Notes and Comments:
    //     internalNotesOrComments: "",
    //     createBy: JSON.parse(localStorage.getItem('user'))._id,
    // };

    const initialFieldValues = Object.fromEntries(
        (props?.propertyData?.fields || []).map(field => [field?.name, ''])
    );

    const initialValues = {
        ...initialFieldValues,
        createBy: JSON.parse(localStorage.getItem('user'))._id
    };

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        // validationSchema: propertySchema,
        validationSchema: yup.object().shape(generateValidationSchema(props?.propertyData?.fields)),

        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik


    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/property/add', values)
            if (response.status === 200) {
                props.onClose();
                formik.resetForm();
                props.setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    const handleCancel = () => {
        formik.resetForm();
        props.onClose()
    }

    return (
        <div>
            <Drawer isOpen={props.isOpen} size={props.size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader justifyContent='space-between' display='flex' >
                        Add Property
                        <IconButton onClick={props.onClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>

                        {/* <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                            <GridItem colSpan={{ base: 12 }}>
                                <Heading as="h1" size="md" >
                                    1. Basic Property Information
                                </Heading>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Property Type<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.propertyType}
                                    name="propertyType"
                                    placeholder='Enter Property Type'
                                    fontWeight='500'
                                    borderColor={errors.propertyType && touched.propertyType ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.propertyType && touched.propertyType && errors.propertyType}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Year Built<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.yearBuilt}
                                    name="yearBuilt"
                                    type='number'
                                    min={1000}
                                    max={new Date().getFullYear()}
                                    placeholder='Enter Year'
                                    fontWeight='500'
                                    borderColor={errors.yearBuilt && touched.yearBuilt ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.yearBuilt && touched.yearBuilt && errors.yearBuilt}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Property Address<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.propertyAddress}
                                    name="propertyAddress"
                                    placeholder='Enter Property Address'
                                    fontWeight='500'
                                    borderColor={errors.propertyAddress && touched.propertyAddress ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.propertyAddress && touched.propertyAddress && errors.propertyAddress}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Listing Price<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.listingPrice}
                                    name="listingPrice"
                                    placeholder='Enter Listing Price'
                                    fontWeight='500'
                                    borderColor={errors.listingPrice && touched.listingPrice ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.listingPrice && touched.listingPrice && errors.listingPrice}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Square Footage<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.squareFootage}
                                    name="squareFootage"
                                    placeholder='Enter Square Footage'
                                    fontWeight='500'
                                    borderColor={errors.squareFootage && touched.squareFootage ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.squareFootage && touched.squareFootage && errors.squareFootage}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Number of Bedrooms<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.numberofBedrooms}
                                    type='number'
                                    min={0}
                                    name="numberofBedrooms"
                                    placeholder='Enter Number of Bedrooms'
                                    fontWeight='500'
                                    borderColor={errors.numberofBedrooms && touched.numberofBedrooms ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.numberofBedrooms && touched.numberofBedrooms && errors.numberofBedrooms}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Number of Bathrooms<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.numberofBathrooms}
                                    name="numberofBathrooms"
                                    type='number'
                                    min={0}
                                    placeholder='Enter Number of Bathrooms'
                                    fontWeight='500'
                                    borderColor={errors.numberofBathrooms && touched.numberofBathrooms ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.numberofBathrooms && touched.numberofBathrooms && errors.numberofBathrooms}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Property Description<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Textarea
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    resize={'none'}
                                    value={values.propertyDescription}
                                    name="propertyDescription"
                                    placeholder='Enter Property Description'
                                    fontWeight='500'
                                    borderColor={errors.propertyDescription && touched.propertyDescription ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.propertyDescription && touched.propertyDescription && errors.propertyDescription}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <HSeparator />
                                <Heading mt={2} as="h1" size="md" >
                                    2. Property Features and Amenities
                                </Heading>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Lot Size
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.lotSize}
                                    name="lotSize"
                                    placeholder='Enter Lot Size'
                                    fontWeight='500'
                                    borderColor={errors.lotSize && touched.lotSize ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.lotSize && touched.lotSize && errors.lotSize}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    appliances Included
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.appliancesIncluded}
                                    name="appliancesIncluded"
                                    placeholder='Enter appliances Included'
                                    fontWeight='500'
                                    borderColor={errors.appliancesIncluded && touched.appliancesIncluded ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.appliancesIncluded && touched.appliancesIncluded && errors.appliancesIncluded}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Heating And Cooling Systems
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.heatingAndCoolingSystems}
                                    name="heatingAndCoolingSystems"
                                    placeholder='Enter Heating And Cooling Systems'
                                    fontWeight='500'
                                    borderColor={errors.heatingAndCoolingSystems && touched.heatingAndCoolingSystems ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.heatingAndCoolingSystems && touched.heatingAndCoolingSystems && errors.heatingAndCoolingSystems}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Flooring Type
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.flooringType}
                                    name="flooringType"
                                    placeholder='Enter Flooring Type'
                                    fontWeight='500'
                                    borderColor={errors.flooringType && touched.flooringType ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.flooringType && touched.flooringType && errors.flooringType}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Exterior Features
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.exteriorFeatures}
                                    name="exteriorFeatures"
                                    placeholder='Enter Exterior Features'
                                    fontWeight='500'
                                    borderColor={errors.exteriorFeatures && touched.exteriorFeatures ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.exteriorFeatures && touched.exteriorFeatures && errors.exteriorFeatures}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Community Amenities
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.communityAmenities}
                                    name="communityAmenities"
                                    placeholder='Enter Community Amenities'
                                    fontWeight='500'
                                    borderColor={errors.communityAmenities && touched.communityAmenities ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.communityAmenities && touched.communityAmenities && errors.communityAmenities}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Parking Availability
                                </FormLabel>
                                <Select
                                    value={values.parkingAvailability}
                                    name="parkingAvailability"
                                    onChange={handleChange}
                                    fontWeight='500'
                                    placeholder={'Select Parking Availability'}
                                    borderColor={errors.parkingAvailability && touched.parkingAvailability ? "red.300" : null}
                                >
                                    <option value='yes'>Yes</option>
                                    <option value='no'>No</option>
                                </Select>
                                <Text mb='10px' color={'red'}>{errors.parkingAvailability && touched.parkingAvailability && errors.parkingAvailability}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <HSeparator />
                                <Heading mt={2} as="h1" size="md" >
                                    3. Listing and Marketing Details
                                </Heading>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Listing Status
                                </FormLabel>
                                <Select
                                    value={values.listingStatus}
                                    name="listingStatus"
                                    onChange={handleChange}
                                    fontWeight='500'
                                    placeholder={'Select Listing Status'}
                                    borderColor={errors.listingStatus && touched.listingStatus ? "red.300" : null}
                                >
                                    <option value='active'>active</option>
                                    <option value='pending'>pending</option>
                                    <option value='sold'>sold</option>
                                </Select>
                                <Text mb='10px' color={'red'}>{errors.listingStatus && touched.listingStatus && errors.listingStatus}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Listing Agent Or Team
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.listingAgentOrTeam}
                                    name="listingAgentOrTeam"
                                    placeholder='Enter Listing Agent Or Team'
                                    fontWeight='500'
                                    borderColor={errors.listingAgentOrTeam && touched.listingAgentOrTeam ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.listingAgentOrTeam && touched.listingAgentOrTeam && errors.listingAgentOrTeam}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Listing Date
                                </FormLabel>
                                <Input
                                    type='date'
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.listingDate}
                                    name="listingDate"
                                    fontWeight='500'
                                    borderColor={errors.listingDate && touched.listingDate ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.listingDate && touched.listingDate && errors.listingDate}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Marketing Description
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.marketingDescription}
                                    name="marketingDescription"
                                    placeholder='Enter Marketing Description'
                                    fontWeight='500'
                                    borderColor={errors.marketingDescription && touched.marketingDescription ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.marketingDescription && touched.marketingDescription && errors.marketingDescription}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Multiple Listing Service
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.multipleListingService}
                                    name="multipleListingService"
                                    placeholder='Enter Multiple Listing Service'
                                    fontWeight='500'
                                    borderColor={errors.multipleListingService && touched.multipleListingService ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.multipleListingService && touched.multipleListingService && errors.multipleListingService}</Text>
                            </GridItem>


                            <GridItem colSpan={{ base: 12 }}>
                                <HSeparator />
                                <Heading mt={2} as="h1" size="md" >
                                    4. Property History
                                </Heading>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Previous Owners
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.previousOwners}
                                    name="previousOwners"
                                    type='number'
                                    min={0}
                                    placeholder='Enter Previous Owners'
                                    fontWeight='500'
                                    borderColor={errors.previousOwners && touched.previousOwners ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}>{errors.previousOwners && touched.previousOwners && errors.previousOwners}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <HSeparator />
                                <Heading mt={2} as="h1" size="md" >
                                    5. Financial Information
                                </Heading>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Property Taxes
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.propertyTaxes}
                                    name="propertyTaxes"
                                    placeholder=' Property Taxes'
                                    fontWeight='500'
                                    borderColor={errors.propertyTaxes && touched.propertyTaxes ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.propertyTaxes && touched.propertyTaxes && errors.propertyTaxes}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Homeowners Association
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.homeownersAssociation}
                                    name="homeownersAssociation"
                                    placeholder='Homeowners Association'
                                    fontWeight='500'
                                    borderColor={errors.homeownersAssociation && touched.homeownersAssociation ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.homeownersAssociation && touched.homeownersAssociation && errors.homeownersAssociation}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Mortgage Information
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.mortgageInformation}
                                    name="mortgageInformation"
                                    placeholder='Mortgage Information'
                                    fontWeight='500'
                                    borderColor={errors.mortgageInformation && touched.mortgageInformation ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.mortgageInformation && touched.mortgageInformation && errors.mortgageInformation}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <HSeparator />
                                <Heading mt={2} as="h1" size="md" >
                                    6. Contacts Associated with Property
                                </Heading>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Sellers
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.sellers}
                                    name="sellers"
                                    placeholder='Sellers'
                                    fontWeight='500'
                                    borderColor={errors.sellers && touched.sellers ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.sellers && touched.sellers && errors.sellers}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Buyers
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.buyers}
                                    name="buyers"
                                    placeholder='Buyers'
                                    fontWeight='500'
                                    borderColor={errors.buyers && touched.buyers ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.buyers && touched.buyers && errors.buyers}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Property Managers
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.propertyManagers}
                                    name="propertyManagers"
                                    placeholder='Property Managers'
                                    fontWeight='500'
                                    borderColor={errors.propertyManagers && touched.propertyManagers ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.propertyManagers && touched.propertyManagers && errors.propertyManagers}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Contractors Or Service Providers
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.contractorsOrServiceProviders}
                                    name="contractorsOrServiceProviders"
                                    placeholder='Contractors Or Service Providers'
                                    fontWeight='500'
                                    borderColor={errors.contractorsOrServiceProviders && touched.contractorsOrServiceProviders ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.contractorsOrServiceProviders && touched.contractorsOrServiceProviders && errors.contractorsOrServiceProviders}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <HSeparator />
                                <Heading mt={2} as="h1" size="md" >
                                    7. Property Notes and Comments
                                </Heading>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Internal Notes Or Comments
                                </FormLabel>
                                <Textarea
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    resize={'none'}
                                    value={values.internalNotesOrComments}
                                    name="internalNotesOrComments"
                                    placeholder='Internal Notes Or Comments'
                                    fontWeight='500'
                                    borderColor={errors.internalNotesOrComments && touched.internalNotesOrComments ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.internalNotesOrComments && touched.internalNotesOrComments && errors.internalNotesOrComments}</Text>
                            </GridItem>


                        </Grid> */}
                        <CustomForm leadData={props.propertyData} values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} />

                    </DrawerBody>


                    <DrawerFooter>
                        <Button size="sm" sx={{ textTransform: "capitalize" }} disabled={isLoding ? true : false} variant="brand" type="submit" onClick={handleSubmit}                        >
                            {isLoding ? <Spinner /> : 'Save'}
                        </Button>
                        <Button size="sm"
                            variant="outline"
                            colorScheme='red'
                            sx={{
                                marginLeft: 2,
                                textTransform: "capitalize",
                            }}
                            onClick={props.onClose}
                        >
                            Close
                        </Button>
                    </DrawerFooter>

                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default Add
