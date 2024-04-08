import React from 'react';
import moment from 'moment';
import { useFormik } from 'formik';
import { Box, Button, Flex, FormLabel, Grid, GridItem, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text } from '@chakra-ui/react';

const AdvanceSearch = ({ handleAdvanceSearch, setAdvaceSearch, search, advaceSearch, isLoding, allData, setDisplaySearchData, setSearchedData, setGetTagValues, setSearchClear, tableCustomFields, setSearchbox }) => {

    const initialFieldValues = Object.fromEntries(
        (tableCustomFields || []).flatMap(field => {
            if (field.type === 'date') {
                return [
                    [`from${field.name}`, ''],
                    [`to${field.name}`, '']
                ];
            } else {
                return [[field?.name, '']];
            }
        })
    );

    const initialValues = {
        ...initialFieldValues
    };

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            handleAdvanceSearch(values)
            resetForm();
        }
    })
    // const formik = useFormik({
    //     initialValues: initialValues,
    //     enableReinitialize: true,
    //     onSubmit: (values, { resetForm }) => {
    //         const searchResult = allData?.filter(item => {
    //             return tableCustomFields.every(field => {
    //                 const fieldValue = values[field.name];
    //                 const itemValue = item[field.name];

    //                 if (field.type === 'select') {
    //                     return !fieldValue || itemValue === fieldValue;
    //                 }
    //                 else if (field.type === 'number') {
    //                     // return (
    //                     //     [null, undefined, ''].includes(fieldValue) ||
    //                     //     (itemValue !== undefined &&
    //                     //         (parseInt(itemValue, 10) >= parseInt(fieldValue, 10) || 0))
    //                     // );
    //                     // return (
    //                     //     [null, undefined, ''].includes(fieldValue) ||
    //                     //     (itemValue !== undefined &&
    //                     //         (parseInt(itemValue, 10) === parseInt(fieldValue, 10)))
    //                     // );
    //                     return (
    //                         [null, undefined, ''].includes(fieldValue) ||
    //                         (itemValue !== undefined &&
    //                             itemValue.toString().includes(fieldValue.toString()))
    //                     );
    //                 }
    //                 else if (field.type === 'date') {
    //                     const fromDate = values[`from${field.name}`];
    //                     const toDate = values[`to${field.name}`];

    //                     if (!fromDate && !toDate) {
    //                         return true; // No date range specified
    //                     }

    //                     const timeItemDate = new Date(itemValue);
    //                     const timeMomentDate = moment(timeItemDate).format('YYYY-MM-DD');

    //                     return (
    //                         (!fromDate || (timeMomentDate >= fromDate)) &&
    //                         (!toDate || (timeMomentDate <= toDate))
    //                     );
    //                 }
    //                 else {
    //                     // Default case for text, email
    //                     return !fieldValue || itemValue?.toLowerCase()?.includes(fieldValue?.toLowerCase());
    //                 }
    //             });
    //         });

    //         // let getValue = tableCustomFields.map(field => values[field.name]).filter(value => value);
    //         const getValue = tableCustomFields.map(field => {
    //             if (field.type === 'date') {
    //                 const fromDate = values[`from${field.name}`];
    //                 const toDate = values[`to${field.name}`];

    //                 return (fromDate || toDate) && `From: ${fromDate} To: ${toDate}`;
    //             } else {
    //                 return values[field.name];
    //             }
    //         }).filter(value => value);

    //         setGetTagValues(getValue);
    //         setSearchedData(searchResult);
    //         setDisplaySearchData(true);
    //         setAdvaceSearch(false);
    //         resetForm();
    //         if (setSearchbox) {
    //             setSearchbox('');
    //         }
    //     }
    // })

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik;

    return (
        <Modal onClose={() => { setAdvaceSearch(false); resetForm() }} isOpen={advaceSearch} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Advance Search</ModalHeader>
                <ModalCloseButton onClick={() => { setAdvaceSearch(false); resetForm(); }} />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
                        {
                            tableCustomFields?.map((field) => (
                                <GridItem colSpan={{ base: 12, sm: (field.type === 'date' ? 12 : 6) }} key={field?.name}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} htmlFor={field?.name}>
                                        {field?.label}
                                    </FormLabel>
                                    {field.type === 'select' ?
                                        <Select
                                            fontSize='sm'
                                            id={field.name}
                                            name={field.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values?.[field?.name]}
                                            fontWeight='500'
                                        // borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                        >
                                            <option value="">Select {field?.label}</option>
                                            {field.options.map(option => (
                                                <option key={option?._id} value={option?.value}>
                                                    {option?.name}
                                                </option>
                                            ))}
                                        </Select>
                                        : field.type === 'date' ? (
                                            <>
                                                <Flex justifyContent="space-between">
                                                    <Box w="49%">
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" >
                                                            From
                                                        </FormLabel>
                                                        <Input
                                                            fontSize='sm'
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values[`from${field.name}`]}
                                                            type="date"
                                                            name={`from${field.name}`}
                                                            fontWeight='500'
                                                        />
                                                    </Box>
                                                    <Box w="49%">
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0">
                                                            To
                                                        </FormLabel>
                                                        <Input
                                                            fontSize='sm'
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values[`to${field.name}`]}
                                                            type="date"
                                                            min={values[`from${field.name}`]}
                                                            name={`to${field.name}`}
                                                            fontWeight='500'
                                                        />
                                                    </Box>
                                                </Flex>
                                                {/* <Text mb='10px' color={'red'}> {errors.fromLeadScore && touched.fromLeadScore && errors.fromLeadScore}</Text> */}
                                            </>
                                        ) : <InputGroup>
                                            {/* {field.type === 'tel' && <InputLeftElement
                                                pointerEvents="none"
                                                children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                            />} */}
                                            < Input
                                                fontSize='sm'
                                                type={field.type}
                                                id={field.name}
                                                name={field.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values[field.name]}
                                                fontWeight='500'
                                                placeholder={`Enter ${field.label}`}
                                            // borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                            />
                                        </InputGroup>
                                    }
                                </GridItem>
                            ))
                        }
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
