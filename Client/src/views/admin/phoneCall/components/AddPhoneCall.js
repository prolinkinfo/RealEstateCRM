import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { phoneCallSchema } from 'schema';
import { getApi, postApi } from 'services/api';

const AddPhoneCall = (props) => {
    const { onClose, isOpen, fetchData } = props
    const [isLoding, setIsLoding] = useState(false)

    const user = JSON.parse(localStorage.getItem('user'))

    const initialValues = {
        sender: user?._id,
        recipient: '',
        callDuration: '',
        callNotes: '',
        createBy: '',
        createByLead: '',
        startDate: '',
        endDate: '',
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: phoneCallSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/phoneCall/add', values)
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

    const fetchDataR = async () => {
        if (props.id && props.lead !== 'true') {
            let response = await getApi('api/contact/view/', props.id)
            if (response?.status === 200) {
                setFieldValue('recipient', response?.data?.contact?.phoneNumber);
                setFieldValue('createBy', props?.id);
                values.recipient = response?.data?.contact?.phoneNumber
            }
        } else if (props.id && props.lead === 'true') {
            let response = await getApi('api/lead/view/', props.id)
            if (response?.status === 200) {
                setFieldValue('recipient', response?.data?.lead?.leadPhoneNumber);
                setFieldValue('createByLead', props.id);
                values.recipient = response?.data?.lead?.leadPhoneNumber
            }
        }
    }

    useEffect(() => {
        fetchDataR()
    }, [props.id])


    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Call </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Recipient<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                type='number'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.recipient}
                                name="recipient"
                                placeholder='Recipient'
                                fontWeight='500'
                                borderColor={errors.recipient && touched.recipient ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
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
                                Call Duration<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.callDuration}
                                name="callDuration"
                                placeholder='call Duration'
                                fontWeight='500'
                                borderColor={errors.callDuration && touched.callDuration ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.callDuration && touched.callDuration && errors.callDuration}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Call Notes
                            </FormLabel>
                            <Textarea
                                resize={'none'}
                                fontSize='sm'
                                placeholder='Enter Call Notes'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.callNotes}
                                name="callNotes"
                                fontWeight='500'
                                borderColor={errors.callNotes && touched.callNotes ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.callNotes && touched.callNotes && errors.callNotes}</Text>
                        </GridItem>

                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' leftIcon={<BsFillTelephoneFill />} disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Call'}</Button>
                    <Button onClick={() => {
                        formik.resetForm()
                        onClose()
                    }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddPhoneCall
