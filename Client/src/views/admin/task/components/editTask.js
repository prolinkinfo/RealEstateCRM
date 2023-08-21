import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Select, Stack, Text, Textarea, useBreakpointValue } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { TaskSchema } from 'schema';
import { putApi } from 'services/api';
import { getApi } from 'services/api';

const EditTask = (props) => {
    const { onClose, isOpen, fetchData } = props
    const [isChecked, setIsChecked] = useState();
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const [contactData, setContactData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))

    const initialValues = {
        title: '',
        category: 'None',
        description: '',
        notes: '',
        assignmentTo: '',
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
            let response = await putApi(`api/task/edit/${props.id}`, values)
            if (response.status === 200) {
                formik.resetForm()
                props.viewClose();
                onClose(false)
                fetchData()
            }
        } catch (e) {
            console.log(e);
        }
    };

    const fetchTaskData = async () => {
        if (props.id) {
            try {
                let result = await getApi('api/task/view/', props.id)

                values.title = result?.data?.title
                values.category = result?.data?.category
                values.description = result?.data?.description
                values.notes = result?.data?.notes
                values.assignmentTo = result?.data?.assignmentTo
                values.reminder = result?.data?.reminder
                values.start = result?.data?.start
                values.end = result?.data?.end
                values.backgroundColor = result?.data?.backgroundColor
                values.borderColor = result?.data?.borderColor
                values.textColor = result?.data?.textColor
                values.display = result?.data?.display
                values.url = result?.data?.url
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    const getContactDetails = async () => {
        try {
            let result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
            setContactData(result?.data)
        }
        catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        getContactDetails()
        fetchTaskData()
    }, [props])

    return (
        <Modal isOpen={isOpen} size={'xl'} isCentered={useBreakpointValue({ base: false, md: true })}>
            {/* <ModalOverlay /> */}
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Edit Task
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>

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
                                Category
                            </FormLabel>
                            <Select
                                value={values.category}
                                name="category"
                                onChange={handleChange}
                                mb={errors.category && touched.category ? undefined : '10px'}
                                fontWeight='500'
                                placeholder={'Select Category'}
                                borderColor={errors.category && touched.category ? "red.300" : null}
                            >
                                <option value="None">None</option>
                                <option value="call">Call</option>
                                <option value="email">Email</option>
                                <option value="meeting">Meeting</option>
                            </Select>
                            <Text mb='10px' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
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
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Assignment To
                            </FormLabel>
                            <Select
                                value={values.assignmentTo}
                                name="assignmentTo"
                                onChange={handleChange}
                                mb={errors.assignmentTo && touched.assignmentTo ? undefined : '10px'}
                                fontWeight='500'
                                placeholder={'Assignment To'}
                                borderColor={errors.assignmentTo && touched.assignmentTo ? "red.300" : null}
                            >
                                <option value="">None</option>
                                {contactData?.map((item) => {
                                    return <option value={item._id} key={item._id}>{item.email}</option>
                                })}
                            </Select>
                            <Text mb='10px' color={'red'}> {errors.assignmentTo && touched.assignmentTo && errors.assignmentTo}</Text>
                        </GridItem>
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
                        <GridItem colSpan={{ base: 12, md: 6 }} >
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
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Full screen event
                            </FormLabel>
                            <RadioGroup onChange={(e) => setFieldValue('display', e)} value={values.display}>
                                <Stack direction='row'>
                                    <Radio value='background' >Yes</Radio>
                                    <Radio value='no'>No</Radio>
                                </Stack>
                            </RadioGroup>
                            <Text mb='10px' color={'red'}> {errors.display && touched.display && errors.display}</Text>
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

                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' onClick={handleSubmit}>Edit</Button>
                    <Button onClick={() => formik.resetForm()}>Clear</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditTask
