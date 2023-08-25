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
        let response = await getApi('api/email/view/', param.id)
        setData(response?.data);
    }
    useEffect(() => {
        fetchData()
    }, [])
    // edit

    return (
        <>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} >
                    <Flex justifyContent={'right'} >
                        <Link to={"/email"}>
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
                                        Email View page
                                    </Heading>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Sender </Text>
                                    <Text>{data?.senderEmail ? data?.senderEmail : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Recipient </Text>
                                    <Text>{data?.recipient ? data?.recipient : ' - '}</Text>
                                </GridItem>
                                {/* <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Cc </Text>
                                    <Text>{data?.cc ? data?.cc : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Bcc </Text>
                                    <Text>{data?.bcc ? data?.bcc : ' - '}</Text>
                                </GridItem> */}
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Create From </Text>
                                    <Link to={data?.createBy ? user?.role !== 'admin' ? `/contactView/${data?.createBy}` : `/admin/contactView/${data?.createBy}` : user?.role !== 'admin' ? `/leadView/${data?.createByLead}` : `/admin/leadView/${data?.createByLead}`}>
                                        <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.createByName ? data?.createByName : ' - '}</Text>
                                    </Link>
                                </GridItem>
                                <GridItem colSpan={{ base: 2, md: 1 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Timestamp </Text>
                                    <Text> {data?.timestamp ? moment(data?.timestamp).format('DD-MM-YYYY  h:mma ') : ' - '} [{data?.timestamp ? moment(data?.timestamp).toNow() : ' - '}]</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Subject </Text>
                                    <Text>{data?.subject ? data?.subject : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 2 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Message </Text>
                                    <Text>{data?.message ? data?.message : ' - '}</Text>
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
