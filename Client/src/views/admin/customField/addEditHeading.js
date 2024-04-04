import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { postApi, putApi } from 'services/api'
import * as yup from 'yup'

const AddEditHeading = (props) => {

    const { moduleId, filed, updateData, setUpdateData } = props;

    const [isLoding, setIsLoding] = useState(false)

    const handleClose = () => {
        props.onClose(false);
        setUpdateData({});
    }

    const headingSchema = yup.object({
        heading: yup.string().required('Heading is required')
    })


    const initialValues = {
        heading: updateData && updateData?.heading ? updateData?.heading : '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: headingSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {

            if (updateData && updateData?.heading) {
                editData();
            } else {
                fetchAddData();
            }

            resetForm();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const fetchAddData = async () => {
        try {
            const addDataPayload = {
                moduleId: moduleId,
                headings: [values]
            }

            let response = await postApi('api/custom-field/add-heading', addDataPayload);
            if (response.status === 200) {
                props.onClose(false);
                props.fetchData();
            } else {
                toast.error(response.response.data)
            }
        }
        catch {
        }
        finally {
        }
    };

    const editData = async () => {
        try {
            const editDataPayload = {
                moduleId: moduleId,
                updatedHeading: values
            }

            let response = await putApi(`api/custom-field/change-single-heading/${updateData?._id}`, editDataPayload);
            if (response.status === 200) {
                handleClose();
                props.fetchData();
            }
        }
        catch {
        }
        finally {
        }
    };

    return (
        <div>
            <Modal onClose={() => handleClose()} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent maxWidth={"2xl"}>
                    <ModalHeader>{updateData && updateData?.heading ? 'Edit' : 'Add'} Heading</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12 }} >
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Heading<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.heading}
                                        name="heading"
                                        placeholder={`Enter Heading`}
                                        fontWeight='500'
                                        borderColor={errors.heading && touched.heading ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.heading && touched.heading && errors.heading}</Text>
                                </GridItem>
                            </Grid>
                        </>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" size="sm" mr={2} type='submit' disabled={isLoding ? true : false} onClick={handleSubmit} >{isLoding ? <Spinner /> : updateData && updateData?.heading ? 'Update' : 'Save'}</Button>
                        <Button variant="outline"
                            colorScheme='red' size="sm"
                            sx={{
                                textTransform: "capitalize",
                            }} onClick={() => { handleClose(); resetForm() }}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AddEditHeading