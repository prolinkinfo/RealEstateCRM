import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Button, Flex, Grid, GridItem, Heading, Menu, MenuButton, MenuDivider, MenuItem, MenuList,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import FolderTreeView from 'components/FolderTreeView/folderTreeView';
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { constant } from "constant";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import ColumnsTable from "../contact/components/ColumnsTable";
import TaskColumnsTable from "../task/components/ColumnsTable";
import PhoneCall from "../contact/components/phonCall";
import AddEmailHistory from "../emailHistory/components/AddEmail";
import AddMeeting from "../meeting/components/Addmeeting";
import AddPhoneCall from "../phoneCall/components/AddPhoneCall";
import Add from "./Add";
import Edit from "./Edit";
import { HasAccess } from "../../../redux/accessUtils";
import DataNotFound from "components/notFoundData";
import CustomView from "utils/customView";
import AddDocumentModal from "utils/addDocumentModal";
import CommonDeleteModel from "components/commonDeleteModel";
import { deleteApi } from "services/api";
import MeetingColumnsTable from "../meeting/components/ColumnsTable";

const View = () => {

    const param = useParams()

    const user = JSON.parse(localStorage.getItem("user"));

    const textColor = useColorModeValue("gray.500", "white");

    const [data, setData] = useState()
    const [allData, setAllData] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [isLoding, setIsLoding] = useState(false)
    const [addMeeting, setMeeting] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [showMeetings, setShowMeetings] = useState(false);
    const [addDocument, setAddDocument] = useState(false);
    const [action, setAction] = useState(false)
    const [leadData, setLeadData] = useState([])
    const [selectedTab, setSelectedTab] = useState(0);

    const navigate = useNavigate();
    const size = "lg";

    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);

    const [permission, taskPermission, meetingPermission, callAccess, emailAccess, taskAccess, meetingAccess] = HasAccess(['Leads', 'Tasks', 'Meetings', 'Calls', 'Emails', 'Tasks', 'Meetings']);


    const columnsDataColumns = [
        { Header: "sender", accessor: "senderName", },
        { Header: "recipient", accessor: "createByName", },
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
        { Header: "Assign To", accessor: "assignToName", },
        { Header: "Start Date", accessor: "start", },
        { Header: "End Date", accessor: "end", },
    ];


    const handleTabChange = (index) => {
        setSelectedTab(index);
    };

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

    const fetchData = async (i) => {
        setIsLoding(true)
        let response = await getApi('api/lead/view/', param.id)
        setData(response.data?.lead);
        setAllData(response.data);
        setIsLoding(false)
        setSelectedTab(i)
    }

    const handleDeleteLead = async (id) => {
        try {
            setIsLoding(true)
            let response = await deleteApi('api/lead/delete/', id)
            if (response.status === 200) {
                setDelete(false)
                setAction((pre) => !pre)
                navigate('/lead')
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
        const response = await getApi('api/custom-field?moduleName=Leads')
        setLeadData(response.data)
    }

    useEffect(() => {
        if (fetchCustomData) fetchCustomData()
    }, [action])


    return (
        <>
            {isOpen && <Add isOpen={isOpen} size={size} onClose={onClose} setLeadData={setLeadData} leadData={leadData[0]} setAction={setAction} />}
            <Edit isOpen={edit} size={size} onClose={setEdit} setLeadData={setLeadData} leadData={leadData[0]} setAction={setAction} moduleId={leadData?.[0]?._id} />

            <CommonDeleteModel isOpen={deleteModel} onClose={() => setDelete(false)} type='Lead' handleDeleteData={handleDeleteLead} ids={param.id} />

            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> :
                <>
                    <Tabs onChange={handleTabChange} index={selectedTab}>
                        <Grid templateColumns={'repeat(12, 1fr)'} mb={3} gap={1}>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <TabList sx={{
                                    border: "none",
                                    '& button:focus': { boxShadow: 'none', },
                                    '& button': {
                                        margin: { sm: "0 3px", md: "0 5px" }, padding: { sm: "5px", md: "8px" }, border: '2px solid #8080803d', borderTopLeftRadius: "10px", borderTopRightRadius: "10px", borderBottom: 0, fontSize: { sm: "12px", md: "16px" }
                                    },
                                    '& button[aria-selected="true"]': {
                                        border: "2px solid brand.200", borderBottom: 0, zIndex: '0'
                                    },
                                }} >
                                    <Tab>Information</Tab>
                                    {(emailAccess?.view || callAccess?.view || taskAccess?.view || meetingAccess?.view) && <Tab> Communication</Tab>}
                                    <Tab>Document</Tab>
                                </TabList>

                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} mt={{ sm: "3px", md: "5px" }} >
                                <Flex justifyContent={"right"}>
                                    <Menu>
                                        {(user.role === 'superAdmin' || (permission?.create || permission?.update || permission?.delete)) && <MenuButton size="sm" variant="outline" colorScheme='blackAlpha' mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                            Actions
                                        </MenuButton>}
                                        <MenuDivider />
                                        <MenuList minWidth={2}>
                                            {(user.role === 'superAdmin' || permission?.create) && <MenuItem color={'blue'} onClick={() => onOpen()} alignItems={"start"} icon={<AddIcon />}>Add</MenuItem>}
                                            {(user.role === 'superAdmin' || permission?.update) && <MenuItem onClick={() => setEdit(true)} alignItems={"start"} icon={<EditIcon />}>Edit</MenuItem>}
                                            {(user.role === 'superAdmin' || permission?.delete) && <>
                                                <MenuDivider />
                                                <MenuItem alignItems={"start"} color={'red'} onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                            </>}
                                        </MenuList>
                                    </Menu>
                                    <Link to="/lead">
                                        <Button leftIcon={<IoIosArrowBack />} size='sm' variant="brand">
                                            Back
                                        </Button>
                                    </Link>
                                </Flex>
                            </GridItem>
                        </Grid>

                        <TabPanels>
                            <TabPanel pt={4} p={0}>
                                <CustomView data={leadData[0]} fieldData={data} toCamelCase={toCamelCase} />
                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 4 }} >
                                    <Grid overflow={'hidden'} templateColumns={{ base: "1fr" }} gap={4}>
                                        <Grid templateColumns={'repeat(12, 1fr)'} gap={4}>
                                            {emailAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card >
                                                    <ColumnsTable fetchData={fetchData} viewData={allData} emailAccess={emailAccess} columnsData={columnsDataColumns} lead='true' tableData={showEmail ? allData.Email : allData?.Email?.length > 0 ? [allData.Email[0]] : []} title={'Email '} />

                                                    <AddEmailHistory viewData={allData} fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} data={data?.contact} setAction={setAction} lead='true' id={param.id} />
                                                    {allData.Email?.length > 1 &&
                                                        <div style={{ display: "flex", justifyContent: "end" }}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" display="flex" justifyContant="end" onClick={() => showEmail ? setShowEmail(false) : setShowEmail(true)}>{showEmail ? "Show less" : "Show more"}</Button>
                                                        </div>}
                                                </Card>
                                            </GridItem>}
                                            {callAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card>
                                                    <PhoneCall callAccess={callAccess} fetchData={fetchData} columnsData={columnsDataColumns} lead='true' tableData={showCall ? allData?.phoneCall : allData?.phoneCall?.length > 0 ? [allData?.phoneCall[0]] : []} title={'Call '} />
                                                    {allData?.phoneCall?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button size="sm" colorScheme="brand" variant="outline" display="flex" justifyContant="end" onClick={() => showCall ? setShowCall(false) : setShowCall(true)}>{showCall ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                    <AddPhoneCall viewData={allData} fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} setAction={setAction} data={data?.contact} id={param.id} lead='true' />
                                                </Card>
                                            </GridItem>}
                                            {taskAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card >
                                                    <TaskColumnsTable fetchData={fetchData} columnsData={taskColumns} lead='true' tableData={showTasks ? allData?.task : allData?.task?.length > 0 ? [allData?.task[0]] : []} title={'Task '} action={action} setAction={setAction} access={taskAccess} />
                                                    {
                                                        allData?.task?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" display="flex" justifyContant="end" onClick={() => showTasks ? setShowTasks(false) : setShowTasks(true)}>{showTasks ? "Show less" : "Show more"}</Button>
                                                        </div>}
                                                </Card>
                                            </GridItem>}

                                            {meetingAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <MeetingColumnsTable fetchData={fetchData} columnsData={MeetingColumns} tableData={showMeetings ? allData?.meeting : allData?.meeting?.length > 0 ? [allData?.meeting[0]] : []} title={'Meeting '} action={action} setAction={setAction} access={meetingAccess} />
                                                    <AddMeeting fetchData={fetchData} isOpen={addMeeting} onClose={setMeeting} from="contact" id={param.id} setAction={setAction} />
                                                    {allData?.meeting?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" size='sm' variant="outline" display="flex" justifyContant="end" onClick={() => showMeetings ? setShowMeetings(false) : setShowMeetings(true)}>{showMeetings ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}
                                        </Grid>
                                    </Grid>
                                </GridItem>
                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 4 }} >
                                    <Card minH={'50vh'} >
                                        <Flex alignItems={'center'} justifyContent={'space-between'} mb='2'>
                                            <Heading size="md" mb={3}>
                                                Documents
                                            </Heading>
                                            <Button leftIcon={<AddIcon />} size='sm' variant='brand' onClick={() => setAddDocument(true)}>Add Document</Button>
                                        </Flex>
                                        <AddDocumentModal addDocument={addDocument} setAddDocument={setAddDocument} linkId={param.id} from="lead" setAction={setAction} fetchData={fetchData} />
                                        <HSeparator />
                                        <VStack mt={4} alignItems="flex-start">
                                            {allData?.Document?.length > 0 ? allData?.Document?.map((item) => (
                                                <FolderTreeView name={item.folderName} item={item}>
                                                    {item?.files?.map((file) => (
                                                        <FolderTreeView download={download} data={file} name={file.fileName} isFile from="lead" />
                                                    ))}
                                                </FolderTreeView>
                                            )) : <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                                <DataNotFound />
                                            </Text>}
                                        </VStack>
                                    </Card>
                                </GridItem>
                            </TabPanel>

                        </TabPanels>
                    </Tabs>
                    {(user.role === 'superAdmin' || (permission?.update || permission?.delete)) && <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    {(user.role === 'superAdmin' || permission?.update) ? <Button size='sm' onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button> : ''}
                                    {(user.role === 'superAdmin' || permission?.delete) ? <Button size='sm' style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button> : ''}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>
                    }
                </>
            }
        </>
    );
};

export default View;
