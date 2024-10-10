import { Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useFormik } from 'formik'
import { useState } from 'react'
import { postApi } from 'services/api'
import Upload from './Upload'

const PropertyPhoto = (props) => {
    const { onClose, isOpen, fetchData, text } = props
    const [isLoding, setIsLoding] = useState(false)

    const initialValues = {
        property: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {
            AddData();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            const formData = new FormData();
            // Append property to the formData
            values.property.forEach((file) => {
                formData?.append('property', file);
            });
            let response;
            if (text === 'Property Photos') {
                response = await postApi(`api/property/add-property-photos/${props.id}`, formData);
            } else if (text === 'Virtual Tours or Videos') {
                response = await postApi(`api/property/add-virtual-tours-or-videos/${props.id}`, formData);
            } else if (text === 'Floor Plans') {
                response = await postApi(`api/property/add-floor-plans/${props.id}`, formData);
            } else if (text === 'Property Documents') {
                response = await postApi(`api/property/add-property-documents/${props.id}`, formData);
            }

            if (response?.status === 200) {
                fetchData(1);
                formik.resetForm()
                onClose();
            }

        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };


    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select {text} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <Upload count={values.property.length} onFileSelect={(file) => setFieldValue('property', file)} text={text} />
                            <Text mb='10px' color={'red'}> {errors.property && touched.property && <>Please Select {text}</>}</Text>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' onClick={handleSubmit} mr={1} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => {
                        onClose()
                        formik.resetForm()
                    }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default PropertyPhoto
