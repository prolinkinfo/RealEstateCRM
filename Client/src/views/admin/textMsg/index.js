import { Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import CheckTable from './components/CheckTable';
// import Add from "./Add";


const Index = () => {
    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        { Header: 'sender', accessor: 'senderName' },
        { Header: "to", accessor: "to", },
        { Header: "create From", accessor: "createByName", },
        { Header: "timestamp", accessor: "timestamp", },
        { Header: "Created" },

    ];
    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} textAlign={"right"}>
                </GridItem>
            </Grid>
            <CheckTable isOpen={isOpen} columnsData={columns} />
        </div>
    )
}

export default Index
