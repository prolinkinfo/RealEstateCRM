import { CloseIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FormLabel, Grid, GridItem, IconButton, Input, Select, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { postApi, getApi, putApi } from 'services/api';
import { generateValidationSchema } from 'utils';
import CustomForm from 'utils/customForm';
import * as yup from 'yup'
import { opprtunitiesSchema } from '../../../schema/opprtunitiesSchema';
import UserModel from '../../../components/commonTableModel/UserModel';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import AccountModel from '../../../components/commonTableModel/AccountModel';
import { HasAccess } from '../../../redux/accessUtils';

const AddEdit = (props) => {
    const { isOpen, size, onClose, type, setAction, selectedId } = props;
    const [isLoding, setIsLoding] = useState(false)
    const [userModel, setUserModel] = useState(false)
    const [accountModel, setAccountModel] = useState(false)
    const [userData, setUserData] = useState([]);
    const [opprtunityDetails, setOpportunityDetails] = useState({});
    const accountList = useSelector((state) => state?.accountData?.data?.data)
    const user = JSON.parse(localStorage.getItem("user"))
    const [accountAccess] = HasAccess(['Account'])

    const initialValues = {
        opportunityName: type === "edit" ? opprtunityDetails?.opportunityName : "",
        accountName: type === "edit" ? opprtunityDetails?.accountName : null,
        assignUser: type === "edit" ? opprtunityDetails?.assignUser : null,
        type: type === "edit" ? opprtunityDetails?.type : "",
        leadSource: type === "edit" ? opprtunityDetails?.leadSource : "",
        currency: type === "edit" ? opprtunityDetails?.currency : "",
        opportunityAmount: type === "edit" ? opprtunityDetails?.opportunityAmount : "",
        amount: type === "edit" ? opprtunityDetails?.amount : "",
        expectedCloseDate: type === "edit" ? opprtunityDetails?.expectedCloseDate : "",
        nextStep: type === "edit" ? opprtunityDetails?.nextStep : "",
        salesStage: type === "edit" ? opprtunityDetails?.salesStage : "",
        probability: type === "edit" ? opprtunityDetails?.probability : "",
        description: type === "edit" ? opprtunityDetails?.description : "",
        createBy: JSON.parse(localStorage.getItem('user'))._id,
        modifiedBy: JSON.parse(localStorage.getItem('user'))._id
    };


    const addData = async (values) => {
        try {
            setIsLoding(true)
            let response = await postApi('api/opportunity/add', values)
            if (response.status === 200) {
                onClose();
                toast.success(`Opprtunities Save successfully`)
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
            let response = await putApi(`api/opportunity/edit/${selectedId}`, values)
            if (response.status === 200) {
                onClose();
                toast.success(`Opprtunities Update successfully`)
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
        validationSchema: opprtunitiesSchema,
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
    console.log(errors)
    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi('api/user/');
        setUserData(result?.data?.user);
        setIsLoding(false)
    }


    const fetchTaskData = async () => {
        if (type === "edit") {
            try {
                setIsLoding(true)
                let result = await getApi('api/opportunity/view/', selectedId)
                if (result?.status === 200) {
                    setOpportunityDetails(result?.data)
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
        if (user.role === 'superAdmin') fetchData();
    }, [])


    useEffect(() => {
        if (type === "edit") fetchTaskData();
    }, [type, selectedId])


    return (
        <div>
            {userModel && <UserModel onClose={() => setUserModel(false)} isOpen={userModel} fieldName={"assignUser"} setFieldValue={setFieldValue} data={userData} isLoding={isLoding} setIsLoding={setIsLoding} />}
            {accountModel && <AccountModel onClose={() => setAccountModel(false)} isOpen={accountModel} fieldName={"accountName"} setFieldValue={setFieldValue} data={accountList} />}

            <Drawer isOpen={isOpen} size={size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader alignItems={"center"} justifyContent='space-between' display='flex'  >
                        {type === "add" ? "Add" : "Edit"} Opportunities
                        <IconButton onClick={() => handleCancel()} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>
                        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Opportunity Name<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.opportunityName}
                                    name="opportunityName"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder='Opportunity Name'
                                    fontWeight='500'
                                    borderColor={errors.opportunityName && touched.opportunityName ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.opportunityName && touched.opportunityName && errors.opportunityName}</Text>
                            </GridItem>
                            {
                                (user.role === 'superAdmin' || accountAccess?.view) &&
                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Account Name
                                    </FormLabel>
                                    <Flex justifyContent={'space-between'}>
                                        <Select
                                            value={values.accountName}
                                            name="accountName"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            mb={errors.accountName && touched.accountName ? undefined : '10px'}
                                            fontWeight='500'
                                            placeholder={'Account Name'}
                                            borderColor={errors.accountName && touched.accountName ? "red.300" : null}
                                        >
                                            {accountList?.length > 0 && accountList?.map((item) => {
                                                return <option value={item._id} key={item._id}>{`${item?.name}`}</option>
                                            })}
                                        </Select>
                                        <IconButton onClick={() => setAccountModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                    </Flex>
                                    <Text mb='10px' fontSize='sm' color={'red'}> {errors.accountName && touched.accountName && errors.accountName}</Text>
                                </GridItem>
                            }
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
                                            onBlur={handleBlur}
                                            onChange={handleChange}
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
                                    Type
                                </FormLabel>
                                <Select
                                    value={values.type}
                                    name="type"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    mb={errors.type && touched.type ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Select Type'}
                                    borderColor={errors.type && touched.type ? "red.300" : null}
                                >
                                    <option value={"Existing Bussiness"} >Existing Bussiness</option>
                                    <option value={"New Bussiness"} >New Bussiness</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.type && touched.type && errors.type}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Lead Source
                                </FormLabel>
                                <Select
                                    value={values.leadSource}
                                    name="leadSource"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    mb={errors.leadSource && touched.leadSource ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Select Lead Source'}
                                    borderColor={errors.leadSource && touched.leadSource ? "red.300" : null}
                                >
                                    <option value={"Cold Call"}>Cold Call</option>
                                    <option value={"Existing Customer"}>Existing Customer</option>
                                    <option value={"Self Generated"}>Self Generated</option>
                                    <option value={"Employee"}>Employee</option>
                                    <option value={"Partner"}>Partner</option>
                                    <option value={"Public Relation"}>Public Relation</option>
                                    <option value={"Direct Mail"}>Direct Mail</option>
                                    <option value={"Conference"}>Conference</option>
                                    <option value={"Trade Show"}>Trade Show</option>
                                    <option value={"Web Site"}>Web Site</option>
                                    <option value={"Word Of Mouth"}>Word Of Mouth</option>
                                    <option value={"Email"}>Email</option>
                                    <option value={"Other"}>Other</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.leadSource && touched.leadSource && errors.leadSource}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Currency
                                </FormLabel>
                                <Select
                                    value={values.currency}
                                    name="currency"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    mb={errors.currency && touched.currency ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Select Currency'}
                                    borderColor={errors.currency && touched.currency ? "red.300" : null}
                                >
                                    <option value={"$"}>USD</option>
                                </Select>
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.currency && touched.currency && errors.currency}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Opportunity Amount<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.opportunityAmount}
                                    name="opportunityAmount"
                                    type='number'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder='Opportunity Amount'
                                    fontWeight='500'
                                    borderColor={errors.opportunityAmount && touched.opportunityAmount ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.opportunityAmount && touched.opportunityAmount && errors.opportunityAmount}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Amount
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    value={values.amount}
                                    name="amount"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type='number'
                                    placeholder='Amount'
                                    fontWeight='500'
                                    borderColor={errors.amount && touched.amount ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.amount && touched.amount && errors.amount}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Expected Close Date<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    type="date"
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={dayjs(values.expectedCloseDate).format("YYYY-MM-DD")}
                                    name="expectedCloseDate"
                                    fontWeight='500'
                                    borderColor={errors?.expectedCloseDate && touched?.expectedCloseDate ? "red.300" : null}
                                />
                                <Text fontSize='sm' mb='10px' color={'red'}> {errors.expectedCloseDate && touched.expectedCloseDate && errors.expectedCloseDate}</Text>
                            </GridItem>

                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Next Step
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.nextStep}
                                    name="nextStep"
                                    placeholder='Next Step'
                                    fontWeight='500'
                                    borderColor={errors.nextStep && touched.nextStep ? "red.300" : null}
                                />
                                <Text fontSize='sm' mb='10px' color={'red'}> {errors.nextStep && touched.nextStep && errors.nextStep}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Sales Stage<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Select
                                    value={values.salesStage}
                                    name="salesStage"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    mb={errors.salesStage && touched.salesStage ? undefined : '10px'}
                                    fontWeight='500'
                                    placeholder={'Select Sales Stage'}
                                    borderColor={errors.salesStage && touched.salesStage ? "red.300" : null}
                                >
                                    <option value={"Prospecting"}>Prospecting</option>
                                    <option value={"Qualification"}>Qualification</option>
                                    <option value={"Needs Analysis"}>Needs Analysis</option>
                                    <option value={"Value Propositon"}>Value Propositon</option>
                                    <option value={"Identifying Decision Makers"}>Identifying Decision Makers</option>
                                    <option value={"Perception Analysis"}>Perception Analysis</option>
                                    <option value={"Proposal/Price Quote"}>Proposal/Price Quote</option>
                                    <option value={"Negotiation/Review"}>Negotiation/Review</option>
                                    <option value={"Closed/Won"}>Closed/Won</option>
                                    <option value={"Closed/Lost"}>Closed/Lost</option>
                                </Select>
                                <Text fontSize='sm' mb='10px' color={'red'}> {errors.salesStage && touched.salesStage && errors.salesStage}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Probability
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.probability}
                                    name="probability"
                                    placeholder='Probability'
                                    type='number'
                                    fontWeight='500'
                                    borderColor={errors.probability && touched.probability ? "red.300" : null}
                                />
                                <Text fontSize='sm' mb='10px' color={'red'}> {errors.probability && touched.probability && errors.probability}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Description
                                </FormLabel>
                                <Textarea
                                    fontSize='sm'
                                    value={values.description}
                                    name="description"
                                    resize={"none"}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder='Description'
                                    fontWeight='500'
                                    borderColor={errors.description && touched.description ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.description && touched.description && errors.description}</Text>
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
