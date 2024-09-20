import { Button, Grid, GridItem, Flex, IconButton, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure, Box, Heading, Input, Select } from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React from 'react'
import moment from 'moment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BiLink } from 'react-icons/bi'
import { useEffect } from 'react'
import { useState } from 'react'
import Card from 'components/card/Card'
import { IoIosArrowBack } from "react-icons/io";
import { HasAccess } from '../../../redux/accessUtils';
import { HSeparator } from 'components/separator/Separator';
import AddEdit from './AddEdit';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi, putApi, getApi } from '../../../services/api';
import { FaFilePdf } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { opprtunitiesSchema } from '../../../schema/opprtunitiesSchema';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { accountSchema } from '../../../schema/accountSchema';

const View = (props) => {
    const params = useParams()
    const { id } = params
    const user = JSON.parse(localStorage.getItem("user"))

    const [permission, contactAccess, leadAccess] = HasAccess(['Account', 'Contacts', 'Leads'])

    const [data, setData] = useState()
    const { onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [deleteManyModel, setDeleteManyModel] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [type, setType] = useState("")
    const [editableField, setEditableField] = useState(null);
    const [editableFieldName, setEditableFieldName] = useState(null);
    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toISOString().split('.')[0];

    const fetchViewData = async () => {
        if (id) {
            let result = await getApi('api/account/view/', id);
            setData(result?.data);
        }
    }
    const generatePDF = () => {
        setLoading(true)
        const element = document.getElementById("reports");
        const hideBtn = document.getElementById("hide-btn");

        if (element) {
            hideBtn.style.display = 'none';
            html2pdf()
                .from(element)
                .set({
                    margin: [0, 0, 0, 0],
                    filename: `Account_Details_${moment().format("DD-MM-YYYY")}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
                })
                .save().then(() => {
                    setLoading(false)
                    hideBtn.style.display = '';
                })
            // }, 500);
        } else {
            console.error("Element with ID 'reports' not found.");
            setLoading(false)
        }
    };
    const handleDeleteAccount = async (ids) => {
        try {
            let response = await deleteManyApi('api/account/deleteMany', ids)
            if (response.status === 200) {
                navigate('/account')
                toast.success(`Account Delete successfully`)
                setDeleteManyModel(false)
            }
        } catch (error) {
            console.log(error)
            toast.error(`server error`)

        }

    }

    const initialValues = {
        name: data?.name,
        officePhone: data?.officePhone,
        alternatePhone: data?.alternatePhone,
        assignUser: data?.assignUser,
        website: data?.website,
        fax: data?.fax,
        ownership: data?.ownership,
        emailAddress: data?.emailAddress,
        nonPrimaryEmail: data?.nonPrimaryEmail,
        billingStreet: data?.billingStreet,
        billingStreet2: data?.billingStreet2,
        billingStreet3: data?.billingStreet3,
        billingStreet4: data?.billingStreet4,
        billingPostalcode: data?.billingPostalcode,
        billingCity: data?.billingCity,
        billingState: data?.billingState,
        billingCountry: data?.billingCountry,
        shippingStreet: data?.shippingStreet,
        shippingStreet2: data?.shippingStreet2,
        shippingStreet3: data?.shippingStreet3,
        shippingStreet4: data?.shippingStreet4,
        shippingPostalcode: data?.shippingPostalcode,
        shippingCity: data?.shippingCity,
        shippingState: data?.shippingState,
        shippingCountry: data?.shippingCountry,
        description: data?.description,
        type: data?.type,
        industry: data?.industry,
        annualRevenue: data?.annualRevenue,
        rating: data?.rating,
        SICCode: data?.SICCode,
        memberOf: data?.memberOf,
        modifiedBy: JSON.parse(localStorage.getItem('user'))._id
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: accountSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            const payload = {
                ...values,
                modifiedDate: new Date()
            }
            let response = await putApi(`api/account/edit/${id}`, payload)
            setEditableField(null);
            if (response.status === 200) {
                fetchViewData()
                toast.success(`${editableFieldName} Update successfully`)
            } else {
                toast.error(`${editableFieldName} not Update`)
            }
        },
    });
    const handleDoubleClick = (fieldName, value, name) => {
        formik.setFieldValue(fieldName, value);
        setEditableField(fieldName)
        setEditableFieldName(name)
    };

    const handleBlur = (e) => {
        formik.handleSubmit();
    };
    useEffect(() => {
        fetchViewData()
    }, [id, edit])

    return (
        <div>
            <Grid templateColumns="repeat(4, 1fr)" gap={3} id="reports">
                <GridItem colSpan={{ base: 4 }}>
                    <Heading size="lg" m={3}>
                        {data?.name || " "}
                    </Heading>
                </GridItem>
                <GridItem colSpan={{ base: 4 }}>
                    <Card>
                        <Grid gap={4}>
                            <GridItem colSpan={2}>
                                <Box>
                                    <Box display={"flex"} justifyContent={"space-between"} >
                                        <Heading size="md" mb={3}>
                                            Account Details
                                        </Heading>
                                        <Flex id="hide-btn" >
                                            <Menu>
                                                {(user.role === 'superAdmin' || permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" colorScheme='blackAlpha' size="sm" va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>}
                                                <MenuDivider />
                                                <MenuList minWidth={2}>
                                                    {(user.role === 'superAdmin' || permission?.create) && <MenuItem onClick={() => { setEdit(true); setType("add"); formik.resetForm() }
                                                    } alignItems={'start'} color={'blue'} icon={<AddIcon />}>Add</MenuItem>}
                                                    {(user.role === 'superAdmin' || permission?.update) && <MenuItem onClick={() => { setEdit(true); setType("edit") }} alignItems={'start'} icon={<EditIcon />}>Edit</MenuItem>}
                                                    <MenuItem onClick={generatePDF} alignItems={"start"} icon={<FaFilePdf />} display={"flex"} style={{ alignItems: "center" }}>Print as PDF</MenuItem >

                                                    {(user.role === 'superAdmin' || permission?.delete) && <>
                                                        <MenuDivider />
                                                        <MenuItem alignItems={'start'} onClick={() => setDeleteManyModel(true)} color={'red'} icon={<DeleteIcon />}>Delete</MenuItem>
                                                    </>}
                                                </MenuList>
                                            </Menu>
                                            <Button leftIcon={<IoIosArrowBack />} size='sm' variant="brand" onClick={() => navigate(-1)} >
                                                Back
                                            </Button>
                                        </Flex>
                                    </Box>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Account Name </Text>
                                {
                                    editableField === "name" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="name"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.name}
                                                borderColor={formik?.errors?.name && formik?.touched?.name ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.name && formik?.touched.name && formik?.errors.name}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("name", data?.name, "Account Name")}>{data?.name ? data?.name : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Office Phone </Text>
                                {
                                    editableField === "officePhone" ?
                                        <>
                                            <Input
                                                name="officePhone"
                                                type="number"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.officePhone}
                                                borderColor={formik?.errors?.officePhone && formik?.touched?.officePhone ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.officePhone && formik?.touched.officePhone && formik?.errors.officePhone}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("officePhone", data?.officePhone, "Office Phone")}>{data?.officePhone ? data?.officePhone : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Alternate Phone</Text>
                                {
                                    editableField === "alternatePhone" ?
                                        <>
                                            <Input
                                                name="alternatePhone"
                                                type="number"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.alternatePhone}
                                                borderColor={formik?.errors?.alternatePhone && formik?.touched?.alternatePhone ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.alternatePhone && formik?.touched.alternatePhone && formik?.errors.alternatePhone}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("alternatePhone", data?.alternatePhone, "Alternate Phone")}>{data?.alternatePhone ? data?.alternatePhone : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Website</Text>
                                {
                                    editableField === "website" ?
                                        <>
                                            <Input
                                                name="website"
                                                type="url"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.website}
                                                borderColor={formik?.errors?.website && formik?.touched?.website ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.website && formik?.touched.website && formik?.errors.website}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("website", data?.website, "Website")}>{data?.website ? data?.website : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Fax</Text>
                                {
                                    editableField === "fax" ?
                                        <>
                                            <Input
                                                name="fax"
                                                type="number"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.fax}
                                                borderColor={formik?.errors?.fax && formik?.touched?.fax ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.fax && formik?.touched.fax && formik?.errors.fax}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("fax", data?.fax, "Fax")}>{data?.fax ? data?.fax : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Ownership</Text>
                                {
                                    editableField === "ownership" ?
                                        <>
                                            <Input
                                                name="ownership"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.ownership}
                                                borderColor={formik?.errors?.ownership && formik?.touched?.ownership ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.ownership && formik?.touched.ownership && formik?.errors.ownership}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("ownership", data?.ownership, "Ownership")}>{data?.ownership ? data?.ownership : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Email Address</Text>
                                {
                                    editableField === "emailAddress" ?
                                        <>
                                            <Input
                                                name="emailAddress"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.emailAddress}
                                                borderColor={formik?.errors?.emailAddress && formik?.touched?.emailAddress ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.emailAddress && formik?.touched.emailAddress && formik?.errors.emailAddress}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("emailAddress", data?.emailAddress, "Email Address")}>{data?.emailAddress ? data?.emailAddress : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Non Primary Email</Text>
                                {
                                    editableField === "nonPrimaryEmail" ?
                                        <>
                                            <Input
                                                name="nonPrimaryEmail"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.nonPrimaryEmail}
                                                borderColor={formik?.errors?.nonPrimaryEmail && formik?.touched?.nonPrimaryEmail ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.nonPrimaryEmail && formik?.touched.nonPrimaryEmail && formik?.errors.nonPrimaryEmail}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("nonPrimaryEmail", data?.nonPrimaryEmail, "Non Primary Email")}>{data?.nonPrimaryEmail ? data?.nonPrimaryEmail : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Shipping Street</Text>
                                {
                                    editableField === "shippingStreet" ?
                                        <>
                                            <Input
                                                name="shippingStreet"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.shippingStreet}
                                                borderColor={formik?.errors?.shippingStreet && formik?.touched?.shippingStreet ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.shippingStreet && formik?.touched.shippingStreet && formik?.errors.shippingStreet}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("shippingStreet", data?.shippingStreet, "Shipping Street")}>{data?.shippingStreet ? data?.shippingStreet : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Billing Street</Text>
                                {
                                    editableField === "billingStreet" ?
                                        <>
                                            <Input
                                                name="billingStreet"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.billingStreet}
                                                borderColor={formik?.errors?.billingStreet && formik?.touched?.billingStreet ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.billingStreet && formik?.touched.billingStreet && formik?.errors.billingStreet}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("billingStreet", data?.billingStreet, "Billing Street")}>{data?.billingStreet ? data?.billingStreet : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Shipping Street2</Text>
                                {
                                    editableField === "shippingStreet2" ?
                                        <>
                                            <Input
                                                name="shippingStreet2"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.shippingStreet2}
                                                borderColor={formik?.errors?.shippingStreet2 && formik?.touched?.shippingStreet2 ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.shippingStreet2 && formik?.touched.shippingStreet2 && formik?.errors.shippingStreet2}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("shippingStreet2", data?.shippingStreet2, "Shipping Street2")}>{data?.shippingStreet2 ? data?.shippingStreet2 : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Billing Street2</Text>
                                {
                                    editableField === "billingStreet2" ?
                                        <>
                                            <Input
                                                name="billingStreet2"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.billingStreet2}
                                                borderColor={formik?.errors?.billingStreet2 && formik?.touched?.billingStreet2 ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.billingStreet2 && formik?.touched.billingStreet2 && formik?.errors.billingStreet2}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("billingStreet2", data?.billingStreet2, "Billing Street2")}>{data?.billingStreet2 ? data?.billingStreet2 : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Shipping Street3</Text>
                                {
                                    editableField === "shippingStreet3" ?
                                        <>
                                            <Input
                                                name="shippingStreet3"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.shippingStreet3}
                                                borderColor={formik?.errors?.shippingStreet3 && formik?.touched?.shippingStreet3 ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.shippingStreet3 && formik?.touched.shippingStreet3 && formik?.errors.shippingStreet3}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("shippingStreet3", data?.shippingStreet3, "Shipping Street3")}>{data?.shippingStreet3 ? data?.shippingStreet3 : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Billing Street3</Text>
                                {
                                    editableField === "billingStreet3" ?
                                        <>
                                            <Input
                                                name="billingStreet3"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.billingStreet3}
                                                borderColor={formik?.errors?.billingStreet3 && formik?.touched?.billingStreet3 ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.billingStreet3 && formik?.touched.billingStreet3 && formik?.errors.billingStreet3}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("billingStreet3", data?.billingStreet3, "Billing Street3")}>{data?.billingStreet3 ? data?.billingStreet3 : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Shipping Street4</Text>
                                {
                                    editableField === "shippingStreet4" ?
                                        <>
                                            <Input
                                                name="shippingStreet4"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.shippingStreet4}
                                                borderColor={formik?.errors?.shippingStreet4 && formik?.touched?.shippingStreet4 ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.shippingStreet4 && formik?.touched.shippingStreet4 && formik?.errors.shippingStreet4}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("shippingStreet4", data?.shippingStreet4, "Shipping Street4")}>{data?.shippingStreet4 ? data?.shippingStreet4 : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Billing Street4</Text>
                                {
                                    editableField === "billingStreet4" ?
                                        <>
                                            <Input
                                                name="billingStreet4"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.billingStreet4}
                                                borderColor={formik?.errors?.billingStreet4 && formik?.touched?.billingStreet4 ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.billingStreet4 && formik?.touched.billingStreet4 && formik?.errors.billingStreet4}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("billingStreet4", data?.billingStreet4, "Billing Street4")}>{data?.billingStreet4 ? data?.billingStreet4 : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Shipping Postal Code</Text>
                                {
                                    editableField === "shippingPostalcode" ?
                                        <>
                                            <Input
                                                name="shippingPostalcode"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.shippingPostalcode}
                                                borderColor={formik?.errors?.shippingPostalcode && formik?.touched?.shippingPostalcode ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.shippingPostalcode && formik?.touched.shippingPostalcode && formik?.errors.shippingPostalcode}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("shippingPostalcode", data?.shippingPostalcode, "Shipping Postal Code")}>{data?.shippingPostalcode ? data?.shippingPostalcode : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Billing Postal Code</Text>
                                {
                                    editableField === "billingPostalcode" ?
                                        <>
                                            <Input
                                                name="billingPostalcode"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.billingPostalcode}
                                                borderColor={formik?.errors?.billingPostalcode && formik?.touched?.billingPostalcode ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.billingPostalcode && formik?.touched.billingPostalcode && formik?.errors.billingPostalcode}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("billingPostalcode", data?.billingPostalcode, "Billing Postal Code")}>{data?.billingPostalcode ? data?.billingPostalcode : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Shipping City
                                </Text>
                                {
                                    editableField === "shippingCity" ?
                                        <>
                                            <Input
                                                name="shippingCity"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.shippingCity}
                                                borderColor={formik?.errors?.shippingCity && formik?.touched?.shippingCity ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.shippingCity && formik?.touched.shippingCity && formik?.errors.shippingCity}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("shippingCity", data?.shippingCity, "Shipping City")}>{data?.shippingCity ? data?.shippingCity : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Billing City
                                </Text>
                                {
                                    editableField === "billingCity" ?
                                        <>
                                            <Input
                                                name="billingCity"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.billingCity}
                                                borderColor={formik?.errors?.billingCity && formik?.touched?.billingCity ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.billingCity && formik?.touched.billingCity && formik?.errors.billingCity}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("billingCity", data?.billingCity, "Billing City")}>{data?.billingCity ? data?.billingCity : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Shipping State</Text>
                                {
                                    editableField === "shippingState" ?
                                        <>
                                            <Input
                                                name="shippingState"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.shippingState}
                                                borderColor={formik?.errors?.shippingState && formik?.touched?.shippingState ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.shippingState && formik?.touched.shippingState && formik?.errors.shippingState}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("shippingState", data?.shippingState, "Shipping State")}>{data?.shippingState ? data?.shippingState : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Billing State</Text>
                                {
                                    editableField === "billingState" ?
                                        <>
                                            <Input
                                                name="billingState"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.billingState}
                                                borderColor={formik?.errors?.billingState && formik?.touched?.billingState ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.billingState && formik?.touched.billingState && formik?.errors.billingState}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("billingState", data?.billingState, "Billing State")}>{data?.billingState ? data?.billingState : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Shipping Country</Text>
                                {
                                    editableField === "shippingCountry" ?
                                        <>
                                            <Input
                                                name="shippingCountry"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.shippingCountry}
                                                borderColor={formik?.errors?.shippingCountry && formik?.touched?.shippingCountry ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.shippingCountry && formik?.touched.shippingCountry && formik?.errors.shippingCountry}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("shippingCountry", data?.shippingCountry, "Shipping Country")}>{data?.shippingCountry ? data?.shippingCountry : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Billing Country</Text>
                                {
                                    editableField === "billingCountry" ?
                                        <>
                                            <Input
                                                name="billingCountry"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.billingCountry}
                                                borderColor={formik?.errors?.billingCountry && formik?.touched?.billingCountry ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.billingCountry && formik?.touched.billingCountry && formik?.errors.billingCountry}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("billingCountry", data?.billingCountry, "Billing Country")}>{data?.billingCountry ? data?.billingCountry : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Type</Text>
                                {
                                    editableField === "type" ?
                                        <>
                                            <Select
                                                value={formik?.values.type}
                                                name="type"
                                                onChange={formik?.handleChange}
                                                onBlur={handleBlur}
                                                fontWeight='500'
                                                placeholder={'Select Type'}
                                                borderColor={formik?.errors.type && formik?.touched.type ? "red.300" : null}
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
                                            <Text mb='10px' color={'red'}> {formik?.errors.type && formik?.touched.type && formik?.errors.type}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("type", data?.type, "Type")}>{data?.type ? data?.type : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Industry</Text>
                                {
                                    editableField === "industry" ?
                                        <>
                                            <Select
                                                value={formik?.values.industry}
                                                name="industry"
                                                onChange={formik?.handleChange}
                                                onBlur={handleBlur}
                                                fontWeight='500'
                                                placeholder={'Select Industry'}
                                                borderColor={formik?.errors.industry && formik?.touched.industry ? "red.300" : null}
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
                                            <Text mb='10px' color={'red'}> {formik?.errors.industry && formik?.touched.industry && formik?.errors.industry}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("industry", data?.industry, "Industry")}>{data?.industry ? data?.industry : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Rating </Text>
                                <Text >{data?.rating ? data?.rating : ' - '}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>SIC Code</Text>
                                {
                                    editableField === "SICCode" ?
                                        <>
                                            <Input
                                                name="SICCode"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.SICCode}
                                                borderColor={formik?.errors?.SICCode && formik?.touched?.SICCode ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.SICCode && formik?.touched.SICCode && formik?.errors.SICCode}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("SICCode", data?.SICCode, "SIC Code")}>{data?.SICCode ? data?.SICCode : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Assigned User </Text>
                                {/* <Text>{data?.assignUserName ? data?.assignUserName : ' - '}</Text> */}
                                {
                                    data?.assignUser ?
                                        <Link to={user.role === 'superAdmin' && `/userView/${data?.assignUser}`}>
                                            <Text color={user.role === 'superAdmin' ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: user.role === 'superAdmin' ? 'blue.500' : 'blackAlpha.900', textDecoration: user.role === 'superAdmin' ? 'underline' : 'none' } }} style={{ cursor: "pointer" }}>{data?.assignUserName ? data?.assignUserName : ' - '}</Text>
                                        </Link>
                                        :
                                        <Text color={user.role === 'superAdmin' ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: user.role === 'superAdmin' ? 'blue.500' : 'blackAlpha.900', textDecoration: user.role === 'superAdmin' ? 'underline' : 'none' } }}>{data?.assignUserName ? data?.assignUserName : ' - '}</Text>

                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Member Of </Text>
                                {
                                    data?.memberOf ?
                                        <Link to={`/accountView/${data?.memberOf}`}>
                                            <Text color={permission?.view ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: permission?.view ? 'blue.500' : 'blackAlpha.900', textDecoration: permission?.view ? 'underline' : 'none' } }} style={{ cursor: "pointer" }}>{data?.memberOfName ? data?.memberOfName : ' - '}</Text>
                                        </Link>
                                        :
                                        <Text color={permission?.view ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: permission?.view ? 'blue.500' : 'blackAlpha.900', textDecoration: permission?.view ? 'underline' : 'none' } }}>{data?.memberOfName ? data?.memberOfName : ' - '}</Text>

                                }
                            </GridItem>

                            {/* <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task reminder </Text>
                                <Text>{data?.reminder ? data?.reminder : ' - '}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Assign To  </Text>
                                <Link to={data?.assignTo ? contactAccess?.view && `/contactView/${data?.assignTo}` : leadAccess?.view && `/leadView/${data?.assignToLead}`}>
                                    <Text color={(data?.category === 'contact' && (contactAccess?.view || user?.role === 'superAdmin')) ? 'brand.600' : (leadAccess?.view || user?.role === 'superAdmin' && data?.category === 'lead') ? 'brand.600' : 'blackAlpha.900'} sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.assignToName ? data?.assignToName : ' - '}</Text>
                                </Link>
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task createBy </Text>
                                <Text>{data?.createByName ? data?.createByName : ' - '}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 2 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Description</Text>
                                {
                                    editableField === "description" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="description"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.description}
                                                autoFocus
                                                borderColor={formik?.errors?.description && formik?.touched?.description ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.description && formik?.touched.description && formik?.errors.description}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("description", data?.description)}>{data?.description ? data?.description : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task notes </Text>
                                {
                                    editableField === "notes" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="notes"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.notes}
                                                autoFocus
                                                borderColor={formik?.errors?.notes && formik?.touched?.notes ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.notes && formik?.touched.notes && formik?.errors.notes}</Text>

                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("notes", data?.notes)}>{data?.notes ? data?.notes : ' - '}</Text>
                                }
                            </GridItem> */}
                        </Grid>
                    </Card>
                </GridItem>

            </Grid>
            {
                (permission?.update || permission?.delete || user?.role === 'superAdmin') && <Card mt={3}>
                    <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                        <GridItem colStart={6} >
                            <Flex justifyContent={"right"}>
                                {(permission?.update || user?.role === 'superAdmin') && <Button size="sm" onClick={() => { setEdit(true); setType("edit") }} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>}
                                {(permission?.delete || user?.role === 'superAdmin') && <Button size="sm" style={{ background: 'red.800' }} onClick={() => setDeleteManyModel(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                            </Flex>
                        </GridItem>
                    </Grid>
                </Card>
            }
            <AddEdit isOpen={edit} size="lg" onClose={() => setEdit(false)} viewClose={onClose} selectedId={id?.event ? id?.event?._def?.extendedProps?._id : id} type={type} />
            <CommonDeleteModel isOpen={deleteManyModel} onClose={() => setDeleteManyModel(false)} type='Account' handleDeleteData={handleDeleteAccount} ids={[id]} />
        </div >
    )
}

export default View
