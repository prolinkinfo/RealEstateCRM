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
import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import AddTask from './components/addTask';
import { HasAccess } from '../../../redux/accessUtils';
import { useLocation } from 'react-router-dom';
import CommonCheckTable from '../../../components/checkTable/checktable';
import TaskAdvanceSearch from './components/TaskAdvanceSearch';
import { SearchIcon } from "@chakra-ui/icons";

const Task = (props) => {
    // const { isOpen, onOpen, onClose } = useDisclosure();
    // const title = "Tasks";

    // const location = useLocation();
    // const state = location.state;
    // // Now you can access the state

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
        { Header: "Action", isSortable: false, center: true },
    ]; 
    // const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
    // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const [action, setAction] = useState(false)
    // const [data, setData] = useState([])
    // const user = JSON.parse(localStorage.getItem("user"))
    // const [isLoding, setIsLoding] = useState(false);
    // const [columns, setColumns] = useState([]);
    // const [displaySearchData, setDisplaySearchData] = useState(false);
    // const [searchedData, setSearchedData] = useState([]);

    // const [permission] = HasAccess(['Task'])
    // const [columns, setColumns] = useState([]);
    // const [isImport, setIsImport] = useState(false);

    // const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? `api/task` : `api/task/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

    // useEffect(() => {
    //     setColumns(tableColumns)
    // }, [action])

    const title = "Tasks";
    const size = "lg";
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [permission, emailAccess, callAccess] = HasAccess(['Lead', 'Email', 'Call']);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [columns, setColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const [dataColumn, setDataColumn] = useState([]);
    const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [leadData, setLeadData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    // const [isImport, setIsImport] = useState(false);

    useEffect(() => {
        fetchData();
        // fetchCustomDataFields();
    }, [action])

    return (
        <div>
            {/* <Flex alignItems={'center'} justifyContent={"right"} flexWrap={'wrap'} mb={3}>
                <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Create Task</Button>
            </Flex> */}
            {/* <CheckTable
                isLoding={isLoding}
                columnsData={columns}
                isOpen={isOpen}
                dataColumn={dataColumn}
                setAction={setAction}
                action={action}
                state={state}
                setSearchedData={setSearchedData}
                allData={data}
                displaySearchData={displaySearchData}
                tableData={displaySearchData ? searchedData : data}
                fetchData={fetchData}
                setIsLoding={setIsLoding}
                setDisplaySearchData={setDisplaySearchData}
                setDynamicColumns={setDynamicColumns}
                dynamicColumns={dynamicColumns}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                className='table-fix-container'
                access={permission}
            /> */}
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

            {/* <AddTask isOpen={isOpen} fetchData={fetchData} onClose={onClose} /> */}
        </div>
    )
}

export default Task

