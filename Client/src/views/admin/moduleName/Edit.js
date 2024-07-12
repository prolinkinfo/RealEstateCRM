import {Button, FormLabel, Grid, GridItem, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import React, {useState } from 'react'
import { useFormik } from 'formik'
import { HSeparator } from 'components/separator/Separator'
import { putApi } from 'services/api'
import { moduleAddSchema } from 'schema/moduleAddSchema'
import Dropzone from "components/Dropzone";
import { toast } from 'react-toastify'
import { fetchRouteData } from '../../../redux/slices/routeSlice'
import { useDispatch } from 'react-redux'

const Edit = (props) => {
    const { onClose, isOpen, fetchData, selectedId, editdata, setAction } = props;
    const [isLoding, setIsLoding] = useState(false)
    const dispatch = useDispatch();

    const initialValues = {
        moduleName: editdata?.moduleName ? editdata?.moduleName : "",
        icon: ''
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: moduleAddSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            EditData()
            resetForm()
        },
    });

    const EditData = async () => {
        let response = await putApi(`api/custom-field/change-module-name/${selectedId}`, values);
        if (response.status === 200) {
            await dispatch(fetchRouteData())
            onClose()
            fetchData()
            setAction((pre) => !pre)
            toast.success(response?.data?.message);
        } else {
            toast.error(response?.response?.data?.message);
        }
    }

    const changeImage = async (file) => {
        try {
            setIsLoding(true);
            const formData = new FormData();

            formData.append("icon", file?.[0])
            const response = await putApi(`api/custom-field/change-icon/${editdata?._id}`, formData);
            if (response.status === 200) {
                await dispatch(fetchRouteData());
                onClose();
                setAction((pre) => !pre)
                toast.success(response?.data?.message);
            } else {
                toast.error(response?.response?.data?.message);
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue } = formik
    return (
        <div>
            <Modal onClose={onClose} isOpen={isOpen} isCentered size='2xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Module Name </ModalHeader>
                    <ModalCloseButton />
                    <HSeparator />
                    <ModalBody>
                        <>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12 }}>
                                    <div className="imageCard" style={{ margin: "10px" }}>
                                        <Image src={editdata?.icon} height={"20%"} width={"20%"} />
                                        <div className='imageContent'>
                                            <Dropzone
                                                borderRadius="0"
                                                isMultipleAllow={false}
                                                onFileSelect={(file) => changeImage(file)}
                                                content={
                                                    <Button size='sm' variant="brand">Change</Button>
                                                }
                                            />
                                        </div>
                                    </div>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='2px'>
                                        Name
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
                                    <Text mb='10px' color={'red'}> {errors.moduleName && touched.moduleName && errors.moduleName}</Text>
                                </GridItem>
                            </Grid>
                        </>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" size='sm' mr={2} disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Update'}</Button>
                        <Button sx={{
                            textTransform: "capitalize",
                        }} variant="outline"
                            colorScheme="red" size="sm" onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Edit
