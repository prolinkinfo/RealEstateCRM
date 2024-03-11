import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { HSeparator } from 'components/separator/Separator'
import { postApi } from 'services/api'
import { moduleAddSchema } from 'schema/moduleAddSchema'
import { toast } from 'react-toastify'



const Add = (props) => {
    const { onClose, isOpen, fetchData, setAction } = props;
    const [isLoding, setIsLoding] = useState(false)

    const initialValues = {
        moduleName: "",
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: moduleAddSchema,
        onSubmit: (values, { resetForm }) => {
            AddData()
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik
    console.log(errors);

    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/custom-field/add-module', values);
            if (response.status === 200) {
                fetchData()
                onClose()
                resetForm()
                setAction((pre) => !pre)
            } else {
                toast.error(response.response.data.message);
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
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
