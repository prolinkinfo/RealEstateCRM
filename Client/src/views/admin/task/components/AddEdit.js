import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, Textarea } from '@chakra-ui/react';
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { TaskSchema } from 'schema';
import { getApi, postApi } from 'services/api';
import moment from 'moment';
import { putApi } from 'services/api';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { HasAccess } from "../../../../redux/accessUtils";

const AddEdit = (props) => {
    const { onClose, isOpen, fetchData, userAction, setAction, id, view, data } = props
    const [isChecked, setIsChecked] = useState(false);
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const [assignToLeadData, setAssignToLeadData] = useState([]);
    const [assignToContactData, setAssignToContactData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);
    const leadData = useSelector((state) => state?.leadData?.data);


    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toISOString().split('.')[0];

    const [leadAccess, contactAccess] = HasAccess(['Leads', 'Contacts']);

    const contactData = useSelector((state) => state?.contactData?.data)

    const initialValues = {
        title: '',
        category: props.leadContect === 'contactView' ? 'Contact' : props.leadContect === 'leadView' ? 'Lead' : 'None',
        description: '',
        notes: '',
        assignTo: props.leadContect === 'contactView' && id ? id : '',
        assignToLead: props.leadContect === 'leadView' && id ? id : '',
        reminder: '',
        start: '',
        end: '',
        backgroundColor: '',
        borderColor: '#ffffff',
        textColor: '',
        allDay: false,
        display: '',
        url: '',
        createBy: userId,
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: TaskSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            AddData();
            resetForm()
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async () => {
        if (userAction === "add") {
            try {
                setIsLoding(true)

                if (values?.start) {
                    values.start = values?.allDay ? moment(values?.start).format('YYYY-MM-DD') : moment(values?.start).format('YYYY-MM-DD HH:mm');
                }
                if (values?.end) {
                    values.end = values?.allDay ? moment(values?.end).format('YYYY-MM-DD') : moment(values?.end).format('YYYY-MM-DD HH:mm');
                }

                let response = await postApi('api/task/add', values)
                if (response.status === 200) {
                    formik.resetForm()
                    onClose();
                    fetchData(1)
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

                if (values?.start) {
                    values.start = values?.allDay ? moment(values?.start).format('YYYY-MM-DD') : moment(values?.start).format('YYYY-MM-DD HH:mm');
                }
                if (values?.end) {
                    values.end = values?.allDay ? moment(values?.end).format('YYYY-MM-DD') : moment(values?.end).format('YYYY-MM-DD HH:mm');
                }

                let response = await putApi(`api/task/edit/${id}`, values)
                if (response.status === 200) {
                    formik.resetForm()
                    onClose();
                    setAction((pre) => !pre)
                }
            } catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        }
    };
    const fetchTaskData = async () => {
        if (id) {
            try {
                setIsLoding(true)
                let result = await getApi('api/task/view/', id)
                setFieldValue('title', result?.data?.title)
                setFieldValue('category', result?.data?.category)
                setFieldValue('description', result?.data?.description)
                setFieldValue('notes', result?.data?.notes)
                setFieldValue('assignTo', result?.data?.assignTo)
                setFieldValue('reminder', result?.data?.reminder)
                setFieldValue('start', result?.data?.start)
                setFieldValue('end', result?.data?.end)
                setFieldValue('backgroundColor', result?.data?.backgroundColor)
                setFieldValue('borderColor', result?.data?.borderColor)
                setFieldValue('textColor', result?.data?.textColor)
                setFieldValue('display', result?.data?.display)
                setFieldValue('url', result?.data?.url)
                setFieldValue("status", result?.data?.status)
                setFieldValue('assignToLead', result?.data?.assignToLead)
                // setFieldValue('allDay', result?.data?.allDay === 'Yes' ? 'Yes' : 'No')
                setFieldValue('allDay', result?.data?.allDay)

                // setIsChecked(result?.data?.allDay === 'Yes' ? true : false)
            }
            catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        } else if (data) {
            setFieldValue('title', data?.title)
            setFieldValue('category', data?.category)
            setFieldValue('description', data?.description)
            setFieldValue('notes', data?.notes)
            setFieldValue('assignTo', data?.assignTo)
            setFieldValue('reminder', data?.reminder)
            setFieldValue('start', data?.start)
            setFieldValue('end', data?.end)
            setFieldValue('backgroundColor', data?.backgroundColor)
            setFieldValue('borderColor', data?.borderColor)
            setFieldValue('textColor', data?.textColor)
            setFieldValue('display', data?.display)
            setFieldValue('url', data?.url)
            setFieldValue("status", data?.status)
            setFieldValue('assignToLead', data?.assignToLead)
            setFieldValue('allDay', data?.allDay === 'Yes' ? 'Yes' : 'No')
            setFieldValue('allDay', data?.allDay)

            // setIsChecked(data?.allDay === 'Yes' ? true : false)
        }
    }

    useEffect(async () => {
        values.start = props?.date
        if (view === true) {
            if (values.category === "Contact" && assignToContactData.length <= 0) {
                setAssignToContactData(contactData)
                // result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`)
                // setAssignToContactData(result?.data)
            } else if (values.category === "Lead" && assignToLeadData.length <= 0) {
                setAssignToLeadData(leadData)
            }
        } else {
            try {
                let result
                if (values.category === "Contact" && assignToContactData.length <= 0) {
                    result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`)
                    setAssignToContactData(result?.data)
                } else if (values.category === "Lead" && assignToLeadData.length <= 0) {
                    result = await getApi(user.role === 'superAdmin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
                    setAssignToLeadData(result?.data)
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }, [props, values.category])
    useEffect(() => {
        if (userAction === "edit" || data) {
            fetchTaskData()
        }
        fetchTaskData()

    }, [userAction, id, data])

    return (
        <Modal isOpen={isOpen} size={'xl'} >
            {!props.from && <ModalOverlay />}
            <ModalContent overflowY={"auto"} height={"600px"}>
                <ModalHeader justifyContent='space-between' display='flex' >
                    {
                        userAction === "add" ? "Create Task" : "Edit Task"
                    }

                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody overflowY={"auto"} height={"700px"}>
                    {/* Contact Model  */}
                    <ContactModel isOpen={contactModelOpen} data={assignToContactData} onClose={setContactModel} values={values} fieldName='assignTo' setFieldValue={setFieldValue} />
                    {/* Lead Model  */}
                    <LeadModel isOpen={leadModelOpen} data={assignToLeadData} onClose={setLeadModel} values={values} fieldName='assignToLead' setFieldValue={setFieldValue} />
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                            <Spinner />
                        </Flex>
                        :
                        <Grid templateColumns="repeat(12, 1fr)" gap={3} >
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Title<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                    name="title"
                                    placeholder='Title'
                                    fontWeight='500'
                                    borderColor={errors?.title && touched?.title ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'} fontSize='sm'> {errors.title && touched.title && errors.title}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Related
                                </FormLabel>
                                <RadioGroup onChange={(e) => { setFieldValue('category', e); setFieldValue('assignTo', null); setFieldValue('assignToLead', null); }} value={values.category}>
                                    <Stack direction='row'>
                                        <Stack direction='row'>
                                            <Radio value='None'>None</Radio>
                                            {props.leadContect === 'contactView' && <Radio value='Contact'>Contact</Radio>}
                                            {props.leadContect === 'leadView' && <Radio value='Lead'>Lead</Radio>}
                                            {!props.leadContect &&
                                                <>
                                                    {(user?.role === "superAdmin" || contactAccess?.create) && <Radio value='Contact'>Contact</Radio>}
                                                    {(user?.role === "superAdmin" || leadAccess?.create) && <Radio value='Lead'>Lead</Radio>}
                                                </>
                                            }
                                        </Stack>

                                    </Stack>
                                </RadioGroup>
                                <Text mb='10px' color={'red'}> {errors.category && touched.category && errors.category}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: values.category === "None" ? 12 : 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Description
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    name="description"
                                    placeholder='Description'
                                    fontWeight='500'
                                    borderColor={errors?.description && touched?.description ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.description && touched.description && errors.description}</Text>
                            </GridItem>
                            {values.category === "Contact" ?
                                <>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                            Assign To  Contact
                                        </FormLabel>
                                        <Flex justifyContent={'space-between'}>
                                            <Select
                                                value={values.assignTo}
                                                name="assignTo"
                                                onChange={handleChange}
                                                mb={errors.assignTo && touched.assignTo ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Assign To'}
                                                borderColor={errors.assignTo && touched.assignTo ? "red.300" : null}
                                            >
                                                {assignToContactData?.map((item) => {
                                                    return <option value={item._id} key={item._id}>{values.category === 'Contact' ? `${item.firstName} ${item.lastName}` : item.leadName}</option>
                                                })}
                                            </Select>
                                            <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                        </Flex>
                                        <Text mb='10px' color={'red'}> {errors.assignTo && touched.assignTo && errors.assignTo}</Text>
                                    </GridItem>
                                </>
                                : values.category === "Lead" ?
                                    <>
                                        <GridItem colSpan={{ base: 12, md: 6 }} >
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Assign To Lead
                                            </FormLabel>
                                            <Flex justifyContent={'space-between'}>
                                                <Select
                                                    value={values.assignToLead}
                                                    name="assignToLead"
                                                    onChange={handleChange}
                                                    mb={errors.assignToLead && touched.assignToLead ? undefined : '10px'}
                                                    fontWeight='500'
                                                    placeholder={'Assign To'}
                                                    borderColor={errors.assignToLead && touched.assignToLead ? "red.300" : null}
                                                >
                                                    {assignToLeadData?.map((item) => {
                                                        return <option value={item._id} key={item._id}>{item.leadName}</option>
                                                    })}
                                                </Select>
                                                <IconButton onClick={() => setLeadModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                            </Flex>
                                            <Text mb='10px' color={'red'}> {errors.assignToLead && touched.assignToLead && errors.assignToLead}</Text>
                                        </GridItem>
                                    </>
                                    : ''
                            }
                            <GridItem colSpan={{ base: 12 }} >
                                <Checkbox isChecked={values?.allDay} name='allDay'
                                    onChange={handleChange}
                                // onChange={(e) => {
                                //     const target = e.target.checked;
                                //     // setFieldValue('allDay', e.target.checked === true ? 'Yes' : 'No');
                                //     setIsChecked(target);
                                // }}
                                >
                                    All Day Task ?
                                </Checkbox>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Start Date<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    type={values?.allDay ? 'date' : 'datetime-local'}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    min={values?.allDay ? dayjs(today).format('YYYY-MM-DD') : dayjs(todayTime).format('YYYY-MM-DD HH:mm')}
                                    value={values?.allDay ? values?.start && dayjs(values?.start).format('YYYY-MM-DD') || null : values?.start && dayjs(values?.start).format('YYYY-MM-DD HH:mm') || null}
                                    name="start"
                                    fontWeight='500'
                                    borderColor={errors?.start && touched?.start ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.start && touched.start && errors.start}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    End Date
                                </FormLabel>
                                <Input
                                    type={values?.allDay ? 'date' : 'datetime-local'}
                                    min={values.start}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values?.allDay ? values?.end && dayjs(values?.end).format('YYYY-MM-DD') || null : values?.end && dayjs(values?.end).format('YYYY-MM-DD HH:mm') || null}
                                    name="end"
                                    fontWeight='500'
                                    borderColor={errors?.end && touched?.end ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.end && touched.end && errors.end}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 4 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Background-Color
                                </FormLabel>
                                <Input
                                    type='color'
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.backgroundColor}
                                    name="backgroundColor"
                                    fontWeight='500'
                                    borderColor={errors?.backgroundColor && touched?.backgroundColor ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.backgroundColor && touched.backgroundColor && errors.backgroundColor}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 4 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Border-Color
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    type='color'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.borderColor}
                                    name="borderColor"
                                    placeholder='borderColor'
                                    fontWeight='500'
                                    borderColor={errors?.borderColor && touched?.borderColor ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.borderColor && touched.borderColor && errors.borderColor}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 4 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Text-Color
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    type='color'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.textColor}
                                    name="textColor"
                                    placeholder='textColor'
                                    fontWeight='500'
                                    textColor={errors?.textColor && touched?.textColor ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.textColor && touched.textColor && errors.textColor}</Text>
                            </GridItem>


                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Url
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.url}
                                    name="url"
                                    placeholder='Enter url'
                                    fontWeight='500'
                                    borderColor={errors?.url && touched?.url ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.url && touched.url && errors.url}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Status
                                </FormLabel>
                                <Select
                                    onChange={(e) => setFieldValue("status", e.target.value)}
                                    value={values?.status}
                                    style={{ fontSize: "14px" }}>
                                    <option value='todo'>Todo</option>
                                    <option value='onHold'>On Hold</option>
                                    <option value='pending'>Pending</option>
                                    <option value='inProgress'>In Progress</option>
                                    <option value='completed'>Completed</option>
                                </Select>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Notes
                                </FormLabel>
                                <Textarea
                                    resize={'none'}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.notes}
                                    name="notes"
                                    placeholder='Notes'
                                    fontWeight='500'
                                    borderColor={errors?.notes && touched?.notes ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.notes && touched.notes && errors.notes}</Text>
                            </GridItem>
                        </Grid>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' onClick={handleSubmit}>{userAction === "add" ? "Save" : "Update"}</Button>
                    <Button type="reset" sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" size="sm" ml={2} onClick={() => { onClose(false); resetForm(); }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default AddEdit
