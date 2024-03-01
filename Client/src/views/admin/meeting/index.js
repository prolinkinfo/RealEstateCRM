// import { AddIcon } from "@chakra-ui/icons";
// import { Button, Grid, GridItem } from '@chakra-ui/react';
// import { useEffect, useState } from 'react';
// import { getApi } from 'services/api';
// import AddMeeting from "./components/Addmeeting";
// import CheckTable from './components/CheckTable';
// import { HasAccess } from "../../../redux/accessUtils";


// const Index = () => {
//     const tableColumns = [
//         {
//             Header: "#",
//             accessor: "_id",
//             isSortable: false,
//             width: 10
//         },
//         { Header: 'agenda', accessor: 'agenda' },
//         { Header: "date & Time", accessor: "dateTime", },
//         { Header: "time stamp", accessor: "timestamp", },
//         { Header: "create By", accessor: "createdByName", },
//         { Header: "Action", isSortable: false, center: true },

//     ];

//     const [data, setData] = useState([])
//     const user = JSON.parse(localStorage.getItem("user"))
//     const [isLoding, setIsLoding] = useState(false)
//     const [action, setAction] = useState(false)
//     const [addMeeting, setMeeting] = useState(false);
//     const [searchedData, setSearchedData] = useState([]);
//     const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
//     const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
//     const [columns, setColumns] = useState([]);
//     const [displaySearchData, setDisplaySearchData] = useState(false);

//     const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

//     const fetchData = async () => {
//         setIsLoding(true)
//         let result = await getApi(user.role === 'superAdmin' ? 'api/meeting' : `api/meeting?createdBy=${user._id}`);
//         setData(result?.data);
//         setIsLoding(false)
//     }

//     const [permission] = HasAccess(['Meeting'])


//     // useEffect(() => {
//     //     fetchData()
//     // }, [action])


//     useEffect(() => {
//         setColumns(tableColumns)
//     }, [action])

//     return (
//         <div>

//             {/* <CheckTable columnsData={columns} tableData={data} /> */}
//             <CheckTable
//                 isOpen={addMeeting}
//                 isLoding={isLoding}
//                 dataColumn={dataColumn}
//                 allData={data}
//                 setSearchedData={setSearchedData}
//                 setMeeting={setMeeting}
//                 addMeeting={addMeeting}
//                 access={permission}
//                 columnsData={columns}
//                 from="index"
//                 setAction={setAction}
//                 action={action}
//                 displaySearchData={displaySearchData}
//                 tableData={displaySearchData ? searchedData : data}
//                 fetchData={fetchData}
//                 setDisplaySearchData={setDisplaySearchData}
//                 setDynamicColumns={setDynamicColumns}
//                 dynamicColumns={dynamicColumns}
//                 selectedColumns={selectedColumns}
//                 setSelectedColumns={setSelectedColumns}
//                 className='table-fix-container' />
//             {/* Add Form */}
//         </div>
//     )
// }

// export default Index

import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/checkTable/checktable';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import ImportModal from '../lead/components/ImportModal';
import { useNavigate } from 'react-router-dom';
import MeetingAdvanceSearch from './components/MeetingAdvanceSearch';
import AddMeeting from './components/Addmeeting';

const Index = () => {
    const title = "Meeting";
    const size = "lg";
    const navigate = useNavigate()
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [edit, setEdit] = useState(false);
    const [eventView, setEventView] = useState(false)
    const [id, setId] = useState('')
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const [deleteMany, setDeleteMany] = useState(false);
    const [addMeeting, setAddMeeting] = useState(false);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [permission] = HasAccess(['Meeting'])
    const tableColumns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        { Header: 'agenda', accessor: 'agenda' },
        { Header: "date & Time", accessor: "dateTime", },
        { Header: "time stamp", accessor: "timestamp", },
        { Header: "create By", accessor: "createdByName", },
        {
            Header: "Action", isSortable: false, center: true,
            cell: ({ row }) => (
                <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                    <Menu isLazy  >
                        <MenuButton><CiMenuKebab /></MenuButton>
                        <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                            {permission?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/metting/${row?.values._id}`)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>}
                        </MenuList>
                    </Menu>
                </Text>
            )
        },
    ];

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/meeting' : `api/meeting?createdBy=${user._id}`);
        setData(result.data);
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
                onClose={onClose}
                onOpen={onOpen}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDeleteMany}
                AdvanceSearch={
                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvanceSearch(true)}>Advance Search</Button>
                }
                deleteMany={'true'}
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
            />

            <MeetingAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />
            <AddMeeting setAction={setAction} isOpen={isOpen} onClose={onClose} />
        </div>
    )
}

export default Index