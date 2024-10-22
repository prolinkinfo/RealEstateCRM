import { CloseIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex,  IconButton} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { putApi } from 'services/api';
import { getApi } from 'services/api';
import { generateValidationSchema } from '../../../utils';
import CustomForm from '../../../utils/customForm';
import * as yup from 'yup'

const Edit = (props) => {
    const [isLoding, setIsLoding] = useState(false);
    const initialFieldValues = Object.fromEntries(
        (props?.moduleData?.fields || []).map(field => [field?.name, ''])
    );

    const [initialValues, setInitialValues] = useState({
        ...initialFieldValues,
        createBy: JSON.parse(localStorage.getItem('user'))._id
    })
    const param = useParams()
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: yup.object().shape(generateValidationSchema(props?.moduleData?.fields)),
        onSubmit: (values, { resetForm }) => {
            EditData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const EditData = async () => {
        try {
            setIsLoding(true)
            let response = await putApi(`api/form/edit/${props?.selectedId || param.id}`, { ...values, moduleId: props.moduleId })
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
        formik.resetForm();
    }
    let response;
    const fetchData = async () => {
        if (props?.selectedId || param.id) {
            try {
                setIsLoding(true)
                response = await getApi(`api/form/view/${props?.selectedId || param.id}?moduleId=${props.moduleId}`)
                let editData = response?.data?.data;
                setInitialValues((prev) => ({ ...prev, ...editData }));

            } catch (e) {
                console.error(e)
            } finally {
                setIsLoding(false)
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [props?.selectedId])

    return (
        <div>
            <Drawer isOpen={props.isOpen} size={props.size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader alignItems={"center"} justifyContent='space-between' display='flex' >
                        Edit {props.title}
                        <IconButton onClick={handleClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>

                        {isLoding ?
                            <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                                <Spinner />
                            </Flex>
                            :
                            <CustomForm moduleData={props.moduleData} values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} />

                        }
                    </DrawerBody>
                    <DrawerFooter>
                        <Button
                            sx={{ textTransform: "capitalize" }}
                            variant="brand" size="sm"
                            type="submit"
                            disabled={isLoding ? true : false}
                            onClick={handleSubmit}
                        >
                            {isLoding ? <Spinner /> : 'Update'}
                        </Button>
                        <Button
                            variant="outline"
                            colorScheme='red' size="sm"
                            sx={{
                                marginLeft: 2,
                                textTransform: "capitalize",
                            }}
                            onClick={handleClose}
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