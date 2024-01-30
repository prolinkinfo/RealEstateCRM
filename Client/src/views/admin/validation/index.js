import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { Button, Checkbox, Flex, Grid, GridItem, Heading, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import Card from 'components/card/Card'
import { HSeparator } from 'components/separator/Separator'
import React, { useEffect, useState } from 'react'
import { getApi } from 'services/api'
import Edit from './Edit'
import View from './view'
import { useNavigate } from 'react-router-dom'
import { CiMenuKebab } from 'react-icons/ci'
import Add from './add'
import Delete from './Delete'
import { IoIosArrowBack } from 'react-icons/io'

const Index = () => {
    const navigate = useNavigate()
    const [editModal, setEdit] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteMany, setDeleteMany] = useState(false)
    const [action, setAction] = useState(false)
    const [selectedId, setselectedId] = useState()
    const [editdata, setEditData] = useState([])
    const [validationData, setValidateData] = useState([])
    const [selectedValues, setSelectedValues] = useState([]);

    const fetchData = async () => {
        let response = await getApi(`api/validation`);
        setValidateData(response?.data);
    }
    useEffect(() => {
        fetchData()
    }, [action])

    const handleEditClose = () => {
        setEdit(false)
    }

    const handleEditOpen = (item) => {
        setselectedId(item._id)
        setEditData(item)
        setEdit(!editModal)
    }
    const handleViewOpen = (item) => {
        setselectedId(item._id)
        setViewModal(!viewModal)
    }
    const handleViewClose = () => {
        setViewModal(false)
    }
    const handleAddOpen = (item) => {
        setAddModal(!viewModal)
    }
    const handleAddClose = () => {
        setAddModal(false)
    }
    const handleDeleteOpen = (item) => {
        setselectedId(item._id)
        setDeleteModal(!viewModal)
    }
    const handleDeleteClose = () => {
        setDeleteModal(false)
    }
    const handleCheckboxChange = (event, value) => {
        if (event.target.checked) {
            setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
        } else {
            setSelectedValues((prevSelectedValues) =>
                prevSelectedValues.filter((selectedValue) => selectedValue !== value)
            );
        }
    };
    return (
        <div>
            <Flex justifyContent={"end"} mb={3}>
                {selectedValues.length > 0 && <Button variant='outline'  colorScheme='brand' color={"red"} mr={2} leftIcon={<DeleteIcon />} onClick={() => setDeleteMany(true)} size='sm' >Delete</Button>}
                <Button size='sm' variant='brand' me={1} onClick={() => handleAddOpen()}>Add </Button>
                <Button size='sm' variant='brand' onClick={() => navigate(-1)} leftIcon={<IoIosArrowBack />}> Back</Button>
            </Flex>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                {validationData?.map((item, i) => (
                    <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }} key={i}>
                        <Card>
                            <Flex alignItems={"center"} justifyContent={"space-between"}>
                                <Flex>
                                    <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(item?._id)} onChange={(event) => handleCheckboxChange(event, item?._id)} me="10px" />
                                    <Heading size="md" fontWeight={"500"} textTransform={"capitalize"}
                                    >{item?.name}</Heading>
                                </Flex>
                                <Menu isLazy  >
                                    <MenuButton><CiMenuKebab /></MenuButton>
                                    <MenuList minW={'fit-content'} transform={"translate(-71px, 0px) !important;"}>
                                        <MenuItem py={2.5} onClick={() => handleEditOpen(item)} icon={<EditIcon fontSize={15} />}>Edit</MenuItem>
                                        <MenuItem py={2.5} color={'green'} onClick={() => handleViewOpen(item)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>
                                        <MenuItem py={2.5} color={'red'} icon={<DeleteIcon fontSize={15} />} onClick={() => handleDeleteOpen(item)}>Delete</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Flex>
                            <Text pt={3} textTransform={"capitalize"}>validations</Text>
                            <HSeparator mb={2} mt={1} />
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>require:</Text>
                                <Text width={"50%"} fontWeight={"500"}  > {item?.validations && item?.validations?.length > 0 && item?.validations[0]?.require === true ? "True" : "False"
                                }</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>min:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item?.validations && item?.validations?.length > 0 && item?.validations[1]?.min === true ? "True" : "False"
                                }</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>max:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item?.validations && item?.validations?.length > 0 && item?.validations[2]?.max === true ? "True" : "False"
                                }</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>match:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item?.validations && item?.validations?.length > 0 && item?.validations[3]?.match === true ? "True" : "False"
                                }</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>formik type:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item?.validations && item?.validations?.length > 0 && item?.validations[4]?.formikType ? "True" : "False"
                                }</Text>
                            </Flex>
                        </Card>
                    </GridItem>
                ))}
            </Grid>


            <Add isOpen={addModal} onClose={handleAddClose} fetchData={fetchData} setAction={setAction} />
            <Edit isOpen={editModal} onClose={handleEditClose} selectedId={selectedId} editdata={editdata} setAction={setAction} fetchData={fetchData} />
            <Delete method='one' isOpen={deleteModal} onClose={handleDeleteClose} selectedId={selectedId} fetchData={fetchData} />
            <Delete method='many' isOpen={deleteMany} onClose={setDeleteMany} selectedId={selectedId} fetchData={fetchData} setSelectedValues={setSelectedValues} data={selectedValues} />
            <View isOpen={viewModal} onClose={handleViewClose} selectedId={selectedId} />
        </div>
    )
}

export default Index
