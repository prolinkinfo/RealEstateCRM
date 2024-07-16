import React from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Grid, GridItem, Input, FormLabel, Select, Text, Button, } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { setSearchValue, getSearchData, setGetTagValues } from '../../../../redux/slices/advanceSearchSlice';
import { useDispatch } from 'react-redux';



const InvoiceAdvanceSearch = (props) => {
    const { state, allData, advanceSearch, setAdvanceSearch, isLoding, setSearchedData, setDisplaySearchData, setSearchClear, setSearchbox } = props;

    const dispatch = useDispatch();
    const initialValues = {
        invoiceNumber: '',
        title: '',
        status: '',
        contactName: '',
        accountName: '',
        grandTotal: '',
    }
    const validationSchema = yup.object({
        invoiceNumber: yup.string(),
        title: yup.string(),
        status: yup.string(),
        contactName: yup.string(),
        accountName: yup.string(),
        grandTotal: yup.string(),
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            dispatch(setSearchValue(values))
            dispatch(getSearchData({ values: values, allData: allData, type: 'invoice' }))

            const getValue = [
                {
                    name: ["invoiceNumber"],
                    value: values.invoiceNumber
                },
                {
                    name: ["title"],
                    value: values.title
                },
                {
                    name: ["status"],
                    value: values.status
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
                                    Invoice Number
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.invoiceNumber}
                                    name="invoiceNumber"
                                    type='number'
                                    placeholder='Enter Invoice Number'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.invoiceNumber && touched.invoiceNumber && errors.invoiceNumber}</Text>
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
                                    Status
                                </FormLabel>
                                <Select
                                    value={values.status}
                                    name="status"
                                    onChange={handleChange}
                                    mb={errors.status && touched.status ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Status'}
                                    borderColor={errors.status && touched.status ? "red.300" : null}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Select>
                                <Text mb='10px' color={'red'}> {errors.status && touched.status && errors.status}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Contact Name
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
                                    Account Name
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

export default InvoiceAdvanceSearch
