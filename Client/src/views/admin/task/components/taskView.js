import { Button, Grid, GridItem, Flex, IconButton, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure, Box, Heading, Input } from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React from 'react'
import moment from 'moment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BiLink } from 'react-icons/bi'
import { useEffect } from 'react'
import { useState } from 'react'
import { getApi } from 'services/api'
import Card from 'components/card/Card'
import { IoIosArrowBack } from "react-icons/io";
import { HasAccess } from '../../../../redux/accessUtils';
import { HSeparator } from 'components/separator/Separator';
import AddEdit from './AddEdit';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi } from 'services/api';
import { FaFilePdf } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { TaskSchema } from 'schema';
import { useFormik } from 'formik';
import { putApi } from 'services/api';
import dayjs from 'dayjs';

const TaskView = (props) => {
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
    const [editableField, setEditableField] = useState(null);
    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toISOString().split('.')[0];
    const fetchViewData = async () => {
        if (id) {
            let result = await getApi('api/task/view/', id?.event ? id?.event?._def?.extendedProps?._id : id);
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
            let response = await deleteManyApi('api/task/deleteMany', ids)
            if (response.status === 200) {
                navigate('/task')
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
        validationSchema: TaskSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            let response = await putApi(`api/task/edit/${id}`, values)
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
                    <Heading size="lg" m={3}>
                        {data?.title || ""}
                    </Heading>
                </GridItem>
                <GridItem colSpan={{ base: 4 }}>
                    <Card >
                        <Grid gap={4}>
                            <GridItem colSpan={2}>
                                <Box>
                                    <Box display={"flex"} justifyContent={"space-between"} >
                                        <Heading size="md" mb={3}>
                                            Task Details
                                        </Heading>
                                        <Flex id="hide-btn" >
                                            <Menu>
                                                {(user.role === 'superAdmin' || permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" colorScheme='blackAlpha' size="sm" va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>}
                                                <MenuDivider />
                                                <MenuList minWidth={2}>
                                                    {(user.role === 'superAdmin' || permission?.create) && <MenuItem onClick={() => handleClick()} alignItems={'start'} color={'blue'} icon={<AddIcon />}>Add</MenuItem>}
                                                    {(user.role === 'superAdmin' || permission?.update) && <MenuItem onClick={() => setEdit(true)} alignItems={'start'} icon={<EditIcon />}>Edit</MenuItem>}
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
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Title </Text>
                                {
                                    editableField === "title" ?
                                        <>
                                            <Input
                                                id="text"
                                                name="title"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={formik.values.title}
                                                borderColor={formik?.errors?.title && formik?.touched?.title ? "red.300" : null}
                                                autoFocus
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.title && formik?.touched.title && formik?.errors.title}</Text>
                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("title", data?.title)}>{data?.title ? data?.title : ' - '}</Text>
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Related To </Text>
                                <Text>{data?.category ? data?.category : ' - '}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task start </Text>
                                {
                                    editableField === "start" ?
                                        <>
                                            <Input
                                                name="start"
                                                type={data?.allDay ? 'date' : 'datetime-local'}
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                value={data.allDay === true
                                                    ? moment(formik.values.start).format('YYYY-MM-DD')
                                                    : moment(formik.values.start).format('YYYY-MM-DD HH:mm A')}
                                                autoFocus
                                                borderColor={formik?.errors?.start && formik?.touched?.start ? "red.300" : null}
                                                min={data?.allDay ? dayjs(today).format('YYYY-MM-DD') : dayjs(todayTime).format('YYYY-MM-DD HH:mm')}
                                            />
                                            <Text mb='10px' color={'red'}> {formik?.errors.start && formik?.touched.start && formik?.errors.start}</Text>

                                        </>
                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("start", data?.start)}>
                                            {data && data?.start ? (
                                                data.allDay === true
                                                    ? moment(data.start).format('DD-MM-YYYY')
                                                    : moment(data.start).format('DD-MM-YYYY HH:mm A')
                                            ) : (
                                                "-"
                                            )}
                                        </Text>
                                }

                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task end  </Text>
                                {
                                    editableField === "end" ?
                                        <>
                                            <Input
                                                name="end"
                                                type={data?.allDay ? 'date' : 'datetime-local'}
                                                onChange={formik.handleChange}
                                                onBlur={handleBlur}
                                                min={formik.values.start}
                                                value={data.allDay === true
                                                    ? moment(formik.values.end).format('YYYY-MM-DD')
                                                    : moment(formik.values.end).format('YYYY-MM-DD HH:mm A')}
                                                autoFocus
                                                borderColor={formik.errors?.end && formik.touched?.end ? "red.300" : null}

                                            />
                                            <Text mb='10px' color={'red'}> {formik.errors.end && formik.touched.end && formik.errors.end}</Text>
                                        </>

                                        :
                                        <Text onDoubleClick={() => handleDoubleClick("end", data?.end)}>{data?.allDay === true ? moment(data?.end).format('DD-MM-YYYY') : moment(data?.end).format('DD-MM-YYYY HH:mm A')}</Text>

                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
                                <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Link </Text>
                                {data?.url ?
                                    <a target='_blank' href={data?.url}>
                                        <IconButton borderRadius="10px" size="md" icon={<BiLink />} />
                                    </a> : '-'
                                }
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }} >
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
                            </GridItem>
                        </Grid>
                    </Card>
                </GridItem>

            </Grid>
            {(permission?.update || permission?.delete || user?.role === 'superAdmin') && <Card mt={3}>
                <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                    <GridItem colStart={6} >
                        <Flex justifyContent={"right"}>
                            {(permission?.update || user?.role === 'superAdmin') && <Button size="sm" onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>}
                            {(permission?.delete || user?.role === 'superAdmin') && <Button size="sm" style={{ background: 'red.800' }} onClick={() => setDeleteManyModel(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                        </Flex>
                    </GridItem>
                </Grid>
            </Card>}
            <AddEdit isOpen={edit} onClose={() => setEdit(false)} viewClose={onClose} id={id?.event ? id?.event?._def?.extendedProps?._id : id} userAction={"edit"} />
            <CommonDeleteModel isOpen={deleteManyModel} onClose={() => setDeleteManyModel(false)} type='Task' handleDeleteData={handleDeleteTask} ids={[id]} />
        </div >
    )
}

export default TaskView
