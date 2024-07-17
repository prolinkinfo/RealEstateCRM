import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import CommonCheckTable from '../../../components/reactTable/checktable';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import { IoIosArrowBack } from 'react-icons/io';
import AddUser from './Add';
import Edit from './Edit';
import UserAdvanceSearch from './components/userAdvanceSearch';
import { deleteManyApi } from 'services/api';
import CommonDeleteModel from 'components/commonDeleteModel';
import AddEditUser from './AddEditUser';


const Index = () => {
    const [action, setAction] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState({});
    // const { onOpen, onClose } = useDisclosure();
    const [isOpen, setIsOpen] = useState(false)
    const [selectedId, setSelectedId] = useState();
    const [deleteMany, setDelete] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const navigate = useNavigate();
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [userAction, setUserAction] = useState('')

    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        {
            Header: 'Email Id', accessor: 'username', cell: (cell) => (
                <Link to={`/userView/${cell?.row?.values._id}`}>
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value}
                    </Text>
                </Link>)
        },
        { Header: "First Name", accessor: "firstName", },
        { Header: "Last Name", accessor: "lastName", },
        { Header: "Role", accessor: "role", },
        {
            Header: "Action", accessor: 'action', isSortable: false, center: true,
            cell: ({ row }) => (
                <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                    <Menu isLazy  >
                        <MenuButton><CiMenuKebab /></MenuButton>
                        <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                            <MenuItem py={2.5} onClick={() => { setEditData(row?.original); setIsOpen(true); setSelectedId(row?.original._id); setUserAction('edit') }} icon={<EditIcon mb={1} fontSize={15} />}>Edit</MenuItem>
                            <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/userView/${row?.values._id}`)} icon={<ViewIcon mb={1} fontSize={15} />}>View</MenuItem>
                            {row?.original?.role === 'superAdmin' ? '' : <MenuItem py={2.5} color={'red'} onClick={() => { setSelectedValues([row?.original._id]); setDelete(true) }} icon={<DeleteIcon fontSize={15} />}>Delete</MenuItem>}
                        </MenuList>
                    </Menu>
                </Text>
            )
        },
    ];

    // const [columns, setColumns] = useState([...tableColumns]);
    // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    const handleOpen = () => {
        setUserAction('add')
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi('api/user/');
        setData(result?.data?.user);
        setIsLoding(false)
    }

    const handleDeleteClick = async () => {

        try {
            setIsLoding(true)
            let response = await deleteManyApi(`api/user/deleteMany`, selectedValues)
            if (response.status === 200) {
                setSelectedValues([])
                setDelete(false)
                setAction((pre) => !pre)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [action])

    return (
        <div>
            <CommonCheckTable
                title={"Users"}
                isLoding={isLoding}
                columnData={tableColumns ?? []}
                // dataColumn={dataColumn ?? []}
                allData={data ?? []}
                tableData={displaySearchData ? searchedData : data}
                searchDisplay={displaySearchData}
                setSearchDisplay={setDisplaySearchData}
                searchedDataOut={searchedData}
                setSearchedDataOut={setSearchedData}
                tableCustomFields={[]}
                // action={action}
                // setAction={setAction}
                // selectedColumns={selectedColumns}
                // setSelectedColumns={setSelectedColumns}
                // isOpen={isOpen}
                // onClose={onclose}
                access={{
                    create: true,
                    edit: true,
                    delete: true,
                    view: true,
                }}
                onOpen={handleOpen}
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
                handleSearchType="UsersSearch"
            />
            <AddEditUser isOpen={isOpen} onClose={handleClose} data={editData} selectedId={selectedId} userAction={userAction} setUserAction={setUserAction} fetchData={fetchData} />
            <CommonDeleteModel isOpen={deleteMany} onClose={() => setDelete(false)} type='User' handleDeleteData={handleDeleteClick} ids={''} selectedValues={selectedValues} />

            <UserAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data ?? []}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />
        </div>
    )
}

export default Index
