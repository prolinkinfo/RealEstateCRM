import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useDisclosure, Box, Button, Flex, Grid, GridItem, Heading, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";
import Add from "./Add";
import Edit from "./Edit";
import Delete from "./Delete";


const View = () => {

    const param = useParams()

    const [data, setData] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);

    const size = "lg";


    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);

    const fetchData = async () => {
        let response = await getApi('api/lead/view/', param.id)
        setData(response.data);
    }
    useEffect(() => {
        fetchData()
    }, [edit, addEmailHistory, addPhoneCall])

    return (
        <>
            <Add isOpen={isOpen} size={size} onClose={onClose} />
            <Edit isOpen={edit} size={size} onClose={setEdit} />
            <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/lead/delete/' id={param.id} />

            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} >
                    <Flex justifyContent={"right"}>
                        <Menu>
                            <MenuButton variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                Actions
                            </MenuButton>
                            <MenuDivider />
                            <MenuList>
                                <MenuItem onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>
                                <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>
                                <MenuDivider />
                                <MenuItem onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                            </MenuList>
                        </Menu>
                        <Link to="/lead">
                            <Button leftIcon={<IoIosArrowBack />} variant="brand">
                                Back
                            </Button>
                        </Link>
                    </Flex>
                </GridItem>
            </Grid>

            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                    <Card >
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                            <GridItem colSpan={12}>
                                <Box>
                                    <Heading size="md" mb={3}>
                                        Basic Lead Information
                                    </Heading>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Name</Text>
                                <Text>{data?.leadName ? data?.leadName : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Email</Text>
                                <Text>{data?.leadEmail ? data?.leadEmail : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead PhoneNumber</Text>
                                <Text>{data?.leadPhoneNumber ? data?.leadPhoneNumber : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Address</Text>
                                <Text>{data?.leadAddress ? data?.leadAddress : 'N/A'}</Text>
                            </GridItem>
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                    <Card >
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                            <GridItem colSpan={12}>
                                <Box>
                                    <Heading size="md" mb={3}>
                                        Lead Assignment and Ownership
                                    </Heading>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Assigned Agent</Text>
                                <Text>{data?.leadAssignedAgent ? data?.leadAssignedAgent : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Assigned Agent</Text>
                                <Text>{data?.leadAssignedAgent ? data?.leadAssignedAgent : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Communication Preferences</Text>
                                <Text>{data?.leadCommunicationPreferences ? data?.leadCommunicationPreferences : 'N/A'}</Text>
                            </GridItem>
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                    <Card >
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                            <GridItem colSpan={12}>
                                <Box>
                                    <Heading size="md" mb={3}>
                                        Lead Source and Details
                                    </Heading>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source </Text>
                                <Text>{data?.leadSource ? data?.leadSource : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Status </Text>
                                <Text>{data?.leadStatus ? data?.leadStatus : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Details </Text>
                                <Text>{data?.leadSourceDetails ? data?.leadSourceDetails : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Campaign </Text>
                                <Text>{data?.leadCampaign ? data?.leadCampaign : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Channel </Text>
                                <Text>{data?.leadSourceChannel ? data?.leadSourceChannel : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Medium </Text>
                                <Text>{data?.leadSourceMedium ? data?.leadSourceMedium : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Campaign </Text>
                                <Text>{data?.leadSourceCampaign ? data?.leadSourceCampaign : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Sourc eReferral </Text>
                                <Text>{data?.leadSourceReferral ? data?.leadSourceReferral : 'N/A'}</Text>
                            </GridItem>
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                    <Card >
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                            <GridItem colSpan={12}>
                                <Box>
                                    <Heading size="md" mb={3}>
                                        Lead Dates and Follow-up
                                    </Heading>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead FollowUp Status </Text>
                                <Text>{data?.leadFollowUpStatus ? data?.leadFollowUpStatus : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Creation Date </Text>
                                <Text>{moment(data?.leadCreationDate).format('L')}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Conversion Date </Text>
                                <Text>{moment(data?.leadConversionDate).format('L')}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">  Lead FollowUp Date </Text>
                                <Text>{moment(data?.leadFollowUpDate).format('L')}</Text>
                            </GridItem>
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                    <Card >
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                            <GridItem colSpan={12}>
                                <Box>
                                    <Heading size="md" mb={3}>
                                        Lead Scoring and Nurturing
                                    </Heading>
                                    <HSeparator />
                                </Box>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Score </Text>
                                <Text>{data?.leadScore ? data?.leadScore : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Nurturing Workflow </Text>
                                <Text>{data?.leadNurturingWorkflow ? data?.leadNurturingWorkflow : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Engagement Level </Text>
                                <Text>{data?.leadEngagementLevel ? data?.leadEngagementLevel : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Conversion Rate </Text>
                                <Text>{data?.leadConversionRate ? data?.leadConversionRate : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Nurturing Stage </Text>
                                <Text>{data?.leadNurturingStage ? data?.leadNurturingStage : 'N/A'}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Next Action </Text>
                                <Text>{data?.leadNextAction ? data?.leadNextAction : 'N/A'}</Text>
                            </GridItem>
                        </Grid>
                    </Card>
                </GridItem>
            </Grid>
            <Card mt={3}>
                <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                    <GridItem colStart={6} >
                        <Flex justifyContent={"right"}>
                            <Button onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>
                            <Button style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>
                        </Flex>
                    </GridItem>
                </Grid>
            </Card>
        </>
    );
};

export default View;
