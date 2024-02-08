import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import CheckTable from './components/CheckTable';
import { AddIcon } from '@chakra-ui/icons';
import Add from './add'
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';

const Index = () => {
    const tableColumns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        { Header: 'sender', accessor: 'senderName' },
        { Header: "recipient", accessor: "createByName", },
        { Header: "Realeted To", },
        { Header: "timestamp", accessor: "timestamp", },
        { Header: "Created" },
        { Header: "Action", isSortable: false, center: true },

    ];
    const [action, setAction] = useState(false)
    const [columns, setColumns] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const size = "lg";
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/phoneCall' : `api/phoneCall?sender=${user._id}`);
        setData(result?.data);
        setIsLoding(false)
    }

    const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    useEffect(() => {
        setColumns(tableColumns)
    }, [action])

    const [permission] = HasAccess(['Call'])

    return (
        <div>
            {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
                </GridItem>
            </Grid> */}
            <CheckTable
                // action={action} columnsData={columns}
                isLoding={isLoding}
                columnsData={columns}
                dataColumn={dataColumn}
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
                access={permission}
            />
            {/* Add Form */}
        </div>
    )
}

export default Index
