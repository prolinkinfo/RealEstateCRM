import { Button, FormLabel, Grid, GridItem, Heading, Input, List, ListItem, Text, Textarea, useDisclosure } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { phoneCallSchema } from 'schema';
import { getApi } from 'services/api';
import { postApi } from 'services/api';

const Call = () => {

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoding, setIsLoding] = useState(false)

    const initialValues = {
        sender: user?._id,
        recipient: '',
        callDuration: '',
        callNotes: '',
        createBy: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: phoneCallSchema,
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
            let response = await postApi('api/phoneCall/add', values)
            if (response.status === 200) {

                toast.success(`Call ${values.recipient} successfully`)
                formik.resetForm();
            }
        } catch (e) {
            console.error(e);
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
            let recipientExists = item?.phoneNumber === values.recipient
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
                    Call
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
                    value={values.recipient}
                    name="recipient"
                    placeholder='Recipient'
                    fontWeight='500'
                    borderColor={errors?.recipient && touched?.recipient ? "red.300" : null}
                />
                {isOpen && values?.recipient && (
                    <List position={'relative'} border={'1px solid'} bg={'gray.100'} width={'100%'} borderRadius={'0px 0px 20px 20px'} lineHeight={1} >
                        {data?.filter((option) => {
                            if (option && option.phoneNumber && typeof option.phoneNumber === 'number') {
                                return option.phoneNumber.toString().includes(values.recipient.toString().toLowerCase());
                            }
                            return false;
                        }).map((option, index) => (
                            <ListItem p={3} borderBottom={'2px solid #efefef'} sx={{ '&:last-child': { borderBottom: 'none' } }} key={option?._id} cursor={'pointer'}
                                onClick={() => {
                                    setFieldValue('createBy', option?._id)
                                    setFieldValue('recipient', option.phoneNumber.toString())
                                }}
                            >
                                {option.phoneNumber}
                            </ListItem>
                        ))}
                    </List>
                )}
                <Text mb='10px' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Call Notes
                </FormLabel>
                <Textarea
                    fontSize='sm'
                    height={'20vh'}
                    resize={'none'}
                    onChange={handleChange}
                    value={values.callNotes}
                    name="callNotes"
                    placeholder='callNotes'
                    fontWeight='500'
                    borderColor={errors?.callNotes && touched?.callNotes ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.callNotes && touched.callNotes && errors.callNotes}</Text>
            </GridItem>

            <GridItem colSpan={{ base: 12 }} >
                <Button variant='brand' disabled={isLoding ? true : false} size="sm" onClick={handleSubmit} leftIcon={<BsFillTelephoneFill />}>{isLoding ? <Spinner /> : 'Call'}</Button>
                <Button onClick={() => formik.resetForm()} size="sm">Clear</Button>
            </GridItem>

        </Grid>
    )
}

export default Call
