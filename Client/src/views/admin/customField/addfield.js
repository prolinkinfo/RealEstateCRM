import { DeleteIcon } from '@chakra-ui/icons'
import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { addFiledSchema } from 'schema'
import { postApi } from 'services/api'
import * as yup from 'yup'



const Addfield = (props) => {

    const { moduleId, filed } = props;

    const [isLoding, setIsLoding] = useState(false)
    const [data, setData] = useState([])

    const handleClose = () => {
        props.onClose(false);
    }
    const initialValues = {
        label: "",
        name: "",
        type: "",
        delete: false,
        fixed: false,
        options: [{
            name: '',
            value: ''
        }, {
            name: '',
            value: ''
        }],
        validate: false,
        validation: [
            {
                require: false,
                message: "",
            },
            {
                min: false,
                value: "",
                message: "",
            },
            {
                max: false,
                value: "",
                message: "",
            },
            {
                match: false,
                value: "",
                message: "",
            },
            {
                types: false,
                formikType: '',
                message: "",
            },
        ],
    };



    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: addFiledSchema,
        validate: (values) => {
            const errors = {};

            if (values?.validation && values.validation[1]?.min && !values.validation[1]?.value) {
                errors.validation = errors.validation || [];
                errors.validation[1] = errors.validation[1] || {};
                errors.validation[1].value = 'Value is required';
            }
            if (values?.validation && values.validation[2]?.max && !values.validation[2]?.value) {
                errors.validation = errors.validation || [];
                errors.validation[2] = errors.validation[2] || {};
                errors.validation[2].value = 'Value is required';
            }
            if (values?.validation && values.validation[3]?.match && !values.validation[3]?.value) {
                errors.validation = errors.validation || [];
                errors.validation[3] = errors.validation[3] || {};
                errors.validation[3].value = 'Value is required';
            }
            if (values?.validation && values.validation[3]?.match && !values.validation[3]?.message) {
                errors.validation = errors.validation || [];
                errors.validation[3] = errors.validation[3] || {};
                errors.validation[3].message = 'Meassage is required';
            }
            if (values?.validation && values.validation[4]?.types && !values.validation[4]?.formikType) {
                errors.validation = errors.validation || [];
                errors.validation[4] = errors.validation[4] || {};
                errors.validation[4].formikType = 'FormikType is required';
            }
            if (values?.options && (values?.type === 'radio' || values?.type === 'select')) {

                values?.options?.forEach((option, index) => {
                    if (!option.name) {
                        if (!errors.options) {
                            errors.options = [];
                        }
                        if (!errors.options[index]) {
                            errors.options[index] = {};
                        }
                        errors.options[index].name = 'Name is required';
                    }
                    if (!option.value) {
                        if (!errors.options) {
                            errors.options = [];
                        }
                        if (!errors.options[index]) {
                            errors.options[index] = {};
                        }
                        errors.options[index].value = 'Value is required';
                    }
                });
            }
            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            fetchAddData()
            resetForm()
        },
    });

    const handleAddOption = () => {
        formik.setFieldValue('options', [...formik.values.options, { name: '', value: '' }]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...formik.values.options];
        newOptions.splice(index, 1);
        formik.setFieldValue('options', newOptions);
    };

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    console.log(errors)

    const fetchAddData = async () => {
        try {
            const addDataPayload = {
                moduleId: moduleId,
                fields: [values]
            }

            let response = await postApi('api/custom-field/add', addDataPayload);
            if (response.status === 200) {
                props.onClose()
                props.fetchData()
            }
        }
        catch {
        }
        finally {
        }
    }

    return (
        <div>
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent maxWidth={"2xl"}>
                    <ModalHeader>Add Field</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Label<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.label}
                                        name="label"
                                        placeholder={`Enter Label`}
                                        fontWeight='500'
                                        borderColor={errors.label && touched.label ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.label && touched.label && errors.label}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Name<Text color={"red"}>*</Text>
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
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Type
                                    </FormLabel>
                                    <Select
                                        value={values.type}
                                        name="type"
                                        onChange={handleChange}
                                        fontWeight='500'
                                        placeholder={'Select Type'}
                                        borderColor={errors.type && touched.type ? "red.300" : null}
                                    >
                                        <option value='text'>Text</option>
                                        <option value='number'>Number</option>
                                        <option value='radio'>Radio</option>
                                        <option value='check'>Check</option>
                                        <option value='date'>Date</option>
                                        <option value='email'>Email</option>
                                        <option value='select'>Select</option>
                                    </Select>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 6 }}>
                                    <Flex alignItems='center'>

                                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' mb={0}>
                                            Fixed
                                        </FormLabel>
                                        <Checkbox colorScheme="brandScheme" me="10px" onChange={(e) => setFieldValue(`fixed`, e.target.checked)} />
                                    </Flex>
                                </GridItem>
                                {(values?.type === 'radio' || values?.type === 'select') ? <>
                                    <GridItem colSpan={{ base: 12, sm: 12, md: 12 }} borderBottom={'1px solid rgba(128, 128, 128, 0.705)'}>
                                        <Flex justifyContent={'space-between'} alignItems={'center'} mb={'8px'} >
                                            <Heading as="h1" size="md" >
                                                Option
                                            </Heading>
                                            <Button size="sm" variant="brand" onClick={() => handleAddOption()}>Add</Button>
                                        </Flex>
                                    </GridItem>
                                    {
                                        values?.options?.map((option, index) => (
                                            <>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 5 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Name
                                                    </FormLabel>
                                                    <Input
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.options[index]?.name}
                                                        name={`options[${index}].name`}
                                                        placeholder='Enter Name'
                                                        fontWeight='500'
                                                        borderColor={errors?.options && touched?.options && errors?.options[index]?.name && touched?.options[index]?.name ? "red.300" : null}
                                                    />
                                                    <Text mb='10px' color={'red'}> {errors?.options && touched?.options && touched?.options[index]?.name && errors?.options[index]?.name}</Text>

                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 5 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Value
                                                    </FormLabel>
                                                    <Input
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.options[index]?.value}
                                                        name={`options[${index}].value`}
                                                        placeholder='Enter Value'
                                                        fontWeight='500'
                                                        borderColor={errors?.options && touched?.options && errors?.options[index]?.value && touched?.options[index]?.value ? "red.300" : null}
                                                    />
                                                    <Text mb='10px' color={'red'}> {errors?.options && touched?.options && touched?.options[index]?.value && errors?.options[index]?.value}</Text>
                                                </GridItem>
                                                {values?.options?.length > 2 ? <GridItem colSpan={{ base: 12, sm: 6, md: 2 }}>
                                                    <DeleteIcon onClick={() => handleRemoveOption(index)} color={'red'} cursor={'pointer'} mt={'2.5rem'} ms={'60px'} />
                                                </GridItem> : <GridItem colSpan={{ base: 12, sm: 6, md: 2 }}>
                                                    <DeleteIcon color={'gray'} mt={'2.5rem'} ms={'60px'} />
                                                </GridItem>}
                                            </>
                                        ))
                                    }

                                </> : ''}
                                <GridItem colSpan={{ base: 12 }} borderBottom={'1px solid rgba(128, 128, 128, 0.705)'}>
                                    <Flex alignItems="center" justifyContent={"space-between"} mb={'8px'}>
                                        <Heading as="h1" size="md" >
                                            Validation
                                        </Heading>
                                        <Checkbox colorScheme="brandScheme" me="10px" onChange={(e) => setFieldValue(`validate`, e.target.checked)} />
                                    </Flex>
                                </GridItem>
                                {values.validate === true ?
                                    <>
                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                            <Flex>
                                                <Checkbox colorScheme="brandScheme" me="10px"
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setFieldValue(`validation[${0}].require`, isChecked);
                                                        setFieldValue(
                                                            'validation[0].message',
                                                            isChecked ? values?.validation[0]?.message : ''
                                                        );
                                                    }}
                                                />
                                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                    Require
                                                </FormLabel>
                                            </Flex>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 12, md: 8 }}>
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Message
                                            </FormLabel>
                                            <Input
                                                disabled={values?.validation[0]?.require === true ? false : true}
                                                fontSize='sm'
                                                onChange={handleChange} onBlur={handleBlur}
                                                value={values?.validation[0]?.require === true ? values?.validation[0]?.message : ''}
                                                name={`validation[${0}].message`}
                                                placeholder='Enter Require  message'
                                                fontWeight='500'
                                            />
                                        </GridItem>
                                        {!(values?.type === 'radio' || values?.type === 'select') &&
                                            <>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                                    <Flex>
                                                        <Checkbox colorScheme="brandScheme" name={`validation[${1}].min`} me="10px" onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            setFieldValue(`validation[${1}].min`, isChecked);
                                                            setFieldValue(
                                                                'validation[1].message',
                                                                isChecked ? values?.validation[1]?.message : ''
                                                            );
                                                            setFieldValue(
                                                                'validation[1].value',
                                                                isChecked ? values?.validation[1]?.value : ''
                                                            );
                                                        }} />
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                            Min
                                                        </FormLabel>
                                                    </Flex>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Value{values.validation[1].min === true ? <Text color={"red"}>*</Text> : ''}
                                                    </FormLabel>
                                                    <Input
                                                        disabled={values.validation[1].min === true ? false : true}
                                                        fontSize='sm'
                                                        type='number'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.validation[1].min === true ? values.validation[1].value : ''}
                                                        name={`validation[${1}].value`}
                                                        placeholder='Enter Min Value'
                                                        fontWeight='500'
                                                        borderColor={values.validation[1].min === true && errors?.validation && touched?.validation && errors?.validation[1]?.value && touched?.validation[1]?.value ? "red.300" : null}
                                                    />
                                                    {values.validation[1].min === true && <Text mb='10px' color={'red'}> {errors?.validation && touched?.validation && touched?.validation[1]?.value && errors?.validation[1]?.value}</Text>}
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Message
                                                    </FormLabel>
                                                    <Input
                                                        disabled={values.validation[1].min === true ? false : true}
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.validation[1].min === true ? values.validation[1].message : ''}
                                                        name={`validation[${1}].message`}
                                                        placeholder='Enter Min message'
                                                        fontWeight='500'
                                                    />
                                                </GridItem>

                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                                    <Flex>
                                                        <Checkbox colorScheme="brandScheme" me="10px" name={`validation[${2}].max`} onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            setFieldValue(`validation[${2}].max`, isChecked);
                                                            setFieldValue(
                                                                'validation[2].message',
                                                                isChecked ? values?.validation[2]?.message : ''
                                                            );
                                                            setFieldValue(
                                                                'validation[2].value',
                                                                isChecked ? values?.validation[2]?.value : ''
                                                            );
                                                        }} />
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                            Max
                                                        </FormLabel>
                                                    </Flex>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Value{values.validation[2].max === true ? <Text color={"red"}>*</Text> : ''}
                                                    </FormLabel>
                                                    <Input
                                                        disabled={values.validation[2].max === true ? false : true}
                                                        fontSize='sm'
                                                        type='number'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.validation[2].max === true ? values.validation[2].value : ''}
                                                        name={`validation[${2}].value`}
                                                        placeholder='Enter Max Value'
                                                        fontWeight='500'
                                                        borderColor={values.validation[2].max === true && errors?.validation && touched?.validation && errors?.validation[2]?.value && touched?.validation[2]?.value ? "red.300" : null}
                                                    />
                                                    {values.validation[2].max === true && <Text mb='10px' color={'red'}> {errors?.validation && touched?.validation && touched?.validation[2]?.value && errors?.validation[2]?.value}</Text>}
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Message
                                                    </FormLabel>
                                                    <Input
                                                        disabled={values.validation[2].max === true ? false : true}
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.validation[2].max === true ? values.validation[2].massage : ''}
                                                        name={`validation[${2}].message`}
                                                        placeholder='Enter Max Message'
                                                        fontWeight='500'
                                                        borderColor={errors.massage && touched.massage ? "red.300" : null}
                                                    />
                                                </GridItem>

                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                                    <Flex>
                                                        <Checkbox colorScheme="brandScheme" me="10px" name={`validation[${3}].match`} onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            setFieldValue(`validation[${3}].match`, isChecked);
                                                            setFieldValue(
                                                                'validation[3].message',
                                                                isChecked ? values?.validation[3]?.message : ''
                                                            );
                                                            setFieldValue(
                                                                'validation[3].value',
                                                                isChecked ? values?.validation[3]?.value : ''
                                                            );
                                                        }} />
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                            Match
                                                        </FormLabel>
                                                    </Flex>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Value{values.validation[3].match === true ? <Text color={"red"}>*</Text> : ''}
                                                    </FormLabel>
                                                    <Input
                                                        disabled={values.validation[3].match === true ? false : true}
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.validation[3].match === true ? values.validation[3].value : ''}
                                                        name={`validation[${3}].value`}
                                                        placeholder='Enter Match Value'
                                                        fontWeight='500'
                                                        borderColor={values.validation[3].match === true && errors?.validation && touched?.validation && errors?.validation[3]?.value && touched?.validation[3]?.value ? "red.300" : null}
                                                    />
                                                    {values.validation[3].match === true && <Text mb='10px' color={'red'}> {errors?.validation && touched?.validation && touched?.validation[3]?.value && errors?.validation[3]?.value}</Text>}
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Message{values.validation[3].match === true ? <Text color={"red"}>*</Text> : ''}
                                                    </FormLabel>
                                                    <Input
                                                        disabled={values.validation[3].match === true ? false : true}
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.validation[3].match === true ? values.validation[3].massage : ''}
                                                        name={`validation[${3}].message`}
                                                        placeholder='Enter Match Message'
                                                        fontWeight='500'
                                                        borderColor={values.validation[3].match === true && errors?.validation && touched?.validation && errors?.validation[3]?.message && touched?.validation[3]?.message ? "red.300" : null}
                                                    />
                                                    {values.validation[3].match === true && <Text mb='10px' color={'red'}> {errors?.validation && touched?.validation && touched?.validation[3]?.message && errors?.validation[3]?.message}</Text>}
                                                </GridItem>

                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                                    <Flex>
                                                        <Checkbox colorScheme="brandScheme" name={`validation[${4}].types`} me="10px" onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            setFieldValue(`validation[${4}].types`, isChecked);
                                                            setFieldValue(
                                                                'validation[4].message',
                                                                isChecked ? values?.validation[4]?.message : ''
                                                            );
                                                            setFieldValue(
                                                                'validation[4].value',
                                                                isChecked ? values?.validation[4]?.value : ''
                                                            );
                                                        }} />
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                            Formik Type
                                                        </FormLabel>
                                                    </Flex>
                                                </GridItem>

                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        FormikType{values.validation[4].types === true ? <Text color={"red"}>*</Text> : ''}
                                                    </FormLabel>
                                                    <Select
                                                        disabled={values?.validation[4]?.types === true ? false : true}
                                                        value={values?.validation[4]?.types === true ? values.validation[4].formikType : ''}
                                                        name={`validation[${4}].formikType`}
                                                        onChange={handleChange}
                                                        fontWeight='500'
                                                        placeholder={'Select Type'}
                                                        borderColor={values?.validation[4]?.types === true && errors?.validation && touched?.validation && errors?.validation[4]?.formikType && touched?.validation[4]?.formikType ? "red.300" : null}
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
                                                    {values?.validation[4]?.types === true && <Text mb='10px' color={'red'}> {errors?.validation && touched?.validation && touched?.validation[4]?.formikType && errors?.validation[4]?.formikType}</Text>}
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Message
                                                    </FormLabel>
                                                    <Input
                                                        disabled={values?.validation[4]?.types === true ? false : true}
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values?.validation[4]?.types === true ? values.validation[3].massage : ''}
                                                        name={`validation[${3}].message`}
                                                        placeholder='Enter Formik Type Message'
                                                        fontWeight='500'
                                                    />
                                                </GridItem>
                                            </>
                                        }

                                    </>
                                    :
                                    ""}
                            </Grid>
                        </>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" size="sm" mr={2} type='submit' disabled={isLoding ? true : false} onClick={handleSubmit} >{isLoding ? <Spinner /> : 'Add'}</Button>
                        <Button variant="outline" size="sm" onClick={() => { handleClose(); resetForm() }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Addfield
