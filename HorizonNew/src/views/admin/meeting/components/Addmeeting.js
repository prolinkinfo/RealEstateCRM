import React, { useEffect, useState } from 'react';
import { Button, FormLabel, Textarea, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { postApi } from 'services/api';
import { getApi } from 'services/api';
import { MeetingSchema } from 'schema';
import { AddIcon } from '@chakra-ui/icons';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';

const AddMeeting = (props) => {
    const { onClose, isOpen, fetchData } = props
    const [data, setData] = useState([])

    const user = JSON.parse(localStorage.getItem('user'))

    const initialValues = {
        agenda: '',
        attendes: [],
        location: '',
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
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue } = formik

    const AddData = async () => {
        try {
            let response = await postApi('api/meeting/add', values)
            if (response.status === 200) {
                props.onClose();
                fetchData()
            }
        } catch (e) {
            console.log(e);
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
        let response = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        if (response?.status === 200) {
            setData(response?.data);
        }
    }

    useEffect(() => {
        fetchContactData()
        fetchContactAllData()
    }, [props.id])


    const extractLabels = (selectedItems) => {
        return selectedItems.map((item) => item._id);
    };
    const countriesWithEmailAsLabel = data?.map((item) => ({
        ...item,
        value: item._id,
        label: item.email,
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
                        <GridItem colSpan={{ base: 12 }}>
                            <CUIAutoComplete
                                label="Choose preferred attendes"
                                placeholder="Type a Contact Email"
                                name="attendes"
                                items={countriesWithEmailAsLabel}
                                selectedItems={countriesWithEmailAsLabel.filter((item) => values.attendes.includes(item._id))}
                                onSelectedItemsChange={(changes) => {
                                    const selectedLabels = extractLabels(changes.selectedItems);
                                    setFieldValue('attendes', selectedLabels);
                                }}
                            />
                            <Text color={'red'}> {errors.attendes && touched.attendes && errors.attendes}</Text>
                        </GridItem>
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
                    <Button variant='brand' leftIcon={<AddIcon />} onClick={handleSubmit}>Add</Button>
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

