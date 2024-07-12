import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { Button, FormLabel, Grid, GridItem, IconButton, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchRoles } from '../../../redux/slices/roleSlice';
import { userSchema } from 'schema';
import { putApi } from 'services/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/slices/localSlice';


const Edit = (props) => {
    const { isOpen, fetchData, data, userData, setEdit } = props

    const initialValues = {
        firstName: data ? data?.firstName : '',
        lastName: data ? data?.lastName : '',
        username: data ? data?.username : '',
        phoneNumber: data ? data?.phoneNumber : ''
    }

    const user = JSON.parse(window.localStorage.getItem('user'))

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: userSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            EditData();
            resetForm();
        },
    });
    const dispatch = useDispatch()

    const handleCloseModal = () => {
        setEdit(false);
        resetForm();
    };
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, resetForm } = formik

    const [isLoding, setIsLoding] = useState(false)

    const EditData = async () => {
        try {
            setIsLoding(true)
            let response = await putApi(`api/user/edit/${props.selectedId}`, values)
            if (response && response.status === 200) {
                setEdit(false)
                let updatedUserData = userData; // Create a copy of userData
                if (user?._id === props.selectedId) {
                    if (updatedUserData && typeof updatedUserData === 'object') {
                        // Create a new object with the updated firstName
                        updatedUserData = {
                            ...updatedUserData,
                            firstName: values?.firstName,
                            lastName: values?.lastName
                        };
                    }

                    const updatedDataString = JSON.stringify(updatedUserData);
                    localStorage.setItem('user', updatedDataString);
                    dispatch(setUser(updatedDataString));
                }


                dispatch(fetchRoles(user?._id))
                handleCloseModal();
                fetchData()
                props.setAction((pre) => !pre)
            } else {
                toast.error(response.response.data?.message)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };


    return (
        <Modal isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Edit User
                    <IconButton onClick={() => setEdit(false)} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                First Name<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.firstName}
                                name="firstName"
                                placeholder='firstName'
                                fontWeight='500'
                                borderColor={errors.firstName && touched.firstName ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.firstName && touched.firstName && errors.firstName}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Last Name
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.lastName}
                                name="lastName"
                                placeholder='Last Name'
                                fontWeight='500'
                                borderColor={errors.lastName && touched.lastName ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.lastName && touched.lastName && errors.lastName}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Email<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                type='email'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.username}
                                name="username"
                                placeholder='Email Address'
                                fontWeight='500'
                                borderColor={errors.username && touched.username ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.username && touched.username && errors.username}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Phone Number<Text color={"red"}>*</Text>
                            </FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                />
                                <Input type="tel"
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.phoneNumber}
                                    name="phoneNumber"
                                    fontWeight='500'
                                    borderColor={errors.phoneNumber && touched.phoneNumber ? "red.300" : null}
                                    placeholder="Phone number" borderRadius="16px" />
                            </InputGroup>
                            <Text mb='10px' color={'red'}>{errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}</Text>
                        </GridItem>
                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Update'}</Button>
                    <Button variant="outline"
                        colorScheme='red' size="sm"
                        sx={{
                            marginLeft: 2,
                            textTransform: "capitalize",
                        }} onClick={() => handleCloseModal()}>close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Edit
