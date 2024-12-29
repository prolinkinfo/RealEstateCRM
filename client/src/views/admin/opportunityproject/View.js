import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Input,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import FolderTreeView from "components/FolderTreeView/folderTreeView";
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
import { HasAccess } from "../../../redux/accessUtils";
import DataNotFound from "components/notFoundData";
import CustomView from "utils/customView";
import AddDocumentModal from "utils/addDocumentModal";
import CommonDeleteModel from "components/commonDeleteModel";
import { deleteApi } from "services/api";
import CommonCheckTable from "components/reactTable/checktable";
import moment from "moment";
import AddEdit from "../task/components/AddEdit";
import { useDispatch, useSelector } from "react-redux";
import { FaFilePdf } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useFormik } from "formik";
import * as yup from "yup";
import Editopportunityproject from "./Editopportunityproject";
import { postApi } from "services/api";
import { putApi } from "services/api";
import { fetchPropertyData } from "../../../redux/slices/propertySlice.js";
import { fetchPropertyCustomFiled } from "../../../redux/slices/propertyCustomFiledSlice.js";

const View = (props) => {
  const { userAction, userData, editData, selectedId, setUserAction } = props;
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = params;
  const user = JSON.parse(localStorage.getItem("user"));
  const userName =
    typeof userData === "string" ? JSON.parse(userData) : userData;
  const textColor = useColorModeValue("gray.500", "white");
  // const [data, setData] = useState();
  const [opportunitydata, setOpportunityData] = useState([]);
  const [allData, setAllData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [edit, setEdit] = useState(false);
  const [deleteModel, setDelete] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [addMeeting, setMeeting] = useState(false);
  const [action, setAction] = useState(false);
  const [editableField, setEditableField] = useState(null);
  const [useraction, setUserction] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedValues, setSelectedValues] = useState();
  const [taskModel, setTaskModel] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedPropertyData, setSelctedPropertyData] = useState([]);
  const propertyTableData = useSelector((state) => state?.propertyData?.data);
  const size = "lg";

  const leadData = useSelector((state) => state?.leadCustomFiled?.data?.data);
  const [permission] = HasAccess(["Opportunity Project"]);
  const fetchViewData = async () => {
    if (id) {
      const result = await getApi("api/opportunityproject/view/", id);
      setOpportunityData(result?.data);
      setSelctedPropertyData(result?.data?.propertyOpportunityProject);
    }
  };
  const handleClick = () => {
    setUserction("add");
    onOpen();
  };
  useEffect(() => {
    fetchViewData();
  }, [id, edit]);

  const handleDoubleClick = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    setEditableField(fieldName);
  };

  const columnsDataColumns = [
    { Header: "sender", accessor: "senderName" },
    {
      Header: "recipient",
      accessor: "createByName",
      cell: (cell) => (
        <Link to={`/Email/${cell?.row?.original?._id}`}>
          <Text
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value || " - "}
          </Text>
        </Link>
      ),
    },
    {
      Header: "time stamp",
      accessor: "timestamp",
      cell: (cell) => (
        <div className="selectOpt">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {moment(cell?.value).fromNow()}
          </Text>
        </div>
      ),
    },
    {
      Header: "Created",
      accessor: "createBy",
      cell: (cell) => (
        <div className="selectOpt">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {moment(cell?.row?.values.timestamp).format("h:mma (DD/MM)")}
          </Text>
        </div>
      ),
    },
  ];
  const callColumns = [
    { Header: "sender", accessor: "senderName" },
    {
      Header: "recipient",
      accessor: "createByName",
      cell: (cell) => (
        <Link to={`/phone-call/${cell?.row?.original?._id}`}>
          <Text
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value || " - "}
          </Text>
        </Link>
      ),
    },
    {
      Header: "time stamp",
      accessor: "timestamp",
      cell: (cell) => (
        <div className="selectOpt">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {moment(cell?.value).fromNow()}
          </Text>
        </div>
      ),
    },
    {
      Header: "Created",
      accessor: "createBy",
      cell: (cell) => (
        <div className="selectOpt">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {moment(cell?.row?.values?.timestamp).format("h:mma (DD/MM)")}
          </Text>
        </div>
      ),
    },
  ];
  const MeetingColumns = [
    {
      Header: "Agenda",
      accessor: "agenda",
      cell: (cell) => (
        <Link to={`/metting/${cell?.row?.original?._id}`}>
          <Text
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value || " - "}
          </Text>
        </Link>
      ),
    },
    { Header: "date Time", accessor: "dateTime" },
    {
      Header: "times tamp",
      accessor: "timestamp",
      cell: (cell) => (
        <div className="selectOpt">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {moment(cell?.value).fromNow()}
          </Text>
        </div>
      ),
    },
    { Header: "create By", accessor: "createdByName" },
  ];
  const taskColumns = [
    {
      Header: "Title",
      accessor: "title",
      type: "text",
      formikType: "",
      cell: (cell) => (
        <div className="selectOpt">
          <Text
            onClick={() => navigate(`/view/${cell?.row?.original?._id}`)}
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
              cursor: "pointer",
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value}
          </Text>
        </div>
      ),
    },
    { Header: "Category", accessor: "category" },
    { Header: "Assign To", accessor: "assignToName" },
    { Header: "Start Date", accessor: "start" },
    { Header: "End Date", accessor: "end" },
  ];

  const fetchCustomDataFields = async () => {
    setIsLoding(true);
    const result = await dispatch(fetchPropertyCustomFiled());
    setPropertyData(result?.payload?.data);
    const tempTableColumns = [
      { Header: "#", accessor: "_id", isSortable: false, width: 10 },
      ...(result?.payload?.data?.[0]?.fields || [])
        ?.filter((field) => field?.isTableField === true)
        ?.map((field) => ({ Header: field?.label, accessor: field?.name })),
    ];
    setColumns(tempTableColumns);
    setIsLoding(false);
  };

  useEffect(async () => {
    await dispatch(fetchPropertyData());
    fetchCustomDataFields();
  }, []);

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const generatePDF = () => {
    const element = document.getElementById("reports");
    const hideBtn = document.getElementById("hide-btn");
    if (element) {
      hideBtn.style.display = "none";
      // element.style.display = "block";
      element.style.width = "100%"; // Adjust width for mobile
      element.style.height = "auto";
      element.style.padding = "15px";
      html2pdf()
        .from(element)
        .set({
          margin: [0, 0, 0, 0],
          filename: `OpportunityProject_Details_${moment().format(
            "DD-MM-YYYY",
          )}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save()
        .then(() => {
          element.style.display = "";
          hideBtn.style.display = "";
          element.style.padding = "";
        });
    } else {
      console.error("Element with ID 'reports' not found.");
    }
  };

  const download = async (data) => {
    if (data) {
      let result = await getApi(`api/document/download/`, data);
      if (result && result?.status === 200) {
        window.open(`${constant?.baseUrl}api/document/download/${data}`);
        toast.success("file Download successful");
      } else if (result && result?.response?.status === 404) {
        toast.error("file Not Found");
      }
    }
  };

  const handleDeleteLead = async (id) => {
    try {
      setIsLoding(true);
      let response = await deleteApi("api/opportunityproject/delete/", id);
      if (response?.status === 200) {
        setDelete(false);
        setAction((pre) => !pre);
        navigate("/opportunityproject");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchViewData();
  }, [action]);

  function toCamelCase(text) {
    return text?.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  const firstValue = Object?.values(params)[0];
  const splitValue = firstValue?.split("/");
  const initialValues = {
    name: opportunitydata?.name,
    requirement: opportunitydata?.requirement,
  };
  const validationSchema = yup.object({
    name: yup.string().required("name is required"),
    requirement: yup.string().required("Requirement is required"),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setEditableField(null);
      AddData();
    },
  });
  const {
    errors,
    touched,
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik;

  const AddData = async () => {
    try {
      setIsLoding(true);
      let response = await putApi(
        `api/opportunityproject/edit/${params?.id}`,
        values,
      );
      if (response && response?.status === 200) {
        setEditableField(null);
        fetchViewData();
        let updatedUserData = userData; // Create a copy of userData
        if (user?._id === params?.id) {
          if (updatedUserData && typeof updatedUserData === "object") {
            // Create a new object with the updated firstName
            updatedUserData = {
              ...updatedUserData,
              Name: values?.name,
              Requirement: values?.requirement,
            };
          }
          const updatedDataString = JSON.stringify(updatedUserData);
          localStorage.setItem("user", updatedDataString);
        }
        onClose();
        setUserAction("");
        setAction((pre) => !pre);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };
  const handleBlur = (e) => {
    formik.handleSubmit();
  };
  const handleOpenModal = (user) => {
    setEdit(true);
  };
  const handleCloseModel = () => {
    setEdit(false);
  };

  const [contactAccess, leadAccess] = HasAccess(["Contacts", "Leads"]);

  return (
    <>
      {isLoding ? (
        <Flex justifyContent={"center"} alignItems={"center"} width="100%">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading size="lg" mt={0} m={3}>
            {opportunitydata?.name || ""}
          </Heading>
          <Tabs
            onChange={handleTabChange}
            index={selectedTab}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "20px",
            }}
            // id="reports"
          >
            <Grid
              templateColumns={"repeat(4, 1fr)"}
              mb={3}
              gap={1}
              id="reports"
            >
              <GridItem colSpan={{ base: 4 }}>
                <TabList
                  sx={{
                    border: "none",
                    "& button:focus": { boxShadow: "none" },
                    "& button": {
                      margin: { sm: "0 3px", md: "0 5px" },
                      padding: { sm: "5px", md: "8px" },
                      border: "2px solid #8080803d",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      borderBottom: 0,
                      fontSize: { sm: "12px", md: "16px" },
                    },
                    '& button[aria-selected="true"]': {
                      border: "2px solid brand.200",
                      borderBottom: 0,
                      zIndex: "0",
                    },
                  }}
                ></TabList>
              </GridItem>
              <GridItem
                colSpan={{ base: 2, md: 4 }}
                mt={{ sm: "3px", md: "5px" }}
              >
                <GridItem colSpan={2}>
                  <Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Heading size="md" mb={3}>
                        Opportunity Project Details
                      </Heading>
                      <Flex id="hide-btn">
                        <Menu>
                          {(user?.role === "superAdmin" ||
                            permission?.create ||
                            permission?.update ||
                            permission?.delete) && (
                            <MenuButton
                              size="sm"
                              variant="outline"
                              colorScheme="blackAlpha"
                              mr={2.5}
                              as={Button}
                              rightIcon={<ChevronDownIcon />}
                            >
                              Actions
                            </MenuButton>
                          )}
                          <MenuDivider />
                          <MenuList minWidth={2}>
                            {(user?.role === "superAdmin" ||
                              permission?.create) && (
                              <MenuItem
                                color={"blue"}
                                onClick={() => {
                                  // onOpen(); setUserAction('add'),
                                  handleClick();
                                }}
                                alignItems={"start"}
                                icon={<AddIcon />}
                              >
                                {" "}
                                Add{" "}
                              </MenuItem>
                            )}
                            {(user?.role === "superAdmin" ||
                              permission?.update) && (
                              <MenuItem
                                onClick={() => {
                                  setUserction("edit");
                                  onOpen();
                                }}
                                alignItems={"start"}
                                icon={<EditIcon />}
                              >
                                Edit
                              </MenuItem>
                            )}
                            <MenuItem
                              onClick={generatePDF}
                              alignItems={"start"}
                              icon={<FaFilePdf />}
                              display={"flex"}
                              style={{ alignItems: "center" }}
                            >
                              Print as PDF
                            </MenuItem>
                            {(user?.role === "superAdmin" ||
                              permission?.delete) && (
                              <>
                                <MenuDivider />
                                <MenuItem
                                  alignItems={"start"}
                                  color={"red"}
                                  onClick={() => setDelete(true)}
                                  icon={<DeleteIcon />}
                                >
                                  Delete
                                </MenuItem>
                              </>
                            )}
                          </MenuList>
                        </Menu>
                        <Link to="/opportunityproject">
                          <Button
                            leftIcon={<IoIosArrowBack />}
                            size="sm"
                            variant="brand"
                          >
                            Back
                          </Button>
                        </Link>
                      </Flex>
                    </Box>
                    <HSeparator />
                  </Box>
                </GridItem>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2 }} mt={3}>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={"blackAlpha.900"}
                  >
                    {" "}
                    Opportunity Project Name{" "}
                  </Text>
                  {editableField === "name" ? (
                    <>
                      <Input
                        id="text"
                        name="name"
                        type="text"
                        onChange={formik?.handleChange}
                        onBlur={handleBlur}
                        value={formik?.values?.name}
                        borderColor={
                          formik?.errors?.name && formik?.touched?.name
                            ? "red.300"
                            : null
                        }
                        autoFocus
                      />
                      <Text mb="10px" color={"red"}>
                        {" "}
                        {formik?.errors.name &&
                          formik?.touched.name &&
                          formik?.errors.name}
                      </Text>
                    </>
                  ) : (
                    <Text
                      onDoubleClick={() =>
                        handleDoubleClick("name", opportunitydata?.name)
                      }
                    >
                      {opportunitydata?.name ? opportunitydata?.name : " - "}
                    </Text>
                  )}
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2 }} mt={3}>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={"blackAlpha.900"}
                  >
                    Opportunity Project Requirement{" "}
                  </Text>
                  {editableField === "requirement" ? (
                    <>
                      <Input
                        id="text"
                        name="requirement"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        value={formik?.values?.requirement}
                        borderColor={
                          formik?.errors?.requirement &&
                          formik?.touched?.requirement
                            ? "red.300"
                            : null
                        }
                        autoFocus
                      />
                      <Text mb="10px" color={"red"}>
                        {" "}
                        {formik?.errors?.requirement &&
                          formik?.touched?.requirement &&
                          formik?.errors?.requirement}
                      </Text>
                    </>
                  ) : (
                    <Text
                      onDoubleClick={() =>
                        handleDoubleClick(
                          "requirement",
                          opportunitydata?.requirement,
                          "Opportunity Name",
                        )
                      }
                    >
                      {opportunitydata?.requirement
                        ? opportunitydata?.requirement
                        : " - "}
                    </Text>
                  )}
                </Box>
              </GridItem>
              <Grid>
                <GridItem colSpan={{ base: 6 }} mt={3}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={"blackAlpha.900"}
                  >
                    {" "}
                    Assign To{" "}
                  </Text>
                  <Link
                    to={
                      opportunitydata?.contact
                        ? contactAccess?.view &&
                          `/contactView/${opportunitydata?.contact}`
                        : leadAccess?.view &&
                          `/leadView/${opportunitydata?.lead}`
                    }
                  >
                    <Text
                      color={
                        opportunitydata?.category === "contact" &&
                        (contactAccess?.view || user?.role === "superAdmin")
                          ? "brand.600"
                          : leadAccess?.view ||
                              (user?.role === "superAdmin" &&
                                opportunitydata?.category === "lead")
                            ? "brand.600"
                            : "blackAlpha.900"
                      }
                      sx={{
                        "&:hover": {
                          color: "blue.500",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {opportunitydata?.setCategory
                        ? opportunitydata?.setCategory
                        : " - "}
                    </Text>
                  </Link>
                </GridItem>
              </Grid>
            </Grid>
          </Tabs>

          <Card mt={3}>
            <Grid templateColumns="repeat(2, 1fr)" gap={1}>
              <GridItem colSpan={{ base: 12 }}>
                <CommonCheckTable
                  title={"Property"}
                  isLoding={isLoding}
                  columnData={columns ?? []}
                  allData={selectedPropertyData ?? []}
                  tableData={selectedPropertyData ?? []}
                  tableCustomFields={
                    propertyData?.[0]?.fields?.filter(
                      (field) => field?.isTableField === true,
                    ) || []
                  }
                  AdvanceSearch={() => ""}
                  ManageGrid={false}
                  deleteMany={false}
                  selectedValues={selectedValues}
                  setSelectedValues={setSelectedValues}
                  selectType="single"
                  customSearch={false}
                  checkBox={false}
                />
              </GridItem>
            </Grid>
          </Card>

          {(user?.role === "superAdmin" ||
            permission?.update ||
            permission?.delete) && (
            <Card mt={3}>
              <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                <GridItem colStart={6}>
                  <Flex justifyContent={"right"}>
                    {user?.role === "superAdmin" || permission?.update ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setUserction("edit");
                          onOpen();
                        }}
                        leftIcon={<EditIcon />}
                        mr={2.5}
                        variant="outline"
                        colorScheme="green"
                      >
                        Edit
                      </Button>
                    ) : (
                      ""
                    )}
                    {user?.role === "superAdmin" || permission?.delete ? (
                      <Button
                        size="sm"
                        style={{ background: "red.800" }}
                        onClick={() => setDelete(true)}
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                      >
                        Delete
                      </Button>
                    ) : (
                      ""
                    )}
                  </Flex>
                </GridItem>
              </Grid>
            </Card>
          )}
        </>
      )}

      <AddMeeting
        fetchData={fetchViewData}
        isOpen={addMeeting}
        leadContect={splitValue?.[0]}
        onClose={setMeeting}
        from="contact"
        id={params?.id}
        setAction={setAction}
        view={true}
      />
      <AddEdit
        isOpen={taskModel}
        fetchData={fetchViewData}
        leadContect={splitValue?.[0]}
        onClose={setTaskModel}
        id={params?.id}
        userAction={"add"}
        view={true}
      />
      <CommonDeleteModel
        isOpen={deleteModel}
        onClose={() => setDelete(false)}
        type="Opportunity Project"
        handleDeleteData={handleDeleteLead}
        ids={params?.id}
      />
      <Editopportunityproject
        isOpen={isOpen}
        fetchData={fetchViewData}
        userAction={useraction}
        selectedId={params?.id}
        onClose={onClose}
        setAction={setAction}
        moduleId={opportunitydata?.[0]?._id}
        data={opportunitydata}
      />
    </>
  );
};

export default View;
