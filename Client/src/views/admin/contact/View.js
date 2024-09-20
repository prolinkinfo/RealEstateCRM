import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import FolderTreeView from 'components/FolderTreeView/folderTreeView';
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { constant } from "constant";
import { useEffect, useState } from "react";
import { BiLink, BiLogoLinkedin } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { LuBuilding2 } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import AddEmailHistory from "../emailHistory/components/AddEmail";
import AddMeeting from "../meeting/components/Addmeeting";
import AddPhoneCall from "../phoneCall/components/AddPhoneCall";
import Add from "./Add";
import Edit from "./Edit";
import PhoneCall from "./components/phonCall";
import PropertyModel from "./components/propertyModel";
import PropertyTable from "./components/propertyTable";
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
import { fetchContactCustomFiled } from '../../../redux/slices/contactCustomFiledSlice';
import { fetchPropertyCustomFiled } from "../../../redux/slices/propertyCustomFiledSlice";
import html2pdf from "html2pdf.js";
import { FaFilePdf } from "react-icons/fa";
import AddEditQuotes from '../quotes/AddEdit'
import AddEditInvoice from '../invoice/AddEdit'
const View = () => {

    const param = useParams()
    const textColor = useColorModeValue("gray.500", "white");

    const user = JSON.parse(localStorage.getItem("user"));
    const buttonbg = useColorModeValue("gray.200", "white");
    const [data, setData] = useState([])
    const [allData, setAllData] = useState([]);
    // const [contactData, setContactData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [propertyModel, setPropertyModel] = useState(false);
    const [isLoding, setIsLoding] = useState(false)
    const [action, setAction] = useState(false)

    const [taskModel, setTaskModel] = useState(false);
    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);
    const [addQuotes, setAddQuotes] = useState(false);
    const [addInvoice, setAddInvoice] = useState(false);
    const [addMeeting, setMeeting] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [showMeetings, setShowMeetings] = useState(false);
    const [showQuotes, setShowQuotes] = useState(false);
    const [showInvoices, setShowInvoices] = useState(false);
    const [addDocument, setAddDocument] = useState(false);

    const [selectedTab, setSelectedTab] = useState(0);
    const size = "lg";
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const contactData = useSelector((state) => state?.contactCustomFiled?.data?.data)

    const [propertyData, setPropertyData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [permission, callAccess, emailAccess, taskAccess, meetingAccess, quotesAccess, invoicesAccess, accountAccess] = HasAccess(['Contacts', 'Calls', 'Emails', 'Tasks', 'Meetings', 'Quotes', 'Invoices', 'Account']);
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
                        {cell?.value || '-'}
                    </Text>
                </Link>)
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
                        {cell?.value || '-'}
                    </Text>
                </Link>)
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

    const PropertyColumn = [
        { Header: 'property Type', accessor: 'propertyType' },
        { Header: "property Address", accessor: "propertyAddress", },
        { Header: "listing Price", accessor: "listingPrice", },
        { Header: "square Footage", accessor: "squareFootage", },
        { Header: "year Built", accessor: "yearBuilt", },
    ];
    const fetchCustomDataFields = async () => {
        setIsLoding(true);
        const result = await dispatch(fetchPropertyCustomFiled())
        setPropertyData(result?.payload?.data);

        const tempTableColumns = [
            { Header: "#", accessor: "_id", isSortable: false, width: 10 },
            ...result?.payload?.data?.[0]?.fields?.filter((field) => field?.isTableField === true)?.map((field) => ({ Header: field?.label, accessor: field?.name })),
        ];

        setColumns(tempTableColumns);
        setIsLoding(false);
    }
    const MeetingColumns = [
        {
            Header: 'agenda', accessor: 'agenda', cell: (cell) => (
                <Link to={`/metting/${cell?.row?.original?._id}`}>
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value || '-'}
                    </Text>
                </Link>)
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
    const quotesColumns = [
        { Header: "Quote Number", accessor: "quoteNumber", isSortable: false, width: 10 },
        {
            Header: 'Title', accessor: 'title', cell: (cell) => (
                <div className="selectOpt">
                    <Text
                        onClick={() => navigate(`/quotesView/${cell?.row?.original._id}`)}
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
        { Header: 'Quote Stage', accessor: 'quoteStage' },
        {
            Header: 'Contact', accessor: 'contact',
            cell: (cell) => (
                <Text
                >
                    {cell?.row?.original?.contactName ? cell?.row?.original?.contactName : "-"}
                </Text>
            )
        },
        {
            Header: 'Account', accessor: 'account',
            cell: (cell) => (
                (user.role === 'superAdmin' || accountAccess?.view) ?
                    <div className="selectOpt">
                        <Text
                            onClick={() => navigate(cell?.row?.original.account !== null && `/accountView/${cell?.row?.original.account}`)}
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                            color='brand.600'
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}
                        </Text>
                    </div>
                    :
                    <Text
                    >
                        {cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}
                    </Text>
            )
        },
        {
            Header: "Grand Total",
            accessor: "grandTotal",
            cell: (cell) => (
                <div className="selectOpt">
                    <Text
                    >
                        {cell?.row?.original?.grandTotal ? `$${cell?.row?.original?.grandTotal}` : '-'}
                    </Text>
                </div>
            )
        },
        { Header: "valid Until", accessor: "validUntil" },
    ];
    const invoicesColumns = [
        { Header: "Invoice Number", accessor: "invoiceNumber", isSortable: false, width: 10 },
        {
            Header: 'Title', accessor: 'title', cell: (cell) => (
                <div className="selectOpt">
                    <Text
                        onClick={() => navigate(`/invoicesView/${cell?.row?.original._id}`)}
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
        {
            Header: 'Status', accessor: 'status',
        },
        {
            Header: 'Contact', accessor: 'contact',
            cell: (cell) => (
                <Text
                >
                    {cell?.row?.original?.contactName ? cell?.row?.original?.contactName : "-"}
                </Text>
            )
        },
        {
            Header: 'Account', accessor: 'account',
            cell: (cell) => (
                (user.role === 'superAdmin' || accountAccess?.view) ?
                    <div className="selectOpt">
                        <Text
                            onClick={() => navigate(cell?.row?.original.account !== null && `/accountView/${cell?.row?.original.account}`)}
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                            color='brand.600'
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}
                        </Text>
                    </div>
                    :
                    <Text
                    >
                        {cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}
                    </Text>
            )
        },
        {
            Header: "Grand Total",
            accessor: "grandTotal",
            cell: (cell) => (
                <div className="selectOpt">
                    <Text>
                        {cell?.row?.original?.grandTotal ? `$${cell?.row?.original?.grandTotal}` : '-'}
                    </Text>
                </div>
            )
        },
    ];



    const taskColumns = [
        {
            Header: "Title", accessor: "title", cell: (cell) => (
                <Link to={`/view/${cell?.row?.original?._id}`}>
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value || '-'}
                    </Text>
                </Link>)
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
                    filename: `Contact_Details_${moment().format("DD-MM-YYYY")}.pdf`,
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
        let response = await getApi('api/contact/view/', param.id)
        setData(response.data?.contact);
        setAllData(response?.data);
        setIsLoding(false)
        setSelectedTab(i)
    }

    const handleDeleteContact = async (id) => {
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

    useEffect(() => {
        fetchCustomDataFields()
    }, [])

    function toCamelCase(text) {
        return text?.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    useEffect(() => {
        dispatch(fetchContactCustomFiled())
    }, [])

    const firstValue = Object?.values(param)[0];
    const splitValue = firstValue?.split('/')

    return (
        <>
            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>
                    <Heading size="lg" mt={0} m={3}>
                        {data?.fullName || ""}
                    </Heading>
                    <Tabs onChange={handleTabChange} index={selectedTab}>
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
                                </TabList>

                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} mt={{ sm: "3px", md: "5px" }} >
                                <Flex justifyContent={"right"}>
                                    <Menu>
                                        {(user.role === 'superAdmin' || permission?.create || permission?.update || permission?.delete) && <MenuButton size="sm" variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                            Actions
                                        </MenuButton>}
                                        <MenuDivider />
                                        <MenuList minWidth={2} zIndex={"99"}>
                                            {(user.role === 'superAdmin' || permission?.create) && <MenuItem alignItems={'start'} onClick={() => onOpen()} color={'blue'} icon={<AddIcon />}>Add</MenuItem>}
                                            {(user.role === 'superAdmin' || permission?.update) && <MenuItem alignItems={'start'} onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>}
                                            <MenuItem onClick={generatePDF} alignItems={"start"} icon={<FaFilePdf />} display={"flex"} style={{ alignItems: "center" }}>Print as PDF</MenuItem >

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
                                <CustomView data={contactData?.[0]} fieldData={data} toCamelCase={toCamelCase} moduleId={contactData?.[0]?._id} fetchData={fetchData} id="reports" />
                                <GridItem colSpan={{ base: 12 }} mt={4}>
                                    <Card >
                                        <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                            <GridItem colSpan={2}>
                                                <Box>
                                                    <Flex alignItems={'center'} mb={2} justifyContent={'space-between'}>
                                                        <Heading size="md">
                                                            Property of Interest ({allData?.interestProperty?.interestProperty?.length})
                                                        </Heading>
                                                        <Button onClick={() => setPropertyModel(true)} leftIcon={<LuBuilding2 />} size="sm" colorScheme="gray" bg={buttonbg}>Select Interested Property  </Button>
                                                    </Flex>
                                                </Box>

                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        {/* <PropertyTable fetchData={fetchData} columnsData={PropertyColumn} tableData={allData?.interestProperty?.interestProperty?.length > 0 ? allData?.interestProperty?.interestProperty : []} title={'Interested Property'} /> */}
                                                        <CommonCheckTable
                                                            isLoding={isLoding}
                                                            columnData={columns ?? []}
                                                            dataColumn={columns ?? []}
                                                            allData={allData?.interestProperty?.interestProperty || []}
                                                            tableData={allData?.interestProperty?.interestProperty || []}
                                                            tableCustomFields={propertyData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
                                                            AdvanceSearch={() => ""}
                                                            ManageGrid={false}
                                                            deleteMany={false}
                                                            selectType="multiple"
                                                            customSearch={false}
                                                            checkBox={false}
                                                        />
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
                                                    <CommonCheckTable
                                                        title={"Email"}
                                                        isLoding={isLoding}
                                                        columnData={columnsDataColumns ?? []}
                                                        // dataColumn={columnsDataColumns ?? []}
                                                        allData={showEmail ? allData.EmailHistory : allData?.EmailHistory?.length > 0 ? [allData.EmailHistory[0]] : []}
                                                        tableData={showEmail ? allData.EmailHistory : allData?.EmailHistory?.length > 0 ? [allData.EmailHistory[0]] : []}
                                                        AdvanceSearch={false}
                                                        dataLength={allData?.EmailHistory?.length}
                                                        tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setAddEmailHistory(true)}
                                                        access={emailAccess}
                                                    />
                                                    {allData?.EmailHistory?.length > 1 &&
                                                        <div style={{ display: "flex", justifyContent: "end" }}>
                                                            <Button colorScheme="brand" variant="outline" size='sm' display="flex" justifyContant="end" onClick={() => showEmail ? setShowEmail(false) : setShowEmail(true)}>{showEmail ? "Show less" : "Show more"}</Button>
                                                        </div>}
                                                </Card>
                                            </GridItem>}
                                            {callAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <CommonCheckTable
                                                        title={"Call"}
                                                        isLoding={isLoding}
                                                        columnData={callColumns ?? []}
                                                        // dataColumn={callColumns ?? []}
                                                        allData={showCall ? allData?.phoneCallHistory : allData?.phoneCallHistory?.length > 0 ? [allData?.phoneCallHistory[0]] : []}
                                                        tableData={showCall ? allData?.phoneCallHistory : allData?.phoneCallHistory?.length > 0 ? [allData?.phoneCallHistory[0]] : []}
                                                        AdvanceSearch={false}
                                                        tableCustomFields={[]}
                                                        dataLength={allData?.phoneCallHistory?.length}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setAddPhoneCall(true)}
                                                        access={callAccess}
                                                    />
                                                    {allData?.phoneCallHistory?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" variant="outline" size='sm' display="flex" justifyContant="end" onClick={() => showCall ? setShowCall(false) : setShowCall(true)}>{showCall ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}
                                            {taskAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <CommonCheckTable
                                                        title={"Task"}
                                                        isLoding={isLoding}
                                                        columnData={taskColumns ?? []}
                                                        // dataColumn={taskColumns ?? []}
                                                        allData={showTasks ? allData?.task : allData?.task?.length > 0 ? [allData?.task[0]] : []}
                                                        tableData={showTasks ? allData?.task : allData?.task?.length > 0 ? [allData?.task[0]] : []}
                                                        AdvanceSearch={false}
                                                        dataLength={allData?.task?.length}
                                                        tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setTaskModel(true)}
                                                        access={taskAccess}
                                                    />
                                                    {allData?.task?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" variant="outline" size='sm' display="flex" justifyContant="end" onClick={() => showTasks ? setShowTasks(false) : setShowTasks(true)}>{showTasks ? "Show less" : "Show more"}</Button>
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
                                                        dataLength={allData?.meetingHistory?.length}
                                                        allData={showMeetings ? allData?.meetingHistory : allData?.meetingHistory?.length > 0 ? [allData?.meetingHistory[0]] : []}
                                                        tableData={showMeetings ? allData?.meetingHistory : allData?.meetingHistory?.length > 0 ? [allData?.meetingHistory[0]] : []}
                                                        AdvanceSearch={false}
                                                        tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setMeeting(true)}
                                                        access={meetingAccess}
                                                    />
                                                    {allData?.meetingHistory?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" size='sm' variant="outline" display="flex" justifyContant="end" onClick={() => showMeetings ? setShowMeetings(false) : setShowMeetings(true)}>{showMeetings ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}
                                            {quotesAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <CommonCheckTable
                                                        title={"Quotes"}
                                                        isLoding={isLoding}
                                                        columnData={quotesColumns ?? []}
                                                        // dataColumn={quotesColumns ?? []}
                                                        dataLength={allData?.quotes?.length}
                                                        allData={showQuotes ? allData?.quotes : allData?.quotes?.length > 0 ? [allData?.quotes[0]] : []}
                                                        tableData={showQuotes ? allData?.quotes : allData?.quotes?.length > 0 ? [allData?.quotes[0]] : []}
                                                        AdvanceSearch={false}
                                                        tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setAddQuotes(true)}
                                                        access={quotesAccess}
                                                    />
                                                    {allData?.quotes?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" size='sm' variant="outline" display="flex" justifyContant="end" onClick={() => showQuotes ? setShowQuotes(false) : setShowQuotes(true)}>{showQuotes ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}
                                            {invoicesAccess?.view && <GridItem colSpan={{ base: 12, md: 6 }}>
                                                <Card overflow={'scroll'}>
                                                    <CommonCheckTable
                                                        title={"Invoices"}
                                                        isLoding={isLoding}
                                                        columnData={invoicesColumns ?? []}
                                                        // dataColumn={invoicesColumns ?? []}
                                                        dataLength={allData?.invoice?.length}
                                                        allData={showInvoices ? allData?.invoice : allData?.invoice?.length > 0 ? [allData?.invoice[0]] : []}
                                                        tableData={showInvoices ? allData?.invoice : allData?.invoice?.length > 0 ? [allData?.invoice[0]] : []}
                                                        AdvanceSearch={false}
                                                        tableCustomFields={[]}
                                                        checkBox={false}
                                                        deleteMany={true}
                                                        ManageGrid={false}
                                                        onOpen={() => setAddInvoice(true)}
                                                        access={invoicesAccess}
                                                    />
                                                    {allData?.invoice?.length > 1 && <div style={{ display: "flex", justifyContent: "end" }}>
                                                        <Button colorScheme="brand" size='sm' variant="outline" display="flex" justifyContant="end" onClick={() => showInvoices ? setShowInvoices(false) : setShowInvoices(true)}>{showInvoices ? "Show less" : "Show more"}</Button>
                                                    </div>}
                                                </Card>
                                            </GridItem>}

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
            {isOpen && <Add isOpen={isOpen} size={size} onClose={onClose} contactData={contactData?.[0]} />}
            <Edit isOpen={edit} contactData={contactData?.[0]} size={size} onClose={setEdit} setAction={setAction} moduleId={contactData?.[0]?._id} data={data} />
            <CommonDeleteModel isOpen={deleteModel} onClose={() => setDelete(false)} type='Contact' handleDeleteData={handleDeleteContact} ids={param.id} />
            <AddEmailHistory lead="false" contactEmail={allData?.contact?.email} fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={param.id} />
            <AddDocumentModal addDocument={addDocument} setAddDocument={setAddDocument} linkId={param.id} from="contact" setAction={setAction} fetchData={fetchData} />
            <AddMeeting fetchData={fetchData} leadContect={splitValue[0]} isOpen={addMeeting} onClose={setMeeting} from="contact" id={param.id} setAction={setAction} view={true} />
            <AddEdit isOpen={taskModel} fetchData={fetchData} leadContect={splitValue[0]} onClose={setTaskModel} id={param.id} userAction={'add'} view={true} />
            <AddPhoneCall viewData={allData} fetchData={fetchData} setAction={setAction} isOpen={addPhoneCall} onClose={setAddPhoneCall} data={data?.contact} id={param.id} cData={data} />
            <AddEditQuotes isOpen={addQuotes} size={"lg"} onClose={() => setAddQuotes(false)} setAction={setAction} type={"add"} contactId={param.id} />
            <AddEditInvoice isOpen={addInvoice} size={"lg"} onClose={() => setAddInvoice(false)} setAction={setAction} type={"add"} contactId={param.id} />
            <PropertyModel fetchData={fetchData} isOpen={propertyModel} onClose={setPropertyModel} id={param.id} interestProperty={data?.interestProperty} />

        </>
    );
};

export default View;
