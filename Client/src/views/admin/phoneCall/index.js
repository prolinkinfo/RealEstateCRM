// import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
// import CheckTable from './components/CheckTable';
// import { AddIcon } from '@chakra-ui/icons';
// import Add from './add'
// import { useEffect, useState } from 'react';
// import { getApi } from 'services/api';
// import { HasAccess } from '../../../redux/accessUtils';

// const Index = () => {
//     const tableColumns = [
//         {
//             Header: "#",
//             accessor: "_id",
//             isSortable: false,
//             width: 10
//         },
//         { Header: 'sender', accessor: 'senderName' },
//         { Header: "recipient", accessor: "createByName", },
//         { Header: "Realeted To", },
//         { Header: "timestamp", accessor: "timestamp", },
//         { Header: "Created" },
//         { Header: "Action", isSortable: false, center: true },

//     ];
//     const [action, setAction] = useState(false)
//     const [columns, setColumns] = useState([]);
//     const [isLoding, setIsLoding] = useState(false);
//     const [data, setData] = useState([]);
//     const [displaySearchData, setDisplaySearchData] = useState(false);
//     const [searchedData, setSearchedData] = useState([]);
//     const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
//     const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
//     const { isOpen, onOpen, onClose } = useDisclosure()
//     const size = "lg";
//     const user = JSON.parse(localStorage.getItem("user"));

//     const fetchData = async () => {
//         setIsLoding(true)
//         let result = await getApi(user.role === 'superAdmin' ? 'api/phoneCall' : `api/phoneCall?sender=${user._id}`);
//         setData(result?.data);
//         setIsLoding(false)
//     }

//     const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

//     useEffect(() => {
//         setColumns(tableColumns)
//     }, [action])

//     const [permission] = HasAccess(['Call'])

//     return (
//         <div>
//             {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
//                 <GridItem colStart={6} textAlign={"right"}>
//                     <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
//                 </GridItem>
//             </Grid> */}
//             <CheckTable
//                 // action={action} columnsData={columns}
//                 isLoding={isLoding}
//                 columnsData={columns}
//                 dataColumn={dataColumn}
//                 isOpen={isOpen}
//                 setAction={setAction}
//                 action={action}
//                 setSearchedData={setSearchedData}
//                 allData={data}
//                 displaySearchData={displaySearchData}
//                 tableData={displaySearchData ? searchedData : data}
//                 fetchData={fetchData}
//                 setDisplaySearchData={setDisplaySearchData}
//                 setDynamicColumns={setDynamicColumns}
//                 dynamicColumns={dynamicColumns}
//                 selectedColumns={selectedColumns}
//                 setSelectedColumns={setSelectedColumns}
//                 access={permission}
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
import Add from './add';
import { MdLeaderboard } from 'react-icons/md';
import { IoIosContact } from 'react-icons/io';
import CallAdvanceSearch from './components/callAdvanceSearch';

const Index = (props) => {
    const title = "Calls";
    const size = "lg";
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [id, setId] = useState('')
    const [selectedId, setDelete] = useState(false);
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
    const [permission, leadAccess, contactAccess] = HasAccess(["Calls", 'Leads', 'Contacts']);

    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'sender Name', accessor: 'senderName' },
        { Header: "recipient", accessor: "createByName", },
        {
            Header: "Realeted To", accessor: "realeted", cell: ({ row }) => (
                <Text  >
                    {row?.original.createBy && contactAccess?.view ? <Link to={`/contactView/${row?.original.createBy}`}>
                        <Text
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                            color={'brand.600'}
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {row?.original.createBy && "Contact"}
                        </Text>
                    </Link> :
                        <Text
                            me="10px"
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {row?.original.createBy && "Contact"}
                        </Text>}

                    {leadAccess?.view && row?.original.createByLead ? <Link to={`/leadView/${row?.original.createByLead}`}>
                        <Text
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                            color={'brand.600'}
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {row?.original.createByLead && "Lead"}
                        </Text>
                    </Link> : <Text
                        me="10px"
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {row?.original.createByLead && "Lead"}
                    </Text>}
                </Text>
            )
        },
        { Header: "timestamp", accessor: "timestamp", },
        {
            Header: "Created", accessor: 'created', cell: ({ row }) => (
                <Text fontSize="sm" fontWeight="700">
                    {moment(row?.values.timestamp).format('(DD/MM) h:mma')}
                </Text>
            )
        },
        {
            Header: "Action", accessor: 'action', isSortable: false, center: true,
            cell: ({ row }) => (
                <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                    <Menu isLazy  >
                        <MenuButton><CiMenuKebab /></MenuButton>
                        <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                            {permission?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/phone-call/${row?.values._id}`)} icon={<ViewIcon mb={'2px'} fontSize={15} />}>View</MenuItem>}
                            {row?.original?.createBy && contactAccess?.view ?
                                <MenuItem width={"165px"} py={2.5} color={'black'} onClick={() => navigate(row?.original?.createBy && `/contactView/${row?.original.createBy}`)} icon={row?.original.createBy && <IoIosContact fontSize={15} />}>  {(row?.original.createBy && contactAccess?.view) && "contact"}
                                </MenuItem>
                                : ''}
                            {row?.original.createByLead && leadAccess?.view ? <MenuItem width={"165px"} py={2.5} color={'black'} onClick={() => navigate(`/leadView/${row?.original.createByLead}`)} icon={row?.original.createByLead && leadAccess?.view && <MdLeaderboard style={{ marginBottom: '4px' }} fontSize={15} />}>{row?.original.createByLead && leadAccess?.view && 'lead'}</MenuItem> : ''}
                        </MenuList>
                    </Menu>
                </Text>
            )
        },
    ];

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/phoneCall' : `api/phoneCall?sender=${user._id}`);
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
                tableData={data}
                searchDisplay={displaySearchData}
                setSearchDisplay={setDisplaySearchData}
                searchedDataOut={searchedData}
                setSearchedDataOut={setSearchedData}
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
                deleteMany={'true'}
                AdvanceSearch={
                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvanceSearch(true)}>Advance Search</Button>
                }
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
            />

            <CallAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />

            <Add isOpen={isOpen} size={"sm"} onClose={onClose} setAction={setAction} />
        </div>
    )
}

export default Index