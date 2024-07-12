import { Button, Grid, GridItem, Flex, IconButton, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure, Box, Heading, Input } from '@chakra-ui/react'
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

const View = (props) => {
    const params = useParams()
    const { id } = params
    const user = JSON.parse(localStorage.getItem("user"))

    const [permission, contactAccess, leadAccess] = HasAccess(['Tasks', 'Contacts', 'Leads'])

    const [data, setData] = useState()
    const { onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [deleteManyModel, setDeleteManyModel] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [type, setType] = useState("")
    const [editableField, setEditableField] = useState(null);
    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toISOString().split('.')[0];
    const fetchViewData = async () => {
        if (id) {
            let result = await getApi('api/opportunity/view/', id?.event ? id?.event?._def?.extendedProps?._id : id);
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
                    filename: `Task_Details_${moment().format("DD-MM-YYYY")}.pdf`,
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
    const handleDeleteTask = async (ids) => {
        try {
            let response = await deleteManyApi('api/opportunities/deleteMany', ids)
            if (response.status === 200) {
                navigate('/opportunities')
                setDeleteManyModel(false)
            }
        } catch (error) {
            console.log(error)
        }

    }

    const initialValues = {
        title: data?.title,
        description: data?.description,
        notes: data?.notes,
        start: data?.start,
        end: data?.end,
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: opprtunitiesSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            let response = await putApi(`api/opportunities/edit/${id}`, values)
            if (response.status === 200) {
                setEditableField(null);
                fetchViewData()
            }
        },
    });
    const handleDoubleClick = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        setEditableField(fieldName)
    };

    const handleBlur = (e) => {
        formik.handleSubmit();
    };
    useEffect(() => {
        fetchViewData()
    }, [id, edit])

    const handleClick = () => {
        onOpen()
    }
    return (
        <div>
            <Grid templateColumns="repeat(4, 1fr)" gap={3} id="reports">
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
                                                {(user.role === 'superAdmin' || permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" colorScheme='blackAlpha' size="sm" va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>}
                                                <MenuDivider />
                                                <MenuList minWidth={2}>
                                                    {(user.role === 'superAdmin' || permission?.create) && <MenuItem onClick={() => { handleClick(); setType("add") }
                                                    } alignItems={'start'} color={'blue'} icon={<AddIcon />}>Add</MenuItem>}
                                                    {(user.role === 'superAdmin' || permission?.update) && <MenuItem onClick={() => { setEdit(true); setType("edit") }} alignItems={'start'} icon={<EditIcon />}>Edit</MenuItem>}
                                                    <MenuItem onClick={generatePDF} alignItems={"start"} icon={<FaFilePdf />} display={"flex"} style={{ alignItems: "center" }}>Print as PDF</MenuItem >

                                                    {(user.role === 'superAdmin' || permission?.deleteModel) && <>
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
                                        <Text onDoubleClick={() => handleDoubleClick("opportunityName", data?.opportunityName)}>{data?.opportunityName ? data?.opportunityName : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Account Name </Text>
                                {
                                    editableField === "accountName" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="accountName"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.accountName}
                                                borderColor={formik?.errors?.accountName && formik?.touched?.accountName ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.accountName && formik?.touched.accountName && formik?.errors.accountName}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("accountName", data?.accountName)}>{data?.accountName ? data?.accountName : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Assigned User </Text>
                                <Text>{data?.assignUserName ? data?.assignUserName : ' - '}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Type</Text>
                                {
                                    editableField === "Type" ?
                                        <>
                                            <Input
                                                name="Type"
                                                type={data?.allDay ? 'date' : 'datetime-local'}
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={data.allDay === true
                                                    ? moment(formik.values.Type).format('YYYY-MM-DD')
                                                    : moment(formik.values.Type).format('YYYY-MM-DD HH:mm A')}
                                                autoFocus
                                                borderColor={formik?.errors?.Type && formik?.touched?.Type ? "red.300" : null}
                                                min={data?.allDay ? dayjs(today).format('YYYY-MM-DD') : dayjs(todayTime).format('YYYY-MM-DD HH:mm')}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.Type && formik?.touched.Type && formik?.errors.Type}</Text>

                                        </>
                                        :
                                        <Text>{data?.type ? data?.type : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Lead Source</Text>
                                {
                                    editableField === "leadSource" ?
                                        <>
                                            <Input
                                                name="leadSource"
                                                type={data?.allDay ? 'date' : 'datetime-local'}
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                min={formik.values.start}
                                                value={data.allDay === true
                                                    ? moment(formik.values.leadSource).format('YYYY-MM-DD')
                                                    : moment(formik.values.leadSource).format('YYYY-MM-DD HH:mm A')}
                                                autoFocus
                                                borderColor={formik.errors?.leadSource && formik.touched?.leadSource ? "red.300" : null}

                                            />
                                            <Text mb='10px' color={'red'}> {formik.errors.leadSource && formik.touched.leadSource && formik.errors.leadSource}</Text>
                                        </>

                                        :
                                        <Text>{data?.leadSource ? data?.leadSource : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Currency</Text>
                                {
                                    editableField === "currency" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="currency"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.currency}
                                                autoFocus
                                                borderColor={formik?.errors?.currency && formik?.touched?.currency ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.currency && formik?.touched.currency && formik?.errors.currency}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("currency", data?.currency)}>{data?.currency ? data?.currency : ' - '}</Text>
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
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.opportunityAmount}
                                                autoFocus
                                                borderColor={formik?.errors?.opportunityAmount && formik?.touched?.opportunityAmount ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.opportunityAmount && formik?.touched.opportunityAmount && formik?.errors.opportunityAmount}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("opportunityAmount", data?.opportunityAmount)}>{data?.opportunityAmount ? data?.opportunityAmount : ' - '}</Text>
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
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.amount}
                                                autoFocus
                                                borderColor={formik?.errors?.amount && formik?.touched?.amount ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.amount && formik?.touched.amount && formik?.errors.amount}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("amount", data?.amount)}>{data?.amount ? data?.amount : ' - '}</Text>
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
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.expectedCloseDate}
                                                autoFocus
                                                borderColor={formik?.errors?.expectedCloseDate && formik?.touched?.expectedCloseDate ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.expectedCloseDate && formik?.touched.expectedCloseDate && formik?.errors.expectedCloseDate}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("expectedCloseDate", data?.expectedCloseDate)}>{data?.expectedCloseDate ? data?.expectedCloseDate : ' - '}</Text>
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
                                        <Text onDoubleClick={() => handleDoubleClick("nextStep", data?.nextStep)}>{data?.nextStep ? data?.nextStep : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Sales Stage</Text>
                                {
                                    editableField === "salesStage" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="salesStage"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.salesStage}
                                                autoFocus
                                                borderColor={formik?.errors?.salesStage && formik?.touched?.salesStage ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.salesStage && formik?.touched.salesStage && formik?.errors.salesStage}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("salesStage", data?.salesStage)}>{data?.salesStage ? data?.salesStage : ' - '}</Text>
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
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.probability}
                                                autoFocus
                                                borderColor={formik?.errors?.probability && formik?.touched?.probability ? "red.300" : null}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.probability && formik?.touched.probability && formik?.errors.probability}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("probability", data?.probability)}>{data?.probability ? data?.probability : ' - '}</Text>
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
                                        <Text onDoubleClick={() => handleDoubleClick("description", data?.description)}>{data?.description ? data?.description : ' - '}</Text>
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
                                {(permission?.update || user?.role === 'superAdmin') && <Button size="sm" onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>}
                                {(permission?.delete || user?.role === 'superAdmin') && <Button size="sm" style={{ background: 'red.800' }} onClick={() => setDeleteManyModel(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                            </Flex>
                        </GridItem>
                    </Grid>
                </Card>
            }
            <AddEdit isOpen={edit} size="lg" onClose={() => setEdit(false)} viewClose={onClose} selectedId={id?.event ? id?.event?._def?.extendedProps?._id : id} userAction={"edit"} type={type} />
            <CommonDeleteModel isOpen={deleteManyModel} onClose={() => setDeleteManyModel(false)} type='Opportunities' handleDeleteData={handleDeleteTask} ids={[id]} />
        </div >
    )
}

export default View
