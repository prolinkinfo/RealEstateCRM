import React from 'react';
import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, InputGroup, InputRightElement, Icon, IconButton, InputLeftElement } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { userSchema } from 'schema';
import { postApi } from 'services/api';
import { RiEyeCloseLine } from 'react-icons/ri';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';


const AddUser = (props) => {
    const { onClose, isOpen, fetchData } = props

    const [show, setShow] = React.useState(false);
    const showPass = () => setShow(!show);

    const initialValues = {
        firstName: '',
        lastName: '',
        username: '',
        phoneNumber: '',
        password: '',
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: userSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async () => {
        try {
            let response = await postApi('api/user/register', values)
            if (response && response.status === 200) {
                props.onClose();
                // fetchData()
            } else {
                toast.error(response.response.data?.message)
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Modal isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Add User
                    <IconButton onClick={onClose} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                First Name
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
                                Email
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
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Password
                            </FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    isRequired={true}
                                    fontSize='sm'
                                    placeholder='Enter Your Password'
                                    name='password'
                                    size='lg'
                                    variant='auth'
                                    type={show ? "text" : "password"}
                                    value={values.password} onChange={handleChange} onBlur={handleBlur}
                                    borderColor={errors.password && touched.password ? "red.300" : null}
                                    className={errors.password && touched.password ? "isInvalid" : null}
                                />
                                <InputRightElement display='flex' alignItems='center' mt='4px'>
                                    <Icon
                                        color={'gray.400'}
                                        _hover={{ cursor: "pointer" }}
                                        as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                        onClick={showPass}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <Text mb='10px' color={'red'}> {errors.password && touched.password && errors.password}</Text>
                        </GridItem>

                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' onClick={handleSubmit}>Add</Button>
                    <Button onClick={() => {
                        formik.resetForm()
                        onClose()
                    }}>Clear</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddUser
