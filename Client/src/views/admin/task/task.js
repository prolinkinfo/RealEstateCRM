import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getApi } from 'services/api'
import CheckTable from './components/CheckTable'
import AddTask from './components/addTask'
import { HasAccess } from '../../../redux/accessUtils'
import { useLocation } from 'react-router-dom'

const Task = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const location = useLocation();
    const state = location.state;
    // Now you can access the state

    const tableColumns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 5
        },
        { Header: 'Title', accessor: 'title' },
        { Header: "Related", accessor: "category", },
        { Header: "Status", accessor: "status", },
        { Header: "Assign To", accessor: "assignmentToName", },
        { Header: "Start Date", accessor: "start", },
        { Header: "End Date", accessor: "end", },
        { Header: "Action", isSortable: false, center: true },
    ];
    const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const [action, setAction] = useState(false)
    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const [columns, setColumns] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);

    const [permission] = HasAccess(['Task'])

    const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? `api/task${state ? `?status=${state}` : ''}` : `api/task/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

    useEffect(() => {
        setColumns(tableColumns)
    }, [action])

    return (
        <div>
            {/* <Flex alignItems={'center'} justifyContent={"right"} flexWrap={'wrap'} mb={3}>
                <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Create Task</Button>
            </Flex> */}
            <CheckTable
                isLoding={isLoding}
                columnsData={columns}
                isOpen={isOpen}
                dataColumn={dataColumn}
                setAction={setAction}
                action={action}
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
            />
            {/* <AddTask isOpen={isOpen} fetchData={fetchData} onClose={onClose} /> */}
        </div>
    )
}

export default Task
