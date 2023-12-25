import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import CheckTable from './components/CheckTable';
// import Add from "./Add";
import { AddIcon } from '@chakra-ui/icons';
import Add from './add';
import { useState } from 'react';


const Index = () => {
    const columns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'sender Name', accessor: 'senderName' },
        { Header: "recipient", accessor: "createByName", },
        { Header: "Realeted To", },
        { Header: "timestamp", accessor: "timestamp", },
        { Header: "Created" },
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
            <CheckTable action={action} columnsData={columns} />
            {/* Add Form */}
            <Add isOpen={isOpen} size={size} onClose={onClose} setAction={setAction} />
        </div>
    )
}

export default Index
