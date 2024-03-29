// import { AddIcon } from "@chakra-ui/icons";
// import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
// import Add from "./Add";
// import CheckTable from './components/CheckTable';
// import { useEffect, useState } from "react";
// import { getApi } from "services/api";

// const Index = () => {
//     const tableColumns = [
//         {
//             Header: "#",
//             accessor: "_id",
//             isSortable: false,
//             width: 10
//         },
//         { Header: 'email Id', accessor: 'username' },
//         { Header: "first Name", accessor: "firstName", },
//         { Header: "last Name", accessor: "lastName", },
//         { Header: "role", accessor: "role", },
//         { Header: "Action", isSortable: false, center: true },

//     ];
//     const [action, setAction] = useState(false)
//     const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
//     const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
//     const [columns, setColumns] = useState([]);
//     const [isLoding, setIsLoding] = useState(false);
//     const [data, setData] = useState([]);
//     const [displaySearchData, setDisplaySearchData] = useState(false);
//     const [searchedData, setSearchedData] = useState([]);
//     const user = JSON.parse(localStorage.getItem("user"));
//     const size = "lg";
//     const { isOpen, onOpen, onClose } = useDisclosure()

//     const fetchData = async () => {
//         setIsLoding(true)
//         let result = await getApi('api/user/');
//         setData(result.data?.user);
//         setIsLoding(false)
//     }

//     useEffect(() => {
//         setColumns(tableColumns)
//     }, [action])

//     const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

//     return (
//         <div>

//             <CheckTable
//                 // isOpen={isOpen} setAction={setAction} action={action} columnsData={columns}
//                 isLoding={isLoding}
//                 columnsData={columns}
//                 isOpen={isOpen}
//                 setAction={setAction}
//                 action={action}
//                 setSearchedData={setSearchedData}
//                 allData={data}
//                 displaySearchData={displaySearchData}
//                 tableData={displaySearchData ? searchedData : data}
//                 fetchData={fetchData}
//                 dataColumn={dataColumn}
//                 setDisplaySearchData={setDisplaySearchData}
//                 setDynamicColumns={setDynamicColumns}
//                 dynamicColumns={dynamicColumns}
//                 selectedColumns={selectedColumns}
//                 setSelectedColumns={setSelectedColumns}
//             />
//             {/* Add Form */}
//         </div>
//     )
// }

// export default Index


import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import { HasAccess } from '../../../redux/accessUtils';
import { useLocation } from 'react-router-dom';
import CommonCheckTable from '../../../components/checkTable/checktable';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import moment from 'moment';
import { MdLeaderboard } from 'react-icons/md';
import { IoIosArrowBack, IoIosContact } from 'react-icons/io';
import AddUser from './Add';
import Edit from './Edit';
import Delete from './Delete';
import UserAdvanceSearch from './components/userAdvanceSearch';

const Index = (props) => {
    const title = "Users";
    const size = "lg";
    const [action, setAction] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [id, setId] = useState('')
    const [selectedId, setSelectedId] = useState();
    const [deleteMany, setDelete] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);

    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'email Id', accessor: 'username' },
        { Header: "first Name", accessor: "firstName", },
        { Header: "last Name", accessor: "lastName", },
        { Header: "role", accessor: "role", },
        {
            Header: "Action", accessor: 'action', isSortable: false, center: true,
            cell: ({ row }) => (
                <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                    <Menu isLazy  >
                        <MenuButton><CiMenuKebab /></MenuButton>
                        <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                            <MenuItem py={2.5} onClick={() => { setEdit(true); setSelectedId(row?.original._id); setEditData(row?.original) }} icon={<EditIcon mb={1} fontSize={15} />}>Edit</MenuItem>
                            <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/userView/${row?.values._id}`)} icon={<ViewIcon mb={1} fontSize={15} />}>View</MenuItem>
                            {row?.original?.role === 'superAdmin' ? '' : <MenuItem py={2.5} color={'red'} onClick={() => { setSelectedValues([row?.original._id]); setDelete(true) }} icon={<DeleteIcon fontSize={15} />}>Delete</MenuItem>}
                        </MenuList>
                    </Menu>
                </Text>
            )
        },
    ];

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi('api/user/');
        setData(result?.data?.user);
        setIsLoding(false)
    }

    const [columns, setColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    useEffect(() => {
        fetchData();
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
                searchDisplay={displaySearchData}
                setSearchDisplay={setDisplaySearchData}
                searchedDataOut={searchedData}
                setSearchedDataOut={setSearchedData}
                tableCustomFields={[]}
                action={action}
                setAction={setAction}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                isOpen={isOpen}
                onClose={onclose}
                access={true}
                onOpen={onOpen}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDelete}
                BackButton={<Button onClick={() => navigate('/admin-setting')} variant="brand" size="sm" leftIcon={<IoIosArrowBack />} ml={2}>Back</Button>}
                AdvanceSearch={
                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvanceSearch(true)}>Advance Search</Button>
                }
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
            />
            <AddUser isOpen={isOpen} size={"sm"} setAction={setAction} onClose={onClose} />
            <Edit isOpen={edit} size={"sm"} setAction={setAction} onClose={onClose} fetchData={fetchData} data={editData} setEdit={setEdit} selectedId={selectedId} />
            <Delete isOpen={deleteMany} onClose={setDelete} setAction={setAction} setSelectedValues={setSelectedValues} url='api/user/deleteMany' data={selectedValues} method='many' />

            <UserAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />

            {/* <Add isOpen={isOpen} size={"sm"} onClose={onClose} setAction={setAction} /> */}
        </div>
    )
}

export default Index
