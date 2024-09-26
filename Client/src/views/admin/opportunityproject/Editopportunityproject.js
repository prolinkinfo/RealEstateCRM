import { CloseIcon } from '@chakra-ui/icons';
import { Button, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import { postApi } from 'services/api';
import * as yup from 'yup';

const Editopportunityproject = (props) => {
    const { onClose, isOpen, setAction, data, userAction, userData, selectedId, fetchData, setUserAction } = props
    const [isLoding, setIsLoding] = useState(false)

    const validationSchema = yup.object({
        name: yup.string().required("Name is required"),
        requirement: yup.string().required("Requirement is required"),
    });
    const initialValues = {
        name: userAction === "add" ? '' : data?.name,
        requirement: userAction === "add" ? '' : data?.requirement,
    }
    const user = JSON.parse(window.localStorage.getItem('user'))
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: () => {
            AddData();
        }
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, resetForm } = formik
    const AddData = async () => {
        if (userAction === "add") {
            try {
                setIsLoding(true)
                let response = await postApi('api/opportunityproject/add', values)
                if (response && response.status === 200) {
                    onClose();
                    resetForm();
                    setAction((pre) => !pre)
                    setUserAction('')
                } else {
                    toast.error(response.response.data?.message)
                }
            } catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        } else if (userAction === "edit") {
            try {
                setIsLoding(true)
                let response = await putApi(`api/opportunityproject/edit/${selectedId}`, values)
                if (response && response.status === 200) {
                    fetchData()
                    let updatedUserData = userData; // Create a copy of userData
                    if (user?._id === selectedId) {
                        if (updatedUserData && typeof updatedUserData === 'object') {
                            updatedUserData = {
                                ...updatedUserData,
                                Name: values?.name,
                                Requirement: values?.requirement
                            };
                        }
                        const updatedDataString = JSON.stringify(updatedUserData);
                        localStorage.setItem('user', updatedDataString);
                    }
                    onClose();
                    setUserAction('')
                    setAction((pre) => !pre)
                } else {
                    toast.error(response.response.data?.message)
                }
            } catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        }
    };

    return (
        <Modal isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    {userAction === "add" ? "Add Opportunity Project" : "Edit Opportunity Project"}
                    <IconButton onClick={onClose} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Name<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.name}
                                name="name"
                                placeholder='Name'
                                fontWeight='500'
                                borderColor={errors.name && touched.name ? "red.300" : null}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <Text mb='10px' color={'red'}>{errors.name && touched.name && errors.name}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Requirement
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.requirement}
                                name="requirement"
                                placeholder='Requirement'
                                fontWeight='500'
                                borderColor={errors.requirement && touched.requirement ? "red.300" : null}
                                error={formik.touched.requirement && Boolean(formik.errors.requirement)}
                                helperText={formik.touched.requirement && formik.errors.requirement}
                            />
                            <Text mb='10px' color={'red'}>{errors.requirement && touched.requirement && errors.requirement}</Text>
                        </GridItem>
                    </Grid>

                </ModalBody>
                <ModalFooter>
                    <Button size="sm" disabled={isLoding ? true : false} variant="brand" type="submit" onClick={handleSubmit}                        >
                        {isLoding ? <Spinner /> : 'Save'}
                    </Button>

                    <Button sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" size="sm" onClick={() => {
                            formik.resetForm()
                            onClose()
                        }}>Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Editopportunityproject
