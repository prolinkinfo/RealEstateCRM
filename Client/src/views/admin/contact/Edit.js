import { CloseIcon, PhoneIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FormLabel, Grid, GridItem, Heading, IconButton, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Text } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BiMobile } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import { contactSchema } from 'schema';
import { getApi, putApi } from 'services/api';
import { generateValidationSchema } from '../../../utils';
import * as yup from 'yup'
import CustomForm from 'utils/customForm';

const Edit = (props) => {
    const [isLoding, setIsLoding] = useState(false)
    const initialFieldValues = Object.fromEntries(
        (props?.contactData?.fields || []).map(field => [field?.name, ''])
    );
    // const [initialValues, setInitialValues] = ({
    //     firstName: "",
    //     lastName: "",
    //     title: "",
    //     email: "",
    //     phoneNumber: "",
    //     mobileNumber: "",
    //     physicalAddress: "",
    //     mailingAddress: "",
    //     preferredContactMethod: "",
    //     // 2.Lead Source Information
    //     leadSource: "",
    //     referralSource: "",
    //     campaignSource: "",
    //     // 3. Status and Classifications
    //     leadStatus: "",
    //     leadRating: "",
    //     leadConversionProbability: "",
    //     // 4. Property of Interest
    //     // 5. History:
    //     notesandComments: "",
    //     // 6. Tags or Categories
    //     tagsOrLabelsForcategorizingcontacts: "",
    //     // 7. Important Dates::
    //     birthday: "",
    //     anniversary: "",
    //     keyMilestones: "",
    //     // 8. Additional Personal Information
    //     dob: "",
    //     gender: "",
    //     occupation: "",
    //     interestsOrHobbies: "",
    //     // 9. Preferred  Communication Preferences:
    //     communicationFrequency: "",
    //     preferences: "",
    //     // 10. Social Media Profiles:
    //     linkedInProfile: "",
    //     facebookProfile: "",
    //     twitterHandle: "",
    //     otherProfiles: "",
    //     // 11. Lead Assignment and Team Collaboration:
    //     agentOrTeamMember: "",
    //     internalNotesOrComments: "",
    //     createBy: JSON.parse(localStorage.getItem('user'))._id,
    // });
    const [initialValues, setInitialValues] = useState({
        ...initialFieldValues,
        createBy: JSON.parse(localStorage.getItem('user'))._id
    });
    const param = useParams()

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        // validationSchema: contactSchema,
        validationSchema: yup.object().shape(generateValidationSchema(props?.contactData?.fields)),
        onSubmit: (values, { resetForm }) => {
            EditData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const EditData = async () => {
        try {
            setIsLoding(true)
            // let response = await putApi(`api/contact/edit/${props?.selectedId || param.id}`, values)
            let response = await putApi(`api/form/edit/${props?.selectedId || param.id}`, { ...values, moduleId: props?.moduleId })
            if (response.status === 200) {
                props.onClose();
                props.setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoding(false)
        }
    };

    const handleClose = () => {
        props.onClose(false)
        props.setSelectedId && props?.setSelectedId()
    }
    let response
    const fetchData = async () => {
        if (props?.selectedId || param.id) {
            try {
                setIsLoding(true)
                response = await getApi('api/contact/view/', props?.selectedId ? props?.selectedId : param.id)
                setInitialValues(response?.data?.contact)
                // values.firstName = response?.data?.contact?.firstName;
                // values.lastName = response?.data?.contact?.lastName;
                // values.title = response?.data?.contact?.title;
                // values.email = response?.data?.contact?.email;
                // values.phoneNumber = response?.data?.contact?.phoneNumber;
                // values.mobileNumber = response?.data?.contact?.mobileNumber;
                // values.physicalAddress = response?.data?.contact?.physicalAddress;
                // values.mailingAddress = response?.data?.contact?.mailingAddress;
                // values.preferredContactMethod = response?.data?.contact?.preferredContactMethod;
                // // 2.Lead Source Information
                // values.leadSource = response?.data?.contact?.leadSource;
                // values.referralSource = response?.data?.contact?.referralSource;
                // values.campaignSource = response?.data?.contact?.campaignSource;
                // // 3. Status and Classifications
                // values.leadStatus = response?.data?.contact?.leadStatus;
                // values.leadRating = response?.data?.contact?.leadRating;
                // values.leadConversionProbability = response?.data?.contact?.leadConversionProbability;
                // // 5. History:
                // values.emailHistory = response?.data?.contact?.emailHistory;
                // values.phoneCallHistory = response?.data?.contact?.phoneCallHistory;
                // values.meetingHistory = response?.data?.contact?.meetingHistory;
                // values.notesandComments = response?.data?.contact?.notesandComments;
                // // 6. Tags or Categories
                // values.tagsOrLabelsForcategorizingcontacts = response?.data?.contact?.tagsOrLabelsForcategorizingcontacts;
                // // 7. Important Dates::
                // values.birthday = moment(response?.data?.contact?.birthday).format('YYYY-MM-DD')
                // values.anniversary = moment(response?.data?.contact?.anniversary).format('YYYY-MM-DD')
                // values.keyMilestones = response?.data?.contact?.keyMilestones;
                // // 8. Additional Personal Information
                // values.dob = moment(response?.data?.contact?.dob).format('YYYY-MM-DD')
                // values.gender = response?.data?.contact?.gender;
                // values.occupation = response?.data?.contact?.occupation;
                // values.interestsOrHobbies = response?.data?.contact?.interestsOrHobbies;
                // // 9. Preferred  Communication Preferences:
                // values.communicationFrequency = response?.data?.contact?.communicationFrequency;
                // values.preferences = response?.data?.contact?.preferences;
                // // 10. Social Media Profiles:
                // values.linkedInProfile = response?.data?.contact?.linkedInProfile;
                // values.facebookProfile = response?.data?.contact?.facebookProfile;
                // values.twitterHandle = response?.data?.contact?.twitterHandle;
                // values.otherProfiles = response?.data?.contact?.otherProfiles;
                // // 11. Lead Assignment and Team Collaboration:
                // values.agentOrTeamMember = response?.data?.contact?.agentOrTeamMember;
                // values.internalNotesOrComments = response?.data?.contact?.internalNotesOrComments;

            } catch (e) {
                console.error(e)
            } finally {
                setIsLoding(false)
            }
        }
    }
    useEffect(() => {
        fetchData()
    }, [props?.selectedId])

    return (
        <div>
            <Drawer isOpen={props.isOpen} size={props.size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader justifyContent='space-between' display='flex' >
                        Edit Contacts
                        <IconButton onClick={handleClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>
                        {isLoding ?
                            <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                                <Spinner />
                            </Flex>
                            :

                            <CustomForm leadData={props.contactData} values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} />

                        }
                    </DrawerBody>
                    {/* <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                                <GridItem colSpan={{ base: 12 }}>
                                    <Heading as="h1" size="md" >
                                        1. Basic Information
                                    </Heading>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        First Name<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.firstName}
                                        name="firstName"
                                        placeholder='Enter First Name'
                                        // mb={errors.firstName && touched.firstName ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.firstName && touched.firstName ? "red.300" : 'none'}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.firstName && touched.firstName && errors.firstName}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Last Name<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.lastName}
                                        name="lastName"
                                        placeholder='Enter Last Name'
                                        mb={errors.lastName && touched.lastName ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.lastName && touched.lastName ? "red.300" : null}
                                    />
                                    {errors.lastName && touched.lastName && <Text mb='10px' color={'red'}> {errors.lastName}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Title<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.title}
                                        name="title"
                                        placeholder='Enter Title'
                                        mb={errors.title && touched.title ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.title && touched.title ? "red.300" : null}
                                    />
                                    {errors.title && touched.title && <Text mb='10px' color={'red'}> {errors.title}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Email<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.email}
                                        name="email"
                                        type='email'
                                        placeholder='mail@simmmple.com'
                                        mb={errors.email && touched.email ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.email && touched.email ? "red.300" : null}
                                    />
                                    {errors.email && touched.email && <Text mb='10px' color={'red'}> {errors.email}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Phone Number<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                        />
                                        <Input type="tel"
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.phoneNumber}
                                            name="phoneNumber"
                                            fontWeight='500'
                                            borderColor={errors.title && touched.title ? "red.300" : null}
                                            mb={errors.title && touched.title ? undefined : '10px'}
                                            placeholder="Phone number" borderRadius="16px" />
                                    </InputGroup>
                                    {errors.title && touched.title && <Text mb='10px' color={'red'}> {errors.title}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Mobile Number
                                    </FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<BiMobile color="gray" borderRadius="16px" />}
                                        />
                                        <Input type="tel"
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.mobileNumber}
                                            name="mobileNumber"
                                            fontWeight='500'
                                            borderColor={errors.title && touched.title ? "red.300" : null}
                                            mb={errors.title && touched.title ? undefined : '10px'}
                                            placeholder="Mobile number" borderRadius="16px" />
                                    </InputGroup>
                                    {errors.mobileNumber && touched.mobileNumber && <Text mb='10px' color={'red'}> {errors.mobileNumber}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Physical Address<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.physicalAddress}
                                        name="physicalAddress"
                                        type='email'
                                        placeholder='Enter Physical Address'
                                        mb={errors.physicalAddress && touched.physicalAddress ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.physicalAddress && touched.physicalAddress ? "red.300" : null}
                                    />
                                    {errors.physicalAddress && touched.physicalAddress && <Text mb='10px' color={'red'}> {errors.physicalAddress}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Mailling Address
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.mailingAddress}
                                        name="mailingAddress"
                                        placeholder='Enter Mailling Address'
                                        mb={errors.mailingAddress && touched.mailingAddress ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.mailingAddress && touched.mailingAddress ? "red.300" : null}
                                    />
                                    {errors.mailingAddress && touched.mailingAddress && <Text mb='10px' color={'red'}> {errors.mailingAddress}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Preferred Contact Method<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.preferredContactMethod}
                                        name="preferredContactMethod"
                                        type='email'
                                        placeholder='Enter Contact Method'
                                        mb={errors.preferredContactMethod && touched.preferredContactMethod ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.preferredContactMethod && touched.preferredContactMethod ? "red.300" : null}
                                    />
                                    {errors.preferredContactMethod && touched.preferredContactMethod && <Text mb='10px' color={'red'}> {errors.preferredContactMethod}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        2. Lead Source Information
                                    </Heading>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Source
                                    </FormLabel>
                                    <Select
                                        value={values.leadSource}
                                        name="leadSource"
                                        onChange={handleChange}
                                        mb={errors.leadSource && touched.leadSource ? undefined : '10px'}
                                        fontWeight='500'
                                        placeholder={'Select Lead Source'}
                                        borderColor={errors.leadSource && touched.leadSource ? "red.300" : null}
                                    >
                                        <option value="website">Website</option>
                                        <option value="referrals">Referrals</option>
                                        <option value="advertising">Advertising</option>
                                        <option value="socialMedia">Social Media</option>
                                        <option value="eventsAndTradeShows">Events and Trade Shows</option>
                                        <option value="callCentersOrTelemarketing">Call Centers or Telemarketing</option>
                                        <option value="partnerships">Partnerships</option>
                                        <option value="directMail">Direct Mail</option>
                                        <option value="onlineAggregatorsOrComparisonWebsites">Online Aggregators or Comparison Websites</option>
                                        <option value="contentMarketing">Content Marketing</option>
                                    </Select>
                                    {errors.leadSource && touched.leadSource && <Text mb='10px' color={'red'}> {errors.leadSource}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Referral Source
                                    </FormLabel>
                                    <Select
                                        value={values.referralSource}
                                        name="referralSource"
                                        onChange={handleChange}
                                        mb={errors.referralSource && touched.referralSource ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.referralSource && touched.referralSource ? "red.300" : null}
                                        placeholder='Select Referral Source'
                                    >
                                        <option value="friend">Friend</option>
                                        <option value="family">Family</option>
                                        <option value="colleague">Colleague</option>
                                    </Select>
                                    {errors.referralSource && touched.referralSource && <Text mb='10px' color={'red'}> {errors.referralSource}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Campaign Source (if applicable)
                                    </FormLabel>
                                    <Select
                                        value={values.campaignSource}
                                        name="campaignSource"
                                        onChange={handleChange}
                                        mb={errors.campaignSource && touched.campaignSource ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.campaignSource && touched.campaignSource ? "red.300" : null}
                                        placeholder=' Campaign Source '
                                    >
                                        <option value="googleAds">Google Ads</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="emailCampaign">Email Campaign</option>
                                        <option value="referrals">Referrals</option>
                                    </Select>
                                    {errors.campaignSource && touched.campaignSource && <Text mb='10px' color={'red'}> {errors.campaignSource}</Text>}
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        3. Status and Classifications
                                    </Heading>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Status (if applicable)
                                    </FormLabel>

                                    <Select
                                        value={values.leadStatus}
                                        name="leadStatus"
                                        onChange={handleChange}
                                        mb={errors.leadStatus && touched.leadStatus ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.leadStatus && touched.leadStatus ? "red.300" : null}
                                        placeholder='Lead Status '
                                    >
                                        <option value="newLead">New Lead</option>
                                        <option value="qualifiedLead">Qualified Lead</option>
                                        <option value="negotiatingLead">Negotiating</option>
                                        <option value="closed">Closed</option>
                                    </Select>
                                    {errors.leadStatus && touched.leadStatus && <Text mb='10px' color={'red'}> {errors.leadStatus}</Text>}
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Rating
                                    </FormLabel>
                                    {values.leadRating || 0.1}
                                    <Slider ml={2} aria-label='slider-ex-1' colorScheme='yellow' min={0.1} max={5} step={.1} defaultValue={0} onChange={(value) => setFieldValue('leadRating', value)} >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb boxSize={6}>
                                            <Box color='yellow.300' as={StarIcon} />
                                        </SliderThumb>
                                    </Slider>
                                    {errors.leadRating && touched.leadRating && <Text mb='10px' color={'red'}> {errors.leadRating}</Text>}
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Conversion Probability
                                    </FormLabel>
                                    <Select
                                        value={values.leadConversionProbability}
                                        name="leadConversionProbability"
                                        onChange={handleChange}
                                        mb={errors.leadConversionProbability && touched.leadConversionProbability ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.leadConversionProbability && touched.leadConversionProbability ? "red.300" : null}
                                        placeholder='Lead Conversion Probability '
                                    >
                                        <option value="newLead">New Lead</option>
                                        <option value="qualifiedLead">Qualified Lead</option>
                                        <option value="negotiatingLead">Negotiating</option>
                                        <option value="closed">Closed</option>
                                    </Select>
                                    {errors.leadConversionProbability && touched.leadConversionProbability && <Text mb='10px' color={'red'}> {errors.leadConversionProbability}</Text>}
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        4. Tags or Categories
                                    </Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Tags Or Labels For Categorizing Contacts
                                    </FormLabel>
                                    <Select
                                        value={values.tagsOrLabelsForcategorizingcontacts}
                                        name="tagsOrLabelsForcategorizingcontacts"
                                        onChange={handleChange}
                                        mb={errors.tagsOrLabelsForcategorizingcontacts && touched.tagsOrLabelsForcategorizingcontacts ? undefined : '10px'}
                                        fontWeight='500'
                                        placeholder={'tags Or Labels For categorizing contacts'}
                                        borderColor={errors.tagsOrLabelsForcategorizingcontacts && touched.tagsOrLabelsForcategorizingcontacts ? "red.300" : null}
                                    >
                                        <option value="seller">Seller</option>
                                        <option value="investor">Investor</option>
                                        <option value="homeBuyer">First-Time Homebuyer</option>
                                    </Select>
                                    <Text mb='10px' color={'red'}> {errors.otherPropertySpecifications && touched.otherPropertySpecifications && errors.otherPropertySpecifications}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Notes and Comments
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.notesandComments}
                                        name="notesandComments"
                                        placeholder='Other Specifications'
                                        fontWeight='500'
                                        borderColor={errors.notesandComments && touched.notesandComments ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.notesandComments && touched.notesandComments && errors.notesandComments}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        5. Important Dates
                                    </Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Birthday
                                    </FormLabel>
                                    <Input
                                        type='date'
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.birthday}
                                        name="birthday"
                                        fontWeight='500'
                                        borderColor={errors.birthday && touched.birthday ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.birthday && touched.birthday && errors.birthday}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Anniversary
                                    </FormLabel>
                                    <Input
                                        type='date'
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.anniversary}
                                        name="anniversary"
                                        fontWeight='500'
                                        borderColor={errors.anniversary && touched.anniversary ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.anniversary && touched.anniversary && errors.anniversary}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Key Milestones
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.keyMilestones}
                                        name="keyMilestones"
                                        placeholder='Enter key Milestones'
                                        fontWeight='500'
                                        borderColor={errors.keyMilestones && touched.keyMilestones ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.keyMilestones && touched.keyMilestones && errors.keyMilestones}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        6. Additional Personal Information
                                    </Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Occupation
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.occupation}
                                        name="occupation"
                                        placeholder='occupation'
                                        mb={errors.occupation && touched.occupation ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.occupation && touched.occupation ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.occupation && touched.occupation && errors.occupation}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Interests Or Hobbies
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.interestsOrHobbies}
                                        name="interestsOrHobbies"
                                        placeholder='Interests Or Hobbies'
                                        mb={errors.interestsOrHobbies && touched.interestsOrHobbies ? undefined : '10px'}
                                        fontWeight='500'
                                        borderColor={errors.interestsOrHobbies && touched.interestsOrHobbies ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.interestsOrHobbies && touched.interestsOrHobbies && errors.interestsOrHobbies}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Gender
                                    </FormLabel>
                                    <RadioGroup onChange={(e) => setFieldValue('gender', e)} value={values.gender}>
                                        <Stack direction='row'>
                                            <Radio value='male' >Male</Radio>
                                            <Radio value='female'>Female</Radio>
                                            <Radio value='other'>Other</Radio>
                                        </Stack>
                                    </RadioGroup>
                                    <Text mb='10px' color={'red'}> {errors.gender && touched.gender && errors.gender}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Date of Birth
                                    </FormLabel>
                                    <Input
                                        type='date'
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.dob}
                                        name="dob"
                                        fontWeight='500'
                                        borderColor={errors.dob && touched.dob ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.dob && touched.dob && errors.dob}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        7. Preferred Communication Preferences
                                    </Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Communication Frequency
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.communicationFrequency}
                                        name="communicationFrequency"
                                        placeholder='Communication Frequency'
                                        fontWeight='500'
                                        borderColor={errors.communicationFrequency && touched.communicationFrequency ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.communicationFrequency && touched.communicationFrequency && errors.communicationFrequency}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Preferences
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.preferences}
                                        name="preferences"
                                        placeholder='Communication Frequency'
                                        fontWeight='500'
                                        borderColor={errors.preferences && touched.preferences ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.preferences && touched.preferences && errors.preferences}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        8. Social Media Profiles
                                    </Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        LinkedIn Profile URL
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.linkedInProfile}
                                        name="linkedInProfile"
                                        placeholder='LinkedIn Profile URL'
                                        fontWeight='500'
                                        borderColor={errors.linkedInProfile && touched.linkedInProfile ? "red.300" : null}
                                    />
                                    {values.linkedInProfile && (
                                        <a color='blue' style={{ color: 'blue', textDecoration: 'underline' }} target="_blank" href={values.linkedInProfile}                                      >
                                            View
                                        </a>
                                    )}
                                    <Text mb='10px' color={'red'}> {errors.linkedInProfile && touched.linkedInProfile && errors.linkedInProfile}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Facebook
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.facebookProfile}
                                        name="facebookProfile"
                                        placeholder='Facebook username'
                                        fontWeight='500'
                                        borderColor={errors.facebookProfile && touched.facebookProfile ? "red.300" : null}
                                    />
                                    {values.facebookProfile && (
                                        <a color='blue' style={{ color: 'blue', textDecoration: 'underline' }} target="_blank" href={"https://www.facebook.com/" + values.facebookProfile}>
                                            View
                                        </a>
                                    )}
                                    <Text mb='10px' color={'red'}> {errors.facebookProfile && touched.facebookProfile && errors.facebookProfile}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Twitter Username
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.twitterHandle}
                                        name="twitterHandle"
                                        placeholder='Twitter Username'
                                        fontWeight='500'
                                        borderColor={errors.twitterHandle && touched.twitterHandle ? "red.300" : null}
                                    />
                                    {values.twitterHandle && (
                                        <a color='blue' style={{ color: 'blue', textDecoration: 'underline' }} target="_blank" href={"https://twitter.com/" + values.twitterHandle}>
                                            View
                                        </a>
                                    )}
                                    <Text mb='10px' color={'red'}> {errors.twitterHandle && touched.twitterHandle && errors.twitterHandle}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Other Social Media Profiles URL
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.otherProfiles}
                                        name="otherProfiles"
                                        placeholder='Other Social Media Profiles URL'
                                        fontWeight='500'
                                        borderColor={errors.otherProfiles && touched.otherProfiles ? "red.300" : null}
                                    />
                                    {values.otherProfiles && (
                                        <a color='blue' style={{ color: 'blue', textDecoration: 'underline' }} target="_blank" href={values.otherProfiles}>
                                            View
                                        </a>
                                    )}
                                    <Text mb='10px' color={'red'}> {errors.otherProfiles && touched.otherProfiles && errors.otherProfiles}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        9. Lead Assignment and Team Collaboration
                                    </Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Assigned Agent or Team Member
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.agentOrTeamMember}
                                        name="agentOrTeamMember"
                                        placeholder='Communication Frequency'
                                        fontWeight='500'
                                        borderColor={errors.agentOrTeamMember && touched.agentOrTeamMember ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.agentOrTeamMember && touched.agentOrTeamMember && errors.agentOrTeamMember}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Internal Notes or Comments for Team Collaboration
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.internalNotesOrComments}
                                        name="internalNotesOrComments"
                                        placeholder='Internal Notes or Comments '
                                        fontWeight='500'
                                        borderColor={errors.internalNotesOrComments && touched.internalNotesOrComments ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.internalNotesOrComments && touched.internalNotesOrComments && errors.internalNotesOrComments}</Text>
                                </GridItem>

                            </Grid> */}

                    <DrawerFooter>
                        <Button
                            sx={{ textTransform: "capitalize" }}
                            variant="solid"
                            colorScheme="green"
                            type="submit" size="sm"
                            disabled={isLoding ? true : false}
                            onClick={handleSubmit}
                        >
                            {isLoding ? <Spinner /> : 'Update'}
                        </Button>
                        <Button
                            variant="outline"
                            colorScheme='red' size="sm"
                            sx={{
                                marginLeft: 2,
                                textTransform: "capitalize",
                            }}
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default Edit