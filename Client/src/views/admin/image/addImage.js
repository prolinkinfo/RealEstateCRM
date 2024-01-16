import { AddIcon } from '@chakra-ui/icons'
import { Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useFormik } from 'formik'
import { useState } from 'react'
import { postApi } from 'services/api'
import Upload from '../property/components/Upload'
import { useNavigate } from 'react-router-dom'

const AddImage = (props) => {
    const { imageModal, setImageModal, fetchData } = props
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate();

    const initialValues = {
        authImg: ''
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
            setIsLoding(true)
            resetForm()

            const response = await postApi('api/images/change-authImg', values)
            if (response.status === 200) {
                setImageModal(false)
                console.log(response)
            }


        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    console.log(values)

    return (
        <Modal onClose={() => setImageModal(false)} isOpen={imageModal} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <Upload count={values?.image?.length} onFileSelect={(file) => setFieldValue('authImg', file)} />
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