import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FormLabel, Grid, GridItem, IconButton, Input, Select, Text } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { postApi, getApi, putApi } from 'services/api';
import { generateValidationSchema } from 'utils';
import CustomForm from 'utils/customForm';
import * as yup from 'yup'
import { accountSchema } from '../../../schema/accountSchema';
import UserModel from 'components/commonTableModel/UserModel';
import AccountModel from 'components/commonTableModel/AccountModel';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountData } from '../../../redux/slices/accountSlice';

const AddEdit = (props) => {
    const { isOpen, size, onClose, type, setAction, selectedId } = props;
    const [isLoding, setIsLoding] = useState(false)
    const [userModel, setUserModel] = useState(false)
    const [accountModel, setAccountModel] = useState(false)
    const [userData, setUserData] = useState([]);
    const [accountDetails, setAccountDetails] = useState({});
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"))

    const accountList = useSelector((state) => state?.accountData?.data?.data)
    // const { isLoding } = useSelector((state) => state?.accountData)

    const initialValues = {
        name: type === "edit" ? accountDetails?.name : "",
        officePhone: type === "edit" ? accountDetails?.officePhone : "",
        alternatePhone: type === "edit" ? accountDetails?.alternatePhone : "",
        assignUser: type === "edit" ? accountDetails?.assignUser : null,
        website: type === "edit" ? accountDetails?.website : "",
        fax: type === "edit" ? accountDetails?.fax : "",
        ownership: type === "edit" ? accountDetails?.ownership : "",
        emailAddress: type === "edit" ? accountDetails?.emailAddress : "",
        nonPrimaryEmail: type === "edit" ? accountDetails?.nonPrimaryEmail : "",
        billingStreet: type === "edit" ? accountDetails?.billingStreet : "",
        billingStreet2: type === "edit" ? accountDetails?.billingStreet2 : "",
        billingStreet3: type === "edit" ? accountDetails?.billingStreet3 : "",
        billingStreet4: type === "edit" ? accountDetails?.billingStreet4 : "",
        billingPostalcode: type === "edit" ? accountDetails?.billingPostalcode : "",
        billingCity: type === "edit" ? accountDetails?.billingCity : "",
        billingState: type === "edit" ? accountDetails?.billingState : "",
        billingCountry: type === "edit" ? accountDetails?.billingCountry : "",
        shippingStreet: type === "edit" ? accountDetails?.shippingStreet : "",
        shippingStreet2: type === "edit" ? accountDetails?.shippingStreet2 : "",
        shippingStreet3: type === "edit" ? accountDetails?.shippingStreet3 : "",
        shippingStreet4: type === "edit" ? accountDetails?.shippingStreet4 : "",
        shippingPostalcode: type === "edit" ? accountDetails?.shippingPostalcode : "",
        shippingCity: type === "edit" ? accountDetails?.shippingCity : "",
        shippingState: type === "edit" ? accountDetails?.shippingState : "",
        shippingCountry: type === "edit" ? accountDetails?.shippingCountry : "",
        description: type === "edit" ? accountDetails?.description : "",
        type: type === "edit" ? accountDetails?.type : "",
        industry: type === "edit" ? accountDetails?.industry : "",
        annualRevenue: type === "edit" ? accountDetails?.annualRevenue : "",
        rating: type === "edit" ? accountDetails?.rating : "",
        SICCode: type === "edit" ? accountDetails?.SICCode : "",
        emailOptOut: type === "edit" ? accountDetails?.emailOptOut : false,
        invalidEmail: type === "edit" ? accountDetails?.invalidEmail : false,
        memberOf: type === "edit" ? accountDetails?.memberOf : null,
        createBy: JSON.parse(localStorage.getItem('user'))._id,
        modifiedBy: JSON.parse(localStorage.getItem('user'))._id
    };


    const addData = async (values) => {
        try {
            setIsLoding(true)
            let response = await postApi('api/account/add', values)
            if (response.status === 200) {
                onClose();
                toast.success(`Account Save successfully`)
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
            let response = await putApi(`api/account/edit/${selectedId}`, values)
            if (response.status === 200) {
                onClose();
                toast.success(`Account Update successfully`)
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
        validationSchema: accountSchema,
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

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi('api/user/');
        setUserData(result?.data?.user);
        setIsLoding(false)
    }


    const fetchAccountDetails = async () => {
        if (type === "edit") {
            try {
                setIsLoding(true)
                let result = await getApi('api/account/view/', selectedId)
                if (result?.status === 200) {
                    setAccountDetails(result?.data)
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
        if (type === "edit") fetchAccountDetails();
        if (user.role === 'superAdmin') fetchData();
    }, [type, selectedId])

    // useEffect(() => {
    //     if (accountList?.length === 0) dispatch(fetchAccountData())
    // }, [])

    return (
        <div>
            {userModel && <UserModel onClose={() => setUserModel(false)} isOpen={userModel} fieldName={"assignUser"} setFieldValue={setFieldValue} data={userData} isLoding={isLoding} setIsLoding={setIsLoding} />}
            {accountModel && <AccountModel onClose={() => setAccountModel(false)} isOpen={accountModel} fieldName={"memberOf"} setFieldValue={setFieldValue} data={accountList} isLoding={isLoding} setIsLoding={setIsLoding} />}

            <Drawer isOpen={isOpen} size={size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader alignItems={"center"} justifyContent='space-between' display='flex'  >
                        {type === "add" ? "Add" : "Edit"} Account
                        <IconButton onClick={() => handleCancel()} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>
                        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Account Name<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.name}
                                    name="name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Account Name'
                                    fontWeight='500'
                                    borderColor={errors.name && touched.name ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.name && touched.name && errors.name}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Office Phone
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.officePhone}
                                    name="officePhone"
                                    type="number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Office Phone'
                                    fontWeight='500'
                                    borderColor={errors.officePhone && touched.officePhone ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.officePhone && touched.officePhone && errors.officePhone}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Alternate Phone
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.alternatePhone}
                                    name="alternatePhone"
                                    type="number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Alternate Phone'
                                    fontWeight='500'
                                    borderColor={errors.alternatePhone && touched.alternatePhone ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.alternatePhone && touched.alternatePhone && errors.alternatePhone}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Website
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.website}
                                    name="website"
                                    type="url"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Website URL'
                                    fontWeight='500'
                                    borderColor={errors.website && touched.website ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.website && touched.website && errors.website}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Fax
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.fax}
                                    name="fax"
                                    type="number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Fax'
                                    fontWeight='500'
                                    borderColor={errors.fax && touched.fax ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.fax && touched.fax && errors.fax}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Ownership
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.ownership}
                                    name="ownership"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='ownership'
                                    fontWeight='500'
                                    borderColor={errors.ownership && touched.ownership ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.ownership && touched.ownership && errors.ownership}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Email Address
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.emailAddress}
                                    name="emailAddress"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Email Address'
                                    fontWeight='500'
                                    borderColor={errors.emailAddress && touched.emailAddress ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.emailAddress && touched.emailAddress && errors.emailAddress}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Non Primary Email
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.nonPrimaryEmail}
                                    name="nonPrimaryEmail"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Non Primary Email'
                                    fontWeight='500'
                                    borderColor={errors.nonPrimaryEmail && touched.nonPrimaryEmail ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.nonPrimaryEmail && touched.nonPrimaryEmail && errors.nonPrimaryEmail}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Street
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingStreet}
                                    name="shippingStreet"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Shipping Street'
                                    fontWeight='500'
                                    borderColor={errors.shippingStreet && touched.shippingStreet ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingStreet && touched.shippingStreet && errors.shippingStreet}</Text>
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
                                    onBlur={handleBlur}
                                    placeholder='Billing Street'
                                    fontWeight='500'
                                    borderColor={errors.billingStreet && touched.billingStreet ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingStreet && touched.billingStreet && errors.billingStreet}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Street2
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingStreet2}
                                    name="shippingStreet2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Shipping Street2'
                                    fontWeight='500'
                                    borderColor={errors.shippingStreet2 && touched.shippingStreet2 ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingStreet2 && touched.shippingStreet2 && errors.shippingStreet2}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing Street2
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingStreet2}
                                    name="billingStreet2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Billing Street2'
                                    fontWeight='500'
                                    borderColor={errors.billingStreet2 && touched.billingStreet2 ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingStreet2 && touched.billingStreet2 && errors.billingStreet2}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Street3
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingStreet3}
                                    name="shippingStreet3"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Shipping Street3'
                                    fontWeight='500'
                                    borderColor={errors.shippingStreet3 && touched.shippingStreet3 ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingStreet3 && touched.shippingStreet3 && errors.shippingStreet3}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing Street3
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingStreet3}
                                    name="billingStreet3"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Billing Street3'
                                    fontWeight='500'
                                    borderColor={errors.billingStreet3 && touched.billingStreet3 ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingStreet3 && touched.billingStreet3 && errors.billingStreet3}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Street4
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingStreet4}
                                    name="shippingStreet4"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Shipping Street4'
                                    fontWeight='500'
                                    borderColor={errors.shippingStreet4 && touched.shippingStreet4 ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingStreet4 && touched.shippingStreet4 && errors.shippingStreet4}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing Street4
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingStreet4}
                                    name="billingStreet4"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Billing Street4'
                                    fontWeight='500'
                                    borderColor={errors.billingStreet4 && touched.billingStreet4 ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingStreet4 && touched.billingStreet4 && errors.billingStreet4}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping Postal Code
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingPostalcode}
                                    name="shippingPostalcode"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Shipping Postal Code'
                                    fontWeight='500'
                                    borderColor={errors.shippingPostalcode && touched.shippingPostalcode ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingPostalcode && touched.shippingPostalcode && errors.shippingPostalcode}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Billing Postal Code
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.billingPostalcode}
                                    name="billingPostalcode"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Billing Postal Code'
                                    fontWeight='500'
                                    borderColor={errors.billingPostalcode && touched.billingPostalcode ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingPostalcode && touched.billingPostalcode && errors.billingPostalcode}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping City
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingCity}
                                    name="shippingCity"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Shipping City'
                                    fontWeight='500'
                                    borderColor={errors.shippingCity && touched.shippingCity ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingCity && touched.shippingCity && errors.shippingCity}</Text>
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
                                    onBlur={handleBlur}
                                    placeholder='Billing City'
                                    fontWeight='500'
                                    borderColor={errors.billingCity && touched.billingCity ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingCity && touched.billingCity && errors.billingCity}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Shipping State
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.shippingState}
                                    name="shippingState"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Shipping State'
                                    fontWeight='500'
                                    borderColor={errors.shippingState && touched.shippingState ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingState && touched.shippingState && errors.shippingState}</Text>
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
                                    onBlur={handleBlur}
                                    placeholder='Billing State'
                                    fontWeight='500'
                                    borderColor={errors.billingState && touched.billingState ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingState && touched.billingState && errors.billingState}</Text>
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
                                    onBlur={handleBlur}
                                    placeholder='Shipping Country'
                                    fontWeight='500'
                                    borderColor={errors.shippingCountry && touched.shippingCountry ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.shippingCountry && touched.shippingCountry && errors.shippingCountry}</Text>
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
                                    onBlur={handleBlur}
                                    placeholder='Billing Country'
                                    fontWeight='500'
                                    borderColor={errors.billingCountry && touched.billingCountry ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.billingCountry && touched.billingCountry && errors.billingCountry}</Text>
                            </GridItem>


                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Type
                                </FormLabel>
                                <Select
                                    value={values.type}
                                    name="type"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    mb={errors.type && touched.type ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Select Type'}
                                    borderColor={errors.type && touched.type ? "red.300" : null}
                                >
                                    <option value="Analyst">Analyst</option>
                                    <option value="Competitor">Competitor </option>
                                    <option value="Customer">Customer</option>
                                    <option value="Integrator">Integrator</option>
                                    <option value="Investor">Investor </option>
                                    <option value="Partner">Partner</option>
                                    <option value="Press">Press</option>
                                    <option value="Prospect">Prospect</option>
                                    <option value="Reseller">Reseller</option>
                                    <option value="Other">Other</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.type && touched.type && errors.type}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Industry
                                </FormLabel>
                                <Select
                                    value={values.industry}
                                    name="industry"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    mb={errors.industry && touched.industry ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Select Industry'}
                                    borderColor={errors.industry && touched.industry ? "red.300" : null}
                                >
                                    <option value="Apparel">Apparel</option>
                                    <option value="Banking">Banking </option>
                                    <option value="Biotechnology">Biotechnology</option>
                                    <option value="Chemicals">Chemicals</option>
                                    <option value="Communications">Communications </option>
                                    <option value="Construction">Construction</option>
                                    <option value="Consulting">Consulting</option>
                                    <option value="Education">Education</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Energy">Energy</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Government">Government</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Hospitality">Hospitality</option>
                                    <option value="Insurance">Insurance</option>
                                    <option value="Machinery">Machinery</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Media">Media</option>
                                    <option value="Not For Profit">Not For Profit</option>
                                    <option value="Recreation">Recreation</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Shipping">Shipping</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Telecommunications">Telecommunications</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Other">Other</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.industry && touched.industry && errors.industry}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Description
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.description}
                                    name="description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Description'
                                    fontWeight='500'
                                    borderColor={errors.description && touched.description ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.description && touched.description && errors.description}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Annual Revenue
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.annualRevenue}
                                    name="annualRevenue"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='annualRevenue'
                                    fontWeight='500'
                                    borderColor={errors.annualRevenue && touched.annualRevenue ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.annualRevenue && touched.annualRevenue && errors.annualRevenue}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Rating
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.rating}
                                    name="rating"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Rating'
                                    fontWeight='500'
                                    borderColor={errors.rating && touched.rating ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.rating && touched.rating && errors.rating}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    SIC Code
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.SICCode}
                                    name="SICCode"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='SIC Code'
                                    fontWeight='500'
                                    borderColor={errors.SICCode && touched.SICCode ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.SICCode && touched.SICCode && errors.SICCode}</Text>
                            </GridItem>
                            {
                                user.role === 'superAdmin' &&
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Assigned User
                                    </FormLabel>
                                    <Flex justifyContent={'space-between'}>
                                        <Select
                                            value={values.assignUser}
                                            name="assignUser"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            mb={errors.assignUser && touched.assignUser ? undefined : '10px'}
                                            fontWeight='500'
                                            placeholder={'Assign To'}
                                            borderColor={errors.assignUser && touched.assignUser ? "red.300" : null}
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
                                    Member Of
                                </FormLabel>
                                <Flex justifyContent={'space-between'}>
                                    <Select
                                        value={values.memberOf}
                                        name="memberOf"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        mb={errors.memberOf && touched.memberOf ? undefined : '10px'}
                                        fontWeight='500'
                                        placeholder={'Member Of'}
                                        borderColor={errors.memberOf && touched.memberOf ? "red.300" : null}
                                    >
                                        {accountList?.length > 0 && accountList?.map((item) => {
                                            return <option value={item._id} key={item._id}>{`${item?.name}`}</option>
                                        })}
                                    </Select>
                                    <IconButton onClick={() => setAccountModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                </Flex>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.memberOf && touched.memberOf && errors.memberOf}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <Checkbox isChecked={values?.emailOptOut} onChange={handleChange} name='emailOptOut' lable="Email Opt Out">Email Opt Out</Checkbox>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <Checkbox isChecked={values?.invalidEmail} onChange={handleChange} name='invalidEmail' lable="Invalid Email">Invalid Email</Checkbox>
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
