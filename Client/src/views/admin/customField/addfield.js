import { DeleteIcon } from '@chakra-ui/icons'
import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { addFiledSchema } from 'schema'
import { postApi } from 'services/api'
import * as yup from 'yup'

const Addfield = (props) => {

    const { moduleId, filed, headingsData, validations } = props;

    const [isLoding, setIsLoding] = useState(false)
    const [validationType, setValidationType] = useState('')

    const handleClose = () => {
        props.onClose(false);
    }
    const initialValues = {
        label: "",
        name: "",
        type: "text",
        delete: false,
        fixed: false,
        belongsTo: null,
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
            if (values?.validation && (values.validation[1]?.min || values?.type === 'range') && values.validation[1]?.value === '') {
                errors.validation = errors.validation || [];
                errors.validation[1] = errors.validation[1] || {};
                errors.validation[1].value = 'Value is required';
            }

            if (values?.validation && (values.validation[2]?.max || values?.type === 'range') && values.validation[2]?.value === '') {
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

    const fetchAddData = async () => {
        try {
            const addDataPayload = {
                moduleId: moduleId,
                fields: [values]
            }

            let response = await postApi('api/custom-field/add', addDataPayload);
            if (response.status === 200) {
                setValidationType('')
                props.onClose()
                resetForm()
                props.fetchData()
            }
            if (!response.response.data?.success) {
                toast.error(response.response.data?.message);
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
                    <ModalCloseButton onClick={() => resetForm()} />
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
                                        onKeyDown={(e) => {
                                            if (e.code === 'Space') {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => {
                                            const newValue = e.target.value.replace(/\s/g, '');
                                            handleChange({
                                                target: {
                                                    name: 'name',
                                                    value: newValue,
                                                },
                                            });
                                        }}
                                        onBlur={handleBlur}
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
                                        onChange={(e) => {
                                            setFieldValue('type', e.target.value)
                                            setFieldValue(`validation[${4}].formikType`, e.target.value === 'date' ? 'date' : '')
                                            setFieldValue(`validation[${4}].types`, e.target.value === 'date' ? true : false)
                                        }}
                                        fontWeight='500'
                                        // placeholder={'Select Type'}
                                        borderColor={errors.type && touched.type ? "red.300" : null}
                                    >
                                        <option value='text'>Text</option>
                                        <option value='number'>Number</option>
                                        <option value='radio'>Radio</option>
                                        <option value='check'>Check</option>
                                        <option value='date'>Date</option>
                                        <option value='tel'>Tel</option>
                                        <option value='range'>Range</option>
                                        <option value='color'>Color</option>
                                        <option value='email'>Email</option>
                                        <option value='url'>Url</option>
                                        <option value='select'>Dropdown</option>
                                    </Select>
                                    <Text mb='10px' color={'red'}> {errors.type && touched.type && errors.type}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Belongs To
                                        {/* Belongs To */}
                                    </FormLabel>
                                    <Select
                                        value={values.belongsTo}
                                        name="belongsTo"
                                        onChange={(e) => {
                                            const selectedValue = e.target.value;
                                            const newValue = selectedValue === "" ? null : selectedValue;
                                            handleChange({
                                                target: {
                                                    name: "belongsTo",
                                                    value: newValue,
                                                },
                                            })
                                        }}
                                        onBlur={handleBlur}
                                        fontWeight='500'
                                        placeholder={'Select Heading'}
                                        borderColor={errors.belongsTo && touched.belongsTo ? "red.300" : null}
                                        isDisabled={headingsData?.length < 1}
                                    >
                                        {
                                            headingsData?.map(item => (
                                                <option value={item?._id} key={item?._id}>{item?.heading}</option>
                                            ))
                                        }
                                    </Select>
                                    <Text mb='10px' color={'red'}> {errors.belongsTo && touched.belongsTo && errors.belongsTo}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
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
                                        <Flex>
                                            {validations?.length > 0 && <Select
                                                value={validationType}
                                                name="validations"
                                                onChange={(e) => {
                                                    setValidationType(e.target.value)
                                                    if (e.target.value) {
                                                        const validationData = validations?.filter(item => item._id === e.target.value)
                                                        const filterData = validationData?.length > 0 ? validationData[0]?.validations : values?.validation
                                                        setFieldValue('validation', filterData)
                                                        setFieldValue('validate', true)
                                                    } else {
                                                        setFieldValue('validate', false)
                                                        setFieldValue('validation', [
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
                                                            },])
                                                    }

                                                }}
                                                me="10px"
                                                fontWeight='500'
                                                size='xs'
                                                placeholder={'Select Validation'}
                                            >
                                                {validations?.map((item, index) => (
                                                    <option key={index} value={item._id} >{item.name}</option>
                                                ))}
                                            </Select>}
                                            <Checkbox colorScheme="brandScheme" me="10px" isChecked={(values?.type === 'range' || values.validate) ? true : false} onChange={(e) => setFieldValue(`validate`, e.target.checked)} />
                                        </Flex>
                                    </Flex>
                                </GridItem>
                                {(values.validate === true || values?.type === 'range') ?
                                    <>

                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                            <Flex>
                                                <Checkbox colorScheme="brandScheme" me="10px" isChecked={values?.validation[0]?.require}
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

                                        {!(values?.type === 'radio' || values?.type === 'select' || values?.type === 'check') &&
                                            <>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                                    <Flex>
                                                        <Checkbox colorScheme="brandScheme" isChecked={(values?.validation[1]?.min || values?.type === 'range') ? true : false} name={`validation[${1}].min`} me="10px" onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            setFieldValue(`validation[${1}].min`, isChecked);
                                                            setFieldValue(
                                                                'validation[1].message',
                                                                (isChecked || values?.type === 'range') ? values?.validation[1]?.message : ''
                                                            );
                                                            setFieldValue(
                                                                'validation[1].value',
                                                                (isChecked || values?.type === 'range') ? values?.validation[1]?.value : ''
                                                            );
                                                        }} />
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                            Min
                                                        </FormLabel>
                                                    </Flex>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Value{(values.validation[1].min === true || values?.type === 'range') ? <Text color={"red"}>*</Text> : ''}
                                                    </FormLabel>
                                                    <Input
                                                        disabled={(values.validation[1].min === true || values?.type === 'range') ? false : true}
                                                        fontSize='sm'
                                                        type={values?.type === 'date' ? 'date' : 'number'}
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={(values.validation[1].min === true || values?.type === 'range') ? values.validation[1].value : ''}
                                                        name={`validation[${1}].value`}
                                                        placeholder='Enter Min Value'
                                                        fontWeight='500'
                                                        borderColor={(values.validation[1].min === true || values?.type === 'range') && errors?.validation && touched?.validation && errors?.validation[1]?.value && touched?.validation[1]?.value ? "red.300" : null}
                                                    />
                                                    {(values.validation[1].min === true || values?.type === 'range') && <Text mb='10px' color={'red'}> {errors?.validation && touched?.validation && touched?.validation[1]?.value && errors?.validation[1]?.value}</Text>}
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Message
                                                    </FormLabel>
                                                    <Input
                                                        disabled={(values.validation[1].min === true || values?.type === 'range') ? false : true}
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={values.validation[1].min === true || values?.type === 'range' ? values.validation[1].message : ''}
                                                        name={`validation[${1}].message`}
                                                        placeholder='Enter Min message'
                                                        fontWeight='500'
                                                    />
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                                    <Flex>
                                                        <Checkbox colorScheme="brandScheme" me="10px" isChecked={(values?.validation[2].max || values?.type === 'range') ? true : false} name={`validation[${2}].max`} onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            setFieldValue(`validation[${2}].max`, isChecked);
                                                            setFieldValue(
                                                                'validation[2].message',
                                                                (isChecked || values?.type === 'range') ? values?.validation[2]?.message : ''
                                                            );
                                                            setFieldValue(
                                                                'validation[2].value',
                                                                (isChecked || values?.type === 'range') ? values?.validation[2]?.value : ''
                                                            );
                                                        }} />
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                            Max
                                                        </FormLabel>
                                                    </Flex>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Value{(values.validation[2].max === true || values?.type === 'range') ? <Text color={"red"}>*</Text> : ''}
                                                    </FormLabel>
                                                    <Input
                                                        disabled={(values.validation[2].max === true || values?.type === 'range') ? false : true}
                                                        fontSize='sm'
                                                        type={values?.type === 'date' ? 'date' : 'number'}
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={(values.validation[2].max === true || values?.type === 'range') ? values.validation[2].value : ''}
                                                        name={`validation[${2}].value`}
                                                        placeholder='Enter Max Value'
                                                        fontWeight='500'
                                                        borderColor={(values.validation[2].max === true || values?.type === 'range') && errors?.validation && touched?.validation && errors?.validation[2]?.value && touched?.validation[2]?.value ? "red.300" : null}
                                                    />
                                                    {(values.validation[2].max === true || values?.type === 'range') && <Text mb='10px' color={'red'}> {errors?.validation && touched?.validation && touched?.validation[2]?.value && errors?.validation[2]?.value}</Text>}
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Message
                                                    </FormLabel>
                                                    <Input
                                                        disabled={(values.validation[2].max === true || values?.type === 'range') ? false : true}
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={(values.validation[2].max === true || values?.type === 'range') ? values.validation[2].massage : ''}
                                                        name={`validation[${2}].message`}
                                                        placeholder='Enter Max Message'
                                                        fontWeight='500'
                                                        borderColor={errors.massage && touched.massage ? "red.300" : null}
                                                    />
                                                </GridItem>

                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                                    <Flex>
                                                        <Checkbox colorScheme="brandScheme" me="10px" isChecked={values?.validation[3].match} name={`validation[${3}].match`} onChange={(e) => {
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
                                                        <Checkbox colorScheme="brandScheme" disabled={values?.type === 'date' ? true : false} isChecked={(values?.validation[4]?.types === true || values?.validation[4].formikType) ? true : false} name={`validation[${4}].types`} me="10px" onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            setFieldValue(`validation[${4}].types`, isChecked);
                                                            setFieldValue(
                                                                'validation[4].formikType',
                                                                isChecked ? values?.validation[4]?.formikType : ''
                                                            );
                                                        }} />
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                            Formik Type
                                                        </FormLabel>
                                                    </Flex>
                                                </GridItem>

                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        FormikType{(values?.validation[4]?.types === true || values?.validation[4].formikType) ? <Text color={"red"}>*</Text> : ''}
                                                    </FormLabel>
                                                    <Select
                                                        disabled={(values?.validation[4]?.types === true || values?.validation[4].formikType) ? values?.type === 'date' ? true : false : true}
                                                        value={values?.validation[4]?.types === true || values?.validation[4].formikType ? values.validation[4].formikType : ''}
                                                        name={`validation[${4}].formikType`}
                                                        onChange={handleChange}
                                                        fontWeight='500'
                                                        placeholder={'Select Type'}
                                                        borderColor={(values?.validation[4]?.types === true || values?.validation[4].formikType) && errors?.validation && touched?.validation && errors?.validation[4]?.formikType && touched?.validation[4]?.formikType ? "red.300" : null}
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
                                                    {(values?.validation[4]?.types === true || values?.validation[4].formikType) && <Text mb='10px' color={'red'}> {errors?.validation && touched?.validation && touched?.validation[4]?.formikType && errors?.validation[4]?.formikType}</Text>}
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                        Message
                                                    </FormLabel>
                                                    <Input
                                                        disabled={(values?.validation[4]?.types === true || values?.validation[4].formikType) ? false : true}
                                                        fontSize='sm'
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        value={(values?.validation[4]?.types === true || values?.validation[4].formikType) ? values.validation[3].massage : ''}
                                                        name={`validation[${4}].message`}
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
                        <Button colorScheme="brand" size="sm" mr={2} type='submit' disabled={isLoding ? true : false} onClick={handleSubmit} >{isLoding ? <Spinner /> : 'Save'}</Button>
                        <Button variant="outline"
                            colorScheme='red' size="sm"
                            sx={{
                                textTransform: "capitalize",
                            }} onClick={() => { handleClose(); resetForm(); setValidationType('') }}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Addfield
