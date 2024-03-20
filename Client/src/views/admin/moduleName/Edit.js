import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { HSeparator } from 'components/separator/Separator'
import { putApi } from 'services/api'
import { moduleAddSchema } from 'schema/moduleAddSchema'



const Edit = (props) => {
    const { onClose, isOpen, fetchData, selectedId, editdata, setAction } = props;
    const [isLoding, setIsLoding] = useState(false)

    const initialValues = {
        moduleName: editdata?.moduleName ? editdata?.moduleName : "",

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
        try {

            let response = await putApi(`api/custom-field/change-module-name/${selectedId}`, values);
            if (response.status === 200) {
                onClose()
                fetchData()

                setAction((pre) => !pre)
            }
        }
        catch {
        }
        finally {
        }
    }

    const { errors, touched, values, handleBlur, handleChange, handleSubmit } = formik
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
