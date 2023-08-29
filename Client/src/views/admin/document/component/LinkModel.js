import { LinkIcon } from '@chakra-ui/icons';
import { Button, FormLabel, Grid, GridItem, Input, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getApi } from 'services/api';
import { postApi } from 'services/api';

const Link = (props) => {
    const { setLinkDocument } = props;
    const [isLoding, setIsLoding] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))

    const initialValues = {
        linkWith: '',
        linkContact: '',
        linkLead: '',
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {
            handleClick();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const handleClick = async () => {
        try {
            setIsLoding(true)
            let data = values.linkContact ? { linkContact: values.linkContact } : { linkLead: values.linkLead }
            let response = await postApi(`api/document/link-document/${props.id}`, data)
            if (response && response.status === 200) {
                setLinkDocument((pre) => !pre)
                props.onClose();
            } else {
                toast.error(response.response.data?.message)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }
    }

    const handleClose = () => {
        props.onClose(false)
    }

    const fetchData = async () => {
        if (values.linkWith === 'contact') {
            let result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
            values.createBy = result?._id;
            setData(prevData => [
                // ...prevData,
                ...(result?.data?.map(item => ({ label: item.firstName + ' ' + item.lastName, value: item._id })) || [])
            ]);
        } else if (values.linkWith === 'lead') {
            let result = await getApi(user.role === 'admin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
            values.createBy = result?._id;
            setData(prevData => [
                // ...prevData,
                ...(result?.data?.map(item => ({ label: item.leadName, value: item._id })) || [])
            ]);
        }
    }

    useEffect(() => {
        fetchData()
    }, [values]);

    return (
        <Modal onClose={props.onClose} isOpen={props.isOpen} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Link With Document</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Link With
                            </FormLabel>
                            <RadioGroup onChange={(e) => { resetForm(); setFieldValue('linkWith', e) }} value={values.linkWith}>
                                <Stack direction='row'>
                                    <Radio value='contact'>Contact</Radio>
                                    <Radio value='lead'>Lead</Radio>
                                </Stack>
                            </RadioGroup>
                            <Text mb='10px' color={'red'}> {errors.linkWith && touched.linkWith && errors.linkWith}</Text>
                        </GridItem>

                        {values.linkWith === 'contact' ?
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Link Contact
                                </FormLabel>
                                <Input
                                    onFocus={onOpen}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={() => setTimeout(onClose, 200)}
                                    value={values?.linkLabel}
                                    name="linkLabel"
                                    placeholder='Link Contact'
                                    fontWeight='500'
                                    borderColor={errors?.linkLabel && touched?.linkLabel ? "red.300" : null}
                                />
                                {isOpen && values?.linkLabel && (
                                    <List position={'relative'} border={'1px solid'} bg={'gray.100'} width={'100%'} borderRadius={'0px 0px 20px 20px'} lineHeight={1} >
                                        {data?.filter((option) => option?.label?.toLowerCase()?.includes(values?.linkLabel.toLowerCase())).map((option, index) => (
                                            <ListItem p={3} borderBottom={'2px solid #efefef'} sx={{ '&:last-child': { borderBottom: 'none' } }} key={option?.value} cursor={'pointer'}
                                                onClick={() => {
                                                    setFieldValue('linkContact', option?.value)
                                                    setFieldValue('linkLabel', option?.label)
                                                }}
                                            >
                                                {option?.label}
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                                <Text mb='10px' color={'red'}> {errors.linkContact && touched.linkContact && errors.linkContact}</Text>
                            </GridItem>
                            : values.linkWith === 'lead' &&
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Link Lead
                                </FormLabel>
                                <Input
                                    onFocus={onOpen}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={() => setTimeout(onClose, 200)}
                                    value={values?.linkLabel}
                                    name="linkLabel"
                                    placeholder='Link Lead'
                                    fontWeight='500'
                                    borderColor={errors?.linkLabel && touched?.linkLabel ? "red.300" : null}
                                />
                                {isOpen && values?.linkLabel && (
                                    <List position={'relative'} border={'1px solid'} bg={'gray.100'} width={'100%'} borderRadius={'0px 0px 20px 20px'} lineHeight={1} >
                                        {data?.filter((option) => option?.label?.toLowerCase()?.includes(values?.linkLabel.toLowerCase())).map((option, index) => (
                                            <ListItem p={3} borderBottom={'2px solid #efefef'} sx={{ '&:last-child': { borderBottom: 'none' } }} key={option?.value} cursor={'pointer'}
                                                onClick={() => {
                                                    setFieldValue('linkLead', option?.value)
                                                    setFieldValue('linkLabel', option?.label)
                                                }}
                                            >
                                                {option?.label}
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                                <Text mb='10px' color={'red'}> {errors.linkLead && touched.linkLead && errors.linkLead}</Text>
                            </GridItem>
                        }

                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='brand' rightIcon={<LinkIcon />} mr={2} onClick={handleClick}>Link</Button>
                    <Button variant="outline" colorScheme='red' onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Link
