import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FormLabel, Grid, GridItem, Heading, IconButton, Input, Select, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { postApi, getApi, putApi } from 'services/api';
import { generateValidationSchema } from 'utils';
import CustomForm from 'utils/customForm';
import * as yup from 'yup'
import { invoicesSchema } from '../../../schema/invoicesSchema';
import UserModel from 'components/commonTableModel/UserModel';
import OpprtunityModel from 'components/commonTableModel/OpprtunityModel';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOpportunityData } from '../../../redux/slices/opportunitySlice';
import AccountModel from 'components/commonTableModel/AccountModel';
import { fetchAccountData } from '../../../redux/slices/accountSlice';
import ContactModel from 'components/commonTableModel/ContactModel';
import { HasAccess } from '../../../redux/accessUtils';

const AddEdit = (props) => {
    const { isOpen, size, onClose, type, setAction, selectedId, contactId } = props;
    const [isLoding, setIsLoding] = useState(false)
    const [userModel, setUserModel] = useState(false)
    const [opprtunityModel, setOpprtunityModel] = useState(false)
    const [userData, setUserData] = useState([]);
    const [accountModel, setAccountModel] = useState(false)
    const [contactModel, setContactModel] = useState(false)
    const [invoiceDetails, setInvoiceDetails] = useState({});
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"))
    const [accountAccess, contactAccess] = HasAccess(['Account', 'Contacts'])

    const opportunityList = useSelector((state) => state?.opportunityData?.data?.data)
    const accountList = useSelector((state) => state?.accountData?.data?.data)
    const contactList = useSelector((state) => state?.contactData?.data)

    const initialValues = {
        title: type === "edit" ? invoiceDetails?.title : "",
        quoteNumber: type === "edit" ? invoiceDetails?.quoteNumber : null,
        quoteDate: type === "edit" ? invoiceDetails?.quoteDate : "",
        dueDate: type === "edit" ? invoiceDetails?.dueDate : "",
        invoiceDate: type === "edit" ? invoiceDetails?.invoiceDate : "",
        status: type === "edit" ? invoiceDetails?.status : "",
        assignedTo: type === "edit" ? invoiceDetails?.assignedTo : null,
        description: type === "edit" ? invoiceDetails?.description : "",
        account: type === "edit" ? invoiceDetails?.account : null,
        contact: type === "edit" ? invoiceDetails?.contact : contactId ? contactId : null,
        billingStreet: type === "edit" ? invoiceDetails?.billingStreet : "",
        shippingStreet: type === "edit" ? invoiceDetails?.shippingStreet : "",
        billingCity: type === "edit" ? invoiceDetails?.billingCity : "",
        shippingCity: type === "edit" ? invoiceDetails?.shippingCity : "",
        billingState: type === "edit" ? invoiceDetails?.billingState : "",
        shippingState: type === "edit" ? invoiceDetails?.shippingState : "",
        billingPostalCode: type === "edit" ? invoiceDetails?.billingPostalCode : "",
        shippingPostalCode: type === "edit" ? invoiceDetails?.shippingPostalCode : "",
        billingCountry: type === "edit" ? invoiceDetails?.billingCountry : "",
        shippingCountry: type === "edit" ? invoiceDetails?.shippingCountry : "",
        isCheck: type === "edit" ? invoiceDetails?.isCheck : false,
        currency: type === "edit" ? invoiceDetails?.currency : "",
        total: type === "edit" ? invoiceDetails?.total : "",
        discount: type === "edit" ? invoiceDetails?.discount : "",
        subtotal: type === "edit" ? invoiceDetails?.subtotal : "",
        shipping: type === "edit" ? invoiceDetails?.shipping : "",
        shippingTax: type === "edit" ? invoiceDetails?.shippingTax : "",
        ptax: type === "edit" ? invoiceDetails?.ptax : "",
        tax: type === "edit" ? invoiceDetails?.tax : "",
        grandTotal: type === "edit" ? invoiceDetails?.grandTotal : "",

        createBy: JSON.parse(localStorage.getItem('user'))._id,
        modifiedBy: JSON.parse(localStorage.getItem('user'))._id
    };


    const addData = async (values) => {
        try {
            setIsLoding(true)
            let response = await postApi('api/invoices/add', values)
            if (response.status === 200) {
                onClose();
                toast.success(`Invoice Save successfully`)
                formik.resetForm();
                setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
            toast.error(`server error`)
        }
        finally {
            setIsLoding(false)
        }
    };
    const editData = async (values) => {
        try {
            setIsLoding(true)
            let response = await putApi(`api/invoices/edit/${selectedId}`, values)
            if (response.status === 200) {
                onClose();
                toast.success(`Invoice Update successfully`)
                formik.resetForm();
                // setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
            toast.error(`server error`)
        }
        finally {
            setIsLoding(false)
        }
    };

    const handleCancel = () => {
        formik.resetForm();
        onClose()
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: invoicesSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (type === "add") {
                addData(values)
            } else {
                const payload = { ...values, modifiedDate: new Date() }
                editData(payload)
            }
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const handleCheck = (e) => {
        setFieldValue("isCheck", e.target.checked)
        if (e.target.checked) {
            setFieldValue("shippingStreet", values?.billingStreet)
            setFieldValue("shippingCity", values?.billingCity)
            setFieldValue("shippingState", values?.billingState)
            setFieldValue("shippingPostalCode", values?.billingPostalCode)
            setFieldValue("shippingCountry", values?.billingCountry)
        } else {
            setFieldValue("shippingStreet", "")
            setFieldValue("shippingCity", "")
            setFieldValue("shippingState", "")
            setFieldValue("shippingPostalCode", "")
            setFieldValue("shippingCountry", "")
        }
    }

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi('api/user/');
        setUserData(result?.data?.user);
        setIsLoding(false)
    }


    const fetchInvoiceDetails = async () => {
        if (type === "edit") {
            try {
                setIsLoding(true)
                let result = await getApi('api/invoices/view/', selectedId)
                if (result?.status === 200) {
                    setInvoiceDetails(result?.data)
                }

            }
            catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        }
    }


    useEffect(() => {
        if (type === "edit") fetchInvoiceDetails();
        if (user.role === 'superAdmin') fetchData();
    }, [type, selectedId])

    useEffect(() => {
        if (opportunityList?.length === 0 || opportunityList === undefined) { dispatch(fetchOpportunityData()) }
        if (accountList?.length === 0 || accountList === undefined) { dispatch(fetchAccountData()) }
    }, [])

    return (
        <div>
            {userModel && <UserModel onClose={() => setUserModel(false)} isOpen={userModel} fieldName={"assignedTo"} setFieldValue={setFieldValue} data={userData} isLoding={isLoding} setIsLoding={setIsLoding} />}
            {/* {opprtunityModel && <OpprtunityModel onClose={() => setOpprtunityModel(false)} isOpen={opprtunityModel} fieldName={"oppotunity"} setFieldValue={setFieldValue} data={opportunityList} isLoding={isLoding} setIsLoding={setIsLoding} type="quotes" billingState="billingState" billingCity="billingCity" billingPostalCode="billingPostalCode" billingCountry="billingCountry" billingStreet="billingStreet" />} */}
            {accountModel && <AccountModel onClose={() => setAccountModel(false)} isOpen={accountModel} fieldName={"account"} setFieldValue={setFieldValue} data={accountList} />}
            {contactModel && <ContactModel isOpen={contactModel} data={contactList} onClose={setContactModel} values={values} fieldName='contact' setFieldValue={setFieldValue} />}

            <Drawer isOpen={isOpen} size={size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader alignItems={"center"} justifyContent='space-between' display='flex'  >
                        {type === "add" ? "Add" : "Edit"} Invoice
                        <IconButton onClick={() => handleCancel()} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>
                        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                            <GridItem colSpan={{ base: 12 }}>
                                <Heading as="h1" size="md" mt='10px'>
                                    Overview
                                </Heading>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Title<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.title}
                                    name="title"
                                    onChange={handleChange}
                                    placeholder='Title'
                                    fontWeight='500'
                                    borderColor={errors.title && touched.title ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.title && touched.title && errors.title}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Quote Number
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.quoteNumber}
                                    name="quoteNumber"
                                    onChange={handleChange}
                                    placeholder='Quote Number'
                                    fontWeight='500'
                                    borderColor={errors.quoteNumber && touched.quoteNumber ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.quoteNumber && touched.quoteNumber && errors.quoteNumber}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Quote Date
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={dayjs(values.quoteDate).format("YYYY-MM-DD")}
                                    name="quoteDate"
                                    onChange={handleChange}
                                    type='date'
                                    fontWeight='500'
                                    borderColor={errors.quoteDate && touched.quoteDate ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.quoteDate && touched.quoteDate && errors.quoteDate}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Due Date
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={dayjs(values.dueDate).format("YYYY-MM-DD")}
                                    name="dueDate"
                                    onChange={handleChange}
                                    type='date'
                                    fontWeight='500'
                                    borderColor={errors.dueDate && touched.dueDate ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.dueDate && touched.dueDate && errors.dueDate}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Invoice Date
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={dayjs(values.invoiceDate).format("YYYY-MM-DD")}
                                    name="invoiceDate"
                                    onChange={handleChange}
                                    type='date'
                                    fontWeight='500'
                                    borderColor={errors.invoiceDate && touched.invoiceDate ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.invoiceDate && touched.invoiceDate && errors.invoiceDate}</Text>
                            </GridItem>
                            {/* <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Opportunity
                                </FormLabel>
                                <Flex justifyContent={'space-between'}>
                                    <Select
                                        value={values.oppotunity}
                                        name="oppotunity"
                                        onChange={handleChange}
                                        mb={errors.oppotunity && touched.oppotunity ? undefined : '10px'}
                                        fontWeight='500'
                                        placeholder={'Opportunity'}
                                        borderColor={errors.oppotunity && touched.oppotunity ? "red.300" : null}
                                    >
                                        {opportunityList?.length > 0 && opportunityList?.map((item) => {
                                            return <option value={item._id} key={item._id}>{`${item?.opportunityName}`}</option>
                                        })}
                                    </Select>
                                    <IconButton onClick={() => setOpprtunityModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                </Flex>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.oppotunity && touched.oppotunity && errors.oppotunity}</Text>
                            </GridItem> */}
                            {/* <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Quote Stage<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Select
                                    value={values.quoteStage}
                                    name="quoteStage"
                                    onChange={handleChange}
                                    mb={errors.quoteStage && touched.quoteStage ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Quote Stage'}
                                    borderColor={errors.quoteStage && touched.quoteStage ? "red.300" : null}
                                >
                                    <option value="Draft" >Draft</option>
                                    <option value="Negotiation" >Negotiation</option>
                                    <option value="Delivered" >Delivered</option>
                                    <option value="On Hold" >On Hold</option>
                                    <option value="Confirmed" >Confirmed</option>
                                    <option value="Closed Accepted" >Closed Accepted</option>
                                    <option value="Closed Lost" >Closed Lost</option>
                                    <option value="Closed Dead" >Closed Dead</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.quoteStage && touched.quoteStage && errors.quoteStage}</Text>
                            </GridItem> */}
                            {
                                user.role === 'superAdmin' &&
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Assigned To
                                    </FormLabel>
                                    <Flex justifyContent={'space-between'}>
                                        <Select
                                            value={values.assignedTo}
                                            name="assignedTo"
                                            onChange={handleChange}
                                            mb={errors.assignedTo && touched.assignedTo ? undefined : '10px'}
                                            fontWeight='500'
                                            placeholder={'Assigned To'}
                                            borderColor={errors.assignedTo && touched.assignedTo ? "red.300" : null}
                                        >
                                            {userData?.map((item) => {
                                                return <option value={item._id} key={item._id}>{`${item?.firstName} ${item?.lastName}`}</option>
                                            })}
                                        </Select>
                                        <IconButton onClick={() => setUserModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                    </Flex>
                                </GridItem>
                            }
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Status
                                </FormLabel>
                                <Select
                                    value={values.status}
                                    name="status"
                                    onChange={handleChange}
                                    mb={errors.status && touched.status ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Status'}
                                    borderColor={errors.status && touched.status ? "red.300" : null}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.status && touched.status && errors.status}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Description
                                </FormLabel>
                                <Textarea
                                    fontSize='sm'
                                    value={values.description}
                                    name="description"
                                    resize={"none"}
                                    onChange={handleChange}
                                    placeholder='Description'
                                    fontWeight='500'
                                    borderColor={errors.description && touched.description ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.description && touched.description && errors.description}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <Heading as="h1" size="md" mt='10px'>
                                    Address Information
                                </Heading>
                            </GridItem>
                            {
                                (user.role === 'superAdmin' || accountAccess?.view) &&
                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Account
                                    </FormLabel>
                                    <Flex justifyContent={'space-between'}>
                                        <Select
                                            value={values.account}
                                            name="account"
                                            onChange={handleChange}
                                            mb={errors.account && touched.account ? undefined : '10px'}
                                            fontWeight='500'
                                            placeholder={'Account'}
                                            borderColor={errors.account && touched.account ? "red.300" : null}
                                        >
                                            {accountList?.length > 0 && accountList?.map((item) => {
                                                return <option value={item._id} key={item._id}>{`${item?.name}`}</option>
                                            })}
                                        </Select>
                                        <IconButton onClick={() => setAccountModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                    </Flex>
                                    <Text mb='10px' fontSize='sm' color={'red'}> {errors.account && touched.account && errors.account}</Text>
                                </GridItem>
                            }
                            {
                                (user.role === 'superAdmin' || contactAccess?.view) &&
                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Contact
                                    </FormLabel>
                                    <Flex justifyContent={'space-between'}>
                                        <Select
                                            value={values.contact}
                                            name="contact"
                                            onChange={handleChange}
                                            mb={errors.contact && touched.contact ? undefined : '10px'}
                                            fontWeight='500'
                                            placeholder={'Contact'}
                                            borderColor={errors.contact && touched.contact ? "red.300" : null}
                                        >
                                            {contactList?.length > 0 && contactList?.map((item) => {
                                                return <option value={item._id} key={item._id}>{`${item.firstName} ${item.lastName}`}</option>
                                            })}
                                        </Select>
                                        <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                    </Flex>
                                    <Text mb='10px' fontSize='sm' color={'red'}> {errors.contact && touched.contact && errors.contact}</Text>
                                </GridItem>
                            }

                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <Heading as="h1" size="md" mt='10px'>
                                    Billing Address
                                </Heading>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <Heading as="h1" size="md" mt='10px'>
                                    Shipping Address
                                </Heading>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing Street
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingStreet}
                                    name="billingStreet"
                                    onChange={handleChange}
                                    placeholder='Billing Street'
                                    fontWeight='500'
                                    borderColor={errors.billingStreet && touched.billingStreet ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingStreet && touched.billingStreet && errors.billingStreet}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Street
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingStreet}
                                    name="shippingStreet"
                                    disabled={values?.isCheck}
                                    onChange={handleChange}
                                    placeholder='Shipping Street'
                                    fontWeight='500'
                                    borderColor={errors.shippingStreet && touched.shippingStreet ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingStreet && touched.shippingStreet && errors.shippingStreet}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing City
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingCity}
                                    name="billingCity"
                                    onChange={handleChange}
                                    placeholder='Billing City'
                                    fontWeight='500'
                                    borderColor={errors.billingCity && touched.billingCity ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingCity && touched.billingCity && errors.billingCity}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping City
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingCity}
                                    name="shippingCity"
                                    disabled={values?.isCheck}
                                    onChange={handleChange}
                                    placeholder='Shipping City'
                                    fontWeight='500'
                                    borderColor={errors.shippingCity && touched.shippingCity ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingCity && touched.shippingCity && errors.shippingCity}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing State
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingState}
                                    name="billingState"
                                    onChange={handleChange}
                                    placeholder='Billing State'
                                    fontWeight='500'
                                    borderColor={errors.billingState && touched.billingState ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingState && touched.billingState && errors.billingState}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping State
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingState}
                                    disabled={values?.isCheck}
                                    name="shippingState"
                                    onChange={handleChange}
                                    placeholder='Shipping State'
                                    fontWeight='500'
                                    borderColor={errors.shippingState && touched.shippingState ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingState && touched.shippingState && errors.shippingState}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing Postal Code
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingPostalCode}
                                    name="billingPostalCode"
                                    onChange={handleChange}
                                    type='number'
                                    placeholder='Billing Postal Code'
                                    fontWeight='500'
                                    borderColor={errors.billingPostalCode && touched.billingPostalCode ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingPostalCode && touched.billingPostalCode && errors.billingPostalCode}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Postal Code
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingPostalCode}
                                    disabled={values?.isCheck}
                                    name="shippingPostalCode"
                                    type='number'
                                    onChange={handleChange}
                                    placeholder='Shipping Postal Code'
                                    fontWeight='500'
                                    borderColor={errors.shippingPostalCode && touched.shippingPostalCode ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingPostalCode && touched.shippingPostalCode && errors.shippingPostalCode}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing Country
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingCountry}
                                    name="billingCountry"
                                    onChange={handleChange}
                                    placeholder='Billing Country'
                                    fontWeight='500'
                                    borderColor={errors.billingCountry && touched.billingCountry ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingCountry && touched.billingCountry && errors.billingCountry}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Country
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingCountry}
                                    name="shippingCountry"
                                    onChange={handleChange}
                                    disabled={values?.isCheck}
                                    placeholder='Shipping Country'
                                    fontWeight='500'
                                    borderColor={errors.shippingCountry && touched.shippingCountry ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingCountry && touched.shippingCountry && errors.shippingCountry}</Text>
                                <Checkbox isChecked={values?.isCheck} onChange={(e) => handleCheck(e)}>
                                    Copy address from left
                                </Checkbox>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <Heading as="h1" size="md" mt='10px'>
                                    Line Items
                                </Heading>
                            </GridItem>

                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Currency
                                </FormLabel>
                                <Select
                                    value={values.currency}
                                    name="currency"
                                    onChange={handleChange}
                                    mb={errors.currency && touched.currency ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Select Currency'}
                                    borderColor={errors.currency && touched.currency ? "red.300" : null}
                                >
                                    <option value="$" selected>US Dollars:$</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.currency && touched.currency && errors.currency}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Total
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.total}
                                    name="total"
                                    onChange={handleChange}
                                    placeholder='Total'
                                    fontWeight='500'
                                    type='number'
                                    borderColor={errors.total && touched.total ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.total && touched.total && errors.total}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Discount
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.discount}
                                    name="discount"
                                    onChange={handleChange}
                                    placeholder='Total'
                                    type='number'
                                    fontWeight='500'
                                    borderColor={errors.discount && touched.discount ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.discount && touched.discount && errors.discount}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Subtotal
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.subtotal}
                                    name="subtotal"
                                    type='number'
                                    onChange={handleChange}
                                    placeholder='Subtotal'
                                    fontWeight='500'
                                    borderColor={errors.subtotal && touched.subtotal ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.subtotal && touched.subtotal && errors.subtotal}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shipping}
                                    name="shipping"
                                    type='number'
                                    onChange={handleChange}
                                    placeholder='Shipping'
                                    fontWeight='500'
                                    borderColor={errors.shipping && touched.shipping ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shipping && touched.shipping && errors.shipping}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 10 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Tax
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingTax}
                                    name="shippingTax"
                                    onChange={handleChange}
                                    placeholder='Shipping Tax'
                                    type='number'
                                    fontWeight='500'
                                    borderColor={errors.shippingTax && touched.shippingTax ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingTax && touched.shippingTax && errors.shippingTax}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 2 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' visibility={"hidden"}>
                                    -
                                </FormLabel>
                                <Select
                                    value={values.ptax}
                                    name="ptax"
                                    onChange={handleChange}
                                    mb={errors.ptax && touched.ptax ? undefined : '10px'}
                                    fontWeight='500'
                                    borderColor={errors.ptax && touched.ptax ? "red.300" : null}
                                >
                                    <option value="0%">0%</option>
                                    <option value="18%">18%</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.ptax && touched.ptax && errors.ptax}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' >
                                    Tax
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.tax}
                                    name="tax"
                                    onChange={handleChange}
                                    fontWeight='500'
                                    type="number"
                                    placeholder='Tax'
                                    borderColor={errors.tax && touched.tax ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.tax && touched.tax && errors.tax}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' >
                                    Grand Total
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.grandTotal}
                                    name="grandTotal"
                                    onChange={handleChange}
                                    fontWeight='500'
                                    type="number"
                                    placeholder='Grand Total'
                                    borderColor={errors.grandTotal && touched.grandTotal ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.grandTotal && touched.grandTotal && errors.grandTotal}</Text>
                            </GridItem>
                        </Grid>
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

export default AddEdit
