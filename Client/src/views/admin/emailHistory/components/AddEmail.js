import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { emailSchema } from 'schema';
import { postApi } from 'services/api';
import { fetchEmailTempData } from '../../../../redux/slices/emailTempSlice';


const AddEmailHistory = (props) => {
    const { onClose, isOpen, fetchData, setAction } = props
    const user = JSON.parse(localStorage.getItem('user'))
    const [isLoding, setIsLoding] = useState(false)
    const todayTime = new Date().toISOString().split('.')[0];
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    const initialValues = {
        sender: user?._id,
        recipient: props.lead !== true ? props?.contactEmail : props?.leadEmail,
        subject: '',
        message: '',
        createByContact: props?.id && props?.lead !== true ? props?.id : '',
        createByLead: props?.id && props?.lead === true ? props?.id : '',
        startDate: '',
        type: 'message',
        html: '',
        createBy: user?._id,
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: emailSchema,
        enableReinitialize: true,
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
    const fetchEmailTemp = async () => {
        setIsLoding(true)
        const result = await dispatch(fetchEmailTempData())
        if (result.payload.status === 200) {
            setData(result?.payload?.data);
        } else {
            toast.error("Failed to fetch data", "error");
        }
        setIsLoding(false)
    }
    useEffect(() => {
        if (values?.type === "template") fetchEmailTemp()
    }, [values?.type])
    // useEffect(() => {
    //    if (props.id && props.lead !== true) {
    //         setFieldValue('createByContact', props.id);
    //     } else if (props.id && props.lead === true) {
    //         setFieldValue('createByLead', props.id);
    //     }
    // }, [props.id, props.lead])

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
                                disabled
                                placeholder='Recipient'
                                fontWeight='500'
                                borderColor={errors.recipient && touched.recipient ? "red.300" : null}
                            />
                            <Text fontSize='sm' mb='10px' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Subject<Text color={"red"}>*</Text>
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
                            <Text fontSize='sm' mb='10px' color={'red'}> {errors.subject && touched.subject && errors.subject}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
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
                            <Text fontSize='sm' mb='10px' color={'red'}> {errors.startDate && touched.startDate && errors.startDate}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Message
                            </FormLabel>
                            <RadioGroup onChange={(e) => { setFieldValue('type', e) }} value={values.type}>
                                <Stack direction='row'>
                                    <Radio value='message'>Message</Radio>
                                    <Radio value='template'>Template</Radio>
                                </Stack>
                            </RadioGroup>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            {
                                values?.type === "message" ?
                                    <>
                                        <Textarea
                                            resize={'none'}
                                            fontSize='sm'
                                            placeholder='Enter Message'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.message}
                                            name="message"
                                            fontWeight='500'
                                            borderColor={errors.message && touched.message ? "red.300" : null}
                                        />
                                        <Text fontSize='sm' mb='10px' color={'red'}> {errors.message && touched.message && errors.message}</Text>
                                    </>
                                    :
                                    <Select
                                        // value={values.assignTo}
                                        name="html"
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.html}
                                        fontWeight='500'
                                        placeholder={'Select Template'}
                                    // borderColor={errors.assignTo && touched.assignTo ? "red.300" : null}
                                    >
                                        {data?.map((item) => {
                                            return <option value={item?.html} key={item._id}>{item?.templateName}</option>
                                        })}
                                    </Select>
                            }
                        </GridItem>

                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
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
