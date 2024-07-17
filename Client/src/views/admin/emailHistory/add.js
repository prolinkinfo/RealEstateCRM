import { Button, Flex, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { emailSchema } from 'schema';
import { getApi, postApi } from 'services/api';
import dayjs from 'dayjs';
import { fetchEmailTempData } from '../../../redux/slices/emailTempSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AddEmailHistory = (props) => {
    const { onClose, isOpen } = props
    const [isLoding, setIsLoding] = useState(false)
    const [assignToLeadData, setAssignToLeadData] = useState([]);
    const [assignToContactData, setAssignToContactData] = useState([]);
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    const user = JSON.parse(localStorage.getItem('user'))
    const todayTime = new Date().toISOString().split('.')[0];

    const initialValues = {
        sender: user?._id,
        recipient: '',
        subject: '',
        callNotes: '',
        createByContact: '',
        createByLead: '',
        startDate: '',
        type: 'message',
        html: '',
        category: 'contact',
        // assignTo: '',
        // assignToLead: '',
        createBy: user?._id,
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: emailSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/email/add', values)
            if (response.status === 200) {
                props.onClose();
                props.setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };
    useEffect(async () => {
        values.start = props?.date
        try {
            let result
            if (values.category === "Contact" && assignToContactData.length <= 0) {
                result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`)
                setAssignToContactData(result?.data)

            } else if (values.category === "Lead" && assignToLeadData <= 0) {
                result = await getApi(user.role === 'superAdmin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
                setAssignToLeadData(result?.data)
            }
        }
        catch (e) {
            console.log(e);
        }
    }, [props, values.category])

    const fetchRecipientData = async () => {
        if (values.createByContact) {
            let findEmail = assignToContactData.find((item) => item._id === values.createByContact);
            if (findEmail) {
                setFieldValue('recipient', findEmail.email);
            }
        } else if (values.createByLead) {
            let findEmail = assignToLeadData.find((item) => item._id === values.createByLead);
            if (findEmail) {
                setFieldValue('recipient', findEmail.leadEmail);
            }
        } else {
            setFieldValue('recipient', "");

        }
    }

    const fetchData = async () => {
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
        if (values?.type === "template") fetchData()
    }, [values?.type])

    useEffect(() => {
        fetchRecipientData()
    }, [values.createByContact, values.createByLead])

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent height={"580px"}>
                <ModalHeader>Add Email </ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY={"auto"} height={"400px"}>
                    {/* Contact Model  */}
                    <ContactModel isOpen={contactModelOpen} data={assignToContactData} onClose={setContactModel} fieldName='createByContact' setFieldValue={setFieldValue} />
                    {/* Lead Model  */}
                    <LeadModel isOpen={leadModelOpen} data={assignToLeadData} onClose={setLeadModel} fieldName='createByLead' setFieldValue={setFieldValue} />

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Related
                            </FormLabel>
                            <RadioGroup onChange={(e) => { setFieldValue('category', e); setFieldValue('createByContact', ''); setFieldValue('createByLead', ''); }} value={values.category}>
                                <Stack direction='row'>
                                    <Radio value='Contact'>Contact</Radio>
                                    <Radio value='Lead'>Lead</Radio>
                                </Stack>
                            </RadioGroup>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            {values.category === "Contact" ?
                                <>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                            Recipient  (Contact)
                                        </FormLabel>
                                        <Flex justifyContent={'space-between'}>
                                            <Select
                                                value={values.createByContact}
                                                name="createByContact"
                                                onChange={handleChange}
                                                mb={errors.createByContact && touched.createByContact ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Assign To'}
                                                borderColor={errors.createByContact && touched.createByContact ? "red.300" : null}
                                            >
                                                {assignToContactData?.map((item) => {
                                                    return <option value={item._id} key={item._id}>{values.category === 'Contact' ? `${item.firstName} ${item.lastName}` : item.leadName}</option>
                                                })}
                                            </Select>
                                            <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                        </Flex>
                                    </GridItem>
                                </>
                                : values.category === "Lead" ?
                                    <>
                                        <GridItem colSpan={{ base: 12, md: 6 }} >
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Recipient (Lead)
                                            </FormLabel>
                                            <Flex justifyContent={'space-between'}>
                                                <Select
                                                    value={values.createByLead}
                                                    name="createByLead"
                                                    onChange={handleChange}
                                                    mb={errors.createByLead && touched.createByLead ? undefined : '10px'}
                                                    fontWeight='500'
                                                    placeholder={'Assign To'}
                                                    borderColor={errors.createByLead && touched.createByLead ? "red.300" : null}
                                                >
                                                    {assignToLeadData?.map((item) => {
                                                        return <option value={item._id} key={item._id}>{values.category === 'Contact' ? `${item.firstName} ${item.lastName}` : item.leadName}</option>
                                                    })}
                                                </Select>
                                                <IconButton onClick={() => setLeadModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                            </Flex>
                                        </GridItem>
                                    </>
                                    : ''
                            }
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Recipient<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                disabled
                                value={values.recipient}
                                name="recipient"
                                placeholder='Recipient'
                                fontWeight='500'
                                borderColor={errors.recipient && touched.recipient ? "red.300" : null}
                            />
                            <Text mb='10px' fontSize='sm' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
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
                                Subject<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.subject}
                                name="subject"
                                placeholder='subject'
                                fontWeight='500'
                                borderColor={errors.subject && touched.subject ? "red.300" : null}
                            />
                            <Text fontSize='sm' mb='10px' color={'red'}> {errors.subject && touched.subject && errors.subject}</Text>
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
                    <Button variant='brand' size="sm" disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Save'}</Button>
                    <Button sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" onClick={() => {
                            formik.resetForm()
                            onClose()
                        }} size="sm">Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddEmailHistory
