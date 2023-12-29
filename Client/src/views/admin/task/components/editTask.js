import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, Textarea, useBreakpointValue } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { TaskSchema } from 'schema';
import { getApi, putApi } from 'services/api';
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import Spinner from 'components/spinner/Spinner';

const EditTask = (props) => {
    const { onClose, isOpen, fetchData, setAction } = props
    const [isChecked, setIsChecked] = useState();
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const user = JSON.parse(localStorage.getItem("user"))
    const [assignmentToData, setAssignmentToData] = useState([]);
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);
    const [isLoding, setIsLoding] = useState(false);
    const initialValues = {
        title: '',
        category: 'None',
        description: '',
        notes: '',
        assignmentTo: '',
        assignmentToLead: '',
        reminder: '',
        start: '',
        end: '',
        backgroundColor: '',
        borderColor: '#ffffff',
        textColor: '',
        display: '',
        url: '',
        createBy: userId,
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: TaskSchema,
        onSubmit: (values, { resetForm }) => {
            EditData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const EditData = async () => {
        try {
            setIsLoding(true)
            let response = await putApi(`api/task/edit/${props.id}`, values)
            if (response.status === 200) {
                formik.resetForm()
                props.viewClose();
                onClose(false)
                // fetchData()
                setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    const fetchTaskData = async () => {
        if (props.id) {
            try {
                setIsLoding(true)
                let result = await getApi('api/task/view/', props.id)

                setFieldValue('title', result?.data?.title)
                setFieldValue('category', result?.data?.category)
                setFieldValue('description', result?.data?.description)
                setFieldValue('notes', result?.data?.notes)
                setFieldValue('assignmentTo', result?.data?.assignmentTo)
                setFieldValue('reminder', result?.data?.reminder)
                setFieldValue('start', result?.data?.start)
                setFieldValue('end', result?.data?.end)
                setFieldValue('backgroundColor', result?.data?.backgroundColor)
                setFieldValue('borderColor', result?.data?.borderColor)
                setFieldValue('textColor', result?.data?.textColor)
                setFieldValue('display', result?.data?.display)
                setFieldValue('url', result?.data?.url)
                setFieldValue('assignmentToLead', result?.data?.assignmentToLead)
            }
            catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        }
    }

    const getContactDetails = async () => {
        try {
            let result
            if (values.category === "contact") {
                result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`)
            } else if (values.category === "lead") {
                result = await getApi(user.role === 'admin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
            }
            setAssignmentToData(result?.data)
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getContactDetails()
    }, [values.category])

    useEffect(() => {
        getContactDetails()
        fetchTaskData()
    }, [props.id])

    return (
        <Modal isOpen={isOpen} size={'xl'} isCentered={useBreakpointValue({ base: false, md: true })}>
            {!props.from && <ModalOverlay />}
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Edit Task
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>
                    {/* Contact Model  */}
                    <ContactModel isOpen={contactModelOpen} onClose={setContactModel} fieldName='assignmentTo' setFieldValue={setFieldValue} />
                    {/* Lead Model  */}
                    <LeadModel isOpen={leadModelOpen} onClose={setLeadModel} fieldName='assignmentToLead' setFieldValue={setFieldValue} />
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                            <Spinner />
                        </Flex>
                        :
                        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
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
                                <Text mb='10px' color={'red'}> {errors.title && touched.title && errors.title}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Related
                                </FormLabel>
                                <RadioGroup onChange={(e) => { setFieldValue('category', e); setFieldValue('assignmentTo', null); setFieldValue('assignmentToLead', null); }} value={values.category}>
                                    <Stack direction='row'>
                                        <Radio value='None' >None</Radio>
                                        <Radio value='contact'>Contact</Radio>
                                        <Radio value='lead'>Lead</Radio>
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
                            {values.category === "contact" ?
                                <>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                            Assignment To  Contact
                                        </FormLabel>
                                        <Flex justifyContent={'space-between'}>
                                            <Select
                                                value={values.assignmentTo}
                                                name="assignmentTo"
                                                onChange={handleChange}
                                                mb={errors.assignmentTo && touched.assignmentTo ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Assignment To'}
                                                borderColor={errors.assignmentTo && touched.assignmentTo ? "red.300" : null}
                                            >
                                                {assignmentToData?.map((item) => {
                                                    return <option value={item._id} key={item._id}>{values.category === 'contact' ? `${item.firstName} ${item.lastName}` : item.leadName}</option>
                                                })}
                                            </Select>
                                            <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                        </Flex>
                                        <Text mb='10px' color={'red'}> {errors.assignmentTo && touched.assignmentTo && errors.assignmentTo}</Text>
                                    </GridItem>
                                </>
                                : values.category === "lead" ?
                                    <>
                                        <GridItem colSpan={{ base: 12, md: 6 }} >
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Assignment To Lead
                                            </FormLabel>
                                            <Flex justifyContent={'space-between'}>
                                                <Select
                                                    value={values.assignmentToLead}
                                                    name="assignmentToLead"
                                                    onChange={handleChange}
                                                    mb={errors.assignmentToLead && touched.assignmentToLead ? undefined : '10px'}
                                                    fontWeight='500'
                                                    placeholder={'Assignment To'}
                                                    borderColor={errors.assignmentToLead && touched.assignmentToLead ? "red.300" : null}
                                                >
                                                    {assignmentToData?.map((item) => {
                                                        return <option value={item._id} key={item._id}>{item.leadName}</option>
                                                    })}
                                                </Select>
                                                <IconButton onClick={() => setLeadModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                            </Flex>
                                            <Text mb='10px' color={'red'}> {errors.assignmentToLead && touched.assignmentToLead && errors.assignmentToLead}</Text>
                                        </GridItem>
                                    </>
                                    : ''
                            }
                            <GridItem colSpan={{ base: 12 }} >
                                <Checkbox isChecked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}>All Day Task ? </Checkbox>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Start Date
                                </FormLabel>
                                <Input
                                    type={isChecked ? 'date' : 'datetime-local'}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.start}
                                    name="start"
                                    fontWeight='500'
                                    borderColor={errors?.start && touched?.start ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.start && touched.start && errors.start}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    End Date
                                </FormLabel>
                                <Input
                                    type={isChecked ? 'date' : 'datetime-local'}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.end}
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
                            <GridItem colSpan={{ base: 12 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Reminder
                                </FormLabel>
                                <RadioGroup onChange={(e) => setFieldValue('reminder', e)} value={values.reminder}>
                                    <Stack direction='row'>
                                        <Radio value='None' >None</Radio>
                                        <Radio value='email'>Email</Radio>
                                        <Radio value='sms'>Sms</Radio>
                                    </Stack>
                                </RadioGroup>
                                <Text mb='10px' color={'red'}> {errors.reminder && touched.reminder && errors.reminder}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }} >
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
                    <Button variant='brand' onClick={handleSubmit}>Update</Button>
                    <Button ml={2} onClick={() => onClose(false)}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditTask
