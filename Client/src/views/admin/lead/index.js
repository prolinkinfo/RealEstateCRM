import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import CheckTable from './components/CheckTable';
import Add from "./Add";


const Index = () => {
    const [columns, setColumns] = useState([]);

    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'Lead Name', accessor: 'leadName', width: 20 },
        { Header: "Lead Email", accessor: "leadEmail", },
        { Header: "Lead PhoneNumber", accessor: "leadPhoneNumber", },
        { Header: "Lead Address", accessor: "leadAddress", },
        { Header: "Lead Status", accessor: "leadStatus", },
        { Header: "Lead Owner", accessor: "leadOwner", },
        { Header: "Lead Score", accessor: "leadScore", },
    ];
    const { isOpen, onOpen, onClose } = useDisclosure()
    const size = "lg";

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
            <CheckTable columnsData={columns} isOpen={isOpen} />
            {/* Add Form */}
            <Add isOpen={isOpen} size={size} onClose={onClose} />
        </div>
    )
}

export default Index
