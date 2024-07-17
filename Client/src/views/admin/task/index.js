import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Select, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/reactTable/checktable';
import TaskAdvanceSearch from './components/TaskAdvanceSearch';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import EventView from './eventView';
import ImportModal from '../lead/components/ImportModal';
import { putApi } from 'services/api';
import { useLocation } from 'react-router-dom';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi } from 'services/api';
import AddEdit from './components/AddEdit';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchTaskData } from '../../../redux/slices/taskSlice';
import { toast } from 'react-toastify';

const Task = () => {
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
    const [isImportLead, setIsImportLead] = useState(false);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [userAction, setUserAction] = useState("");
    const [permission, leadAccess, contactAccess] = HasAccess(["Tasks", 'Leads', 'Contacts']);
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate()
    const dispatch = useDispatch();

    console.log("displaySearchData----::", displaySearchData)
    const handleEditOpen = (row) => {
        onOpen();
        setUserAction("edit")
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
                            <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { setId(row?.original._id); handleViewOpen(row?.values?._id); }}>View</MenuItem>}
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
            Header: 'Title', accessor: 'title', type: 'text', formikType: '', cell: (cell) => (
                <div className="selectOpt">
                    <Text
                        onClick={() => handleViewOpen(cell?.row?.original._id)}
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
        { Header: "Related", accessor: "category", type: 'text', formikType: '' },
        {
            Header: "Status", accessor: "status", type: 'select', formikType: '', cell: (cell) => (
                <div className="selectOpt">
                    <Select className={changeStatus(cell)} onChange={(e) => setStatusData(cell, e)} height={7} width={130} value={cell?.value} style={{ fontSize: "14px" }}>
                        <option value='completed'>Completed</option>
                        <option value='todo'>Todo</option>
                        <option value='onHold'>On Hold</option>
                        <option value='inProgress'>In Progress</option>
                        <option value='pending'>Pending</option>
                    </Select>
                </div>
            )
        },
        { Header: "Assign To", accessor: "assignToName", type: 'text', formikType: '' },
        { Header: "Start Date", accessor: "start", type: 'date', formikType: '' },
        { Header: "End Date", accessor: "end", type: 'date', formikType: '' },
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : []),
    ];

    const fetchData = async () => {
        setIsLoding(true)
        const result = await dispatch(fetchTaskData())
        if (result.payload.status === 200) {
            setData(result?.payload?.data);
        } else {
            toast.error("Failed to fetch data", "error");
        }
        setIsLoding(false)
    }
    const setStatusData = async (cell, e) => {
        try {
            setIsLoding(true)
            let response = await putApi(`api/task/changeStatus/${cell?.row?.original?._id}`, { status: e.target.value });
            if (response.status === 200) {
                setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    }
    const changeStatus = (cell) => {
        switch (cell.value) {
            case 'pending':
                return 'pending';
            case 'completed':
                return 'completed';
            case 'todo':
                return 'toDo';
            case 'onHold':
                return 'onHold';
            case 'inProgress':
                return 'inProgress';
            default:
                return '';
        }

    }

    const handleDeleteTask = async (ids) => {
        try {
            setIsLoding(true)
            let response = await deleteManyApi('api/task/deleteMany', ids)
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


    const handleDateClick = (cell) => {
        setId(cell?.row?.values?._id)
        setEventView(true)
    }
    // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    const handleViewOpen = (id) => {
        navigate(`/view/${id}`)
    }

    const addBtn = () => {
        onOpen();
        setUserAction("add");
    }

    const handleClose = () => {
        onClose();
        setSelectedId("")
    }
    useEffect(() => {
        fetchData();
    }, [action])

    return (
        <div>
            <CommonCheckTable
                title={"Tasks"}
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
                state={state}
                onOpen={addBtn}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDeleteMany}
                AdvanceSearch={
                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvanceSearch(true)}>Advance Search</Button>
                }
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
                handleSearchType="TasksSearch"
            />

            <TaskAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                state={state}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data ?? []}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />
            <AddEdit isOpen={isOpen} fetchData={fetchData} onClose={handleClose} userAction={userAction} id={selectedId} setAction={setAction} />
            {/* <EditTask isOpen={edit} onClose={setEdit} viewClose={onClose} id={selectedId} setAction={setAction} /> */}
            {/* <EventView fetchData={fetchData} isOpen={eventView} access={permission} contactAccess={contactAccess} leadAccess={leadAccess} onClose={setEventView} id={id} setAction={setAction} action={action} /> */}
            <CommonDeleteModel isOpen={deleteMany} onClose={() => setDeleteMany(false)} type='Tasks' handleDeleteData={handleDeleteTask} ids={selectedValues} />
            <ImportModal text='Lead file' fetchData={fetchData} isOpen={isImportLead} onClose={setIsImportLead} />
        </div>
    )
}

export default Task

