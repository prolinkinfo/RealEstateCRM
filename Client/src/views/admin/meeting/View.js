import { useDisclosure, Box, Button, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import moment from "moment";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";

const View = () => {

    const param = useParams()

    const [data, setData] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))
    const size = "lg";

    const fetchData = async () => {
        let response = await getApi('api/meeting/view/', param.id)
        setData(response?.data);
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            {/* <Add isOpen={isOpen} size={size} onClose={onClose} /> */}
            {/* <Edit isOpen={edit} size={size} onClose={setEdit} /> */}
            {/* <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/user/delete/' id={param.id} /> */}

            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} >
                    <Flex justifyContent={'right'} >
                        {/* <Menu> */}
                        {/* <MenuButton variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}> */}
                        {/* Actions */}
                        {/* </MenuButton> */}
                        {/* <MenuDivider /> */}
                        {/* <MenuList> */}
                        {/* <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem> */}
                        {/* <MenuDivider /> */}
                        {/* <MenuItem onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem> */}
                        {/* </MenuList> */}
                        {/* </Menu> */}
                        <Link to="/metting">
                            <Button leftIcon={<IoIosArrowBack />} variant="brand">
                                Back
                            </Button>
                        </Link>
                    </Flex>
                </GridItem>
            </Grid>


            <Grid templateColumns="repeat(4, 1fr)" gap={3}>

                <GridItem colSpan={{ base: 4 }}>
                    <Card >
                        <Grid templateColumns={{ base: "1fr" }} gap={4}>
                            <GridItem colSpan={2}>
                                <Box>
                                    <Heading size="md" mb={3}>
                                        Metting View page
                                    </Heading>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Agenda </Text>
                                    <Text>{data?.agenda ? data?.agenda : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Created By </Text>
                                    <Text>{data?.createdByName ? data?.createdByName : ' - '}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> DateTime </Text>
                                    <Text> {data?.dateTime ? moment(data?.dateTime).format('DD-MM-YYYY  h:mma ') : ' - '} [{data?.dateTime ? moment(data?.dateTime).toNow() : ' - '}]</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Timestamp </Text>
                                    <Text> {data?.timestamp ? moment(data?.timestamp).format('DD-MM-YYYY  h:mma ') : ' - '} [{data?.timestamp ? moment(data?.timestamp).toNow() : ' - '}]</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Location </Text>
                                    <Text>{data?.location ? data?.location : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>  Notes </Text>
                                    <Text>{data?.notes ? data?.notes : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Attendes </Text>
                                    {data?.attendes ? data?.attendes.map((item) => {
                                        return (
                                            <Link to={user?.role !== 'admin' ? `/contactView/${item._id}` : `/admin/contactView/${item._id}`}>
                                                <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{item.email}</Text>
                                            </Link>
                                        )
                                    }) : '-'}
                                </GridItem>
                            </Grid>
                        </Grid>
                    </Card>
                </GridItem>

            </Grid>
            {/* <Card mt={3}>
                <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                    <GridItem colStart={6} >
                        <Flex justifyContent={"right"}>
                            <Button onClick={() => setEdit(true)} leftIcon={<EditIcon />} variant="outline" colorScheme="green">Edit</Button>
                            <Button style={{ background: 'red.800' }} ml={2.5} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>
                        </Flex>
                    </GridItem>
                </Grid>
            </Card> */}
        </>
    );
};

export default View;
