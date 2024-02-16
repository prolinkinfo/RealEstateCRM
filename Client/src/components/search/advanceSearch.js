import { Box, Button, Flex, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import React from 'react'
import * as yup from "yup"

const AdvanceSearch = ({ setAdvaceSearch, advaceSearch, isLoding, allData, setDisplaySearchData, setSearchedData, setGetTagValues, setSearchClear }) => {

    const initialValues = {
        leadName: '',
        leadStatus: '',
        leadEmail: '',
        leadPhoneNumber: '',
        leadAddress: '',
        leadOwner: '',
        fromLeadScore: '',
        toLeadScore: ''
    }
    const validationSchema = yup.object({
        leadName: yup.string(),
        leadStatus: yup.string(),
        leadEmail: yup.string().email("Lead Email is invalid"),
        leadPhoneNumber: yup.number().typeError('Enter Number').min(0, 'Lead Phone Number is invalid').max(999999999999, 'Lead Phone Number is invalid').notRequired(),
        leadAddress: yup.string(),
        leadOwner: yup.string(),
        fromLeadScore: yup.number().min(0, "From Lead Score is invalid"),
        toLeadScore: yup.number().min(yup.ref('fromLeadScore'), "To Lead Score must be greater than or equal to From Lead Score")
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            const searchResult = allData?.filter(
                (item) =>
                    (!values?.leadName || (item?.leadName && item?.leadName.toLowerCase().includes(values?.leadName?.toLowerCase()))) &&
                    (!values?.leadStatus || (item?.leadStatus && item?.leadStatus.toLowerCase().includes(values?.leadStatus?.toLowerCase()))) &&
                    (!values?.leadEmail || (item?.leadEmail && item?.leadEmail.toLowerCase().includes(values?.leadEmail?.toLowerCase()))) &&
                    (!values?.leadPhoneNumber || (item?.leadPhoneNumber && item?.leadPhoneNumber.toString().includes(values?.leadPhoneNumber))) &&
                    (!values?.leadOwner || (item?.leadOwner && item?.leadOwner.toLowerCase().includes(values?.leadOwner?.toLowerCase()))) &&
                    ([null, undefined, ''].includes(values?.fromLeadScore) || [null, undefined, ''].includes(values?.toLeadScore) ||
                        ((item?.leadScore || item?.leadScore === 0) &&
                            (parseInt(item?.leadScore, 10) >= parseInt(values.fromLeadScore, 10) || 0) &&
                            (parseInt(item?.leadScore, 10) <= parseInt(values.toLeadScore, 10) || 0)))
            )
            let getValue = [values.leadName, values?.leadStatus, values?.leadEmail, values?.leadPhoneNumber, values?.leadOwner, (![null, undefined, ''].includes(values?.fromLeadScore) && `${values.fromLeadScore}-${values.toLeadScore}`) || undefined].filter(value => value);
            setGetTagValues(getValue)
            setSearchedData(searchResult);
            setDisplaySearchData(true)
            setAdvaceSearch(false)
            setSearchClear(true)
            resetForm();
        }
    })

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    return (
        <Modal onClose={() => { setAdvaceSearch(false); resetForm() }} isOpen={advaceSearch} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Advance Search</ModalHeader>
                <ModalCloseButton onClick={() => { setAdvaceSearch(false); resetForm() }} />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                Name
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values?.leadName}
                                name="leadName"
                                placeholder='Enter Lead Name'
                                fontWeight='500'
                            />
                            <Text mb='10px' color={'red'}> {errors.leadName && touched.leadName && errors.leadName}</Text>

                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                Status
                            </FormLabel>
                            <Select
                                value={values?.leadStatus}
                                fontSize='sm'
                                name="leadStatus"
                                onChange={handleChange}
                                fontWeight='500'
                                placeholder={'Select Lead Status'}
                            >
                                <option value='active'>active</option>
                                <option value='pending'>pending</option>
                                <option value='sold'>sold</option>
                            </Select>
                            <Text mb='10px' color={'red'}> {errors.leadStatus && touched.leadStatus && errors.leadStatus}</Text>

                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                                Email
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values?.leadEmail}
                                name="leadEmail"
                                placeholder='Enter Lead Email'
                                fontWeight='500'
                            />
                            <Text mb='10px' color={'red'}> {errors.leadEmail && touched.leadEmail && errors.leadEmail}</Text>

                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                Phone Number
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values?.leadPhoneNumber}
                                name="leadPhoneNumber"
                                placeholder='Enter Lead PhoneNumber'
                                fontWeight='500'
                            />
                            <Text mb='10px' color={'red'}> {errors.leadPhoneNumber && touched.leadPhoneNumber && errors.leadPhoneNumber}</Text>

                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                Owner
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values?.leadOwner}
                                name="leadOwner"
                                placeholder='Enter Lead Owner'
                                fontWeight='500'
                            />
                            <Text mb='10px' color={'red'}> {errors.leadOwner && touched.leadOwner && errors.leadOwner}</Text>

                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                Score
                            </FormLabel>
                            <Flex justifyContent={"space-between"}>
                                <Box w={"49%"}>
                                    <Input
                                        fontSize='sm'
                                        onChange={(e) => {
                                            setFieldValue('toLeadScore', e.target.value)
                                            handleChange(e)
                                        }}
                                        onBlur={handleBlur}
                                        value={values.fromLeadScore}
                                        name="fromLeadScore"
                                        placeholder='From Lead Score'
                                        fontWeight='500'
                                        type='number'
                                        borderColor={errors.fromLeadScore && touched.fromLeadScore ? "red.300" : null}
                                    />

                                </Box>
                                <Box w={"49%"} >
                                    <Input
                                        fontSize='sm'
                                        onChange={(e) => {
                                            values.fromLeadScore <= e.target.value && handleChange(e)
                                        }}
                                        onBlur={handleBlur}
                                        value={values.toLeadScore}
                                        name="toLeadScore"
                                        placeholder='To Lead Score'
                                        fontWeight='500'
                                        type='number'
                                        borderColor={errors.toLeadScore && touched.toLeadScore ? "red.300" : null}
                                        disabled={[null, undefined, ''].includes(values.fromLeadScore) || values.fromLeadScore < 0}
                                    />
                                </Box>
                            </Flex>
                            <Text mb='10px' color={'red'}> {errors.fromLeadScore && touched.fromLeadScore && errors.fromLeadScore}</Text>

                        </GridItem>

                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" colorScheme='green' size="sm" mr={2} onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
                    <Button colorScheme="red" size="sm" onClick={() => resetForm()}>Clear</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AdvanceSearch
