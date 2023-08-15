import Card from 'components/card/Card'
import CheckTable from './components/CheckTable'
import { Button, useDisclosure, Flex, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import AddTask from './components/addTask'
import CountUpComponent from "components/countUpComponent/countUpComponent"

const Task = (props) => {
    const { data, fetchData } = props
    const { isOpen, onOpen, onClose } = useDisclosure()

    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 5
        },
        { Header: 'Title', accessor: 'title' },
        { Header: "Category", accessor: "category", },
        { Header: "Assignment To", accessor: "assignmentToName", },
        { Header: "Start Date", accessor: "start", },
        { Header: "End Date", accessor: "end", },
    ];

    const handleClick = () => {
        onOpen()
    }

    // const [data, setData] = useState([])

    // const fetchData = async () => {
    //     let result = await getApi('api/task/');
    //     setData(result.data);
    // }

    // useEffect(() => {
    //     fetchData()
    // }, [])

    return (
        <div>
            <Card display={'flex'} mb={3} >
                <Flex alignItems={'center'} justifyContent={"space-between"} flexWrap={'wrap'}>
                    <Text
                        color={'secondaryGray.900'}
                        fontSize="22px"
                        fontWeight="700"
                        lineHeight="100%"
                    >
                        Task Table (<CountUpComponent targetNumber={data?.length} />)
                    </Text>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Create Task</Button>
                </Flex>
            </Card>

            <AddTask isOpen={isOpen} fetchData={fetchData} onClose={onClose} />
            <CheckTable columnsData={columns} data={data} />
        </div>
    )
}

export default Task
