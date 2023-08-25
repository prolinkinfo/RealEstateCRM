import React, { useEffect, useState } from 'react';
import { Button, FormLabel, Textarea, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, RadioGroup, Stack, Radio } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { postApi } from 'services/api';
import { getApi } from 'services/api';
import { MeetingSchema } from 'schema';
import { AddIcon } from '@chakra-ui/icons';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import Spinner from 'components/spinner/Spinner';
import { toast } from 'react-toastify';

const AddMeeting = (props) => {
    const { onClose, isOpen, fetchData } = props
    const [data, setData] = useState([])
    const [isLoding, setIsLoding] = useState(false)

    const user = JSON.parse(localStorage.getItem('user'))

    const initialValues = {
        agenda: '',
        attendes: [],
        attendesLead: [],
        location: '',
        related: '',
        dateTime: '',
        notes: '',
        createFor: '',
        createdBy: user?._id,
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: MeetingSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            if (values.attendes.length > 0 || values.attendesLead.length > 0) {
                let response = await postApi('api/meeting/add', values)
                if (response.status === 200) {
                    formik.resetForm();
                    props.onClose();
                    fetchData()
                }
            } else {
                toast.error('Select Related To')
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    const fetchContactData = async () => {
        if (props.id) {
            let response = await getApi('api/contact/view/', props.id)
            if (response?.status === 200) {
                setFieldValue('createFor', props?.id);
            }
        }
    }

    const fetchContactAllData = async () => {
        let result
        if (values.related === "contact") {
            result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`)
        } else if (values.related === "lead") {
            result = await getApi(user.role === 'admin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
        }
        setData(result?.data);
    }

    useEffect(() => {
        fetchContactData()
        fetchContactAllData()
    }, [props.id, values.related])

    const extractLabels = (selectedItems) => {
        return selectedItems.map((item) => item._id);
    };

    const countriesWithEmailAsLabel = data?.map((item) => ({
        ...item,
        value: item._id,
        label: values.related === "contact" ? `${item.firstName} ${item.lastName}` : item.leadName,
    }));

    return (
        <Modal onClose={onClose} isOpen={isOpen} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Meeting </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Agenda<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.agenda}
                                name="agenda"
                                placeholder='Agenda'
                                fontWeight='500'
                                borderColor={errors.agenda && touched.agenda ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.agenda && touched.agenda && errors.agenda}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                related To
                            </FormLabel>
                            <RadioGroup onChange={(e) => setFieldValue('related', e)} value={values.related}>
                                <Stack direction='row'>
                                    <Radio value='contact'>Contact</Radio>
                                    <Radio value='lead'>Lead</Radio>
                                </Stack>
                            </RadioGroup>
                            <Text mb='10px' color={'red'}> {errors.related && touched.related && errors.related}</Text>
                        </GridItem>
                        {data?.length > 0 && values.related && <GridItem colSpan={{ base: 12 }}>
                            <CUIAutoComplete
                                label={`Choose preferred attendes ${values.related === "contact" ? "Contact" : values.related === "lead" && "Lead"}`}
                                placeholder="Type a Name"
                                name="attendes"
                                items={countriesWithEmailAsLabel}
                                selectedItems={countriesWithEmailAsLabel?.filter((item) => values.related === "contact" ? values?.attendes.includes(item._id) : values.related === "lead" && values?.attendesLead.includes(item._id))}
                                onSelectedItemsChange={(changes) => {
                                    const selectedLabels = extractLabels(changes.selectedItems);
                                    values.related === "contact" ? setFieldValue('attendes', selectedLabels) : values.related === "lead" && setFieldValue('attendesLead', selectedLabels)
                                }}
                            />
                            <Text color={'red'}> {errors.attendes && touched.attendes && errors.attendes}</Text>
                        </GridItem>
                        }
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Location
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.location}
                                name="location"
                                placeholder='Location'
                                fontWeight='500'
                                borderColor={errors.location && touched.location ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.location && touched.location && errors.location}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Date Time
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                type='datetime-local'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.dateTime}
                                name="dateTime"
                                placeholder='Date Time'
                                fontWeight='500'
                                borderColor={errors.dateTime && touched.dateTime ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.dateTime && touched.dateTime && errors.dateTime}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Notes
                            </FormLabel>
                            <Textarea
                                resize={'none'}
                                fontSize='sm'
                                placeholder='Notes'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.notes}
                                name="notes"
                                fontWeight='500'
                                borderColor={errors.notes && touched.notes ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.notes && touched.notes && errors.notes}</Text>
                        </GridItem>

                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' leftIcon={<AddIcon />} disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Add'}</Button>
                    <Button onClick={() => {
                        formik.resetForm()
                        onClose()
                    }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddMeeting

