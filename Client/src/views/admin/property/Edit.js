import { CloseIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, IconButton } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApi, putApi } from 'services/api';
import { generateValidationSchema } from 'utils';
import CustomForm from 'utils/customForm';
import * as yup from 'yup'

const Edit = (props) => {
    const { data } = props
    const initialFieldValues = Object.fromEntries(
        (props?.leadData?.fields || []).map(field => [field?.name, ''])
    );
    const [initialValues, setInitialValues] = useState({
        ...initialFieldValues,
        createBy: JSON.parse(localStorage.getItem('user'))._id
    })

    const param = useParams()

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: yup.object().shape(generateValidationSchema(props?.propertyData?.fields)),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            EditData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik;

    const [isLoding, setIsLoding] = useState(false)

    const EditData = async () => {
        try {
            setIsLoding(true)
            let response = await putApi(`api/property/edit/${props?.selectedId || param.id}`, values)
            if (response.status === 200) {
                props.onClose();
                props.setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    const handleClose = () => {
        props.onClose(false)
        props.setSelectedId && props?.setSelectedId()
    }

    let response


    const fetchData = async () => {
        if (data) {
            setInitialValues((prev) => ({ ...prev, ...data }))
        } else if (props?.selectedId) {
            try {
                setIsLoding(true)
                response = await getApi('api/property/view/', props?.selectedId)
                setInitialValues((prev) => ({ ...prev, ...response?.data?.property }))
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoding(false)
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [props?.selectedId, data])

    return (
        <div>
            <Drawer isOpen={props.isOpen} size={props.size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader alignItems={"center"} justifyContent='space-between' display='flex' >
                        Edit Property
                        <IconButton onClick={handleClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>
                        {isLoding ?
                            <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                                <Spinner />
                            </Flex>
                            :
                            <CustomForm moduleData={props.propertyData} values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} />
                        }
                    </DrawerBody>
                    <DrawerFooter>
                        <Button size="sm"
                            sx={{ textTransform: "capitalize" }}
                            variant="brand"
                            disabled={isLoding ? true : false}
                            type="submit"
                            onClick={handleSubmit}
                        >
                            {isLoding ? <Spinner /> : 'Update'}
                        </Button>
                        <Button size="sm"
                            variant="outline"
                            colorScheme='red'
                            sx={{
                                marginLeft: 2,
                                textTransform: "capitalize",
                            }}
                            onClick={() => { props.onClose(false) }}
                        >
                            Close
                        </Button>
                    </DrawerFooter>

                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default Edit