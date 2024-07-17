import React from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Grid, GridItem, Input, FormLabel, Select, Text, Button, } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { setSearchValue, getSearchData, setGetTagValues } from '../../../../redux/slices/advanceSearchSlice';
import { useDispatch } from 'react-redux';



const OpprtunityAdvanceSearch = (props) => {
    const { state, allData, advanceSearch, setAdvanceSearch, isLoding, setSearchedData, setDisplaySearchData, setSearchClear, setSearchbox } = props;

    const dispatch = useDispatch();
    const initialValues = {
        name: '',
        officePhone: '',
        fax: '',
        emailAddress: '',
    }
    const validationSchema = yup.object({
        name: yup.string(),
        officePhone: yup.string(),
        fax: yup.string(),
        emailAddress: yup.string()
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            dispatch(setSearchValue(values))
            dispatch(getSearchData({ values: values, allData: allData, type: 'Account' }))
            // const searchResult = allData?.filter(
            //     (item) =>
            //         (!values?.senderName || (item?.senderName && item?.senderName.toLowerCase().includes(values?.senderName?.toLowerCase()))) &&
            //         (!values?.realetedTo || (values.realetedTo === "contact" ? item.createBy : item.createByLead)) &&
            //         (!values?.createByName || (item?.createByName && item?.createByName.toLowerCase().includes(values?.createByName?.toLowerCase())))
            // )
            // let getValue = [values.senderName, values?.realetedTo, values?.createByName].filter(value => value);
            const getValue = [
                {
                    name: ["name"],
                    value: values.name
                },
                {
                    name: ["officePhone"],
                    value: values.officePhone
                },
                {
                    name: ["fax"],
                    value: values.fax
                },
                {
                    name: ["emailAddress"],
                    value: values.emailAddress
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
                                    Account Name
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.name}
                                    name="name"
                                    placeholder='Enter Account Name'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.name && touched.name && errors.name}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Office Phone
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.officePhone}
                                    name="officePhone"
                                    type="number"
                                    placeholder='Enter Office Phone'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.officePhone && touched.officePhone && errors.officePhone}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Fax
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.fax}
                                    name="fax"
                                    placeholder='Enter Fax'
                                    type="number"
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.fax && touched.fax && errors.fax}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Email Address
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.emailAddress}
                                    name="emailAddress"
                                    placeholder='Enter Email Address'
                                    type="email"
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.emailAddress && touched.emailAddress && errors.emailAddress}</Text>
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

export default OpprtunityAdvanceSearch
