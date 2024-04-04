import { CloseIcon } from '@chakra-ui/icons';
import { Button, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { postApi } from 'services/api';
import * as yup from 'yup'

const AddRole = (props) => {
    const { onClose, isOpen, setAction } = props;
    const [isLoding, setIsLoding] = useState(false);

    const initialValues = {
        roleName: '',
        description: '',
    };

    const validationSchema = yup.object({
        roleName: yup.string().required("Role Name is required"),
        description: yup.string().required("Description is required")
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/role-access/add', values)
            if (response && response.status === 200) {
                onClose(false);
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
    };

    return (
        <Modal isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Add Role
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Role Name<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.roleName}
                                name="roleName"
                                placeholder='Enter Role Name'
                                fontWeight='500'
                                borderColor={errors.roleName && touched.roleName ? "red.300" : null}
                            />
                            <Text mb='10px' fontSize={'sm'} color={'red'}> {errors.roleName && touched.roleName && errors.roleName}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Description<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.description}
                                name="description"
                                placeholder='Enter Description'
                                fontWeight='500'
                                borderColor={errors.description && touched.description ? "red.300" : null}
                            />
                            <Text mb='10px' fontSize={'sm'} color={'red'}> {errors.description && touched.description && errors.description}</Text>
                        </GridItem>
                    </Grid>

                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' mr={1} disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Save'}</Button>
                    <Button size="sm" variant='outline' color={'red'} colorScheme='red' onClick={() => {
                        formik.resetForm()
                        onClose(false)
                    }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddRole
