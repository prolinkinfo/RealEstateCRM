import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { Button, FormLabel, Grid, GridItem, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { userSchema } from 'schema';
import { putApi } from 'services/api';
import { postApi } from 'services/api';
import * as yup from 'yup';

const Editopportunityproject = (props) => {
    const { onClose, isOpen, setAction, data, userAction, userData, editData, selectedId, fetchData, setUserAction } = props
    // console.log(selectedId, data, "selectedId")
    const [isLoding, setIsLoding] = useState(false)
    const [show, setShow] = React.useState(false);
    const [modelEdit, setmodelEdit] = useState(true)
    const showPass = () => setShow(!show);
    const validationSchema = yup.object({
        name: yup.string().required("Name is required"),
        requirement: yup.string().required("Requirement is required"),
    });
    const initialValues = {
        name: userAction === "add" ? '' : data?.name,
        requirement: userAction === "add" ? '' : data?.requirement,
    }
    const user = JSON.parse(window.localStorage.getItem('user'))
    // console.log(data, "dataaa")
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            AddData();
        }
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik
    // console.log(errors)
    const AddData = async () => {
        // console.log(userAction, "hello")
        if (userAction === "add") {
            try {
                setIsLoding(true)
                let response = await postApi('api/opportunityproject/add', values)
                console.log(response, "response")
                if (response && response.status === 200) {
                    onClose();
                    resetForm();
                    setAction((pre) => !pre)
                    setUserAction('')
                } else {
                    toast.error(response.response.data?.message)
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
                let response = await putApi(`api/opportunityproject/edit/${selectedId}`, values)
                console.log(response, "edit response dataaa")
                if (response && response.status === 200) {
                    // setEdit(false)
                    fetchData()
                    let updatedUserData = userData; // Create a copy of userData
                    if (user?._id === selectedId) {
                        if (updatedUserData && typeof updatedUserData === 'object') {
                            // Create a new object with the updated firstName
                            updatedUserData = {
                                ...updatedUserData,
                                Name: values?.name,
                                Requirement: values?.requirement
                            };
                        }
                        const updatedDataString = JSON.stringify(updatedUserData);
                        localStorage.setItem('user', updatedDataString);
                        // dispatch(setUser(updatedDataString));
                    }
                    // dispatch(fetchRoles(user?._id))
                    onClose();
                    setUserAction('')
                    console.log("hello")
                    setAction((pre) => !pre)
                } else {
                    toast.error(response.response.data?.message)
                }
            } catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        }
    };
    const handleEditClose = () => {
        setmodelEdit(false)
    }
    // console.log(userData, "userData")
    return (
        <Modal isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    {userAction === "add" ? "Add Opportunity Project" : "Edit Opportunity Project"}
                    <IconButton onClick={onClose} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Name<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.name}
                                name="name"
                                placeholder='Name'
                                fontWeight='500'
                                borderColor={errors.name && touched.name ? "red.300" : null}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <Text mb='10px' color={'red'}>{errors.name && touched.name && errors.name}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Requirement
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.requirement}
                                name="requirement"
                                placeholder='Requirement'
                                fontWeight='500'
                                borderColor={errors.requirement && touched.requirement ? "red.300" : null}
                                error={formik.touched.requirement && Boolean(formik.errors.requirement)}
                                helperText={formik.touched.requirement && formik.errors.requirement}
                            />
                            <Text mb='10px' color={'red'}>{errors.requirement && touched.requirement && errors.requirement}</Text>
                        </GridItem>
                        {/* <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Email<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                type='email'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.username}
                                name="username"
                                disabled={userAction === 'edit'}
                                placeholder='Email Address'
                                fontWeight='500'
                                borderColor={errors.username && touched.username ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.username && touched.username && errors.username}</Text>
                        </GridItem> */}
                        {/* <GridItem colSpan={{ base: 12 }}>
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
                        </GridItem> */}
                        {/* {
                            userAction !== "edit" &&
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Name
                                </FormLabel>
                                <InputGroup size='md'>
                                    <Input
                                        isRequired={true}
                                        fontSize='sm'
                                        placeholder='Enter Your Name'
                                        name='name'
                                        size='lg'
                                        variant='auth'
                                        type={show ? "text" : "name"}
                                        value={values.name} onChange={handleChange} onBlur={handleBlur}
                                        borderColor={errors.name && touched.name ? "red.300" : null}
                                        className={errors.name && touched.name ? "isInvalid" : null}
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
                                <Text mb='10px' color={'red'}> {errors.name && touched.name && errors.name}</Text>
                            </GridItem>
                        }  */}
                    </Grid>

                </ModalBody>
                <ModalFooter>
                    <Button size="sm" disabled={isLoding ? true : false} variant="brand" type="submit" onClick={handleSubmit}                        >
                        {isLoding ? <Spinner /> : 'Save'}
                    </Button>

                    <Button sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" size="sm" onClick={() => {
                            formik.resetForm()
                            onClose()
                        }}>Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Editopportunityproject
