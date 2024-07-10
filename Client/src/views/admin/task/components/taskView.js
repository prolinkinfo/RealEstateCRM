import { Button, Grid, GridItem, Flex, IconButton, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react'
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
    const navigate = useNavigate()

    const fetchViewData = async () => {
        if (id) {
            let result = await getApi('api/task/view/', id?.event ? id?.event?._def?.extendedProps?._id : id);
            setData(result?.data);
        }
    }
    const generatePDF = () => {
        const element = document.getElementById("reports");
        if (element) {
            html2pdf()
                .from(element)
                .set({
                    margin: [0, 0, 0, 0],
                    filename: `Task_Details_${moment().format("DD-MM-YYYY")}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
                })
                .save()
            // }, 500);
        } else {
            console.error("Element with ID 'reports' not found.");
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

    useEffect(() => {
        fetchViewData()
    }, [id, edit])

    const handleClick = () => {
        onOpen()
    }
    return (
        <div>
            <Card>
                <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={1} justifyContent={"space-between"} alignItem={"center"} >
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                        <Text fontSize="xl" fontWeight="bold" color={'blackAlpha.900'}> Task View </Text>

                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                        <Flex justifyContent={"right"}>
                            <Menu>
                                {(user.role === 'superAdmin' || permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" colorScheme='blackAlpha' size="sm" va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                    Actions
                                </MenuButton>}
                                <MenuDivider />
                                <MenuList minWidth={2}>
                                    {(user.role === 'superAdmin' || permission?.create) && <MenuItem onClick={() => handleClick()} alignItems={'start'} color={'blue'} icon={<AddIcon />}>Add</MenuItem>}
                                    {(user.role === 'superAdmin' || permission?.update) && <MenuItem onClick={() => setEdit(true)} alignItems={'start'} icon={<EditIcon />}>Edit</MenuItem>}
                                    <MenuItem onClick={generatePDF} alignItems={"start"} icon={<FaFilePdf />} display={"flex"} style={{ alignItems: "center" }}>Print as PDF</MenuItem >

                                    {(user.role === 'superAdmin' || permission?.deleteModel) && <>
                                        <MenuDivider />
                                        <MenuItem alignItems={'start'} onClick={() => setDeleteManyModel(true)} color={'red'} icon={<DeleteIcon />}>Delete</MenuItem>
                                    </>}
                                </MenuList>
                            </Menu>
                            <Link to="/task">
                                <Button size="sm" leftIcon={<IoIosArrowBack />} variant="brand">
                                    Back
                                </Button>
                            </Link>
                        </Flex>
                    </GridItem>
                </Grid>
                <HSeparator />
                <div id="reports">
                    <Grid templateColumns="repeat(12, 1fr)" gap={3} pt={3} >
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Title </Text>
                            <Text>{data?.title ? data?.title : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Related To </Text>
                            <Text>{data?.category ? data?.category : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task start </Text>
                            <Text>
                                {data && data?.start ? (
                                    data.allDay === true
                                        ? moment(data.start).format('DD-MM-YYYY')
                                        : moment(data.start).format('DD-MM-YYYY HH:mm A')
                                ) : (
                                    "-"
                                )}
                            </Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task end  </Text>
                            <Text>{data?.allDay === true ? moment(data?.end).format('DD-MM-YYYY') : moment(data?.end).format('DD-MM-YYYY HH:mm A')}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Link </Text>
                            {data?.url ?
                                <a target='_blank' href={data?.url}>
                                    <IconButton borderRadius="10px" size="md" icon={<BiLink />} />
                                </a> : '-'
                            }
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task reminder </Text>
                            <Text>{data?.reminder ? data?.reminder : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Assign To  </Text>
                            <Link to={data?.assignTo ? contactAccess?.view && `/contactView/${data?.assignTo}` : leadAccess?.view && `/leadView/${data?.assignToLead}`}>
                                <Text color={(data?.category === 'contact' && (contactAccess?.view || user?.role === 'superAdmin')) ? 'brand.600' : (leadAccess?.view || user?.role === 'superAdmin' && data?.category === 'lead') ? 'brand.600' : 'blackAlpha.900'} sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.assignToName ? data?.assignToName : ' - '}</Text>
                            </Link>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task createBy </Text>
                            <Text>{data?.createByName ? data?.createByName : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Description</Text>
                            <Text>{data?.description ? data?.description : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task notes </Text>
                            <Text>{data?.notes ? data?.notes : ' - '}</Text>
                        </GridItem>
                    </Grid>
                </div>
            </Card>
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
            {/* Edittask modal */}
            {/* <EditTask isOpen={edit} onClose={setEdit} viewClose={onClose} id={id?.event ? id?.event?._def?.extendedProps?._id : id} /> */}
            {/* Deletetask modal */}
            {/* <DeleteTask isOpen={deleteModel} onClose={setDelete} viewClose={onClose} url='api/task/delete/' method='one' id={id?.event ? id?.event?._def?.extendedProps?._id : id} redirectPage={"/task"} /> */}
        </div>
    )
}

export default TaskView
