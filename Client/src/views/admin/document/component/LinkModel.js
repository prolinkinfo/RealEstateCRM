import { LinkIcon } from '@chakra-ui/icons';
import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from 'services/api';
import { deleteManyApi } from 'services/api';
import { deleteApi } from 'services/api';

const Link = (props) => {

    const [isLoding, setIsLoding] = useState(false)

    const initialValues = {
        linkContact: '',
        linkLead: '',
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {
            handleClick();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const handleClick = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/user/register', values)
            if (response && response.status === 200) {
                props.onClose();
            } else {
                toast.error(response.response.data?.message)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }
    }

    const handleClose = () => {
        props.onClose(false)
    }

    return (
        <div>
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Link Document</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Link Contact
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.linkContact}
                                    name="linkContact"
                                    placeholder='Link Contact'
                                    fontWeight='500'
                                    borderColor={errors.linkContact && touched.linkContact ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.linkContact && touched.linkContact && errors.linkContact}</Text>
                            </GridItem>
                        </Grid >


                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='brand' rightIcon={<LinkIcon />} mr={2} onClick={handleClick}>Link</Button>
                        <Button variant="outline" colorScheme='red' onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Link
