
import React, { useEffect, useState } from 'react'
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Menu, MenuButton, Checkbox, GridItem, Text, MenuItem, Grid, MenuList, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card'
import Addfield from './addfield'
import { getApi, putApi } from 'services/api';
import EditField from './editfield';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BiGridVertical } from "react-icons/bi";
import AddEditHeading from "./addEditHeading";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import Spinner from "components/spinner/Spinner";
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteApi } from 'services/api';
import { deleteManyApi } from 'services/api';

const CustomField = () => {
    const [addFieldModel, setAddFieldModel] = useState(false);
    const [moduleName, setModuleName] = useState('')
    const [moduleId, setModuleId] = useState('')
    const [data, setData] = useState([])
    const [dataFilter, setDataFilter] = useState([])
    const [fields, setFields] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [updateField, setUpdateField] = useState({})
    const [deleteMany, setDeleteMany] = useState(false)
    const [selectedValues, setSelectedValues] = useState([]);

    const [addHeadingModel, setAddHeadingModel] = useState(false);
    const [deleteManyHeadings, setDeleteManyHeadings] = useState(false);
    const [editHeadingModal, setEditHeadingModal] = useState(false);
    const [updateHeading, setUpdateHeading] = useState({});
    const [selectedHeadings, setSelectedHeadings] = useState([]);
    const [headingId, setHeadingId] = useState('');
    const [heading, setHeading] = useState('');
    const [isLoding, setIsLoding] = useState(false)
    const [method, setMethod] = useState('')
    const [selectedId, setSelectedId] = useState('')
    const [validations, setValidations] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleHeadigsCheckboxChange = (event, value) => {
        if (event.target.checked) {
            setSelectedHeadings((prevSelectedHeadings) => [...prevSelectedHeadings, value]);
        } else {
            setSelectedHeadings((prevSelectedHeadings) =>
                prevSelectedHeadings.filter((selectedHeading) => selectedHeading !== value)
            );
        }
    };

    const handleHeadingsDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const newData = [...data[0]?.headings];
        const [removed] = newData.splice(result.source.index, 1);
        newData.splice(result.destination.index, 0, removed);
        setData((prev) => [{ ...prev[0], headings: newData }]);

        const response = await putApi(`api/custom-field/change-headings/${moduleId}`, newData)
        fetchData();
    };

    const textColor = useColorModeValue("gray.500", "white");

    const getValidationData = async () => {
        const response = await getApi('api/validation')
        setValidations(response.data)
    }

    useEffect(() => {
        getValidationData()
    }, [moduleName])

    const navigate = useNavigate()

    const handleCheckboxChange = (event, value) => {
        if (event.target.checked) {
            setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
        } else {
            setSelectedValues((prevSelectedValues) =>
                prevSelectedValues.filter((selectedValue) => selectedValue !== value)
            );
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const newData = [...data[0]?.fields];
        const newFilterData = [...dataFilter];
        const [removed] = newData.splice(result.source.index, 1);
        newData.splice(result.destination.index, 0, removed);
        const [removed1] = newFilterData.splice(result.source.index, 1);
        newFilterData.splice(result.destination.index, 0, removed1);
        setData((prev) => [{ ...prev[0], fields: newData }]);
        setDataFilter(newFilterData);

        const mergedArray = [...newFilterData, ...newData];

        const unique = [...new Set(mergedArray.map(item => item))]

        await putApi(`api/custom-field/change-fields/${moduleId}`, unique);
        fetchData();
    };

    const fetchData = async () => {
        setIsLoading(true)
        let responseAllData = await getApi(`api/custom-field`);
        setFields(responseAllData?.data);
        if (moduleName) {
            let response = await getApi(`api/custom-field/?moduleName=${moduleName}`);
            const filterData = response?.data[0]?.fields?.filter(field => (headingId ? headingId : field?.belongsTo) === field?.belongsTo);

            setDataFilter(filterData);
            setData(response?.data);
        } else if (!moduleName) {
            setData([]);
            setDataFilter([])
        }
        setIsLoading(false)
    }

    const handleDeleteFiled = async (id, fieldsIds) => {
        if (method === 'one') {
            try {
                setIsLoding(true)
                const response = await deleteApi(`api/custom-field/delete/${id}?moduleId=`, moduleId)
                if (response.status === 200) {
                    setDeleteMany(false)
                    fetchData()
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
                const payload = {
                    moduleId: data[0]?._id,
                    fieldsIds: fieldsIds
                }
                let response = await deleteManyApi('api/custom-field/deleteMany', payload)
                if (response.status === 200) {
                    setSelectedValues([])
                    setDeleteMany(false)
                    fetchData()
                }
            } catch (error) {
                console.log(error)
            }
            finally {
                setIsLoding(false)
            }
        }
    };

    const handleDeleteHeading = async (id, headingsIds) => {
        if (method === 'one') {
            try {
                setIsLoding(true)
                const response = await deleteApi(`api/custom-field/delete-heading/${id}?moduleId=`, moduleId)
                if (response.status === 200) {
                    setDeleteManyHeadings(false)
                    fetchData()
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
                const payload = {
                    moduleId: data[0]?._id,
                    headingsIds: headingsIds
                }
                let response = await deleteManyApi('api/custom-field/deleteMany-headings', payload)
                if (response.status === 200) {
                    setSelectedHeadings([])
                    setDeleteManyHeadings(false)
                    fetchData()
                }
            } catch (error) {
                console.log(error)
            }
            finally {
                setIsLoding(false)
            }
        }
    };

    const handleOpenDeleteMany = (id, type) => {
        setMethod(type)
        setSelectedId(id);
        setDeleteMany(true);
    }

    const handleOpenDeleteModel = (id, type) => {
        setMethod(type)
        setSelectedId(id);
        setDeleteManyHeadings(true);
    }

    useEffect(() => {
        if (fetchData) fetchData()
    }, [moduleName, headingId])

    return (
        <>
            <Card minHeight='250px'>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Flex alignItems='center'>
                        <Text color={"secondaryGray.900"}
                            fontSize="22px"
                            fontWeight="700"
                        >{moduleName ? 'Custom Heading' : 'Select Module'}</Text>
                        {selectedHeadings.length > 0 && <Button color="red" ml='2' onClick={() => handleOpenDeleteModel('', 'many')} size='sm' ><DeleteIcon /></Button>}
                    </Flex>
                    <Box>
                        <Flex>
                            {!isLoading && (
                                <Menu>
                                    <MenuButton as={Button} mr={2} size='sm' rightIcon={<ChevronDownIcon />} variant="outline">
                                        {moduleName ? moduleName : 'Select Module'}
                                    </MenuButton>
                                    <MenuList minWidth={"10rem"} maxHeight={'15rem'} overflow={'auto'}>
                                        <MenuItem onClick={() => { setModuleName(''); setData([]); setDataFilter([]); }}>Select Module</MenuItem>
                                        {fields?.map((item, id) => (
                                            <MenuItem key={id} onClick={() => { setModuleName(item.moduleName); setModuleId(item._id); setHeadingId('') }}>{item.moduleName}</MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            )}

                            {data?.length > 0 && <Button ml={2} onClick={() => setAddHeadingModel(true)} leftIcon={<AddIcon />} variant="brand" size='sm'>Add Heading</Button>}
                            <Button onClick={() => navigate('/admin-setting')} variant="brand" size="sm" leftIcon={<IoIosArrowBack />} ml={2}>Back</Button>
                        </Flex>
                    </Box>
                </Flex>
                {!data?.length > 0 && !isLoading && <Text
                    textAlign={"center"}
                    width="100%"
                    color={'gray.500'}
                    fontSize="sm"
                    my='7'
                    fontWeight="700"
                >-- Please Select Module --</Text>}
                {isLoading ? <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    <Spinner />
                </Flex> : <DragDropContext DragDropContext onDragEnd={handleHeadingsDragEnd} >
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    data[0]?.headings?.length === 0 ? <Text
                                        textAlign={"center"}
                                        width="100%"
                                        color={'gray.500'}
                                        fontSize="sm"
                                        my='7'
                                        fontWeight="700"
                                    >-- No Data Found --</Text> : <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={5}>
                                        {data[0]?.headings?.map((item, i) => (
                                            <GridItem colSpan={{ base: 12, md: 6 }} key={item._id}>
                                                <Draggable draggableId={item._id} index={i}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                        >
                                                            <Flex
                                                                alignItems="center"
                                                                justifyContent="space-between"
                                                                className="CustomFieldName"
                                                            >

                                                                <Text display='flex' alignItems='center' size='sm' colorScheme='gray' ms='4px' mt={4} fontSize='md' fontWeight='500' mb='8px' >
                                                                    {!item.fixed && <div {...provided.dragHandleProps} style={{ marginRight: '10px', cursor: 'grab' }} size={18} >
                                                                        <BiGridVertical size={18} />
                                                                    </div>}
                                                                    {!item.fixed && <Checkbox colorScheme="brandScheme" value={selectedHeadings} isChecked={selectedHeadings.includes(item?._id)} onChange={(event) => handleHeadigsCheckboxChange(event, item?._id)} me="10px" />}
                                                                    {item?.heading}
                                                                </Text>
                                                                <span className="EditDelete">
                                                                    {item?.editable ?
                                                                        <Button size='sm' variant='outline' me={2} color={'green'} onClick={() => { setEditHeadingModal(true); setUpdateHeading(item) }}><EditIcon /></Button> :
                                                                        <Button size='sm' variant='outline' me={2} color={'gray'} pointer="none" ><EditIcon /></Button>}
                                                                    {item.fixed ? <Button size='sm' variant='outline' me={2} color={'gray'}><DeleteIcon /></Button> : <Button size='sm' variant='outline' me={2} color={'red'} onClick={() => { handleOpenDeleteModel(item?._id, 'one') }}><DeleteIcon /></Button>}
                                                                </span>
                                                            </Flex>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            </GridItem>
                                        ))}
                                    </Grid>
                                }

                            </div>
                        )}
                    </Droppable>
                </DragDropContext>}

            </Card>
            {data?.length > 0 && <Card mt='5'>
                <Flex justifyContent={'space-between'} alignItems={'center'} mt='5'>
                    <Flex alignItems='center'>
                        <Text color={"secondaryGray.900"}
                            fontSize="22px"
                            fontWeight="700"
                        >{moduleName && 'Custom Field'}</Text>
                        {selectedValues.length > 0 && <Button color="red" ml='2' onClick={() => handleOpenDeleteMany('', 'many')} size='sm' ><DeleteIcon /></Button>}
                    </Flex>

                    <Box>
                        {(!isLoading && data[0]?.headings.length > 0) && <Menu>
                            <MenuButton as={Button} size='sm' rightIcon={<ChevronDownIcon />} variant="outline">
                                {heading ? heading : 'Select All Headings'}
                            </MenuButton>
                            <MenuList minWidth={"10rem"} maxHeight={'15rem'} overflow={'auto'}>
                                <MenuItem onClick={() => { setHeading(''); setHeadingId('') }}>Select All Headings</MenuItem>
                                {data[0]?.headings?.map((item, id) => (
                                    <MenuItem key={id} onClick={() => { setHeading(item.heading); setHeadingId(item._id) }}>{item.heading}</MenuItem>
                                ))}
                            </MenuList>
                        </Menu>}
                        {data?.length > 0 && <Button me={2} ml='2' onClick={() => setAddFieldModel(true)} variant="brand" leftIcon={<AddIcon />} size='sm'>Add Field</Button>}
                    </Box>

                </Flex>
                {isLoading && moduleName ? <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    <Spinner />
                </Flex> :
                    <>
                        <DragDropContext DragDropContext onDragEnd={handleDragEnd} >
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {
                                            dataFilter.length === 0 ?
                                                <Text
                                                    textAlign={"center"}
                                                    width="100%"
                                                    color={'gray.500'}
                                                    fontSize="sm"
                                                    my='7'
                                                    fontWeight="700"
                                                >-- No Data Found --</Text>
                                                : <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={5}>
                                                    {dataFilter && dataFilter?.map((item, i) => (
                                                        <GridItem colSpan={{ base: 12, md: 6 }} key={item._id}>
                                                            <Draggable draggableId={item._id} index={i}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                    >
                                                                        <Flex
                                                                            alignItems="center"
                                                                            justifyContent="space-between"
                                                                            className="CustomFieldName"
                                                                        >

                                                                            <Text display='flex' alignItems='center' size='sm' colorScheme='gray' ms='4px' mt={4} fontSize='md' fontWeight='500' mb='8px' >
                                                                                <div {...provided.dragHandleProps} style={{ marginRight: '10px', cursor: 'grab' }} size={18} >
                                                                                    <BiGridVertical size={18} />
                                                                                </div>
                                                                                {!item.fixed && <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(item?._id)} onChange={(event) => handleCheckboxChange(event, item?._id)} me="10px" />}
                                                                                {item?.label}
                                                                            </Text>
                                                                            <span className="EditDelete">
                                                                                {item?.editable ?
                                                                                    <Button size='sm' variant='outline' me={2} color={'green'} onClick={() => { setEditModal(true); setUpdateField(item) }}><EditIcon /></Button> :
                                                                                    <Button size='sm' variant='outline' me={2} color={'gray'} ><EditIcon /></Button>
                                                                                }
                                                                                {item.fixed ? <Button size='sm' variant='outline' me={2} color={'gray'}><DeleteIcon /></Button> : <Button size='sm' variant='outline' me={2} color={'red'} onClick={() => { handleOpenDeleteMany(item?._id, "one"); }}><DeleteIcon /></Button>}
                                                                            </span>
                                                                        </Flex>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        </GridItem>
                                                    ))}
                                                </Grid>
                                        }

                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                    </>
                }
            </Card>}
            <Addfield isOpen={addFieldModel} onClose={setAddFieldModel} moduleName={moduleName} field={data[0]?.fields} validations={validations} moduleId={data[0]?._id} fetchData={fetchData} headingsData={data?.[0]?.headings} />
            <EditField isOpen={editModal} onClose={setEditModal} field={data[0]?.fields} moduleId={data[0]?._id} validations={validations} fetchData={fetchData} updateFiled={updateField} headingsData={data?.[0]?.headings} />

            <AddEditHeading isOpen={addHeadingModel || editHeadingModal} onClose={editHeadingModal ? setEditHeadingModal : setAddHeadingModel} moduleName={moduleName} moduleId={data[0]?._id} fetchData={fetchData} updateData={updateHeading} setUpdateData={setUpdateHeading} />

            <CommonDeleteModel isOpen={deleteMany} onClose={() => setDeleteMany(false)} type={method === "one" ? 'Leads Filed' : 'Leads Fileds'} handleDeleteData={handleDeleteFiled} ids={selectedId} selectedValues={selectedValues} />
            <CommonDeleteModel isOpen={deleteManyHeadings} onClose={() => setDeleteManyHeadings(false)} type={method === "one" ? 'Leads Heading' : 'Leads Headings'} handleDeleteData={handleDeleteHeading} ids={selectedId} selectedValues={selectedHeadings} />

        </>
    )
}

export default CustomField