import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Select, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/reactTable/checktable';
import { CiMenuKebab } from 'react-icons/ci';
import { putApi } from 'services/api';
import { useLocation } from 'react-router-dom';
import { deleteManyApi } from 'services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CommonDeleteModel from 'components/commonDeleteModel';
import { fetchEmailTempData } from '../../../redux/slices/emailTempSlice';

const Index = () => {
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [edit, setEdit] = useState(false);
    const [eventView, setEventView] = useState(false)
    const [id, setId] = useState('')
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    // const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const [deleteMany, setDeleteMany] = useState(false);
    const [isImportLead, setIsImportLead] = useState(false);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [userAction, setUserAction] = useState("");
    const [permission] = HasAccess(["Email Template"]);
    const location = useLocation();
    // const state = location.state;
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleEditOpen = (row) => {
        onOpen();
        setUserAction("edit")
        navigate(`/email-template/email-template-addEdit`, { state: { type: 'edit', id: row?.values?._id } })
        setSelectedId(row?.values?._id);
    }

    const actionHeader = {
        Header: "Action", isSortable: false, center: true,
        cell: ({ row }) => (
            <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                <Menu isLazy >
                    <MenuButton ><CiMenuKebab /></MenuButton>
                    <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                        {permission?.update &&
                            <MenuItem py={2.5} icon={<EditIcon fontSize={15} mb={1} />} onClick={() => handleEditOpen(row)}>Edit</MenuItem>}
                        {permission?.view &&
                            <MenuItem py={2.5} color={"green"} icon={<ViewIcon fontSize={15} mb={1} />} onClick={() => navigate(`/email-template/${row?.values?._id}`)}>View</MenuItem>}
                        {permission?.delete &&
                            <MenuItem py={2.5} color={'red'} icon={<DeleteIcon fontSize={15} mb={1} />} onClick={() => { setDeleteMany(true); setSelectedValues([row?.values?._id]); }}>Delete</MenuItem>}
                    </MenuList>
                </Menu>
            </Text>
        )
    }
    const tableColumns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 5
        },
        {
            Header: 'Template Name', accessor: 'templateName',
            cell: (cell) => (
                <div className="selectOpt">
                    <Text
                        onClick={() => navigate(`/email-template/${cell?.row?.original._id}`)}
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value}
                    </Text>
                </div>
            )
        },
        { Header: "Description", accessor: "description" },
        ...(permission?.update || permission?.delete ? [actionHeader] : []),
    ];

    const fetchData = async () => {
        setIsLoding(true)
        const result = await dispatch(fetchEmailTempData())
        if (result.payload.status === 200) {
            setData(result?.payload?.data);
        } else {
            toast.error("Failed to fetch data", "error");
        }
        setIsLoding(false)
    }

    const handleDeleteTask = async (ids) => {
        try {
            setIsLoding(true)
            let response = await deleteManyApi('api/email-temp/deleteMany', ids)
            if (response.status === 200) {
                setSelectedValues([])
                setDeleteMany(false)
                setAction((pre) => !pre)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }
    }


    // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    const addBtn = () => {
        navigate(`/email-template/email-template-addEdit`, { state: { type: 'add' } })
        setUserAction("add");
    }

    useEffect(() => {
        fetchData();
    }, [action])

    return (
        <div>
            <CommonCheckTable
                title={"Email Template"}
                isLoding={isLoding}
                columnData={tableColumns ?? []}
                // dataColumn={dataColumn ?? []}
                allData={data ?? []}
                searchDisplay={displaySearchData}
                setSearchDisplay={setDisplaySearchData}
                searchedDataOut={searchedData}
                setSearchedDataOut={setSearchedData}
                tableCustomFields={[]}
                access={permission}
                // selectedColumns={selectedColumns}
                // setSelectedColumns={setSelectedColumns}
                // state={state}
                onOpen={addBtn}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDeleteMany}
                AdvanceSearch={false}
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
                handleSearchType="template"
            />
            <CommonDeleteModel isOpen={deleteMany} onClose={() => setDeleteMany(false)} type='Email Template' handleDeleteData={handleDeleteTask} ids={selectedValues} />
        </div>
    )
}

export default Index

