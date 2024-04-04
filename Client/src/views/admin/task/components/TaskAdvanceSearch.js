import React from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Grid, GridItem, Input, FormLabel, Select, Text, Button, } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';



const TaskAdvanceSearch = (props) => {
    const { state, allData, advanceSearch, setAdvanceSearch, isLoding, setGetTagValues, setSearchedData, setDisplaySearchData, setSearchClear, setSearchbox } = props;

    const initialValues = {
        title: '',
        category: '',
        start: '',
        end: '',
        status: '',
        leadAddress: '',
        assignmentToName: '',
        fromLeadScore: '',
        toLeadScore: ''
    }
    const validationSchema = yup.object({
        title: yup.string(),
        category: yup.string(),
        start: yup.date(),
        end: yup.date(),
        leadAddress: yup.string(),
        assignmentToName: yup.string(),
        fromLeadScore: yup.number().min(0, "From Lead Score is invalid"),
        toLeadScore: yup.number().min(yup.ref('fromLeadScore'), "To Lead Score must be greater than or equal to From Lead Score")
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            const searchResult = allData?.filter(
                (item) => {

                    return ((!values?.title || (item?.title && item?.title.toLowerCase().includes(values?.title?.toLowerCase()))) &&
                        (!values.status || (item?.status && item?.status.toLowerCase().includes(values.status?.toLowerCase()))) &&
                        (!values?.category || (item?.category && item?.category.toLowerCase().includes(values?.category?.toLowerCase()))) &&
                        (!values?.start || (item?.start && item?.start.toLowerCase().includes(values?.start?.toLowerCase()))) &&
                        (!values?.end || (item?.end && item?.end.toString().includes(values?.end))) &&
                        (!values?.assignmentToName || (item?.assignmentToName && item?.assignmentToName.toLowerCase().includes(values?.assignmentToName?.toLowerCase()))) &&
                        ([null, undefined, ''].includes(values?.fromLeadScore) || [null, undefined, ''].includes(values?.toLeadScore) ||
                            ((item?.leadScore || item?.leadScore === 0) &&
                                (parseInt(item?.leadScore, 10) >= parseInt(values.fromLeadScore, 10) || 0) &&
                                (parseInt(item?.leadScore, 10) <= parseInt(values.toLeadScore, 10) || 0)))
                    )
                });
            let getValue = [values.title, values?.category, values.status, state && state, values?.start, values?.end, values?.assignmentToName, (![null, undefined, ''].includes(values?.fromLeadScore) && `${values.fromLeadScore}-${values.toLeadScore}`) || undefined].filter(value => value);
            setGetTagValues(getValue)
            setSearchedData(searchResult);
            setDisplaySearchData(true);
            setAdvanceSearch(false);
            resetForm();
            setSearchbox('');
        }
    });

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
                                    value={values?.status}
                                    fontSize='sm'
                                    name="status"
                                    onChange={handleChange}
                                    fontWeight='500'
                                >
                                    {!state && <option value=''>Select Status</option>}
                                    <option value='completed'>Completed</option>
                                    <option value='todo'>Todo</option>
                                    <option value='pending'>Pending</option>
                                    <option value='inProgress'>In Progress</option>
                                    <option value='onHold'>On Hold</option>
                                </Select>
                                <Text mb='10px' color={'red'}> {errors.status && touched.status && errors.status}</Text>

                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Related
                                </FormLabel>
                                <Select
                                    value={values?.category}
                                    fontSize='sm'
                                    name="category"
                                    onChange={handleChange}
                                    fontWeight='500'
                                    placeholder={'Select Category'}
                                >
                                    <option value='contact'>Contact</option>
                                    <option value='lead'>Lead</option>
                                    <option value='none'>None</option>
                                </Select>

                                <Text mb='10px' color={'red'}> {errors.category && touched.category && errors.category}</Text>

                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Assignment To
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.assignmentToName}
                                    name="assignmentToName"
                                    placeholder='Enter Assignment To'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.assignmentToName && touched.assignmentToName && errors.assignmentToName}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                                    Start Date
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.start}
                                    name="start"
                                    type="date"
                                    placeholder='Enter Start Date'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.start && touched.start && errors.start}</Text>

                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    End Date
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    type="date"
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values?.end}
                                    min={values?.start}
                                    name="end"
                                    placeholder='Enter  End Date'
                                    fontWeight='500'
                                />
                                <Text mb='10px' color={'red'}> {errors.end && touched.end && errors.end}</Text>

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

export default TaskAdvanceSearch
