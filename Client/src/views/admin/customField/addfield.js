import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { addFiledSchema } from 'schema'
import { postApi } from 'services/api'
import * as yup from 'yup'



const Addfield = (props) => {

    const { moduleId, filed } = props;

    const [isLoding, setIsLoding] = useState(false)
    // const [validation, setValidation] = useState(false)
    // const [requiredChecked, setRequired] = useState(false)
    // const [minChecked, setmin] = useState(false)
    // const [maxChecked, setMax] = useState(false)
    const [data, setData] = useState([])

    const handleClose = () => {
        props.onClose(false);
    }
    const initialValues = {
        name: "",
        label: "",
        type: "",
        delete: false,
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
        ],
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: addFiledSchema,
        validate: (values) => {
            const errors = {};

            if (values?.validation && values.validation[0]?.require && !values.validation[0]?.message) {
                errors.validation = errors.validation || [];
                errors.validation[0] = errors.validation[0] || {};
                errors.validation[0].message = 'require message is required';
            }

            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            fetchAddData()
        },
    });

    // const handleCheckValidation = (e) => {
    //     setValidation(e.target.checked)
    // }
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue } = formik
    console.log(errors)

    const fetchAddData = async () => {
        try {
            filed.push()
            const addDataPayload = {
                moduleId: moduleId,
                fields: filed
            }
            // let response = await postApi(`api/custom-field/add`, addDataPayload);
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
                                <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Label
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.label}
                                        name="label"
                                        placeholder='Enter Label Name'
                                        fontWeight='500'
                                        borderColor={errors.label && touched.label ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.label && touched.label && errors.label}</Text>
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
                                        <option value='select'>Select</option>
                                    </Select>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <Flex alignItems="center" justifyContent={"end"}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Validation
                                        </FormLabel>
                                        <Checkbox colorScheme="brandScheme" me="10px" onChange={(e) => setFieldValue(`validate`, e.target.checked)} />
                                    </Flex>
                                </GridItem>
                                {values.validate === true ?
                                    <>
                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                            <Flex>
                                                <Checkbox colorScheme="brandScheme" me="10px"
                                                    onChange={(e) => setFieldValue(`validation[${0}].require`, e.target.checked)}
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
                                                value={values?.validation[0]?.message}
                                                name={`validation[${0}].message`}
                                                placeholder='Enter message'
                                                fontWeight='500'
                                                borderColor={errors?.validation[0]?.message && touched?.validation[0]?.message ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {errors?.validation[0]?.message && touched?.validation[0]?.message && errors?.message}</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                            <Flex>
                                                <Checkbox colorScheme="brandScheme" name={`validation[${1}].min`} me="10px" onChange={(e) => setFieldValue(`validation[${1}].min`, e.target.checked)} />
                                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                    Min
                                                </FormLabel>
                                            </Flex>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Value
                                            </FormLabel>
                                            <Input
                                                disabled={values.validation[1].min === true ? false : true}
                                                fontSize='sm'
                                                onChange={handleChange} onBlur={handleBlur}
                                                value={values.validation[1].value}
                                                name={`validation[${1}].value`}
                                                placeholder='Enter Min Value'
                                                fontWeight='500'
                                                borderColor={errors.value && touched.value ? "red.300" : null}
                                            />
                                            {`validation[${2}].min` == true ? <Text mb='10px' color={'red'}> {errors.value && touched.value && errors.value}</Text> : ""}
                                        </GridItem>
                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Message
                                            </FormLabel>
                                            <Input
                                                disabled={values.validation[1].min === true ? false : true}
                                                fontSize='sm'
                                                onChange={handleChange} onBlur={handleBlur}
                                                value={values.validation[1].message}
                                                name={`validation[${1}].message`}
                                                placeholder='Enter Min message'
                                                fontWeight='500'
                                            // borderColor={errors.`validation[${1}].message` && touched.validation[1].message ? "red.300" : null}
                                            />
                                        </GridItem>
                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }} mt={8}>
                                            <Flex>
                                                <Checkbox colorScheme="brandScheme" me="10px" name={`validation[${2}].max`} onChange={(e) => setFieldValue(`validation[${2}].max`, e.target.checked)} />
                                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                                    Max
                                                </FormLabel>
                                            </Flex>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Value
                                            </FormLabel>
                                            <Input
                                                disabled={values.validation[2].max === true ? false : true}
                                                fontSize='sm'
                                                onChange={handleChange} onBlur={handleBlur}
                                                value={values.validation[2].value}
                                                name={`validation[${2}].value`}
                                                placeholder='Enter Max Value'
                                                fontWeight='500'
                                                borderColor={errors.value && touched.value ? "red.300" : null}
                                            />
                                            {`validation[${2}].max` === true ? <Text mb='10px' color={'red'}> {errors.value && touched.value && errors.value}</Text> : ""}
                                        </GridItem>
                                        <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Message
                                            </FormLabel>
                                            <Input
                                                disabled={values.validation[2].max === true ? false : true}
                                                fontSize='sm'
                                                onChange={handleChange} onBlur={handleBlur}
                                                value={values.validation[2].massage}
                                                name={`validation[${2}].message`}
                                                placeholder='Enter Max Message'
                                                fontWeight='500'
                                                borderColor={errors.massage && touched.massage ? "red.300" : null}
                                            />
                                        </GridItem>
                                    </>
                                    :
                                    ""}
                            </Grid>
                        </>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" size="sm" mr={2} disabled={isLoding ? true : false} onClick={() => handleSubmit()} >{isLoding ? <Spinner /> : 'Add'}</Button>
                        <Button variant="outline" size="sm" onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Addfield
