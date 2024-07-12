import {  Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useBreakpointValue } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useFormik } from 'formik'
import { useState } from 'react'
import { postApi } from 'services/api'
import UploadImg from './components/Upload';
import { toast } from 'react-toastify'
import { fetchImage } from '../../../redux/slices/imageSlice'
import { useDispatch } from 'react-redux'

const AddImage = (props) => {
    const { imageModal, setImageModal } = props
    const [isLoding, setIsLoding] = useState(false)

    const dispatch = useDispatch()

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
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm, dirty } = formik

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
                    dispatch(fetchImage());
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
        <Modal onClose={() => setImageModal(false)} size={"xl"} isOpen={imageModal} isCentered={useBreakpointValue({ base: false, md: true })}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 6, md: 12, sm: 12, lg: 6 }}>
                            <UploadImg id='logoLgImg' count={values?.logoLgImg?.length} onFileSelect={(file) => setFieldValue('logoLgImg', file)} text="Large Logo " />
                        </GridItem>
                        <GridItem colSpan={{ base: 6, md: 12, sm: 12, lg: 6 }}>
                            <UploadImg id='logoSmImg' count={values?.logoSmImg?.length} onFileSelect={(file) => setFieldValue('logoSmImg', file)} text="Small Logo " />
                        </GridItem>
                        <GridItem display={{ lg: 'flex' }} justifyContent={{ lg: 'center' }} colSpan={{ base: 12, md: 12, sm: 12, lg: 12 }}>
                            <UploadImg id='authImg' count={values?.authImg?.length} onFileSelect={(file) => setFieldValue('authImg', file)} text="Login Page Image" />
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button me={2} variant='brand' onClick={handleSubmit} disabled={isLoding || !(values?.authImg && values?.logoSmImg && values?.logoLgImg) ? true : false} size='sm' >{isLoding ? <Spinner /> : 'Save'}</Button>
                    <Button variant="outline"
                        size='sm'
                        colorScheme="red" onClick={() => {
                            setImageModal(false)
                            formik.resetForm()
                        }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddImage