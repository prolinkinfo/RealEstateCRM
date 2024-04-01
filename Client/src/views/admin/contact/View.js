import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import FolderTreeView from 'components/FolderTreeView/folderTreeView';
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { constant } from "constant";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BiLink, BiLogoLinkedin } from "react-icons/bi";
import { BsFillSendFill, BsFillTelephoneFill, BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { LuBuilding2 } from "react-icons/lu";
import { SiGooglemeet } from "react-icons/si";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import AddEmailHistory from "../emailHistory/components/AddEmail";
import AddMeeting from "../meeting/components/Addmeeting";
import AddPhoneCall from "../phoneCall/components/AddPhoneCall";
import AddTask from "../task/components/addTask";
import Add from "./Add";
import Edit from "./Edit";
import ColumnsTable from "./components/ColumnsTable";
import PhoneCall from "./components/phonCall";
import PropertyModel from "./components/propertyModel";
import PropertyTable from "./components/propertyTable";
import { HasAccess } from "../../../redux/accessUtils";
import MeetingColumnsTable from "../meeting/components/ColumnsTable";
import TaskColumnsTable from "../task/components/ColumnsTable";
import DataNotFound from "components/notFoundData";
import CustomView from "utils/customView";
import AddDocumentModal from "utils/addDocumentModal";
import CommonDeleteModel from "components/commonDeleteModel";
import { deleteApi } from "services/api";

const View = () => {

    const param = useParams()
    const textColor = useColorModeValue("gray.500", "white");

    const user = JSON.parse(localStorage.getItem("user"));
    const buttonbg = useColorModeValue("gray.200", "white");
    const [data, setData] = useState([])
    const [allData, setAllData] = useState([]);
    const [contactData, setContactData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [propertyModel, setPropertyModel] = useState(false);
    const [isLoding, setIsLoding] = useState(false)
    const [action, setAction] = useState(false)

    const [taskModel, setTaskModel] = useState(false);
    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);
    const [addMeeting, setMeeting] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [showMeetings, setShowMeetings] = useState(false);
    const [addDocument, setAddDocument] = useState(false);

    const size = "lg";
    const navigate = useNavigate()

    const [permission, callAccess, emailAccess, taskAccess, meetingAccess] = HasAccess(['Contacts', 'Calls', 'Emails', 'Tasks', 'Meetings']);

    const columnsDataColumns = [
        { Header: "sender", accessor: "senderName", },
        { Header: "recipient", accessor: "createByName", },
        { Header: "time stamp", accessor: "timestamp", },
        { Header: "Created", accessor: "createBy", },
    ];

    const PropertyColumn = [
        { Header: 'property Type', accessor: 'propertyType' },
        { Header: "property Address", accessor: "propertyAddress", },
        { Header: "listing Price", accessor: "listingPrice", },
        { Header: "square Footage", accessor: "squareFootage", },
        { Header: "year Built", accessor: "yearBuilt", },
    ];
    const textColumnsDataColumns = [
        { Header: "sender", accessor: "sender", },
        { Header: "recipient", accessor: "to", },
        { Header: "time stamp", accessor: "timestamp", },
        { Header: "Created", accessor: "createBy", },
    ];

    const MeetingColumns = [
        { Header: 'agenda', accessor: 'agenda' },
        { Header: "date Time", accessor: "dateTime", },
        { Header: "times tamp", accessor: "timestamp", },
        { Header: "create By", accessor: "createdByName", },
    ];
    const taskColumns = [
        { Header: 'Title', accessor: 'title' },
        { Header: "Category", accessor: "category", },
        { Header: "Assignment To", accessor: "assignmentToName", },
        { Header: "Start Date", accessor: "start", },
        { Header: "End Date", accessor: "end", },
    ];

    const download = async (data) => {
        if (data) {
            let result = await getApi(`api/document/download/`, data)
            if (result && result.status === 200) {
                window.open(`${constant.baseUrl}api/document/download/${data}`)
                toast.success('file Download successful')
            } else if (result && result.response.status === 404) {
                toast.error('file Not Found')
            }
        }
    }

    const fetchData = async () => {
        setIsLoding(true)
        let response = await getApi('api/contact/view/', param.id)
        setData(response.data?.contact);
        setAllData(response?.data);
        setIsLoding(false)
    }

    const handleDeleteContact=async(id)=>{
        try {
            setIsLoding(true)
            let response = await deleteApi('api/contact/delete/', id)
            if (response.status === 200) {
                setDelete(false)
                setAction((pre) => !pre)
                navigate('/contacts')
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [action])

    function toCamelCase(text) {
        return text?.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    const fetchCustomData = async () => {
        const response = await getApi('api/custom-field?moduleName=Contacts')
        setContactData(response.data)
    }

    useEffect(() => {
        if (fetchCustomData) fetchCustomData()
    }, [action])

    return (
        <>
            {isOpen && <Add isOpen={isOpen} size={size} onClose={onClose} contactData={contactData[0]} />}
            <Edit isOpen={edit} contactData={contactData[0]} size={size} onClose={setEdit} setAction={setAction} moduleId={contactData?.[0]?._id} />
            {/* <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/contact/delete/' id={param.id} /> */}
            <CommonDeleteModel isOpen={deleteModel} onClose={() => setDelete(false)} type='Contact' handleDeleteData={handleDeleteContact} ids={param.id} />
            <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={param.id} viewData={allData} lead="false" />

            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>
                    <Tabs >
                        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={1}>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <TabList sx={{
                                    width: '100%',
                                    overflowX: 'auto',
                                    border: "none",
                                    '& button:focus': { boxShadow: 'none', },
                                    '& button': {
                                        margin: { sm: "0 3px", md: "0 5px" }, padding: { sm: "5px", md: "8px" }, fontSize: { sm: "12px", md: "16px" }, border: '2px solid #8080803d', borderTopLeftRadius: "10px", borderTopRightRadius: "10px", borderBottom: 0
                                    },
                                    '& button[aria-selected="true"]': {
                                        border: "2px solid brand.200", borderBottom: 0, zIndex: '0'
                                    },
                                }} >
                                    <Tab >Information</Tab>
                                    {(emailAccess?.view || callAccess?.view || taskAccess?.view || meetingAccess?.view) && <Tab> Communication</Tab>}
                                    <Tab>Document</Tab>
                                    {/* <Tab>Social Media</Tab> */}
                                </TabList>

                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} mt={{ sm: "3px", md: "5px" }} >
                                <Flex justifyContent={"right"}>
                                    <Menu>
                                        {(user.role === 'superAdmin' || permission?.create || permission?.update || permission?.delete) && <MenuButton size="sm" variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                            Actions
                                        </MenuButton>}
                                        <MenuDivider />
                                        <MenuList minWidth={2}>
                                            {(user.role === 'superAdmin' || permission?.create) && <MenuItem alignItems={'start'} onClick={() => onOpen()} color={'blue'} icon={<AddIcon />}>Add</MenuItem>}
                                            {(user.role === 'superAdmin' || permission?.update) && <MenuItem alignItems={'start'} onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>}
                                            {(user.role === 'superAdmin' || permission?.delete) &&
                                                <>
                                                    <MenuDivider />
                                                    <MenuItem alignItems={'start'} onClick={() => setDelete(true)} color={'red'} icon={<DeleteIcon />}>Delete</MenuItem>
                                                </>
                                            }
                                        </MenuList>
                                    </Menu>
                                    <Link to="/contacts">
                                        <Button leftIcon={<IoIosArrowBack />} size="sm" variant="brand">
                                            Back
                                        </Button>
                                    </Link>
                                </Flex>
                            </GridItem>
                        </Grid>
                        <TabPanels>
                            <TabPanel pt={4} p={0}>
                                <CustomView data={contactData[0]} fieldData={data} toCamelCase={toCamelCase} />
                                <GridItem colSpan={{ base: 12 }} mt={4}>
                                    <Card >
                                        <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                            <GridItem colSpan={2}>
                                                <Box>
                                                    <Flex alignItems={'center'} mb={2} justifyContent={'space-between'}>
                                                        <Heading size="md">
                                                            Property of Interest({allData?.interestProperty?.interestProperty?.length})
                                                        </Heading>
                                                        <Button onClick={() => setPropertyModel(true)} leftIcon={<LuBuilding2 />} size="sm" colorScheme="gray" bg={buttonbg}>Select Interested Property  </Button>
                                                        <PropertyModel fetchData={fetchData} isOpen={propertyModel} onClose={setPropertyModel} id={param.id} interestProperty={data?.interestProperty} />
                                                    </Flex>
                                                    {/* <HSeparator / >  */}
                                                </Box>

                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        {/* {allData?.interestProperty?.interestProperty?.length > 0 && <PropertyTable fetchData={fetchData} columnsData={PropertyColumn} tableData={allData?.interestProperty?.interestProperty} title={'Interested Property'} / >} */}
                                                        <PropertyTable fetchData={fetchData} columnsData={PropertyColumn} tableData={allData?.interestProperty?.interestProperty?.length > 0 ? allData?.interestProperty?.interestProperty : []} title={'Interested Property'} />
                                                    </GridItem>
                                                </Grid>
                                            </GridItem>

                                        </Grid>
                                    </Card>
                                </GridItem>

                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 12 }} >
                                    <Grid templateColumns={{ base: "1fr" }} gap={4}>

                                        <Grid templateColumns={'repeat(12, 1fr)'} gap={4}>
                                            {emailAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <ColumnsTable viewData={allData} fetchData={fetchData} emailAccess={emailAccess} columnsData={columnsDataColumns} tableData={showEmail ? allData.EmailHistory : allData?.EmailHistory?.length > 0 ? [allData.EmailHistory[0]] : []} title={'Email '} />
                                                    {/* {(allData?.EmailHistory && allData?.EmailHistory?.length) ? <ColumnsTable fetchData={fetchData} emailAccess={emailAccess} columnsData={columnsDataColumns} tableData={showEmail ? allData.EmailHistory : [allData.EmailHistory[0]]} title={'Email '} /> : emailAccess?.create && <Button onClick={() => setAddEmailHistory(true)} leftIcon={<BsFillSendFill />} colorScheme="gray" size='sm'>Send Email </Button>}
                                                    <AddEmailHistory fetchData={fetchData} setAction={setAction} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={param.id} /> */}
                                                    {allData?.EmailHistory?.length > 1 &&
                                                        <div style={{ display: "flex", justifyContent: "end" }}>
                                                            <Button colorScheme="brand" variant="outline" size='sm' display="flex" justifyContant="end" onClick={() => showEmail ? setShowEmail(false) : setShowEmail(true)}>{showEmail ? "Show less" : "Show more"}</Button>
                                                        </div>}
                                                </Card>
                                            </GridItem>}
                                            {callAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <PhoneCall callAccess={callAccess} fetchData={fetchData} columnsData={columnsDataColumns} tableData={showCall ? allData?.phoneCallHistory : allData?.phoneCallHistory?.length > 0 ? [allData?.phoneCallHistory[0]] : []} title={'Call '} />
                                                    {/* {allData?.phoneCallHistory?.length > 0 ? <PhoneCall callAccess={callAccess} fetchData={fetchData} columnsData={columnsDataColumns} tableData={showCall ? allData?.phoneCallHistory : [allData?.phoneCallHistory[0]]} title={'Call '} /> : callAccess?.create && <Button onClick={() => setAddPhoneCall(true)} leftIcon={<BsFillTelephoneFill />} colorScheme="gray" size='sm'> Call </Button>} */}
                                                    <AddPhoneCall viewData={allData} fetchData={fetchData} setAction={setAction} isOpen={addPhoneCall} onClose={setAddPhoneCall} data={data?.contact} id={param.id} />
                                                    {allData?.phoneCallHistory?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" variant="outline" size='sm' display="flex" justifyContant="end" onClick={() => showCall ? setShowCall(false) : setShowCall(true)}>{showCall ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}
                                            {taskAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}><TaskColumnsTable fetchData={fetchData} columnsData={taskColumns} tableData={showTasks ? allData?.task : allData?.task?.length > 0 ? [allData?.task[0]] : []} title={'Task '} action={action} setAction={setAction} access={taskAccess} />
                                                    {/* {allData?.task?.length > 0 ? <TaskColumnsTable fetchData={fetchData} columnsData={taskColumns} tableData={showTasks ? allData?.task : [allData?.task[0]]} title={'Task '} action={action} setAction={setAction} access={taskAccess} /> : taskAccess?.create && <Button onClick={() => setTaskModel(true)} leftIcon={<AddIcon />} colorScheme="gray" size='sm'>Create Task</Button>} */}
                                                    <AddTask fetchData={fetchData} isOpen={taskModel} onClose={setTaskModel} from="contact" id={param.id} />
                                                    {allData?.task?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" variant="outline" size='sm' display="flex" justifyContant="end" onClick={() => showTasks ? setShowTasks(false) : setShowTasks(true)}>{showTasks ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}
                                            {meetingAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <MeetingColumnsTable fetchData={fetchData} columnsData={MeetingColumns} tableData={showMeetings ? allData?.meetingHistory : allData?.meetingHistory?.length > 0 ? [allData?.meetingHistory[0]] : []} title={'Meeting '} action={action} setAction={setAction} access={meetingAccess} />
                                                    {/* {allData?.meetingHistory?.length > 0 ? <MeetingColumnsTable fetchData={fetchData} columnsData={MeetingColumns} tableData={showMeetings ? allData?.meetingHistory : [allData?.meetingHistory[0]]} title={'Meeting '} action={action} setAction={setAction} access={meetingAccess} /> : meetingAccess?.create && <Button onClick={() => setMeeting(true)} leftIcon={<SiGooglemeet />} size='sm' colorScheme="gray" >Add Meeting </Button>} */}
                                                    <AddMeeting fetchData={fetchData} isOpen={addMeeting} onClose={setMeeting} from="contact" id={param.id} setAction={setAction} />
                                                    {allData?.meetingHistory?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" size='sm' variant="outline" display="flex" justifyContant="end" onClick={() => showMeetings ? setShowMeetings(false) : setShowMeetings(true)}>{showMeetings ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}
                                            {/* <GridItem colSpan={{ base: 2 }}>
                                                    {data?.textMsg?.length > 0 ? <PhoneCall text='true' fetchData={fetchData} columnsData={textColumnsDataColumns} tableData={data?.textMsg} title={'Text Msg '} /> : <Button onClick={() => navigate('/communication-integration')} leftIcon={<MdOutlineMessage />} colorScheme="gray" >send text Msg</Button>}
                                                </GridItem> */}
                                        </Grid>
                                    </Grid>
                                </GridItem>

                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 12 }} >
                                    <Card minH={'40vh'} >
                                        <Flex alignItems={'center'} justifyContent={'space-between'} mb='2'>
                                            <Heading size="md" mb={3}>
                                                Documents
                                            </Heading>
                                            <Button leftIcon={<AddIcon />} size='sm' variant='brand' onClick={() => setAddDocument(true)}>Add Document</Button>
                                        </Flex>
                                        <AddDocumentModal addDocument={addDocument} setAddDocument={setAddDocument} linkId={param.id} from="contact" setAction={setAction} />
                                        <HSeparator />
                                        <VStack mt={4} alignItems="flex-start">
                                            {allData?.Document?.length > 0 ? allData?.Document?.map((item) => (
                                                <FolderTreeView name={item.folderName} item={item}>
                                                    {item?.files?.map((file) => (
                                                        <FolderTreeView download={download} data={file} name={file.fileName} isFile from="contact" />
                                                    ))}
                                                </FolderTreeView>
                                            )) :
                                                <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                                    <DataNotFound />
                                                </Text>
                                            }

                                        </VStack>
                                    </Card>
                                </GridItem>
                            </TabPanel>

                            <TabPanel pt={4} p={0}>

                                <GridItem colSpan={{ base: 12 }} >
                                    <Card >
                                        <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                            <GridItem colSpan={2}>
                                                <Box>
                                                    <Heading size="md" mb={3}>
                                                        Social Media Profiles
                                                    </Heading>
                                                    <HSeparator />
                                                </Box>
                                            </GridItem>
                                            {data?.linkedInProfile || data?.facebookProfile || data?.twitterHandle || data?.otherProfiles ?
                                                <Grid templateColumns={'repeat(12, 1fr)'} gap={4} my={3} flexWrap={'wrap'} display={'flex'} justifyContent={'center'}>
                                                    {data?.linkedInProfile && <GridItem textAlign={'center'} colSpan={{ base: 2, md: 1 }}>
                                                        <a target='_blank' href={data?.linkedInProfile}>
                                                            <IconButton colorScheme="brand" aria-label="Call Fred" borderRadius="10px" size="md" icon={<BiLogoLinkedin />} />
                                                        </a>
                                                        <Text fontSize="sm" mt={2} fontWeight="bold" color={'blackAlpha.900'}> LinkedIn Profile  </Text>
                                                    </GridItem>}
                                                    {data?.facebookProfile && <GridItem textAlign={'center'} colSpan={{ base: 2, md: 1 }}>
                                                        <a target='_blank' href={`https://www.facebook.com/${data.facebookProfile}`}>
                                                            <IconButton colorScheme="brand" aria-label="Call Fred" borderRadius="10px" size="md" icon={<FaFacebook />} />
                                                        </a>
                                                        <Text fontSize="sm" mt={2} fontWeight="bold" color={'blackAlpha.900'}> Facebook Profile  </Text>
                                                    </GridItem>}
                                                    {data?.linkedInProfile && <GridItem textAlign={'center'} colSpan={{ base: 2, md: 1 }}>
                                                        <a target='_blank' href={`https://www.facebook.com/${data.facebookProfile}`}>
                                                            <IconButton colorScheme="brand" aria-label="Call Fred" borderRadius="10px" size="md" icon={<BsTwitter />} />
                                                        </a>
                                                        <Text fontSize="sm" mt={2} px={2} fontWeight="bold" color={'blackAlpha.900'}>Twitter Handle </Text>
                                                    </GridItem>}

                                                    {data?.linkedInProfile && <GridItem textAlign={'center'} colSpan={{ base: 2, md: 1 }}>
                                                        <a target='_blank' href={data?.otherProfiles}>
                                                            <IconButton colorScheme="brand" aria-label="Call Fred" borderRadius="10px" size="md" icon={<BiLink />} />
                                                        </a>
                                                        <Text fontSize="sm" mt={2} fontWeight="bold" color={'blackAlpha.900'}> Other Profiles  </Text>
                                                    </GridItem>}
                                                </Grid>
                                                :
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2 }} textAlign={'center'}>
                                                        <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700"> <DataNotFound /></Text>

                                                    </GridItem>
                                                </Grid>
                                            }
                                        </Grid>
                                    </Card>
                                </GridItem>

                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                    {(user.role === 'superAdmin' || (permission?.update || permission?.delete)) && <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    {permission?.update && <Button size="sm" onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>}
                                    {permission?.delete && <Button size="sm" style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>}
                </>}
        </>
    );
};

export default View;
