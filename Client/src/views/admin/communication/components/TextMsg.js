import { Button, FormLabel, Grid, GridItem, Heading, Input, List, ListItem, Text, Textarea, useDisclosure } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { MdOutlineMessage } from 'react-icons/md';
import { toast } from 'react-toastify';
import { textMsgSchema } from 'schema';
import { getApi } from 'services/api';
import { postApi } from 'services/api';

const TextMsg = () => {

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoding, setIsLoding] = useState(false)

    const initialValues = {
        sender: user?._id,
        to: '',
        message: '',
        createFor: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: textMsgSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });

    const { errors, touched, values, handleChange, handleSubmit, setFieldValue, } = formik

    if (touched.to && errors.createFor) {
        toast.error('Please select an authorized to');
        formik.resetForm();

    }

    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/text-msg/add', values)
            if (response.status === 200) {
                toast.success(`Text Msg send successfully to ${values.to} `)
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
        values.createFor = result?._id;
        setData(result.data);
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        data?.map((item) => {
            let recipientExists = item?.phoneNumber === values.to
            if (recipientExists) {
                values.createFor = item._id
                setFieldValue('createFor', item._id)
            }
        })
    }, [values])

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }} >
                <Heading as='h2' size='xl' noOfLines={1}>
                    Text Message
                </Heading>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    To<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                    onFocus={onOpen}
                    fontSize='sm'
                    type='number'
                    onChange={handleChange}
                    onBlur={() => setTimeout(onClose, 200)}
                    value={values.to}
                    name="to"
                    placeholder='to'
                    fontWeight='500'
                    borderColor={errors?.to && touched?.to ? "red.300" : null}
                />
                {isOpen && values?.to && (
                    <List position={'relative'} border={'1px solid'} bg={'gray.100'} width={'100%'} borderRadius={'0px 0px 20px 20px'} lineHeight={1} >
                        {data?.filter((option) => {
                            if (option && option.phoneNumber && typeof option.phoneNumber === 'number') {
                                return option.phoneNumber.toString().includes(values.to.toString().toLowerCase());
                            }
                            return false;
                        }).map((option, index) => (
                            <ListItem p={3} borderBottom={'2px solid #efefef'} sx={{ '&:last-child': { borderBottom: 'none' } }} key={option?._id} cursor={'pointer'}
                                onClick={() => {
                                    setFieldValue('createFor', option?._id)
                                    setFieldValue('to', option.phoneNumber.toString())
                                }}
                            >
                                {option.phoneNumber}
                            </ListItem>
                        ))}
                    </List>
                )}
                <Text mb='10px' color={'red'}> {errors.to && touched.to && errors.to}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Message
                </FormLabel>
                <Textarea
                    height={'20vh'}
                    fontSize='sm'
                    resize={'none'}
                    onChange={handleChange}
                    value={values.message}
                    name="message"
                    placeholder='message'
                    fontWeight='500'
                    borderColor={errors?.message && touched?.message ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.message && touched.message && errors.message}</Text>
            </GridItem>

            <GridItem colSpan={{ base: 12 }} >
                <Button variant='brand' size="sm" onClick={handleSubmit} disabled={isLoding ? true : false} leftIcon={<MdOutlineMessage />}>  {isLoding ? <Spinner /> : 'Send Msg'}</Button>
                <Button onClick={() => formik.resetForm()} size="sm">Clear</Button>
            </GridItem>

        </Grid>
    )
}

export default TextMsg
