
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/checkTable/checktable';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import moment from 'moment';
import { MdLeaderboard } from 'react-icons/md';
import { IoIosContact } from 'react-icons/io';
import AddEdit from './AddEdit';
import { useDispatch } from 'react-redux';
import { fetchEmailsData } from '../../../redux/slices/emailsSlice';
import { toast } from 'react-toastify';
import EmailAdvanceSearch from '../emailHistory/components/EmailAdvanceSearch';
import { fetchOpportunityData } from '../../../redux/slices/opportunitySlice';

const Index = (props) => {
    const title = "Opprtunities";
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
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
    const [selectedId, setSelectedId] = useState();
    const [deleteModel, setDelete] = useState(false);
    const [edit, setEdit] = useState(false);
    const [type, setType] = useState("")

    const [permission, leadAccess, contactAccess] = HasAccess(["Emails", 'Leads', 'Contacts']);

    const actionHeader = {
        Header: "Action",
        accessor: "action",
        isSortable: false,
        center: true,
        cell: ({ row, i }) => (
            <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                <Menu isLazy>
                    <MenuButton>
                        <CiMenuKebab />
                    </MenuButton>
                    <MenuList
                        minW={"fit-content"}
                        transform={"translate(1520px, 173px);"}
                    >
                        {permission?.update && (
                            <MenuItem
                                py={2.5}
                                icon={<EditIcon fontSize={15} mb={1} />}
                                onClick={() => {
                                    setType("edit");
                                    onOpen();
                                    setSelectedId(row?.values?._id);
                                }}
                            >
                                Edit
                            </MenuItem>
                        )}
                        {permission?.view && (
                            <MenuItem
                                py={2.5}
                                color={"green"}
                                icon={<ViewIcon mb={1} fontSize={15} />}
                                onClick={() => {
                                    navigate(`/opportunitiesView/${row?.values?._id}`);
                                }}
                            >
                                View
                            </MenuItem>
                        )}
                        {permission?.delete && (
                            <MenuItem
                                py={2.5}
                                color={"red"}
                                icon={<DeleteIcon fontSize={15} mb={1} />}
                                onClick={() => {
                                    setDelete(true);
                                    setSelectedValues([row?.values?._id]);
                                }}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Text>
        ),
    };
    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        {
            Header: 'Opportunity Name', accessor: 'opportunityName',
        },
        {
            Header: 'Account Name', accessor: 'accountName',
        },
        {
            Header: 'Opportunity Amount', accessor: 'opportunityAmount',
        },
        {
            Header: 'Expected Close Date', accessor: 'expectedCloseDate', cell: (cell) => (
                <div>{moment(cell?.value).format("YYYY-MM-DD")}</div>
            )
        },
        {
            Header: 'Sales Stage', accessor: 'salesStage',
        },
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])

    ];

    const handleOpenAdd = () => {
        onOpen();
        setType("add")
    }

    const fetchData = async () => {
        setIsLoding(true)
        const result = await dispatch(fetchOpportunityData())

        if (result.payload.status === 200) {
            setData(result?.payload?.data);
        } else {
            toast.error("Failed to fetch data", "error");
        }
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
                columnData={columns ?? []}
                dataColumn={dataColumn ?? []}
                allData={data ?? []}
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
                onOpen={handleOpenAdd}
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

            <AddEdit isOpen={isOpen} size={"lg"} onClose={onClose} setAction={setAction} type={type} selectedId={selectedId} />
        </div>
    )
}

export default Index