import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import CheckTable from './components/CheckTable';
// import Add from "./Add";
import { AddIcon } from '@chakra-ui/icons';

import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';


const Index = () => {
    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'sender Name', accessor: 'senderName' },
        { Header: "recipient", accessor: "createByName", },
        { Header: "Realeted To", },
        { Header: "timestamp", accessor: "timestamp", },
        { Header: "Created", },
        { Header: "Action", isSortable: false, center: true },
    ];
    const columnsToExclude = ['Realeted To', 'Created'];
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [action, setAction] = useState(false)
    const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const [columns, setColumns] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const size = "lg";


    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/email/' : `api/email/?sender=${user._id}`);
        setData(result?.data);
        setIsLoding(false)
    }
    useEffect(() => {
        setColumns(tableColumns)
    }, [action])

    const permission = HasAccess('email')

    return (
        <div>

            <CheckTable
                // action={action} columnsData={columns} 
                isLoding={isLoding}
                columnsData={columns}
                isOpen={isOpen}
                setAction={setAction}
                action={action}
                setSearchedData={setSearchedData}
                allData={data}
                displaySearchData={displaySearchData}
                tableData={displaySearchData ? searchedData : data}
                fetchData={fetchData}
                setDisplaySearchData={setDisplaySearchData}
                setDynamicColumns={setDynamicColumns}
                dynamicColumns={dynamicColumns}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                columnsToExclude={columnsToExclude}
                access={permission}
            />
        </div>
    )
}

export default Index
