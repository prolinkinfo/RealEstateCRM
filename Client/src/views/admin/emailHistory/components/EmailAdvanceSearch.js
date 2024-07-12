import React from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Grid, GridItem, Input, FormLabel, Select, Text, Button, } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { setSearchValue, getSearchData, setGetTagValues } from '../../../../redux/slices/advanceSearchSlice';
import { useDispatch } from 'react-redux';



const EmailAdvanceSearch = (props) => {
    const { state, allData, advanceSearch, setAdvanceSearch, isLoding, setSearchedData, setDisplaySearchData, setSearchClear, setSearchbox } = props;

    const dispatch = useDispatch();
    const initialValues = {
        senderName: '',
        realetedTo: '',
        createByName: '',
    }
    const validationSchema = yup.object({
        senderName: yup.string(),
        realetedTo: yup.string(),
        createByName: yup.string()
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            dispatch(setSearchValue(values))
            dispatch(getSearchData({ values: values, allData: allData, type: 'Email' }))
            // const searchResult = allData?.filter(
            //     (item) =>
            //         (!values?.senderName || (item?.senderName && item?.senderName.toLowerCase().includes(values?.senderName?.toLowerCase()))) &&
            //         (!values?.realetedTo || (values.realetedTo === "contact" ? item.createBy : item.createByLead)) &&
            //         (!values?.createByName || (item?.createByName && item?.createByName.toLowerCase().includes(values?.createByName?.toLowerCase())))
            // )
            // let getValue = [values.senderName, values?.realetedTo, values?.createByName].filter(value => value);
            const getValue = [
                {
                    name: ["senderName"],
                    value: values.senderName
                },
                {
                    name: ["realetedTo"],
                    value: values.realetedTo
                },
                {
                    name: ["createByName"],
                    value: values.createByName
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
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Sender Name
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.senderName}
                                    name="senderName"
                                    placeholder='Enter Sender Name'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.senderName && touched.senderName && errors.senderName}</Text>

                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Realeted To
                                </FormLabel>
                                <Select
                                    value={values?.realetedTo}
                                    fontSize='sm'
                                    name="realetedTo"
                                    onChange={handleChange}
                                    fontWeight='500'
                                    placeholder={'Select Realeted To'}
                                >
                                    <option value='contact'>Contact</option>
                                    <option value='lead'>Lead</option>
                                </Select>
                                <Text mb='10px' color={'red'}> {errors.realetedTo && touched.realetedTo && errors.realetedTo}</Text>

                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                                    CreateBy Name
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.createByName}
                                    name="createByName"
                                    placeholder='Enter CreateBy Name'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.createByName && touched.createByName && errors.createByName}</Text>
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

export default EmailAdvanceSearch
