// import { AddIcon } from '@chakra-ui/icons'
// import { Button, Flex, useDisclosure } from '@chakra-ui/react'
// import { useEffect, useState } from 'react'
// import { getApi } from 'services/api'
// import CheckTable from './components/CheckTable'
// import AddTask from './components/addTask'
// import { HasAccess } from '../../../redux/accessUtils'
// import { useLocation } from 'react-router-dom'

// const Task = (props) => {
//     const { isOpen, onOpen, onClose } = useDisclosure()

//     const location = useLocation();
//     const state = location.state;
//     // Now you can access the state

//     const tableColumns = [
//         {
//             Header: "#",
//             accessor: "_id",
//             isSortable: false,
//             width: 5
//         },
//         { Header: 'Title', accessor: 'title' },
//         { Header: "Related", accessor: "category", },
//         { Header: "Status", accessor: "status", },
//         { Header: "Assign To", accessor: "assignmentToName", },
//         { Header: "Start Date", accessor: "start", },
//         { Header: "End Date", accessor: "end", },
//         { Header: "Action", isSortable: false, center: true },
//     ];
//     const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
//     const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
//     const [action, setAction] = useState(false)
//     const [data, setData] = useState([])
//     const user = JSON.parse(localStorage.getItem("user"))
//     const [isLoding, setIsLoding] = useState(false)
//     const [columns, setColumns] = useState([]);
//     const [displaySearchData, setDisplaySearchData] = useState(false);
//     const [searchedData, setSearchedData] = useState([]);

//     const [permission] = HasAccess(['Task'])

//     const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

//     const fetchData = async () => {
//         setIsLoding(true)
//         let result = await getApi(user.role === 'superAdmin' ? `api/task` : `api/task/?createBy=${user._id}`);
//         setData(result.data);
//         setIsLoding(false)
//     }

//     useEffect(() => {
//         setColumns(tableColumns)
//     }, [action])

//     return (
//         <div>
//             {/* <Flex alignItems={'center'} justifyContent={"right"} flexWrap={'wrap'} mb={3}>
//                 <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Create Task</Button>
//             </Flex> */}
//             <CheckTable
//                 isLoding={isLoding}
//                 columnsData={columns}
//                 isOpen={isOpen}
//                 dataColumn={dataColumn}
//                 setAction={setAction}
//                 action={action}
//                 state={state}
//                 setSearchedData={setSearchedData}
//                 allData={data}
//                 displaySearchData={displaySearchData}
//                 tableData={displaySearchData ? searchedData : data}
//                 fetchData={fetchData}
//                 setIsLoding={setIsLoding}
//                 setDisplaySearchData={setDisplaySearchData}
//                 setDynamicColumns={setDynamicColumns}
//                 dynamicColumns={dynamicColumns}
//                 selectedColumns={selectedColumns}
//                 setSelectedColumns={setSelectedColumns}
//                 className='table-fix-container'
//                 access={permission}
//             />
//             {/* <AddTask isOpen={isOpen} fetchData={fetchData} onClose={onClose} /> */}
//         </div>
//     )
// }

// export default Task

import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import AddTask from './components/addTask';
import { HasAccess } from '../../../redux/accessUtils';
import { useLocation } from 'react-router-dom';
import CommonCheckTable from '../../../components/checkTable/checktable';
import TaskAdvanceSearch from './components/TaskAdvanceSearch';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import EditTask from './components/editTask';
import EventView from './eventView';
import DeleteTask from './components/deleteTask';
import ImportModal from '../lead/components/ImportModal';

const Task = (props) => {
    const title = "Tasks";
    const size = "lg";
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [leadData, setLeadData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [eventView, setEventView] = useState(false)
    const [id, setId] = useState('')
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [deleteMany, setDeleteMany] = useState(false);
    const [isImportLead, setIsImportLead] = useState(false);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [permission, leadAccess, contactAccess, callAccess] = HasAccess(["Task", 'Lead', 'Email', 'Contact']);
    const tableColumns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 5
        },
        { Header: 'Title', accessor: 'title', type: 'text', formikType: '' },
        { Header: "Related", accessor: "category", type: 'text', formikType: '' },
        { Header: "Status", accessor: "status", type: 'select', formikType: '' },
        { Header: "Assign To", accessor: "assignmentToName", type: 'text', formikType: '' },
        { Header: "Start Date", accessor: "start", type: 'date', formikType: '' },
        { Header: "End Date", accessor: "end", type: 'date', formikType: '' },
        {
            Header: "Action", isSortable: false, center: true,
            cell: ({ row }) => (
                <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                    <Menu isLazy >
                        <MenuButton ><CiMenuKebab /></MenuButton>
                        <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                            {permission?.update &&
                                <MenuItem py={2.5} icon={<EditIcon fontSize={15} mb={1} />} onClick={() => { setEdit(true); setSelectedId(row?.values?._id); }}>Edit</MenuItem>}

                            {/* <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { setEventView(true); setId(row?.original._id) }}>Event View</MenuItem> */}
                            {permission?.view &&
                                <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { setEventView(true); setId(row?.original._id) }}>View</MenuItem>}
                            {permission?.delete &&
                                <MenuItem py={2.5} color={'red'} icon={<DeleteIcon fontSize={15} mb={1} />} onClick={() => { setDeleteMany(true); setSelectedValues([row?.values?._id]); }}>Delete</MenuItem>}
                        </MenuList>
                    </Menu>
                </Text>
            )
        },
    ];

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? `api/task` : `api/task/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

    const [columns, setColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const [dataColumn, setDataColumn] = useState([]);
    const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))


    useEffect(() => {
        fetchData();
        // fetchCustomDataFields();
    }, [action])

    return (
        <div>
            <CommonCheckTable
                title={title}
                isLoding={isLoding}
                columnData={columns}
                dataColumn={dataColumn}
                allData={data}
                tableData={displaySearchData ? searchedData : data}
                displaySearchData={displaySearchData}
                setDisplaySearchData={setDisplaySearchData}
                searchedData={searchedData}
                setSearchedData={setSearchedData}
                tableCustomFields={[]}
                access={permission}
                action={action}
                setAction={setAction}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                isOpen={isOpen}
                onClose={onclose}
                onOpen={onOpen}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDelete}
                AdvanceSearch={
                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvanceSearch(true)}>Advance Search</Button>
                }
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
            />

            <TaskAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />

            <AddTask isOpen={isOpen} fetchData={fetchData} onClose={onClose} />
            <EditTask isOpen={edit} onClose={setEdit} viewClose={onClose} id={selectedId} setAction={setAction} />
            <EventView fetchData={fetchData} isOpen={eventView} access={permission} contactAccess={contactAccess} leadAccess={leadAccess} onClose={setEventView} info={id} setAction={setAction} action={action} />
            <DeleteTask isOpen={deleteMany} onClose={setDeleteMany} viewClose={onClose} url='api/task/deleteMany' method='many' data={selectedValues} setSelectedValues={setSelectedValues} redirectPage={"/task"} fetchData={fetchData} setAction={setAction} />
            <ImportModal text='Lead file' fetchData={fetchData} isOpen={isImportLead} onClose={setIsImportLead} />
        </div>
    )
}

export default Task

