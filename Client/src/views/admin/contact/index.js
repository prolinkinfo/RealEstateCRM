import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, FormLabel, Grid, GridItem, Input, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import Add from "./Add";
import Card from "components/card/Card";
import { useFormik } from "formik";
import { HasAccess } from "../../../redux/accessUtils";


const Index = () => {
    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'Title', accessor: 'title' },
        { Header: "First Name", accessor: "firstName", },
        { Header: "Last Name", accessor: "lastName", },
        { Header: "Phone Number", accessor: "phoneNumber", },
        { Header: "Email Address", accessor: "email", },
        { Header: "Contact Method", accessor: "preferredContactMethod", },
        { Header: "Action", isSortable: false, center: true },
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

    const permission = HasAccess('Contacts');
    const emailAccess = HasAccess('Email')
    const callAccess = HasAccess('Call')

    const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
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
                <GridItem colSpan={6}>
                    <CheckTable
                        isLoding={isLoding}
                        columnsData={columns}
                        dataColumn={dataColumn}
                        isOpen={isOpen}
                        setAction={setAction}
                        action={action}
                        setSearchedData={setSearchedData}
                        displaySearchData={displaySearchData}
                        setDisplaySearchData={setDisplaySearchData}
                        allData={data}
                        emailAccess={emailAccess}
                        callAccess={callAccess}
                        setDynamicColumns={setDynamicColumns}
                        dynamicColumns={dynamicColumns}
                        tableData={displaySearchData ? searchedData : data}
                        fetchData={fetchData}
                        onOpen={onOpen}
                        onClose={onClose}
                        selectedColumns={selectedColumns}
                        access={permission}
                        setSelectedColumns={setSelectedColumns} />
                </GridItem>
            </Grid>
        </div>
    )
}

export default Index
