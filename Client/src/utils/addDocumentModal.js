import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormLabel, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useFormik } from 'formik';
import Spinner from 'components/spinner/Spinner';
import { postApi } from 'services/api';
import { documentSchema } from 'schema';
import FormDataUse, { commonUtils } from './formDataUse';
import Upload from '../views/admin/document/component/Upload'

const AddDocumentModal = ({ setAddDocument, addDocument, linkId, from, setAction, fetchData }) => {
    const [isLoding, setIsLoding] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))

    const initialValues = {
        folderName: '',
        files: '',
        filename: '',
        linkLead: from === 'lead' && linkId,
        linkContact: from === 'contact' && linkId,
        createBy: user._id
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: documentSchema,
        onSubmit: (values, { resetForm }) => {
            addData();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik


    const addData = async () => {
        try {
            setIsLoding(true)
            const payload = commonUtils.formData(values)

            let response = await postApi(from === 'lead' ? 'api/document/addDocumentLead' : 'api/document/addDocumentContact', payload);
            if (response && response.status === 200) {
                formik.resetForm();
                // setAction((pre) => !pre)
                fetchData(2)
                setAddDocument(false)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };
    return (
        <Modal onClose={() => setAddDocument(false)} isOpen={addDocument} isCentered>
            <ModalOverlay />
            <ModalContent maxWidth={"2xl"}>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box >
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            Folder Name<Text color={"red"}>*</Text>
                        </FormLabel>
                        <Input
                            fontSize='sm'
                            onChange={handleChange}
                            value={values.folderName}
                            name="folderName"
                            placeholder='Enter Folder Name'
                            fontWeight='500'
                            borderColor={errors?.folderName && touched?.folderName ? "red.300" : null}
                        />
                        <Text mb='10px' color={'red'}> {errors.folderName && touched.folderName && errors.folderName}</Text>
                    </Box>
                    <Box >
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            File Name
                        </FormLabel>
                        <Input
                            fontSize='sm'
                            onChange={handleChange}
                            value={values.filename}
                            name="filename"
                            placeholder='Enter File Name'
                            fontWeight='500'
                            borderColor={errors?.filename && touched?.filename ? "red.300" : null}
                        />
                        <Text mb='10px' color={'red'}> {errors.filename && touched.filename && errors.filename}</Text>
                    </Box>
                    <Upload count={values.files.length} onFileSelect={(file) => setFieldValue('files', file)} />              </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' mr={2} onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
                    <Button size="sm" variant="outline" colorScheme="red" onClick={() => { setAddDocument(false); resetForm() }} >Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddDocumentModal
