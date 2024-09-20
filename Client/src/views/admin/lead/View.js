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
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi } from "services/api";
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
import CommonCheckTable from "components/reactTable/checktable";
import moment from 'moment';
import AddEdit from '../task/components/AddEdit'
import { useDispatch, useSelector } from "react-redux";
import { fetchLeadCustomFiled } from "../../../redux/slices/leadCustomFiledSlice";
import { FaFilePdf } from "react-icons/fa";
import html2pdf from "html2pdf.js";

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
    // const [leadData, setLeadData] = useState([])
    const [selectedTab, setSelectedTab] = useState(0);
    const [taskModel, setTaskModel] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const size = "lg";

    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);

    const leadData = useSelector((state) => state?.leadCustomFiled?.data.data)

    const [permission, taskPermission, meetingPermission, callAccess, emailAccess, taskAccess, meetingAccess] = HasAccess(['Leads', 'Tasks', 'Meetings', 'Calls', 'Emails', 'Tasks', 'Meetings']);


    const columnsDataColumns = [
        { Header: "sender", accessor: "senderName", },
        {
            Header: "recipient", accessor: "createByName", cell: (cell) => (
                <Link to={`/Email/${cell?.row?.original?._id}`}>
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value || ' - '}
                    </Text></Link>)
        },
        {
            Header: "time stamp", accessor: "timestamp",
            cell: (cell) => (
                <div className="selectOpt">
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {moment(cell?.value).fromNow()}
                    </Text>
                </div>
            )
        },
        {
            Header: "Created", accessor: "createBy",
            cell: (cell) => (
                <div className="selectOpt">
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {moment(cell?.row?.values.timestamp).format('h:mma (DD/MM)')}
                    </Text>
                </div>
            )
        },
    ];
    const callColumns = [
        { Header: "sender", accessor: "senderName", },
        {
            Header: "recipient", accessor: "createByName", cell: (cell) => (
                <Link to={`/phone-call/${cell?.row?.original?._id}`}>
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value || ' - '}
                    </Text></Link>)
        },
        {
            Header: "time stamp", accessor: "timestamp",
            cell: (cell) => (
                <div className="selectOpt">
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {moment(cell?.value).fromNow()}
                    </Text>
                </div>
            )
        },
        {
            Header: "Created", accessor: "createBy",
            cell: (cell) => (
                <div className="selectOpt">
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {moment(cell?.row?.values.timestamp).format('h:mma (DD/MM)')}
                    </Text>
                </div>
            )
        },
    ];
    const MeetingColumns = [
        {
            Header: 'Agenda', accessor: 'agenda', cell: (cell) => (
                <Link to={`/metting/${cell?.row?.original?._id}`}>
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value || ' - '}
                    </Text></Link>)
        },
        { Header: "date Time", accessor: "dateTime", },
        {
            Header: "times tamp", accessor: "timestamp",
            cell: (cell) => (
                <div className="selectOpt">
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {moment(cell?.value).fromNow()}
                    </Text>
                </div>
            )
        },
        { Header: "create By", accessor: "createdByName", },
    ];
    const taskColumns = [
        {
            Header: 'Title', accessor: 'title', type: 'text', formikType: '', cell: (cell) => (
                <div className="selectOpt">
                    <Text
                        onClick={() => navigate(`/view/${cell?.row?.original._id}`)}
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value}
                    </Text>
                </div>
            )
        },
        { Header: "Category", accessor: "category", },
        { Header: "Assign To", accessor: "assignToName", },
        { Header: "Start Date", accessor: "start", },
        { Header: "End Date", accessor: "end", },
    ];


    const handleTabChange = (index) => {
        setSelectedTab(index);
    };
    const generatePDF = () => {
        const element = document.getElementById("reports");
        if (element) {
            element.style.display = 'block';
            element.style.width = '100%'; // Adjust width for mobile
            element.style.height = 'auto';
            // setTimeout(() => {
            html2pdf()
                .from(element)
                .set({
                    margin: [0, 0, 0, 0],
                    filename: `Lead_Details_${moment().format("DD-MM-YYYY")}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
                })
                .save().then(() => {
                    element.style.display = '';
                })
            // }, 500);
        } else {
            console.error("Element with ID 'reports' not found.");
        }
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
        dispatch(fetchLeadCustomFiled());
    }, [action])


    function toCamelCase(text) {
        return text?.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    const firstValue = Object?.values(param)[0];
    const splitValue = firstValue?.split('/')

    return (
        <>

            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> :
                <>
                    <Heading size="lg" mt={0} m={3}>
                        {data?.leadName || ""}
                    </Heading>
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
                                            {(user.role === 'superAdmin' || permission?.create) && <MenuItem color={'blue'} onClick={() => onOpen()} alignItems={"start"} icon={<AddIcon />}  >Add</MenuItem>}
                                            {(user.role === 'superAdmin' || permission?.update) && <MenuItem onClick={() => setEdit(true)} alignItems={"start"} icon={<EditIcon />}>Edit</MenuItem>}
                                            <MenuItem onClick={generatePDF} alignItems={"start"} icon={<FaFilePdf />} display={"flex"} style={{ alignItems: "center" }}>Print as PDF</MenuItem >
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
                                <CustomView data={leadData?.[0]} fieldData={data} toCamelCase={toCamelCase} moduleId={leadData?.[0]?._id} fetchData={fetchData} id="reports" />
                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 4 }} >
                                    <Grid overflow={'hidden'} templateColumns={{ base: "1fr" }} gap={4}>
                                        <Grid templateColumns={'repeat(12, 1fr)'} gap={4}>
                                            {emailAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card >
                                                    <CommonCheckTable
                                                        title={"Email"}
                                                        isLoding={isLoding}
                                                        columnData={columnsDataColumns ?? []}
                                                        // dataColumn={columnsDataColumns ?? []}
                                                        allData={showEmail ? allData.Email : allData?.Email?.length > 0 ? [allData.Email[0]] : []}
                                                        tableData={showEmail ? allData.Email : allData?.Email?.length > 0 ? [allData.Email[0]] : []}
                                                        AdvanceSearch={false}
                                                        dataLength={allData?.Email?.length}
                                                        tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setAddEmailHistory(true)}
                                                        access={emailAccess}
                                                    />
                                                    {allData?.Email?.length > 1 &&
                                                        <div style={{ display: "flex", justifyContent: "end" }}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" display="flex" justifyContant="end" onClick={() => showEmail ? setShowEmail(false) : setShowEmail(true)}>{showEmail ? "Show less" : "Show more"}</Button>
                                                        </div>}
                                                </Card>
                                            </GridItem>}
                                            {callAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card>
                                                    <CommonCheckTable
                                                        title={"Call"}
                                                        isLoding={isLoding}
                                                        columnData={callColumns ?? []}
                                                        // dataColumn={callColumns ?? []}
                                                        allData={showCall ? allData?.phoneCall : allData?.phoneCall?.length > 0 ? [allData?.phoneCall[0]] : []}
                                                        tableData={showCall ? allData?.phoneCall : allData?.phoneCall?.length > 0 ? [allData?.phoneCall[0]] : []}
                                                        AdvanceSearch={false}
                                                        dataLength={allData?.phoneCall?.length}
                                                        tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setAddPhoneCall(true)}
                                                        access={callAccess}
                                                    />
                                                    {allData?.phoneCall?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button size="sm" colorScheme="brand" variant="outline" display="flex" justifyContant="end" onClick={() => showCall ? setShowCall(false) : setShowCall(true)}>{showCall ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}
                                            {taskAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card >
                                                    <CommonCheckTable
                                                        title={"Task"}
                                                        isLoding={isLoding}
                                                        columnData={taskColumns ?? []}
                                                        // dataColumn={taskColumns ?? []}
                                                        allData={showTasks ? allData?.task : allData?.task?.length > 0 ? [allData?.task[0]] : []}
                                                        tableData={showTasks ? allData?.task : allData?.task?.length > 0 ? [allData?.task[0]] : []}
                                                        dataLength={allData?.task?.length}
                                                        AdvanceSearch={false}
                                                        tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setTaskModel(true)}
                                                        access={taskAccess}
                                                    />
                                                    {
                                                        allData?.task?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" display="flex" justifyContant="end" onClick={() => showTasks ? setShowTasks(false) : setShowTasks(true)}>{showTasks ? "Show less" : "Show more"}</Button>
                                                        </div>}
                                                </Card>
                                            </GridItem>}

                                            {meetingAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <CommonCheckTable
                                                        title={"Meeting"}
                                                        isLoding={isLoding}
                                                        columnData={MeetingColumns ?? []}
                                                        // dataColumn={MeetingColumns ?? []}
                                                        allData={showMeetings ? allData?.meeting : allData?.meeting?.length > 0 ? [allData?.meeting[0]] : []}
                                                        tableData={showMeetings ? allData?.meeting : allData?.meeting?.length > 0 ? [allData?.meeting[0]] : []}
                                                        AdvanceSearch={false}
                                                        dataLength={allData?.meeting?.length} tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setMeeting(true)}
                                                        access={meetingAccess}
                                                    />

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
            {isOpen && <Add isOpen={isOpen} size={size} onClose={onClose} leadData={leadData?.[0]} setAction={setAction} />}
            <Edit isOpen={edit} size={size} onClose={setEdit} leadData={leadData?.[0]} setAction={setAction} moduleId={leadData?.[0]?._id} data={data} />
            <AddMeeting fetchData={fetchData} isOpen={addMeeting} leadContect={splitValue?.[0]} onClose={setMeeting} from="contact" id={param.id} setAction={setAction} view={true} />
            <AddEdit isOpen={taskModel} fetchData={fetchData} leadContect={splitValue?.[0]} onClose={setTaskModel} id={param.id} userAction={'add'} view={true} />
            <AddPhoneCall viewData={allData} fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} setAction={setAction} data={data?.contact} id={param.id} lead={true} LData={data} />
            <AddEmailHistory lead={true} leadEmail={allData?.lead?.leadEmail} fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={param.id} />
            <AddDocumentModal addDocument={addDocument} setAddDocument={setAddDocument} linkId={param.id} from="lead" setAction={setAction} fetchData={fetchData} />
            <CommonDeleteModel isOpen={deleteModel} onClose={() => setDelete(false)} type='Lead' handleDeleteData={handleDeleteLead} ids={param.id} />
        </>
    );
};

export default View;
