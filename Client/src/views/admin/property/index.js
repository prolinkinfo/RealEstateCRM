import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Add from "./Add";
import CheckTable from './components/CheckTable';
import { getApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";

const Index = () => {
    const [columns, setColumns] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const tableColumns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        { Header: 'property Type', accessor: 'propertyType' },
        { Header: "listing Price", accessor: "listingPrice", },
        { Header: "square Footage", accessor: "squareFootage", center: true },
        { Header: "year Built", accessor: "yearBuilt", center: true },
        { Header: "number of Bedrooms", accessor: "numberofBedrooms", center: true },
        { Header: "number of Bathrooms", accessor: "numberofBathrooms", center: true },
        { Header: "Action", isSortable: false, center: true },
    ];
    const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const [action, setAction] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const size = "lg";

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/property/' : `api/property/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

    useEffect(() => {
        setColumns(tableColumns)
    }, [onClose])
    const permission = HasAccess('property');

    return (
        <div>
            {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} textAlign={"right"}>
                    {permission?.create && <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>}
                </GridItem>
            </Grid> */}
            <CheckTable
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
                access={permission}
                setSelectedColumns={setSelectedColumns}
            />
            {/* <Add isOpen={isOpen} size={size} onClose={onClose} setAction={setAction} /> */}
        </div>
    )
}

export default Index
