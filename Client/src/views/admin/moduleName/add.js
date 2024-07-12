import { Box, Button, Flex, FormLabel, Grid, GridItem, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { postApi } from 'services/api'
import { moduleAddSchema } from 'schema/moduleAddSchema'
import { toast } from 'react-toastify'
import Dropzone from "components/Dropzone";
import { MdUpload } from "react-icons/md";
import { fetchRouteData } from '../../../redux/slices/routeSlice'
import { useDispatch } from 'react-redux'
import { fetchModules } from '../../../redux/slices/moduleSlice'



const Add = (props) => {
    const { onClose, isOpen, fetchData, setAction } = props;
    const [isLoding, setIsLoding] = useState(false)
    const brandColor = useColorModeValue("brand.500", "white");
    const dispatch = useDispatch();
    const initialValues = {
        moduleName: "",
        icon: ""
    };

    const formik = useFormik({
        initialValues: initialValues,
        // validationSchema: validationsAddSchema,
        validationSchema: moduleAddSchema,
        onSubmit: (values, { resetForm }) => {
            AddData()
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            const formData = new FormData();

            formData.append("moduleName", values?.moduleName)
            formData.append("icon", values?.icon?.[0])


            let response = await postApi('api/custom-field/add-module', formData);
            if (response.status === 200) {
                fetchData()
                await dispatch(fetchRouteData());
                await dispatch(fetchModules())
                onClose()
                resetForm()
                setAction((pre) => !pre)
            } else {
                toast.error(response.response.data.message);
            }
        }
        catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while processing your request.");
            }
        }
        finally {
            setIsLoding(false)
        }
    }


    return (
        <div>
            <Modal onClose={onClose} isOpen={isOpen} isCentered size='2xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Module</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                                <GridItem colSpan={{ base: 12 }}>
                                    <Dropzone
                                        w={{ base: "100%" }}
                                        me='36px'
                                        minH={100}
                                        img={props.text === 'Property Photos' ? 'img' : ''}
                                        isMultipleAllow={false}
                                        height={'100%'}
                                        onFileSelect={(file) => setFieldValue('icon', file)}
                                        content={
                                            <Box>
                                                <Icon as={MdUpload} w='50px' h='50px' color={brandColor} />
                                                <Flex justify='center' mx='auto' mb='12px'>
                                                    <Text fontSize='sm' fontWeight='700' color={brandColor}>
                                                        Upload File
                                                    </Text>
                                                </Flex>
                                                {values?.icon.length > 0 && <Text fontSize='sm' fontWeight='500' color='secondaryGray.500'>
                                                    Selected Files : {values?.icon.length}
                                                </Text>}
                                            </Box>
                                        }
                                    />
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Name<Text color={"red"}>*</Text>
                                    </FormLabel>
                                    <Input
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.moduleName}
                                        name="moduleName"
                                        placeholder='Enter Name'
                                        fontWeight='500'
                                        borderColor={errors.moduleName && touched.moduleName ? "red.300" : null}
                                    />
                                    <Text mb='10px' fontSize='sm' color={'red'}> {errors.moduleName && touched.moduleName && errors.moduleName}</Text>
                                </GridItem>
                            </Grid>
                        </>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" size='sm' mr={2} disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Save'}</Button>
                        <Button sx={{
                            textTransform: "capitalize",
                        }} variant="outline"
                            colorScheme="red" size="sm" onClick={() => { onClose(); resetForm() }}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Add
