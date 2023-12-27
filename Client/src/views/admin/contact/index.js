import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, FormLabel, Grid, GridItem, Input, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import Add from "./Add";
import Card from "components/card/Card";
import { useFormik } from "formik";


const Index = () => {
    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'title', accessor: 'title' },
        { Header: "first Name", accessor: "firstName", },
        { Header: "last Name", accessor: "lastName", },
        { Header: "phone Number", accessor: "phoneNumber", },
        { Header: "Email Address", accessor: "email", },
        { Header: "physical Address", accessor: "physicalAddress", },
        { Header: "mailing Address", accessor: "mailingAddress", },
        { Header: "Contact Method", accessor: "preferredContactMethod", },
    ];

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [data, setData] = useState([])
    const [isLoding, setIsLoding] = useState(false)
    const [action, setAction] = useState(false)
    const [columns, setColumns] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);

    const user = JSON.parse(localStorage.getItem("user"))

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }


    useEffect(() => {
        fetchData()
        setColumns(tableColumns)
    }, [action])

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
                {/* <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
                </GridItem> */}
                <GridItem colSpan={6}>
                    <CheckTable
                        isLoding={isLoding}
                        columnsData={tableColumns}
                        setSearchedData={setSearchedData}
                        displaySearchData={displaySearchData}
                        setDisplaySearchData={setDisplaySearchData}
                        isOpen={isOpen}
                        allData={data}
                        // tableData={data}
                        setDynamicColumns={setDynamicColumns}
                        dynamicColumns={dynamicColumns}
                        tableData={displaySearchData ? searchedData : data}
                        fetchData={fetchData}
                        setAction={setAction}
                        onOpen={onOpen}
                        onClose={onClose}
                        selectedColumns={selectedColumns}
                        setSelectedColumns={setSelectedColumns} />
                </GridItem>
            </Grid>
            {/* Add Form */}
            {/* <Add isOpen={isOpen} size={size} onClose={onClose} setAction={setAction} /> */}
        </div>
    )
}

export default Index
