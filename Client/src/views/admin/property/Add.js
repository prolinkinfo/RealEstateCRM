import { CloseIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useState } from 'react';
import { postApi } from 'services/api';
import { generateValidationSchema } from 'utils';
import CustomForm from 'utils/customForm';
import * as yup from 'yup'

const Add = (props) => {
    const [isLoding, setIsLoding] = useState(false)

    const initialFieldValues = Object.fromEntries(
        (props?.propertyData?.fields || []).map(field => [field?.name, ''])
    );

    const initialValues = {
        ...initialFieldValues,
        createBy: JSON.parse(localStorage.getItem('user'))._id
    };

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: yup.object().shape(generateValidationSchema(props?.propertyData?.fields)),

        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik


    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/form/add', { ...values, moduleId: props?.propertyData?._id })
            if (response.status === 200) {
                props.onClose();
                formik.resetForm();
                props.setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    return (
        <div>
            <Drawer isOpen={props.isOpen} size={props.size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader alignItems={"center"} justifyContent='space-between' display='flex' >
                        Add Property
                        <IconButton onClick={props.onClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>
                        <CustomForm moduleData={props.propertyData} values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} />
                    </DrawerBody>


                    <DrawerFooter>
                        <Button size="sm" sx={{ textTransform: "capitalize" }} disabled={isLoding ? true : false} variant="brand" type="submit" onClick={handleSubmit}                        >
                            {isLoding ? <Spinner /> : 'Save'}
                        </Button>
                        <Button size="sm"
                            variant="outline"
                            colorScheme='red'
                            sx={{
                                marginLeft: 2,
                                textTransform: "capitalize",
                            }}
                            onClick={props.onClose}
                        >
                            Close
                        </Button>
                    </DrawerFooter>

                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default Add
