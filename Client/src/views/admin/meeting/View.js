import { Box, Button, Flex, Grid, GridItem, Heading, Text, useDisclosure } from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
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
    const [isLoding, setIsLoding] = useState(false)


    const fetchData = async () => {
        setIsLoding(true)
        let response = await getApi('api/meeting/view/', param.id)
        setData(response?.data);
        setIsLoding(false)
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>

            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>

                    <Grid templateColumns="repeat(4, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 4 }}>
                            <Card >
                                <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                    <GridItem colSpan={2}>
                                        <Box>
                                            <Heading size="md" mb={3}>
                                                Meeting View page
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
                                            {data?.related === 'contact' ? data?.attendes && data?.attendes.map((item) => {
                                                return (
                                                    <Link to={user?.role !== 'admin' ? `/contactView/${item._id}` : `/admin/contactView/${item._id}`}>
                                                        <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{item.firstName + ' ' + item.lastName}</Text>
                                                    </Link>
                                                )
                                            }) : data?.related === 'lead' ? data?.attendesLead && data?.attendesLead.map((item) => {
                                                return (
                                                    <Link to={user?.role !== 'admin' ? `/leadView/${item._id}` : `/admin/leadView/${item._id}`}>
                                                        <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{item.leadName}</Text>
                                                    </Link>
                                                )
                                            }) : '-'}
                                        </GridItem>
                                    </Grid>
                                </Grid>
                            </Card>
                        </GridItem>

                    </Grid>


                </>}

        </>
    );
};

export default View;
