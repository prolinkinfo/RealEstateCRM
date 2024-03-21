import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormLabel, Grid, GridItem, Heading, IconButton, Input, InputGroup, InputLeftElement, Select, Text } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { leadSchema } from 'schema';
import { getApi } from 'services/api';
import { postApi } from 'services/api';
import { generateValidationSchema } from 'utils';
import CustomForm from 'utils/customForm';
import * as yup from 'yup'

const Add = (props) => {
    const [isLoding, setIsLoding] = useState(false)


    const initialFieldValues = Object.fromEntries(
        (props?.leadData?.fields || []).map(field => [field?.name, ''])
    );

    const initialValues = {
        ...initialFieldValues,
        createBy: JSON.parse(localStorage.getItem('user'))._id
    };

    const formik = useFormik({
        initialValues: initialValues,
        // validationSchema: validationSchema,
        validationSchema: yup.object().shape(generateValidationSchema(props?.leadData?.fields)),
        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            // let response = await postApi('api/lead/add', values)
            let response = await postApi('api/form/add', { ...values, moduleId: props?.leadData?._id })
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

    const handleCancel = () => {
        formik.resetForm();
        props.onClose()
    }

    return (
        <div>
            <Drawer isOpen={props.isOpen} size={props.size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader alignItems={"center"} justifyContent='space-between' display='flex'  >
                        Add Lead
                        <IconButton onClick={props.onClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>
                        {/* <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                            {props?.leadData?.headings?.length > 0 ?
                                <>
                                    {
                                        props?.leadData?.headings?.map((item, ind) => (
                                            <>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    {ind !== 0 && <HSeparator />}
                                                    <Heading as="h1" size="md" >
                                                        {ind + 1}. {item?.heading}
                                                    </Heading>
                                                </GridItem>
                                                {
                                                    props?.leadData?.fields?.filter((itm) => itm?.belongsTo === item?._id)?.map((field) => (
                                                        <GridItem colSpan={{ base: 12, sm: 6 }}>
                                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field?.name}>
                                                                {field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                                                    <span style={{ color: 'red' }}>*</span>
                                                                )}
                                                            </FormLabel>
                                                            <Input
                                                                id={field?.name}
                                                                name={field?.name}
                                                                type={field?.type}
                                                                value={values?.[field?.name]}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                fontSize='sm'
                                                                fontWeight='500'
                                                                borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                                                placeholder={`Enter ${field?.label}`}
                                                            />
                                                            {touched[field?.name] && errors?.[field?.name] ? (
                                                                <Text mb='10px' color={'red'}> {errors?.[field?.name]}</Text>
                                                            ) : null}
                                                        </GridItem>
                                                    ))
                                                }
                                            </>
                                        ))
                                    }
                                    {props?.leadData?.headings?.length > 0 &&
                                        props?.leadData?.headings?.map((item, ind) => (
                                            <>
                                                {props?.leadData?.fields?.filter((itm) => !itm?.belongsTo)?.map((field) => (
                                                    <GridItem colSpan={{ base: 12, sm: 6 }} key={field?.name}>
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field?.name}>
                                                            {field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                                                <span style={{ color: 'red' }}>*</span>
                                                            )}
                                                        </FormLabel>
                                                        <Input
                                                            id={field?.name}
                                                            name={field?.name}
                                                            type={field?.type}
                                                            value={values?.[field?.name]}
                                                            onChange={handleChange} onBlur={handleBlur}
                                                            fontSize='sm'
                                                            fontWeight='500'
                                                            borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                                            placeholder={`Enter ${field?.label}`}
                                                        />
                                                        {touched[field?.name] && errors?.[field?.name] ? (
                                                            <Text mb='10px' color={'red'}> {errors?.[field?.name]}</Text>
                                                        ) : null}
                                                    </GridItem>
                                                ))}
                                            </>
                                        ))
                                    }
                                </>
                                :
                                props?.leadData?.fields?.map(field => (
                                    <GridItem colSpan={{ base: 12, sm: 6 }} key={field?.name}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field.name}>{field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                            <span style={{ color: 'red' }}>*</span>
                                        )}</FormLabel>
                                        <Input
                                            id={field?.name}
                                            name={field?.name}
                                            type={field?.type}
                                            value={values?.[field?.name]}
                                            onChange={handleChange} onBlur={handleBlur}
                                            fontSize='sm'
                                            fontWeight='500'
                                            borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                            placeholder={`Enter ${field?.label}`}
                                        />
                                        {touched[field?.name] && errors[field?.name] ? (
                                            <Text mb='10px' color={'red'}> {errors?.[field?.name]}</Text>
                                        ) : null}
                                    </GridItem>
                                ))
                            }
                        </Grid> */}
                        <CustomForm leadData={props.leadData} values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} />
                    </DrawerBody>
                    <DrawerFooter>
                        <Button sx={{ textTransform: "capitalize" }} size="sm" disabled={isLoding ? true : false} variant="brand" type="submit" onClick={handleSubmit}                        >
                            {isLoding ? <Spinner /> : 'Save'}
                        </Button>
                        <Button
                            variant="outline"
                            colorScheme='red' size="sm"
                            sx={{
                                marginLeft: 2,
                                textTransform: "capitalize",
                            }}
                            onClick={handleCancel}
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
