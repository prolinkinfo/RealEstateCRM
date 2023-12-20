import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Add from "./Add";
import CheckTable from './components/CheckTable';
import CommonCheckTable from "components/checkTable/checktable";
import { getApi } from "services/api";


const Index = () => {
    const [columns, setColumns] = useState([]);

    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'Lead Name', accessor: 'leadName', width: 20 },
        { Header: "Lead Status", accessor: "leadStatus", },
        { Header: "Lead Email", accessor: "leadEmail", },
        { Header: "Lead PhoneNumber", accessor: "leadPhoneNumber", },
        { Header: "Lead Address", accessor: "leadAddress", },
        { Header: "Lead Owner", accessor: "leadOwner", },
        { Header: "Lead Score", accessor: "leadScore", },
    ];

    const { isOpen, onOpen, onClose } = useDisclosure()
    const size = "lg";
    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

    useEffect(() => {
        fetchData()
    }, [isOpen])

    useEffect(() => {
        setColumns(tableColumns)
    }, [onClose])


    const handleClick = () => {
        onOpen()
    }

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
                </GridItem>
            </Grid>
            {/* <CommonCheckTable columnData={columns} title="Leads" data={data} /> */}
            <CheckTable columnsData={columns} isOpen={isOpen} />
            {/* Add Form */}
            <Add isOpen={isOpen} size={size} onClose={onClose} />
        </div>
    )
}

export default Index
