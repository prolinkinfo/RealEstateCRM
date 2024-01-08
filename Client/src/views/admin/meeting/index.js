import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import AddMeeting from "./components/Addmeeting";
import CheckTable from './components/CheckTable';


const Index = () => {
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
        { Header: "Action", isSortable: false, center: true },

    ];

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const [action, setAction] = useState(false)
    const [addMeeting, setMeeting] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const [columns, setColumns] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/meeting' : `api/meeting?createdBy=${user._id}`);
        setData(result?.data);
        setIsLoding(false)
    }


    // useEffect(() => {
    //     fetchData()
    // }, [action])


    useEffect(() => {
        setColumns(tableColumns)
    }, [action])

    return (
        <div>

            {/* <CheckTable columnsData={columns} tableData={data} /> */}
            <CheckTable
                isOpen={addMeeting}
                isLoding={isLoding}
                // data={data}
                allData={data}
                setSearchedData={setSearchedData}
                setMeeting={setMeeting}
                addMeeting={addMeeting}
                columnsData={columns}
                from="index"
                setAction={setAction}
                action={action}
                displaySearchData={displaySearchData}
                tableData={displaySearchData ? searchedData : data}
                fetchData={fetchData}
                setDisplaySearchData={setDisplaySearchData}
                setDynamicColumns={setDynamicColumns}
                dynamicColumns={dynamicColumns}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                className='table-fix-container' />
            {/* Add Form */}
        </div>
    )
}

export default Index
