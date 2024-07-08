import { LinkIcon } from '@chakra-ui/icons';
import { Button, Flex, FormLabel, Grid, GridItem, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApi, postApi } from 'services/api';
import ContactModel from 'components/commonTableModel/ContactModel';
import LeadModel from "components/commonTableModel/LeadModel";
import { LiaMousePointerSolid } from 'react-icons/lia';

const Link = (props) => {
    const { setLinkDocument } = props;
    const [isLoding, setIsLoding] = useState(false)
    const [data, setData] = useState([])
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);
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
        if (values.linkWith === 'Contact') {
            let result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
            values.createBy = result?._id;
            setData(prevData => [
                // ...prevData,
                ...(result?.data?.map(item => ({ label: item.firstName + ' ' + item.lastName, value: item._id })) || [])
            ]);
        } else if (values.linkWith === 'lead') {
            let result = await getApi(user.role === 'superAdmin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
            values.createBy = result?._id;
            setData(prevData => [
                // ...prevData,
                ...(result?.data?.map(item => ({ label: item.leadName, value: item._id })) || [])
            ]);
        }
    }

    useEffect(() => {
        fetchData()
    }, [values.linkWith]);

    return (
        <>

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
                                        <Radio value='Contact'>Contact</Radio>
                                        <Radio value='lead'>Lead</Radio>
                                    </Stack>
                                </RadioGroup>
                                <Text mb='10px' color={'red'}> {errors.linkWith && touched.linkWith && errors.linkWith}</Text>
                            </GridItem>

                            {values.linkWith === 'Contact' ?
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Link Contact
                                    </FormLabel>
                                   
                                    <Flex>

                                        <Select
                                            value={values.linkContact}
                                            name="linkContact"
                                            onChange={handleChange}
                                            mb={errors.linkContact && touched.linkContact ? undefined : '10px'}
                                            fontWeight='500'
                                            placeholder='Link Contact'
                                            borderColor={errors.linkContact && touched.linkContact ? "red.300" : null}
                                        >
                                            {data?.map((item) => {
                                                return <option value={item.value} key={item.value}>{values.linkWith === 'Contact' && `${item.label}`}</option>
                                            })}
                                        </Select>
                                        <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                        <Text mb='10px' color={'red'}> {errors.linkContact && touched.linkContact && errors.linkContact}</Text>
                                    </Flex>
                                </GridItem>
                                : values.linkWith === 'lead' &&
                                <GridItem colSpan={{ base: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Link Lead
                                    </FormLabel>
                                    
                                    <Flex>

                                        <Select
                                            value={values.linkLead}
                                            name="linkLead"
                                            onChange={handleChange}
                                            mb={errors.linkLead && touched.linkLead ? undefined : '10px'}
                                            fontWeight='500'
                                            placeholder='Link Lead'
                                            borderColor={errors.linkLead && touched.linkLead ? "red.300" : null}
                                        >
                                            {data?.map((item) => {
                                                return <option value={item.value} key={item.value}>{values.linkWith === 'lead' && `${item.label}`}</option>
                                            })}
                                        </Select>
                                        <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                        <Text mb='10px' color={'red'}> {errors.linkLead && touched.linkLead && errors.linkLead}</Text>
                                    </Flex>
                                    <Text mb='10px' color={'red'}> {errors.linkLead && touched.linkLead && errors.linkLead}</Text>
                                </GridItem>

                            }

                        </Grid>


                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" colorScheme='brand' rightIcon={<LinkIcon />} mr={2} onClick={handleClick}>Link</Button>
                        <Button size="sm" variant="outline" colorScheme='red' onClick={() => { handleClose(); resetForm() }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
            <ContactModel data={data} isOpen={contactModelOpen} onClose={setContactModel} fieldName='linkContact' setFieldValue={setFieldValue} />
            {/* Lead Model  */}
            <LeadModel data={data} isOpen={leadModelOpen} onClose={setLeadModel} fieldName='linkLead' setFieldValue={setFieldValue} />
        </>
    )
}

export default Link
