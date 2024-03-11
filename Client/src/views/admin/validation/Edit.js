import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { HSeparator } from 'components/separator/Separator'
import { putApi } from 'services/api'
import { validationAddSchema } from 'schema/validationAddSchema'



const Edit = (props) => {
    const { onClose, isOpen, fetchData, selectedId, editdata, setAction, fetchViewData } = props;
    const [isLoding, setIsLoding] = useState(false)

    const initialValues = {
        name: editdata.name ? editdata.name : "",
        validations: [
            {
                require: editdata?.validations ? editdata?.validations[0]?.require : '',
                message: editdata?.validations ? editdata?.validations[0]?.message : '',
            },
            {
                min: editdata?.validations ? editdata?.validations[1]?.min : '',
                value: editdata?.validations ? editdata?.validations[1]?.value : '',
                message: editdata?.validations ? editdata?.validations[1]?.message : '',
            },
            {
                max: editdata?.validations ? editdata?.validations[2]?.max : '',
                value: editdata?.validations ? editdata?.validations[2]?.value : '',
                message: editdata?.validations ? editdata?.validations[2]?.message : '',
            },
            {
                match: editdata?.validations ? editdata?.validations[3]?.match : '',
                value: editdata?.validations ? editdata?.validations[3]?.value : '',
                message: editdata?.validations ? editdata?.validations[3]?.message : '',
            },
            {
                types: editdata?.validations ? editdata?.validations[4]?.formikType ? true : false : '',
                formikType: editdata?.validations ? editdata?.validations[4]?.formikType : '',
                message: editdata?.validations ? editdata?.validations[4]?.message : '',
            },
        ],
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationAddSchema,
        enableReinitialize: true,
        validate: (values) => {
            const errors = {};

            if (values?.validations && values.validations[0]?.require && !values.validations[0]?.message) {
                errors.validations = errors.validations || [];
                errors.validations[0] = errors.validations[0] || {};
                errors.validations[0].message = 'Message is required';
            }
            if (values?.validations && values.validations[1]?.min && !values.validations[1]?.value) {
                errors.validations = errors.validations || [];
                errors.validations[1] = errors.validations[1] || {};
                errors.validations[1].value = 'Value is required';
            }
            if (values?.validations && values.validations[2]?.max && !values.validations[2]?.value) {
                errors.validations = errors.validations || [];
                errors.validations[2] = errors.validations[2] || {};
                errors.validations[2].value = 'Value is required';
            }
            if (values?.validations && values.validations[3]?.match && !values.validations[3]?.value && !values.validations[3]?.message) {
                errors.validations = errors.validations || [];
                errors.validations[3] = errors.validations[3] || {};
                errors.validations[3].value = 'Value is required';
                errors.validations[3].message = 'Meassage is required';
            }
            if (values?.validations && values.validations[4]?.types && !values.validations[4]?.formikType) {
                errors.validations = errors.validations || [];
                errors.validations[4] = errors.validations[4] || {};
                errors.validations[4].formikType = 'FormikType is required';
            }
            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            EditData()
            resetForm()
        },
    });

    const EditData = async () => {
        try {

            let response = await putApi(`api/validation/edit/${selectedId}`, values);
            if (response.status === 200) {
                onClose()
                fetchData()
                if (fetchViewData) {
                    fetchViewData()
                }
                setAction((pre) => !pre)
            }
        }
        catch {
        }
        finally {
        }
    }

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik
    return (
        <div>
            <Modal onClose={onClose} isOpen={isOpen} isCentered size='2xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit </ModalHeader>
                    <ModalCloseButton />
                    <HSeparator />
                    <ModalBody>
                        <>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Name
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.name}
                                        name="name"
                                        placeholder='Enter Name'
                                        fontWeight='500'
                                        borderColor={errors.name && touched.name ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.name && touched.name && errors.name}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <Flex >
                                        <FormLabel display='flex' ms='4px' fontSize='lg' fontWeight='600' mb="0">
                                            Validations
                                        </FormLabel>
                                    </Flex>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                    <Flex>
                                        <Checkbox colorScheme="brandScheme" me="10px" isChecked={values?.validations[0]?.require}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setFieldValue(`validations[${0}].require`, isChecked);
                                                setFieldValue(
                                                    'validations[0].message',
                                                    isChecked ? values?.validations[0]?.message : ''
                                                );
                                            }}
                                        />
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Require
                                        </FormLabel>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 8 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Message
                                    </FormLabel>
                                    <Input
                                        disabled={values?.validations[0]?.require === true ? false : true}
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values?.validations[0]?.message}
                                        name={`validations[${0}].message`}
                                        placeholder='Enter message'
                                        fontWeight='500'
                                        borderColor={errors?.validations && touched?.validations && errors?.validations[0]?.message && touched?.validations[0]?.message ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors?.validations && touched?.validations && touched?.validations[0]?.message && errors?.validations[0]?.message}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                    <Flex>
                                        <Checkbox colorScheme="brandScheme" isChecked={values?.validations[1]?.min} onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setFieldValue(`validations[${1}].min`, isChecked);
                                            setFieldValue(
                                                'validations[1].message',
                                                (isChecked) ? values?.validations[1]?.message : ''
                                            );
                                            setFieldValue(
                                                'validations[1].value',
                                                (isChecked) ? values?.validations[1]?.value : ''
                                            )
                                        }} />
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Min
                                        </FormLabel>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Value
                                    </FormLabel>
                                    <Input
                                        disabled={values.validations[1].min === true ? false : true}
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.validations[1].value}
                                        name={`validations[${1}].value`}
                                        placeholder='Enter Min Value'
                                        fontWeight='500'
                                        borderColor={errors?.validations && touched?.validations && errors?.validations[1]?.value && touched?.validations[1]?.value ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors?.validations && touched?.validations && touched?.validations[1]?.value && errors?.validations[1]?.value}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Message
                                    </FormLabel>
                                    <Input
                                        disabled={values.validations[1].min === true ? false : true}
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.validations[1].message}
                                        name={`validations[${1}].message`}
                                        placeholder='Enter Min message'
                                        fontWeight='500'
                                    />
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                    <Flex>
                                        <Checkbox colorScheme="brandScheme" isChecked={values?.validations[1]?.max} onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setFieldValue(`validations[${2}].max`, isChecked);
                                            setFieldValue(
                                                'validations[2].message',
                                                isChecked ? values?.validations[2]?.message : ''
                                            );
                                            setFieldValue(
                                                'validations[2].value',
                                                isChecked ? values?.validations[2]?.value : ''
                                            )
                                        }} />
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Max
                                        </FormLabel>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Value
                                    </FormLabel>
                                    <Input
                                        disabled={values.validations[2].max === true ? false : true}
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.validations[2].value}
                                        name={`validations[${2}].value`}
                                        placeholder='Enter Max Value'
                                        fontWeight='500'
                                        borderColor={errors?.validations && touched?.validations && errors?.validations[2]?.value && touched?.validations[2]?.value ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors?.validations && touched?.validations && touched?.validations[2]?.value && errors?.validations[2]?.value}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Message
                                    </FormLabel>
                                    <Input
                                        disabled={values.validations[2].max === true ? false : true}
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.validations[2].massage}
                                        name={`validations[${2}].message`}
                                        placeholder='Enter Max Message'
                                        fontWeight='500'
                                        borderColor={errors.massage && touched.massage ? "red.300" : null}
                                    />
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                    <Flex>
                                        <Checkbox colorScheme="brandScheme" isChecked={values?.validations[3]?.match} me="10px" name={`validations[${3}].match`} onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setFieldValue(`validations[${3}].match`, isChecked);
                                            setFieldValue(
                                                'validations[3].message',
                                                isChecked ? values?.validations[3]?.message : ''
                                            );
                                            setFieldValue(
                                                'validations[3].value',
                                                isChecked ? values?.validations[3]?.value : ''
                                            );
                                        }} />
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Match
                                        </FormLabel>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Value
                                    </FormLabel>
                                    <Input
                                        disabled={values.validations[3].match === true ? false : true}
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.validations[3].value}
                                        name={`validations[${3}].value`}
                                        placeholder='Enter Max Value'
                                        fontWeight='500'
                                        borderColor={errors?.validations && touched?.validations && errors?.validations[3]?.value && touched?.validations[3]?.value ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors?.validations && touched?.validations && touched?.validations[3]?.value && errors?.validations[3]?.value}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Message
                                    </FormLabel>
                                    <Input
                                        disabled={values.validations[3].match === true ? false : true}
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.validations[3].massage}
                                        name={`validations[${3}].message`}
                                        placeholder='Enter Match Message'
                                        fontWeight='500'
                                        borderColor={errors?.validations && touched?.validations && errors?.validations[3]?.message && touched?.validations[3]?.message ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors?.validations && touched?.validations && touched?.validations[3]?.message && errors?.validations[3]?.message}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                    <Flex>
                                        <Checkbox colorScheme="brandScheme" isChecked={values.validations[4].types} name={`validations[${4}].types`} me="10px" onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setFieldValue(`validations[${4}].types`, isChecked);
                                            setFieldValue(
                                                'validations[4].formikType',
                                                isChecked ? values?.validations[4]?.formikType : ''
                                            );
                                            setFieldValue(
                                                'validations[4].message',
                                                isChecked ? values?.validations[4]?.message : ''
                                            );
                                        }} />
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Formik Type
                                        </FormLabel>
                                    </Flex>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        FormikType
                                    </FormLabel>
                                    <Select
                                        disabled={values?.validations[4]?.types === true ? false : true}
                                        value={values.validations[4].formikType}
                                        name={`validations[${4}].formikType`}
                                        onChange={handleChange}
                                        fontWeight='500'
                                        placeholder={'Select Type'}
                                        borderColor={errors?.validations && touched?.validations && errors?.validations[4]?.formikType && touched?.validations[4]?.formikType ? "red.300" : null}
                                    >
                                        <option value='string'>String </option>
                                        <option value='email'>Email </option>
                                        <option value='date'>Date </option>
                                        <option value='number'>Number </option>
                                        <option value='object'>Object </option>
                                        <option value='array'>Array </option>
                                        <option value='url'>Url </option>
                                        <option value='boolean'>Boolean </option>
                                        <option value='positive'>Positive </option>
                                        <option value='negative'>Negative  </option>
                                        <option value='integer'>Integer  </option>
                                    </Select>
                                    <Text mb='10px' color={'red'}> {errors?.validations && touched?.validations && touched?.validations[4]?.formikType && errors?.validations[4]?.formikType}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Message
                                    </FormLabel>
                                    <Input
                                        disabled={values?.validations[4]?.types === true ? false : true}
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.validations[4].massage}
                                        name={`validations[${3}].message`}
                                        placeholder='Enter Formik Type Message'
                                        fontWeight='500'
                                        borderColor={errors?.validations && touched?.validations && errors?.validations[3]?.message && touched?.validations[3]?.message ? "red.300" : null}
                                    />
                                    {/* <Text mb='10px' color={'red'}> {errors?.validations && touched?.validations && touched?.validations[3]?.message && errors?.validations[3]?.message}</Text> */}
                                </GridItem>

                            </Grid>
                        </>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" size='sm' mr={2} disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Update'}</Button>
                        <Button sx={{
                            textTransform: "capitalize",
                        }} variant="outline"
                            colorScheme="red" size="sm" onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Edit
