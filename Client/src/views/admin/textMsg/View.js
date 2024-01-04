import { Box, Button, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
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
    const user = JSON.parse(localStorage.getItem("user"))

    const fetchData = async () => {
        let response = await getApi('api/text-msg/view/', param.id)
        setData(response?.data);
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>

            <Grid templateColumns="repeat(4, 1fr)" gap={3}>


                <GridItem colSpan={{ base: 4 }}>
                    <Card >
                        <Grid templateColumns={{ base: "1fr" }} gap={4}>
                            <GridItem colSpan={2}>
                                <Box>
                                    <Heading size="md" mb={3}>
                                        Text Msg View page
                                    </Heading>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Sender </Text>
                                    <Text>{data?.senderName ? data?.senderName : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> To </Text>
                                    <Text>{data?.to ? data?.to : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Create to </Text>
                                    <Link to={`/contactView/${data?.createFor}`}>
                                        <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.createByName ? data?.createByName : ' - '}</Text>
                                    </Link>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Timestamp </Text>
                                    <Text> {data?.timestamp ? moment(data?.timestamp).format('DD-MM-YYYY  h:mma ') : ' - '} [{data?.timestamp ? moment(data?.timestamp).toNow() : ' - '}]</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Message </Text>
                                    <pre style={{ whiteSpace: 'pre-wrap' }}>{data?.message ? data?.message : ' - '}</pre>
                                </GridItem>
                            </Grid>
                        </Grid>
                    </Card>
                </GridItem>

            </Grid>
        </>
    );
};

export default View;
