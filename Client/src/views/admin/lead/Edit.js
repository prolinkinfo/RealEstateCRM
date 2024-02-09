import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FormLabel, Grid, GridItem, Heading, IconButton, Input, InputGroup, InputLeftElement, Select, Text } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { leadSchema } from 'schema';
import { putApi } from 'services/api';
import { getApi } from 'services/api';

const Edit = (props) => {
    const [isLoding, setIsLoding] = useState(false);
    const [initialValues, setInitialValues] = useState({
        // Lead Information:
        leadName: '',
        leadEmail: '',
        leadPhoneNumber: '',
        leadAddress: '',
        // Lead Source and Details:
        leadSource: '',
        leadStatus: '',
        leadSourceDetails: '',
        leadCampaign: '',
        leadSourceChannel: '',
        leadSourceMedium: '',
        leadSourceCampaign: '',
        leadSourceReferral: '',
        // Lead Assignment and Ownership:
        leadAssignedAgent: '',
        leadOwner: '',
        leadCommunicationPreferences: '',
        // Lead Dates and Follow-up:
        leadCreationDate: '',
        leadConversionDate: '',
        leadFollowUpDate: '',
        leadFollowUpStatus: '',
        // Lead Scoring and Nurturing:
        leadScore: '',
        leadNurturingWorkflow: '',
        leadEngagementLevel: '',
        leadConversionRate: '',
        leadNurturingStage: '',
        leadNextAction: '',
        createBy: JSON.parse(localStorage.getItem('user'))._id,
    });
    const param = useParams()

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: leadSchema,
        onSubmit: (values, { resetForm }) => {
            EditData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const EditData = async () => {
        try {
            setIsLoding(true)
            // let response = await putApi(`api/lead/edit/${props?.selectedId || param.id}`, values)
            let response = await putApi(`api/form/edit/${props?.selectedId || param.id}`, { ...values, moduleId: props.moduleId })
            if (response.status === 200) {
                props.onClose();
                props.setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    const handleClose = () => {
        props.onClose(false)
        props.setSelectedId && props?.setSelectedId()
        formik.resetForm();
    }

    let response
    const fetchData = async () => {
        if (props?.selectedId || param.id) {
            try {
                setIsLoding(true)
                response = await getApi('api/lead/view/', props?.selectedId ? props?.selectedId : param.id)
                let editData = response?.data?.lead
                editData.leadCreationDate = moment(response?.data?.lead?.leadCreationDate).format('YYYY-MM-DD');
                editData.leadConversionDate = moment(response?.data?.lead?.leadConversionDate).format('YYYY-MM-DD');
                editData.leadFollowUpDate = moment(response?.data?.lead?.leadFollowUpDate).format('YYYY-MM-DD');
                setInitialValues(editData)
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
                        Edit leads
                        <IconButton onClick={handleClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>

                        {isLoding ?
                            <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                                <Spinner />
                            </Flex>
                            :
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12 }}>
                                    <Heading as="h1" size="md" >
                                        1. Basic Lead Information
                                    </Heading>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Name<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadName}
                                        name="leadName"
                                        placeholder='Enter Lead Name'
                                        fontWeight='500'
                                        borderColor={errors.leadName && touched.leadName ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadName && touched.leadName && errors.leadName}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Email<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadEmail}
                                        type='email'
                                        name="leadEmail"
                                        placeholder='mail@simmmple.com'
                                        fontWeight='500'
                                        borderColor={errors.leadEmail && touched.leadEmail ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadEmail && touched.leadEmail && errors.leadEmail}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Phone Number<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                        />
                                        <Input type="tel"
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.leadPhoneNumber}
                                            name="leadPhoneNumber"
                                            fontWeight='500'
                                            borderColor={errors.title && touched.title ? "red.300" : null}
                                            placeholder="Phone number" borderRadius="16px" />
                                    </InputGroup>
                                    <Text mb='10px' color={'red'}>{errors.leadPhoneNumber && touched.leadPhoneNumber && errors.leadPhoneNumber}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Address<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadAddress}
                                        name="leadAddress"
                                        placeholder='Enter Lead Address'
                                        fontWeight='500'
                                        borderColor={errors.leadAddress && touched.leadAddress ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadAddress && touched.leadAddress && errors.leadAddress}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        2. Lead Source and Details
                                    </Heading>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Source
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadSource}
                                        name="leadSource"
                                        placeholder='Enter Lead Source'
                                        fontWeight='500'
                                        borderColor={errors.leadSource && touched.leadSource ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadSource && touched.leadSource && errors.leadSource}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Status
                                    </FormLabel>
                                    <Select
                                        value={values.leadStatus}
                                        name="leadStatus"
                                        onChange={handleChange}
                                        fontWeight='500'
                                        placeholder={'Select Lead Source'}
                                        borderColor={errors.leadStatus && touched.leadStatus ? "red.300" : null}
                                    >
                                        <option value='active'>active</option>
                                        <option value='pending'>pending</option>
                                        <option value='sold'>sold</option>
                                    </Select>
                                    <Text mb='10px' color={'red'}>{errors.leadStatus && touched.leadStatus && errors.leadStatus}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Source Details
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadSourceDetails}
                                        name="leadSourceDetails"

                                        placeholder='Enter Lead Source Details'
                                        fontWeight='500'
                                        borderColor={errors.leadSourceDetails && touched.leadSourceDetails ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadSourceDetails && touched.leadSourceDetails && errors.leadSourceDetails}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Campaign
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadCampaign}
                                        name="leadCampaign"
                                        placeholder='Enter Lead Campaign'
                                        fontWeight='500'
                                        borderColor={errors.leadCampaign && touched.leadCampaign ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadCampaign && touched.leadCampaign && errors.leadCampaign}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Source Channel
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadSourceChannel}
                                        name="leadSourceChannel"

                                        placeholder='Enter Lead Source Channel'
                                        fontWeight='500'
                                        borderColor={errors.leadSourceChannel && touched.leadSourceChannel ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadSourceChannel && touched.leadSourceChannel && errors.leadSourceChannel}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Source Medium
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadSourceMedium}
                                        name="leadSourceMedium"

                                        placeholder='Enter Lead Source Medium'
                                        fontWeight='500'
                                        borderColor={errors.leadSourceMedium && touched.leadSourceMedium ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadSourceMedium && touched.leadSourceMedium && errors.leadSourceMedium}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Source Campaign
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadSourceCampaign}
                                        name="leadSourceCampaign"

                                        placeholder='Enter lead Source Campaign'
                                        fontWeight='500'
                                        borderColor={errors.leadSourceCampaign && touched.leadSourceCampaign ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadSourceCampaign && touched.leadSourceCampaign && errors.leadSourceCampaign}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Source Referral
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadSourceReferral}
                                        name="leadSourceReferral"

                                        placeholder='Enter Lead Source Referral'
                                        fontWeight='500'
                                        borderColor={errors.leadSourceReferral && touched.leadSourceReferral ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadSourceReferral && touched.leadSourceReferral && errors.leadSourceReferral}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        3. Lead Assignment and Ownership
                                    </Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Assigned Agent
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadAssignedAgent}
                                        name="leadAssignedAgent"

                                        placeholder='Enter Lead Assigned Agent'
                                        fontWeight='500'
                                        borderColor={errors.leadAssignedAgent && touched.leadAssignedAgent ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadAssignedAgent && touched.leadAssignedAgent && errors.leadAssignedAgent}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Owner
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadOwner}
                                        name="leadOwner"

                                        placeholder='Enter Lead Owner'
                                        fontWeight='500'
                                        borderColor={errors.leadOwner && touched.leadOwner ? "red.300" : 'none'}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadOwner && touched.leadOwner && errors.leadOwner}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Communication Preferences
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadCommunicationPreferences}
                                        name="leadCommunicationPreferences"

                                        placeholder='Enter Lead Communication Preferences'
                                        fontWeight='500'
                                        borderColor={errors.leadCommunicationPreferences && touched.leadCommunicationPreferences ? "red.300" : 'none'}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadCommunicationPreferences && touched.leadCommunicationPreferences && errors.leadCommunicationPreferences}</Text>
                                </GridItem>


                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        4. Lead Dates and Follow-up
                                    </Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Creation Date
                                    </FormLabel>
                                    <Input
                                        type='date'
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadCreationDate}
                                        name="leadCreationDate"
                                        fontWeight='500'
                                        borderColor={errors.leadCreationDate && touched.leadCreationDate ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadCreationDate && touched.leadCreationDate && errors.leadCreationDate}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Conversion Date
                                    </FormLabel>
                                    <Input
                                        type='date'
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadConversionDate}
                                        name="leadConversionDate"
                                        fontWeight='500'
                                        borderColor={errors.leadConversionDate && touched.leadConversionDate ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadConversionDate && touched.leadConversionDate && errors.leadConversionDate}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead FollowUp Date
                                    </FormLabel>
                                    <Input
                                        type='date'
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadFollowUpDate}
                                        name="leadFollowUpDate"
                                        fontWeight='500'
                                        borderColor={errors.leadFollowUpDate && touched.leadFollowUpDate ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadFollowUpDate && touched.leadFollowUpDate && errors.leadFollowUpDate}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead FollowUp Status
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadFollowUpStatus}
                                        name="leadFollowUpStatus"
                                        placeholder='Lead FollowUp Status'
                                        fontWeight='500'
                                        borderColor={errors.leadFollowUpStatus && touched.leadFollowUpStatus ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadFollowUpStatus && touched.leadFollowUpStatus && errors.leadFollowUpStatus}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        5. Lead Scoring and Nurturing
                                    </Heading>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Score
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadScore}
                                        name="leadScore"
                                        placeholder='Lead Score'
                                        type='number'
                                        fontWeight='500'
                                        borderColor={errors.leadScore && touched.leadScore ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadScore && touched.leadScore && errors.leadScore}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Nurturing Workflow
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadNurturingWorkflow}
                                        name="leadNurturingWorkflow"
                                        placeholder='Lead Nurturing Workflow'
                                        fontWeight='500'
                                        borderColor={errors.leadNurturingWorkflow && touched.leadNurturingWorkflow ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadNurturingWorkflow && touched.leadNurturingWorkflow && errors.leadNurturingWorkflow}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Engagement Level
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadEngagementLevel}
                                        name="leadEngagementLevel"
                                        placeholder='Lead Engagement Level'
                                        fontWeight='500'
                                        borderColor={errors.leadEngagementLevel && touched.leadEngagementLevel ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadEngagementLevel && touched.leadEngagementLevel && errors.leadEngagementLevel}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Conversion Rate
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadConversionRate}
                                        name="leadConversionRate"
                                        type='number'
                                        placeholder='Lead Conversion Rate'
                                        fontWeight='500'
                                        borderColor={errors.leadConversionRate && touched.leadConversionRate ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadConversionRate && touched.leadConversionRate && errors.leadConversionRate}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Nurturing Stage
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadNurturingStage}
                                        name="leadNurturingStage"
                                        placeholder='Lead Nurturing Stage'
                                        fontWeight='500'
                                        borderColor={errors.leadNurturingStage && touched.leadNurturingStage ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadNurturingStage && touched.leadNurturingStage && errors.leadNurturingStage}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Next Action
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadNextAction}
                                        name="leadNextAction"
                                        placeholder='Lead Next Action'
                                        fontWeight='500'
                                        borderColor={errors.leadNextAction && touched.leadNextAction ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadNextAction && touched.leadNextAction && errors.leadNextAction}</Text>
                                </GridItem>


                            </Grid>
                        }
                    </DrawerBody>


                    <DrawerFooter>
                        <Button
                            sx={{ textTransform: "capitalize" }}
                            variant="solid"
                            colorScheme="green" size="sm"
                            type="submit"
                            disabled={isLoding ? true : false}
                            onClick={handleSubmit}
                        >
                            {isLoding ? <Spinner /> : 'Update Data'}
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
                            Cancel
                        </Button>
                    </DrawerFooter>

                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default Edit