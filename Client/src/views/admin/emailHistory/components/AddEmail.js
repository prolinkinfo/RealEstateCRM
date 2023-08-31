import React, { useEffect } from 'react';
import { Button, FormLabel, Textarea, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, IconButton, Flex } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { emailSchema } from 'schema';
import { postApi } from 'services/api';
import { getApi } from 'services/api';
import { BsFillSendFill } from 'react-icons/bs';
import { useState } from 'react';
import Spinner from 'components/spinner/Spinner';
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import { LiaMousePointerSolid } from 'react-icons/lia';


const AddEmailHistory = (props) => {
    const { onClose, isOpen, fetchData } = props
    const user = JSON.parse(localStorage.getItem('user'))
    const [isLoding, setIsLoding] = useState(false)
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);

    const initialValues = {
        sender: user?._id,
        recipient: '',
        subject: '',
        message: '',
        createBy: '',
        createByLead: '',
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: emailSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/email/add', values)
            if (response.status === 200) {
                props.onClose();
                fetchData()
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    const fetchRecipientData = async () => {
        if (props.id && props.lead !== 'true') {
            let response = await getApi('api/contact/view/', props.id)
            if (response?.status === 200) {
                setFieldValue('recipient', response?.data?.contact?.email);
                setFieldValue('createBy', props.id);
                values.recipient = response?.data?.contact?.email
            }
        } else if (props.id && props.lead === 'true') {
            let response = await getApi('api/lead/view/', props.id)
            if (response?.status === 200) {
                setFieldValue('recipient', response?.data?.lead?.leadEmail);
                setFieldValue('createByLead', props.id);
                values.recipient = response?.data?.lead?.leadEmail
            }
        }
    }

    useEffect(() => {
        fetchRecipientData()
    }, [props.id])

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Send Email </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/*  Contact Model  */}
                    {/* <ContactModel isOpen={contactModelOpen} onClose={setContactModel} fieldName='selectedId' setFieldValue={setFieldValue} /> */}
                    {/* Lead Model  */}
                    {/* <LeadModel isOpen={leadModelOpen} onClose={setLeadModel} fieldName='selectedId' setFieldValue={setFieldValue} /> */} */}

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Recipient<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.recipient}
                                name="recipient"
                                placeholder='Recipient'
                                fontWeight='500'
                                borderColor={errors.recipient && touched.recipient ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Subject
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                placeholder='Enter subject'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.subject}
                                name="subject"
                                fontWeight='500'
                                borderColor={errors.subject && touched.subject ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.subject && touched.subject && errors.subject}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Message
                            </FormLabel>
                            <Textarea
                                fontSize='sm'
                                placeholder='Here Type message'
                                resize={'none'}
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.message}
                                name="message"
                                fontWeight='500'
                                borderColor={errors.message && touched.message ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.message && touched.message && errors.message}</Text>
                        </GridItem>

                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' onClick={handleSubmit} rightIcon={<BsFillSendFill />} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Send'}</Button>
                    <Button onClick={() => {
                        formik.resetForm()
                        onClose()
                    }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddEmailHistory
