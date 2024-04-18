import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { phoneCallSchema } from 'schema';
import { getApi, postApi } from 'services/api';

const AddPhoneCall = (props) => {
    const { onClose, isOpen, fetchData, setAction, cData, LData } = props
    const [isLoding, setIsLoding] = useState(false)
    const todayTime = new Date().toISOString().split('.')[0];
    const user = JSON.parse(localStorage.getItem('user'))

    const initialValues = {
        sender: user?._id,
        recipient: '',
        callDuration: '',
        callNotes: '',
        createByContact: '',
        createByLead: '',
        startDate: '',
        createBy: user?._id,
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
                fetchData(1)
                // setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    // const fetchDataR = async () => {
    //     if (props?.viewData?.lead?.leadPhoneNumber) {
    //         if (props.id && props.lead !== true) {
    //             setFieldValue('recipient', props?.viewData?.contact?.phoneNumber);
    //             setFieldValue('createByContact', props?.id);
    //             values.recipient = props?.viewData?.contact?.phoneNumber
    //         } else if (props.id && props.lead === true) {
    //             let response = await getApi('api/lead/view/', props.id)
    //             if (response?.status === 200) {
    //                 setFieldValue('recipient', response?.data?.lead?.leadPhoneNumber);
    //                 setFieldValue('createByLead', props.id);
    //                 values.recipient = response?.data?.lead?.leadPhoneNumber
    //             }
    //         }
    //     } else {
    //         if (props.id && props.lead !== true) {
    //             if (cData) {
    //                 setFieldValue('recipient', cData?.phoneNumber);
    //                 setFieldValue('createByContact', props?.id);
    //                 values.recipient = cData?.phoneNumber
    //             }
    //             // let response = await getApi('api/contact/view/', props.id)
    //             // if (response?.status === 200) {
    //             //     setFieldValue('recipient', response?.data?.contact?.phoneNumber);
    //             //     setFieldValue('createByContact', props?.id);
    //             //     values.recipient = response?.data?.contact?.phoneNumber
    //             // }
    //         } else if (props.id && props.lead === true) {
    //             let response = await getApi('api/lead/view/', props.id)
    //             if (response?.status === 200) {
    //                 setFieldValue('recipient', response?.data?.lead?.leadPhoneNumber);
    //                 setFieldValue('createByLead', props.id);
    //                 values.recipient = response?.data?.lead?.leadPhoneNumber
    //             }
    //         }
    //     }
    // }

    const fetchDataR = async () => {
        if (LData && LData._id && props.lead === true) {
            setFieldValue('recipient', LData.leadPhoneNumber);
            setFieldValue('createByLead', props?.id);
            values.recipient = LData.leadPhoneNumber
        } else if (cData && cData._id && props.lead !== true) {
            setFieldValue('recipient', cData?.phoneNumber);
            setFieldValue('createByContact', props?.id);
            values.recipient = cData?.phoneNumber
        }
    }
    useEffect(() => {
        fetchDataR()
    }, [props.id, cData, LData])


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
                                disabled
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.recipient}
                                name="recipient"
                                placeholder='Recipient'
                                fontWeight='500'
                                borderColor={errors.recipient && touched.recipient ? "red.300" : null}
                            />
                            <Text mb='10px' fontSize='sm' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Start Date<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                type="datetime-local"
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min={dayjs(todayTime).format('YYYY-MM-DD HH:mm')}
                                value={values.startDate}
                                name="startDate"
                                fontWeight='500'
                                borderColor={errors?.startDate && touched?.startDate ? "red.300" : null}
                            />
                            <Text mb='10px' fontSize='sm' color={'red'}> {errors.startDate && touched.startDate && errors.startDate}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
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
                            <Text mb='10px' fontSize='sm' color={'red'}> {errors.callDuration && touched.callDuration && errors.callDuration}</Text>
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
                            <Text mb='10px' fontSize='sm' color={'red'}> {errors.callNotes && touched.callNotes && errors.callNotes}</Text>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Save'}</Button>
                    <Button size="sm" sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" onClick={() => {
                            formik.resetForm()
                            onClose()
                        }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddPhoneCall
