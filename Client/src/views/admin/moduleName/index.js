import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Button, Checkbox, Flex, Grid, GridItem, Heading, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import Card from 'components/card/Card'
import React, { useEffect, useState } from 'react'
import { getApi } from 'services/api'
import Edit from './Edit'
import View from './view'
import { useNavigate } from 'react-router-dom'
import Add from './add'
import { IoIosArrowBack } from 'react-icons/io'
import DataNotFound from 'components/notFoundData'
import Spinner from '../../../components/spinner/Spinner'
import { deleteManyApi } from 'services/api'
import { fetchRouteData } from '../../../redux/slices/routeSlice';
import CommonDeleteModel from 'components/commonDeleteModel';
import { useDispatch } from 'react-redux'
import { deleteApi } from 'services/api'
import { fetchModules } from '../../../redux/slices/moduleSlice'

const Index = () => {
    const navigate = useNavigate()
    const [editModal, setEdit] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [action, setAction] = useState(false)
    const [selectedId, setselectedId] = useState()
    const [editdata, setEditData] = useState([])
    const [moduleData, setValidateData] = useState([])
    const [selectedValues, setSelectedValues] = useState([]);
    const [isLoding, setIsLoding] = useState(false)
    const textColor = useColorModeValue("gray.500", "white");
    const [method, setMethod] = useState('')

    const dispatch = useDispatch();


    const fetchData = async () => {
        setIsLoding(true)
        try {
            let response = await getApi(`api/custom-field`);
            setValidateData(response?.data);
            setIsLoding(false);
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchData()
    }, [action])

    const handleEditClose = () => {
        setEdit(false)
    }

    const handleEditOpen = (item) => {
        setselectedId(item?._id)
        setEditData(item)
        setEdit(!editModal)
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
    const handleDeleteOpen = (item, type) => {
        setMethod(type)
        setselectedId(item?._id)
        setDeleteModal(!deleteModal)
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

    const handleDeleteModule = async (ids, selectedIds) => {
        if (method === 'one') {
            try {
                if (ids) {
                    setIsLoding(true)
                    const response = await deleteApi('api/custom-field/module/', ids)
                    if (response.status === 200) {
                        await dispatch(fetchRouteData());
                        setDeleteModal(false)
                        fetchData()
                        await dispatch(fetchModules())
                    }
                }
            } catch (error) {
                console.log(error)
            }
            finally {
                setIsLoding(false)
            }
        } else if (method === 'many') {
            try {
                setIsLoding(true)
                let response = await deleteManyApi('api/custom-field/deleteMany-Module', selectedIds)
                if (response.status === 200) {
                    await dispatch(fetchRouteData());
                    setSelectedValues([])
                    setDeleteModal(false)
                    fetchData()
                    await dispatch(fetchModules())
                }
            } catch (error) {
                console.log(error)
            }
            finally {
                setIsLoding(false)
            }
        }

    };

    return (
        <div>
            <Flex justifyContent={"end"} mb={3}>
                {selectedValues.length > 0 && <Button variant='outline' colorScheme='brand' color={"red"} mr={2} leftIcon={<DeleteIcon />} onClick={() => { handleDeleteOpen('', 'many') }} size='sm' >Delete</Button>}
                <Button size='sm' variant='brand' me={1} onClick={() => handleAddOpen()} leftIcon={<AddIcon />}>Add New</Button>
                <Button size='sm' variant='brand' onClick={() => navigate(-1)} leftIcon={<IoIosArrowBack />}> Back</Button>
            </Flex>
            {isLoding ? (
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    <Spinner />
                </Flex>
            ) : (
                moduleData && moduleData.length > 0 ? (
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        {moduleData && moduleData?.map((item, i) => (

                            <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }} key={i}>
                                <Card>
                                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                                        <Flex>
                                            <Checkbox disabled={item.moduleName === 'Properties' || item.moduleName === 'Contacts' || item.moduleName === 'Leads'} colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(item?._id)} onChange={(event) => handleCheckboxChange(event, item?._id)} me="10px" />
                                            <Tooltip hasArrow label={item?.moduleName} bg='gray.200' color='gray' textTransform={"capitalize"} fontSize='sm'>
                                                <Heading size="md" fontWeight={"500"} sx={{
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '6rem',
                                                    overflow: 'hidden', textTransform: 'capitalize'
                                                }}
                                                >
                                                    {item?.moduleName}
                                                </Heading>

                                            </Tooltip>
                                        </Flex>
                                        <Flex>
                                            <Button size='sm' disabled={item.moduleName === 'Properties' || item.moduleName === 'Contacts' || item.moduleName === 'Leads'} variant='outline' me={2} color={'green'} onClick={() => handleEditOpen(item)}><EditIcon /></Button>
                                            <Button size='sm' disabled={item.moduleName === 'Properties' || item.moduleName === 'Contacts' || item.moduleName === 'Leads'} variant='outline' me={2} color={'red'} onClick={() => handleDeleteOpen(item, 'one')}><DeleteIcon /></Button>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </GridItem>
                        ))}
                    </Grid>) : (
                    <Card mt='5'>
                        <Text textAlign={'center'} width="100%" color={'gray.500'} fontSize="sm" fontWeight="700">
                            <DataNotFound />
                        </Text>
                    </Card>
                )
            )}
            <Add isOpen={addModal} onClose={handleAddClose} fetchData={fetchData} setAction={setAction} />
            <Edit isOpen={editModal} onClose={handleEditClose} selectedId={selectedId} editdata={editdata} setAction={setAction} fetchData={fetchData} />
            <CommonDeleteModel isOpen={deleteModal} onClose={() => setDeleteModal(false)} type={'Module'} handleDeleteData={handleDeleteModule} ids={selectedId} selectedValues={selectedValues} />
            <View isOpen={viewModal} onClose={handleViewClose} selectedId={selectedId} setAction={setAction} fetchData={fetchData} />
        </div>
    )
}

export default Index
