import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Select, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import AddTask from './components/addTask';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/checkTable/checktable';
import TaskAdvanceSearch from './components/TaskAdvanceSearch';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import EditTask from './components/editTask';
import EventView from './eventView';
import DeleteTask from './components/deleteTask';
import ImportModal from '../lead/components/ImportModal';
import { putApi } from 'services/api';
import { useLocation } from 'react-router-dom';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi } from 'services/api';

const Task = () => {
    const title = "Tasks";
    const size = "lg";
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
    const [permission, leadAccess, contactAccess] = HasAccess(["Tasks", 'Leads', 'Contacts']);
    const location = useLocation();
    const state = location.state;
    const actionHeader = {
        Header: "Action", isSortable: false, center: true,
        cell: ({ row }) => (
            <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                <Menu isLazy >
                    <MenuButton ><CiMenuKebab /></MenuButton>
                    <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                        {permission?.update &&
                            <MenuItem py={2.5} icon={<EditIcon fontSize={15} mb={1} />} onClick={() => { setEdit(true); setSelectedId(row?.values?._id); }}>Edit</MenuItem>}
                        {permission?.view &&
                            <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { setEventView(true); setId(row?.original._id) }}>View</MenuItem>}
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
                        onClick={() => handleDateClick(cell)}
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
        { Header: "Assign To", accessor: "assignmentToName", type: 'text', formikType: '' },
        { Header: "Start Date", accessor: "start", type: 'date', formikType: '' },
        { Header: "End Date", accessor: "end", type: 'date', formikType: '' },
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : []),
    ];

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? `api/task` : `api/task/?createBy=${user._id}`);
        setData(result.data);
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
                state={state}
                onOpen={onOpen}
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
            />

            <TaskAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                state={state}
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
            {/* <DeleteTask isOpen={deleteMany} onClose={setDeleteMany} viewClose={onClose} url='api/task/deleteMany' method='many' data={selectedValues} setSelectedValues={setSelectedValues} redirectPage={"/task"} fetchData={fetchData} setAction={setAction} /> */}
            <CommonDeleteModel isOpen={deleteMany} onClose={() => setDeleteMany(false)} type='Tasks' handleDeleteData={handleDeleteTask} ids={selectedValues} />
            <ImportModal text='Lead file' fetchData={fetchData} isOpen={isImportLead} onClose={setIsImportLead} />
        </div>
    )
}

export default Task

