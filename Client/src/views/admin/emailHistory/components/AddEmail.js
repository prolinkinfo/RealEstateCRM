import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { emailSchema } from 'schema';
import { getApi, postApi } from 'services/api';


const AddEmailHistory = (props) => {
    const { onClose, isOpen, fetchData, setAction } = props
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
        startDate: '',
        endDate: '',
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
                setAction((pre) => !pre)
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
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Start Date
                            </FormLabel>
                            <Input
                                type="datetime-local"
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.startDate}
                                name="startDate"
                                fontWeight='500'
                                borderColor={errors?.startDate && touched?.startDate ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.startDate && touched.startDate && errors.startDate}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                End Date
                            </FormLabel>
                            <Input
                                type='datetime-local'
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.endDate}
                                name="endDate"
                                fontWeight='500'
                                borderColor={errors?.endDate && touched?.endDate ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.endDate && touched.endDate && errors.endDate}</Text>
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
                    <Button size="sm" variant='brand' onClick={handleSubmit} rightIcon={<BsFillSendFill />} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Send'}</Button>
                    <Button sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" size="sm" onClick={() => {
                            formik.resetForm()
                            onClose()
                        }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddEmailHistory
