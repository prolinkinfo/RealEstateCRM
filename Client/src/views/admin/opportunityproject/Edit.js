import { CloseIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, Grid, Text, GridItem, FormLabel, Input, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, IconButton } from '@chakra-ui/react';
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
    const { data } = props;
    const [isLoding, setIsLoding] = useState(false);
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
        enableReinitialize: true,
        validationSchema: yup.object().shape(generateValidationSchema(props?.leadData?.fields)),
        onSubmit: (values, { resetForm }) => {
            EditData();
        },
    });
    const validationSchema = yup.object({
        name: yup.string().required("Name is required"),
        requirement: yup.string().required("Requirement is required"),
    });
    // const initialValues = {
    //     name: data?.name,
    //     requirement: data?.requirement
    // }
    // const user = JSON.parse(window.localStorage.getItem('user'))

    // const formik = useFormik({
    //     initialValues: initialValues,
    //     validationSchema,
    //     enableReinitialize: true,
    //     onSubmit: (values) => {
    //         EditData();
    //     }
    // });
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

    let response
    const fetchData = async () => {
        if (data) {
            setInitialValues((prev) => ({ ...prev, ...data }))
        } else if (props?.selectedId) {
            // } else if (props?.selectedId || param.id) {
            try {
                setIsLoding(true)
                response = await getApi('api/lead/view/', props?.selectedId)
                let editData = response?.data?.lead;
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
    }, [props?.selectedId, data])

    return (
        <div>
            <Drawer isOpen={props.isOpen} size={props.size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader alignItems={"center"} justifyContent='space-between' display='flex' >
                        Edit Opportunity Project
                        <IconButton onClick={handleClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>
                        {
                            isLoding ?
                                <Grid container>
                                    <GridItem colSpan={{ base: 12 }}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                            First Name<Text color={"red"}>*</Text>
                                        </FormLabel>
                                        <Input
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.name}
                                            name="name"
                                            placeholder='Name'
                                            fontWeight='500'
                                            // borderColor={errors.Name && touched.Name ? "red.300" : null}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />
                                        <Text mb='10px' color={'red'}> {errors.name && touched.name && errors.name}</Text>
                                    </GridItem>
                                </Grid>
                                :
                                <Text>Data Not Found</Text>
                        }
                        {/* {isLoding ?
                            <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                                <Spinner />
                            </Flex>
                            :
                            <CustomForm moduleData={props.leadData} values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} />

                        } */}
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