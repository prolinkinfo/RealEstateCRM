import { AddIcon } from '@chakra-ui/icons'
import { Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useFormik } from 'formik'
import { useState } from 'react'
import { postApi } from 'services/api'
import Upload from './Upload'
import { useNavigate } from 'react-router-dom'

const ImportModal = (props) => {
    const { onClose, isOpen, fetchData, text, fieldsInCrm } = props
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate();

    const initialValues = {
        lead: ''
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

            if (values.lead) {
                onClose();
                navigate('/leadImport', { state: { fileData: values.lead } });
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
                <ModalHeader>Import Leads</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <Upload count={values.lead.length} onFileSelect={(file) => setFieldValue('lead', file)} text={text} />
                            <Text mb='10px' color={'red'}> {errors.lead && touched.lead && <>Please Select {text}</>}</Text>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' size="sm" onClick={handleSubmit} disabled={isLoding ? true : false} rightIcon={<AddIcon />}>{isLoding ? <Spinner /> : 'Add'}</Button>
                    <Button variant="outline"
                        colorScheme="red" sx={{
                            textTransform: "capitalize",
                        }} size="sm" onClick={() => {
                            onClose()
                            formik.resetForm()
                        }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ImportModal