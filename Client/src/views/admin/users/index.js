import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import Add from "./Add";
import CheckTable from './components/CheckTable';
import { useState } from "react";

const Index = () => {
    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        { Header: 'email Id', accessor: 'username' },
        { Header: "first Name", accessor: "firstName", },
        { Header: "last Name", accessor: "lastName", },
        { Header: "role", accessor: "role", },

    ];
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [action, setAction] = useState(false)
    const size = "lg";

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
            <CheckTable isOpen={isOpen} setAction={setAction} action={action} columnsData={columns} />
            {/* Add Form */}
            <Add isOpen={isOpen} size={size} setAction={setAction} onClose={onClose} />
        </div>
    )
}

export default Index
