import React from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Grid, GridItem, Input, FormLabel, Select, Text, Button, } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { setSearchValue, getSearchData, setGetTagValues } from '../../../../redux/slices/advanceSearchSlice';
import { useDispatch } from 'react-redux';



const QuotesAdvanceSearch = (props) => {
    const { state, allData, advanceSearch, setAdvanceSearch, isLoding, setSearchedData, setDisplaySearchData, setSearchClear, setSearchbox } = props;

    const dispatch = useDispatch();
    const initialValues = {
        quoteNumber: '',
        title: '',
        quoteStage: '',
        contactName: '',
        accountName: '',
        grandTotal: '',
        validUntil: '',
    }
    const validationSchema = yup.object({
        quoteNumber: yup.string(),
        title: yup.string(),
        quoteStage: yup.string(),
        contactName: yup.string(),
        accountName: yup.string(),
        grandTotal: yup.string(),
        validUntil: yup.string()
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            dispatch(setSearchValue(values))
            dispatch(getSearchData({ values: values, allData: allData, type: 'quotes' }))

            const getValue = [
                {
                    name: ["quoteNumber"],
                    value: values.quoteNumber
                },
                {
                    name: ["title"],
                    value: values.title
                },
                {
                    name: ["quoteStage"],
                    value: values.quoteStage
                },
                {
                    name: ["contactName"],
                    value: values.contactName
                },
                {
                    name: ["accountName"],
                    value: values.accountName
                },
                {
                    name: ["grandTotal"],
                    value: values.grandTotal
                },
                {
                    name: ["validUntil"],
                    value: values.validUntil
                },
            ]
            dispatch(setGetTagValues(getValue.filter(item => item.value)))
            setDisplaySearchData(true)
            setAdvanceSearch(false)
            resetForm();
            setSearchbox('');
        }
    })

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm, dirty } = formik;

    return (
        <>
            <Modal onClose={() => { setAdvanceSearch(false); resetForm() }} isOpen={advanceSearch} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Advance Search</ModalHeader>
                    <ModalCloseButton onClick={() => { setAdvanceSearch(false); resetForm() }} />
                    <ModalBody>
                        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Quote Number
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.quoteNumber}
                                    name="quoteNumber"
                                    type='number'
                                    placeholder='Enter Quote Number'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.quoteNumber && touched.quoteNumber && errors.quoteNumber}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Title
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.title}
                                    name="title"
                                    placeholder='Enter Title'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.title && touched.title && errors.title}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Quote Stage
                                </FormLabel>
                                <Select
                                    value={values.quoteStage}
                                    name="quoteStage"
                                    onChange={handleChange}
                                    mb={errors.quoteStage && touched.quoteStage ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Quote Stage'}
                                    borderColor={errors.quoteStage && touched.quoteStage ? "red.300" : null}
                                >
                                    <option value="Draft" >Draft</option>
                                    <option value="Negotiation" >Negotiation</option>
                                    <option value="Delivered" >Delivered</option>
                                    <option value="On Hold" >On Hold</option>
                                    <option value="Confirmed" >Confirmed</option>
                                    <option value="Closed Accepted" >Closed Accepted</option>
                                    <option value="Closed Lost" >Closed Lost</option>
                                    <option value="Closed Dead" >Closed Dead</option>
                                </Select>
                                <Text mb='10px' color={'red'}> {errors.quoteStage && touched.quoteStage && errors.quoteStage}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Contact
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.contactName}
                                    name="contactName"
                                    placeholder='Enter Contact Name'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.contactName && touched.contactName && errors.contactName}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Account
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.accountName}
                                    name="accountName"
                                    placeholder='Enter Account Name'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.accountName && touched.accountName && errors.accountName}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Grand Total
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.grandTotal}
                                    name="grandTotal"
                                    placeholder='Enter Grand Total'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.grandTotal && touched.grandTotal && errors.grandTotal}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Valid Untile
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.validUntil}
                                    name="validUntil"
                                    type='date'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.validUntil && touched.validUntil && errors.validUntil}</Text>
                            </GridItem>
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" variant="brand" mr={2} onClick={handleSubmit} disabled={isLoding || !dirty ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
                        <Button size="sm" variant="outline" colorScheme="red" onClick={() => resetForm()}>Clear</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default QuotesAdvanceSearch
