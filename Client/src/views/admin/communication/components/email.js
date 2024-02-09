import { Button, FormLabel, Grid, GridItem, Heading, Input, List, ListItem, Text, Textarea, useDisclosure } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { emailSchema } from 'schema';
import { getApi } from 'services/api';
import { postApi } from 'services/api';

const Email = () => {
    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoding, setIsLoding] = useState(false)

    const initialValues = {
        sender: user?._id,
        recipient: '',
        cc: '',
        bcc: '',
        subject: '',
        message: '',
        createBy: ''
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: emailSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    if (touched.recipient && errors.createBy) {
        toast.error('Please select an authorized recipient');
        formik.resetForm();

    }

    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/email/add', values)
            if (response.status === 200) {
                toast.success('Email Send successfully')
                formik.resetForm();
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };


    const fetchData = async () => {
        let result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        values.createBy = result?._id;
        setData(result.data);
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        data?.map((item) => {
            let recipientExists = item.email === values.recipient
            if (recipientExists) {
                values.createBy = item._id
                setFieldValue('createBy', item._id)
            }
        })
    }, [values])

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }} >
                <Heading as='h2' size='xl' noOfLines={1}>
                    Send Email
                </Heading>
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    To<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                    onFocus={onOpen}
                    fontSize='sm'
                    onChange={handleChange}
                    onBlur={() => setTimeout(onClose, 200)}
                    value={values.recipient}
                    name="recipient"
                    placeholder='Recipient'
                    fontWeight='500'
                    borderColor={errors?.recipient && touched?.recipient ? "red.300" : null}
                />
                {isOpen && values?.recipient && (
                    <List position={'relative'} border={'1px solid'} bg={'gray.100'} width={'100%'} borderRadius={'0px 0px 20px 20px'} lineHeight={1} >
                        {data?.filter((option) => option?.email?.includes(values?.recipient.toLowerCase())).map((option, index) => (
                            <ListItem p={3} borderBottom={'2px solid #efefef'} sx={{ '&:last-child': { borderBottom: 'none' } }} key={option?._id} cursor={'pointer'}
                                onClick={() => {
                                    setFieldValue('createBy', option?._id)
                                    setFieldValue('recipient', option?.email)
                                }}
                            >
                                {option?.email}
                            </ListItem>
                        ))}
                    </List>
                )}
                <Text mb='10px' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Sc
                </FormLabel>
                <Input
                    fontSize='sm'
                    onChange={handleChange}
                    value={values.cc}
                    name="cc"
                    placeholder='cc'
                    fontWeight='500'
                    borderColor={errors?.cc && touched?.cc ? "red.300" : null}
                />

                <Text mb='10px' color={'red'}> {errors.cc && touched.cc && errors.cc}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Bcc
                </FormLabel>
                <Input
                    fontSize='sm'
                    onChange={handleChange}
                    value={values.bcc}
                    name="bcc"
                    placeholder='bcc'
                    fontWeight='500'
                    borderColor={errors?.bcc && touched?.bcc ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.bcc && touched.bcc && errors.bcc}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Subject
                </FormLabel>
                <Input
                    fontSize='sm'
                    onChange={handleChange}
                    value={values.subject}
                    name="subject"
                    placeholder='Subject'
                    fontWeight='500'
                    borderColor={errors?.subject && touched?.subject ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.subject && touched.subject && errors.subject}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Message<Text color={"red"}>*</Text>
                </FormLabel>
                <Textarea
                    height={240}
                    resize={'none'}
                    fontSize='sm'
                    onChange={handleChange}
                    value={values.message}
                    name="message"
                    placeholder='Enter Message Hear'
                    fontWeight='500'
                    borderColor={errors?.message && touched?.message ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.message && touched.message && errors.message}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <Button size="sm" variant='brand' onClick={handleSubmit} disabled={isLoding ? true : false} rightIcon={<BsFillSendFill />}> {isLoding ? <Spinner /> : 'Send'}</Button>
                <Button size="sm" onClick={() => formik.resetForm()}>Clear</Button>
            </GridItem>

        </Grid>
    )
}

export default Email
