
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/reactTable/checktable';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import EmailAdvanceSearch from './components/EmailAdvanceSearch';
import moment from 'moment';
import { MdLeaderboard } from 'react-icons/md';
import { IoIosContact } from 'react-icons/io';
import AddEmailHistory from './add';
import { useDispatch } from 'react-redux';
import { fetchEmailsData } from '../../../redux/slices/emailsSlice';
import { toast } from 'react-toastify';

const Index = (props) => {
    const title = "Email";
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedId, setDelete] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [permission, leadAccess, contactAccess] = HasAccess(["Emails", 'Leads', 'Contacts']);
    const actionHeader = {
        Header: "Action", accessor: 'action', isSortable: false, center: true,
        cell: ({ row }) => (
            <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                <Menu isLazy  >
                    <MenuButton><CiMenuKebab /></MenuButton>
                    <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                        {permission?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/Email/${row?.values._id}`)} icon={<ViewIcon mb={'2px'} fontSize={15} />}>View</MenuItem>}
                        {row?.original?.createByContact && contactAccess?.view ?
                            <MenuItem width={"165px"} py={2.5} color={'black'} onClick={() => navigate(row?.original?.createByContact && `/contactView/${row?.original.createByContact}`)} icon={row?.original.createByContact && <IoIosContact fontSize={15} />}>  {(row?.original.createByContact && contactAccess?.view) && "contact"}
                            </MenuItem>
                            : ''}
                        {row?.original.createByLead && leadAccess?.view ? <MenuItem width={"165px"} py={2.5} color={'black'} onClick={() => navigate(`/leadView/${row?.original.createByLead}`)} icon={row?.original.createByLead && leadAccess?.view && <MdLeaderboard style={{ marginBottom: '4px' }} fontSize={15} />}>{row?.original.createByLead && leadAccess?.view && 'lead'}</MenuItem> : ''}
                    </MenuList>
                </Menu>
            </Text>
        )
    };
    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        {
            Header: "recipient", accessor: "createByName", cell: (cell) => (
                <Link to={`/Email/${cell?.row?.values._id}`}>
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value || '-'}
                    </Text>
                </Link>)
        },
        { Header: 'sender Name', accessor: 'senderName' },
        {
            Header: "Realeted To", accessor: 'realeted', cell: ({ row }) => (
                <Text  >
                    {row?.original.createByContact && contactAccess?.view ? <Link to={`/contactView/${row?.original.createByContact}`}>
                        <Text
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                            color={'brand.600'}
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {row?.original.createByContact && "Contact"}
                        </Text>
                    </Link> :
                        <Text
                            me="10px"
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {row?.original.createByContact && "Contact"}
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
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])

    ];

    const fetchData = async () => {
        setIsLoding(true)
        const result = await dispatch(fetchEmailsData())
        let response = [...result?.payload?.data]

        response && response?.length > 0 && response?.forEach(element => {

            if (Object.isExtensible(element)) {
                if (element.createByLead) {
                    element.realeted = 'Lead';
                }
                if (element.createBy) {
                    element.realeted = 'Contact';
                }
            } else {
                const modifiedElement = { ...element };
                if (element.createByLead) {
                    modifiedElement.realeted = 'Lead';
                }
                if (element.createBy) {
                    modifiedElement.realeted = 'Contact';
                }
                element = modifiedElement;
            }
        });
        if (result.payload.status === 200) {
            setData(response);
        } else {
            toast.error("Failed to fetch data", "error");
        }
        setIsLoding(false)
    }

    // const [columns, setColumns] = useState([...tableColumns]);
    // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))


    useEffect(() => {
        fetchData();
    }, [action])

    return (
        <div>
            <CommonCheckTable
                title={title}
                isLoding={isLoding}
                columnData={tableColumns ?? []}
                // dataColumn={dataColumn ?? []}
                allData={data ?? []}
                tableData={data}
                searchDisplay={displaySearchData}
                setSearchDisplay={setDisplaySearchData}
                searchedDataOut={searchedData}
                setSearchedDataOut={setSearchedData}
                tableCustomFields={[]}
                access={permission}
                // action={action}
                // setAction={setAction}
                // selectedColumns={selectedColumns}
                // setSelectedColumns={setSelectedColumns}
                // isOpen={isOpen}
                // onClose={onclose}
                onOpen={onOpen}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDelete}
                deleteMany={true}
                AdvanceSearch={
                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvanceSearch(true)}>Advance Search</Button>
                }
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
                handleSearchType="EmailSearch"
            />

            <EmailAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data ?? []}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />

            <AddEmailHistory isOpen={isOpen} size={"sm"} onClose={onClose} setAction={setAction} />
        </div>
    )
}

export default Index