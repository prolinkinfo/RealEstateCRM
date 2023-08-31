import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, Spinner, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import Add from "./Add";


const Index = () => {
    const columns = [
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
    const size = "lg";
    const [data, setData] = useState([])
    const [isLoding, setIsLoding] = useState(false)

    const user = JSON.parse(localStorage.getItem("user"))

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

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
            {/* <CheckTable columnsData={columns} tableData={data} /> */}
            <CheckTable isLoding={isLoding} columnsData={columns} isOpen={isOpen} tableData={data} fetchData={fetchData} />
            {/* Add Form */}
            <Add isOpen={isOpen} size={size} onClose={onClose} />
        </div>
    )
}

export default Index
