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

const View = (props) => {
    const params = useParams()
    const { id } = params
    const user = JSON.parse(localStorage.getItem("user"))

    const [opportunityAccess, accountAccess] = HasAccess(['Opportunities', 'Account'])

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
            let result = await getApi('api/opportunity/view/', id);
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
                    filename: `Opportunities_Details_${moment().format("DD-MM-YYYY")}.pdf`,
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
    const handleDeleteOpportunities = async (ids) => {
        try {
            let response = await deleteManyApi('api/opportunities/deleteMany', ids)
            if (response.status === 200) {
                navigate('/opportunities')
                toast.success(`Opprtunities Delete successfully`)
                setDeleteManyModel(false)
            }
        } catch (error) {
            console.log(error)
            toast.error(`server error`)

        }

    }

    const initialValues = {
        opportunityName: data?.opportunityName,
        accountName: data?.accountName,
        assignUser: data?.assignUser,
        type: data?.type,
        leadSource: data?.leadSource,
        currency: data?.currency,
        opportunityAmount: data?.opportunityAmount,
        amount: data?.amount,
        expectedCloseDate: data?.expectedCloseDate,
        nextStep: data?.nextStep,
        salesStage: data?.salesStage,
        probability: data?.probability,
        description: data?.description,
        modifiedBy: JSON.parse(localStorage.getItem('user'))._id
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: opprtunitiesSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            setEditableField(null);
            const payload = {
                ...values,
                modifiedDate: new Date()
            }
            let response = await putApi(`api/opportunity/edit/${id}`, payload)
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
                    {data?.opportunityName || ""}
                </Heading>

                </GridItem>
                <GridItem colSpan={{ base: 4 }}>

                    <Card >
                        <Grid gap={4}>
                            <GridItem colSpan={2}>
                                <Box>
                                    <Box display={"flex"} justifyContent={"space-between"} >
                                        <Heading size="md" mb={3}>
                                            Opportunities Details
                                        </Heading>
                                        <Flex id="hide-btn" >
                                            <Menu>
                                                {(user.role === 'superAdmin' || opportunityAccess?.create || opportunityAccess?.update || opportunityAccess?.delete) && <MenuButton variant="outline" colorScheme='blackAlpha' size="sm" va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>}
                                                <MenuDivider />
                                                <MenuList minWidth={2}>
                                                    {(user.role === 'superAdmin' || opportunityAccess?.create) && <MenuItem onClick={() => { setEdit(true); setType("add"); formik.resetForm() }
                                                    } alignItems={'start'} color={'blue'} icon={<AddIcon />}>Add</MenuItem>}
                                                    {(user.role === 'superAdmin' || opportunityAccess?.update) && <MenuItem onClick={() => { setEdit(true); setType("edit") }} alignItems={'start'} icon={<EditIcon />}>Edit</MenuItem>}
                                                    <MenuItem onClick={generatePDF} alignItems={"start"} icon={<FaFilePdf />} display={"flex"} style={{ alignItems: "center" }}>Print as PDF</MenuItem >

                                                    {(user.role === 'superAdmin' || opportunityAccess?.delete) && <>
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
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Opportunity Name </Text>
                                {
                                    editableField === "opportunityName" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="opportunityName"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.opportunityName}
                                                borderColor={formik?.errors?.opportunityName && formik?.touched?.opportunityName ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.opportunityName && formik?.touched.opportunityName && formik?.errors.opportunityName}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("opportunityName", data?.opportunityName, "Opportunity Name")}>{data?.opportunityName ? data?.opportunityName : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Account Name </Text>
                                {
                                    data?.accountName ?
                                        <Link to={accountAccess?.view && `/accountView/${data?.accountName}`}>
                                            <Text color={accountAccess?.view ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: accountAccess?.view ? 'blue.500' : 'blackAlpha.900', textDecoration: accountAccess?.view ? 'underline' : 'none' } }} style={{ cursor: "pointer" }}>{data?.accountName2 ? data?.accountName2 : ' - '}</Text>
                                        </Link>
                                        :
                                        <Text color={accountAccess?.view ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: accountAccess?.view ? 'blue.500' : 'blackAlpha.900', textDecoration: accountAccess?.view ? 'underline' : 'none' } }}>{data?.accountName2 ? data?.accountName2 : ' - '}</Text>

                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Assigned User </Text>
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
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Type</Text>
                                {
                                    editableField === "type" ?
                                        <>
                                            <Select
                                                value={formik?.values.type}
                                                name="type"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                mb={formik?.errors.type && formik?.touched.type ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Type'}
                                                borderColor={formik?.errors.type && formik?.touched.type ? "red.300" : null}
                                            >
                                                <option value={"Existing Bussiness"} >Existing Bussiness</option>
                                                <option value={"New Bussiness"} >New Bussiness</option>
                                            </Select>
                                            <Text mb='10px' color={'red'}> {formik?.errors.type && formik?.touched.type && formik?.errors.type}</Text>

                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("type", data?.type, "Type")}>{data?.type ? data?.type : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Lead Source</Text>
                                {
                                    editableField === "leadSource" ?
                                        <>
                                            <Select
                                                value={formik?.values.leadSource}
                                                name="leadSource"
                                                onChange={formik?.handleChange}
                                                onBlur={handleBlur}
                                                mb={formik?.errors.leadSource && formik?.touched.leadSource ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Lead Source'}
                                                borderColor={formik?.errors.leadSource && formik?.touched.leadSource ? "red.300" : null}
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
                                            <Text mb='10px' color={'red'}> {formik.errors.leadSource && formik.touched.leadSource && formik.errors.leadSource}</Text>
                                        </>

                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("leadSource", data?.leadSource, "Lead Source")}>{data?.leadSource ? data?.leadSource : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Currency</Text>
                                {
                                    editableField === "currency" ?
                                        <>
                                            <Select
                                                value={formik?.values.currency}
                                                name="currency"
                                                onChange={formik?.handleChange}
                                                onBlur={handleBlur}
                                                mb={formik?.errors.currency && formik?.touched.currency ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Select Currency'}
                                                borderColor={formik?.errors.currency && formik?.touched.currency ? "red.300" : null}
                                            >
                                                <option value={"$"}>USD</option>
                                            </Select>
                                            <Text mb='10px' color={'red'}> {formik?.errors.currency && formik?.touched.currency && formik?.errors.currency}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("currency", data?.currency, "Currency")}>{data?.currency ? data?.currency : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Opportunity Amount</Text>
                                {
                                    editableField === "opportunityAmount" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="opportunityAmount"
                                                type="number"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.opportunityAmount}
                                                autoFocus
                                                borderColor={formik?.errors?.opportunityAmount && formik?.touched?.opportunityAmount ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.opportunityAmount && formik?.touched.opportunityAmount && formik?.errors.opportunityAmount}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("opportunityAmount", data?.opportunityAmount, "Opportunity Amount")}>{data?.opportunityAmount ? data?.opportunityAmount : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Amount</Text>
                                {
                                    editableField === "amount" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="amount"
                                                type="number"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.amount}
                                                autoFocus
                                                borderColor={formik?.errors?.amount && formik?.touched?.amount ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.amount && formik?.touched.amount && formik?.errors.amount}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("amount", data?.amount, "Amount")}>{data?.amount ? data?.amount : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Expected Close Date</Text>
                                {
                                    editableField === "expectedCloseDate" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="expectedCloseDate"
                                                type="date"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={dayjs(formik.values.expectedCloseDate).format("YYYY-MM-DD")}
                                                autoFocus
                                                borderColor={formik?.errors?.expectedCloseDate && formik?.touched?.expectedCloseDate ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.expectedCloseDate && formik?.touched.expectedCloseDate && formik?.errors.expectedCloseDate}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("expectedCloseDate", data?.expectedCloseDate, "Expected Close Date")}>{data?.expectedCloseDate ? dayjs(data?.expectedCloseDate).format("YYYY-MM-DD") : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Next Step</Text>
                                {
                                    editableField === "nextStep" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="nextStep"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.nextStep}
                                                autoFocus
                                                borderColor={formik?.errors?.nextStep && formik?.touched?.nextStep ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.nextStep && formik?.touched.nextStep && formik?.errors.nextStep}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("nextStep", data?.nextStep, "Next Step")}>{data?.nextStep ? data?.nextStep : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Sales Stage</Text>
                                {
                                    editableField === "salesStage" ?
                                        <>
                                            <Select
                                                value={formik?.values.salesStage}
                                                name="salesStage"
                                                onChange={formik?.handleChange}
                                                onBlur={handleBlur}
                                                mb={formik?.errors.salesStage && formik?.touched.salesStage ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Sales Stage'}
                                                borderColor={formik?.errors.salesStage && formik?.touched.salesStage ? "red.300" : null}
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
                                            <Text mb='10px' color={'red'}> {formik?.errors.salesStage && formik?.touched.salesStage && formik?.errors.salesStage}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("salesStage", data?.salesStage, "Sales Stage")}>{data?.salesStage ? data?.salesStage : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Probability</Text>
                                {
                                    editableField === "probability" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="probability"
                                                type="number"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.probability}
                                                autoFocus
                                                borderColor={formik?.errors?.probability && formik?.touched?.probability ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.probability && formik?.touched.probability && formik?.errors.probability}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("probability", data?.probability, "Probability")}>{data?.probability ? data?.probability : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Description</Text>
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
                                        <Text onDoubleClick={() => handleDoubleClick("description", data?.description, "Description")}>{data?.description ? data?.description : ' - '}</Text>
                                }
                            </GridItem>


                            {/* <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task reminder </Text>
                                <Text>{data?.reminder ? data?.reminder : ' - '}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Assign To  </Text>
                                <Link to={data?.assignTo ? opportunityAccess?.view && `/contactView/${data?.assignTo}` : leadAccess?.view && `/leadView/${data?.assignToLead}`}>
                                    <Text color={(data?.category === 'contact' && (opportunityAccess?.view || user?.role === 'superAdmin')) ? 'brand.600' : (leadAccess?.view || user?.role === 'superAdmin' && data?.category === 'lead') ? 'brand.600' : 'blackAlpha.900'} sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.assignToName ? data?.assignToName : ' - '}</Text>
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
                (opportunityAccess?.update || opportunityAccess?.delete || user?.role === 'superAdmin') && <Card mt={3}>
                    <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                        <GridItem colStart={6} >
                            <Flex justifyContent={"right"}>
                                {(opportunityAccess?.update || user?.role === 'superAdmin') && <Button size="sm" onClick={() => { setEdit(true); setType("edit") }} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>}
                                {(opportunityAccess?.delete || user?.role === 'superAdmin') && <Button size="sm" style={{ background: 'red.800' }} onClick={() => setDeleteManyModel(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                            </Flex>
                        </GridItem>
                    </Grid>
                </Card>
            }
            <AddEdit isOpen={edit} size="lg" onClose={() => setEdit(false)} viewClose={onClose} selectedId={id?.event ? id?.event?._def?.extendedProps?._id : id} type={type} />
            <CommonDeleteModel isOpen={deleteManyModel} onClose={() => setDeleteManyModel(false)} type='Opportunities' handleDeleteData={handleDeleteOpportunities} ids={[id]} />
        </div >
    )
}

export default View
