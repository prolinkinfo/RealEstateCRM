import { AddIcon } from '@chakra-ui/icons'
import { Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useFormik } from 'formik'
import { useState } from 'react'
import { postApi } from 'services/api'
import UploadImg from './components/Upload';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AddImage = (props) => {
    const { imageModal, setImageModal, fetchData } = props
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate();

    const initialValues = {
        authImg: '',
        logoSmImg: '',
        logoLgImg: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {
            AddData()
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async () => {
        try {
            setIsLoding(true);
            const formData = new FormData();

            if (values?.authImg) {
                formData?.append('authImg', values?.authImg?.[0]);
            }

            if (values?.logoSmImg) {
                formData?.append('logoSmImg', values?.logoSmImg?.[0]);
            }

            if (values?.logoLgImg) {
                formData?.append('logoLgImg', values?.logoLgImg?.[0]);
            }

            if (values?.authImg || values?.logoSmImg || values?.logoLgImg) {
                const response = await postApi('api/images/add-auth-logo-img', formData);

                if (response.status === 200) {
                    setImageModal(false);
                    resetForm();
                    toast.success(response?.data?.message);
                } else {
                    toast.error(response?.response?.data?.message);
                }
            }

        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    return (
        <Modal onClose={() => setImageModal(false)} isOpen={imageModal} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <UploadImg id='authImg' count={values?.authImg?.length} onFileSelect={(file) => setFieldValue('authImg', file)} text="Image for Authentication Display" />
                            <UploadImg id='logoSmImg' count={values?.logoSmImg?.length} onFileSelect={(file) => setFieldValue('logoSmImg', file)} text="Small Logo Image" />
                            <UploadImg id='logoLgImg' count={values?.logoLgImg?.length} onFileSelect={(file) => setFieldValue('logoLgImg', file)} text="Large Logo Image" />
                            <Text mb='10px' color={'red'}> {errors.lead && touched.lead && <>Please Select </>}</Text>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' onClick={handleSubmit} disabled={isLoding ? true : false} rightIcon={<AddIcon />}>{isLoding ? <Spinner /> : 'Add'}</Button>
                    <Button onClick={() => {
                        setImageModal(false)
                        formik.resetForm()
                    }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddImage