import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import AddMeeting from "./components/Addmeeting";


const Index = () => {
    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        { Header: 'agenda', accessor: 'agenda' },
        { Header: "date Time", accessor: "dateTime", },
        { Header: "times tamp", accessor: "timestamp", },
        { Header: "create By", accessor: "createdByName", },

    ];

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))

    const fetchData = async () => {
        let result = await getApi(user.role === 'admin' ? 'api/meeting' : `api/meeting?createdBy=${user._id}`);
        setData(result?.data);
    }

    const [addMeeting, setMeeting] = useState(false);

    useEffect(() => {
        fetchData()
    }, [addMeeting])

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => setMeeting(true)} leftIcon={<AddIcon />} variant="brand">Add</Button>
                </GridItem>
            </Grid>

            {/* <CheckTable columnsData={columns} tableData={data} /> */}
            <CheckTable isOpen={addMeeting} data={data} columnsData={columns} />
            {/* Add Form */}
            <AddMeeting isOpen={addMeeting} onClose={setMeeting} />
        </div>
    )
}

export default Index
