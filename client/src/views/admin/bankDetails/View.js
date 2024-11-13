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
// import Editopportunityproject from "./Editopportunityproject";
import { postApi } from "services/api";
import { putApi } from "services/api";
import { fetchPropertyData } from "../../../redux/slices/propertySlice.js";
import { fetchPropertyCustomFiled } from "../../../redux/slices/propertyCustomFiledSlice.js";
import { fetchBankData } from "../../../redux/slices/bankDetailsSlice.js";
import Add from "./components/Add";
import Edit from "./components/Edit";
import { deleteManyApi } from "services/api";

const View = (props) => {
  const {
    userAction,
    userData,
    editData,
    selectedId,
    setUserAction,
    getBankDetails,
  } = props;
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
  const [bankDataDetails, setBankDetails] = useState();
  // const [bankData, setBankData] = useState([]);
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
  const [selectedPropertyData, setSelctedPropertyData] = useState([]);
  const propertyTableData = useSelector((state) => state?.propertyData?.data);
  const size = "lg";
  const bankDetails = useSelector((state) => state?.bankData?.data);

  useEffect(async () => {
    await dispatch(fetchBankData());
  }, [edit, deleteModel, onOpen , action]);

  const [permission] = HasAccess(["Bank Details"]);
  const fetchViewData = async () => {
    if (id) {
      const result = await getApi("api/bank-details/view/", id);
      setBankDetails(result?.data);
      setSelctedPropertyData(result?.data?.propertyOpportunityProject);
    }
  };

  const handleClick = () => {
    setUserction("add");
    onOpen();
  };

  useEffect(() => {
    fetchViewData();
  }, [id, edit, action]);

  const handleDoubleClick = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    setEditableField(fieldName);
  };


  const handleTabChange = (index) => {
    setSelectedTab(index);
  };
  const handleDeleteBankDetais = async (ids) => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi("api/bank-details/deleteMany", [ids]);
      if (response?.status === 200) {
        setSelectedValues([]);
        setDelete(false);
        setAction((pre) => !pre);
        navigate("/bank-details")
      }
      setIsLoding(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
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
          filename: `Bank_Details_${moment().format("DD-MM-YYYY")}.pdf`,
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

  const firstValue = Object?.values(params)[0];
  const splitValue = firstValue?.split("/");
  const initialValues = {
    accountName: bankDataDetails?.accountName || "",
    accountNumber: bankDataDetails?.accountNumber || "",
    bank: bankDataDetails?.bank || "",
    branch: bankDataDetails?.branch || "",
    swiftCode: bankDataDetails?.swiftCode || "",
  };
  const validationSchema = yup.object({
    accountName: yup.string().required("AccountName Is required"),
    accountNumber: yup.number().required("AccountNumber Is required"),
    bank: yup.string().required("Bank Is required"),
    branch: yup.string().required("Branch Is required"),
    swiftCode: yup.number().required("SwiftCode Is required"),
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
        `api/bank-details/edit/${params?.id}`,
        values
      );
      if (response && response?.status === 200) {
        setEditableField(null);
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

  return (
    <>
      {isLoding ? (
        <Flex justifyContent={"center"} alignItems={"center"} width="100%">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading size="lg" mt={0} m={3}>
            {bankDataDetails?.accountName || ""}
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
                        Bank Details
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
                                  setEdit(true);
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
                        <Link to="/bank-details">
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
                    Account Name{" "}
                  </Text>

                  <>
                    {/* <Input
                        id="text"
                        name="accountName"
                        type="text"
                        onChange={formik?.handleChange}
                        onBlur={handleBlur}
                        value={formik?.values?.accountName}
                        borderColor={
                          formik?.errors?.accountName &&
                          formik?.touched?.accountName
                            ? "red.300"
                            : null
                        }
                        autoFocus
                      /> */}
                    {/* <Text mb="10px" color={"red"}>
                        {" "}
                        {formik?.errors.accountName &&
                          formik?.touched.accountName &&
                          formik?.errors.accountName}
                      </Text> */}
                  </>

                  <Text>
                    {bankDataDetails?.accountName
                      ? bankDataDetails?.accountName
                      : " - "}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2 }} mt={3}>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={"blackAlpha.900"}
                  >
                    Account Number{" "}
                  </Text>

                  {/* <Input
                        id="text"
                        name="accountNumber"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        value={formik?.values?.accountNumber}
                        borderColor={
                          formik?.errors?.accountNumber &&
                          formik?.touched?.accountNumber
                            ? "red.300"
                            : null
                        }
                        autoFocus
                      />
                      <Text mb="10px" color={"red"}>
                        {" "}
                        {formik?.errors?.accountNumber &&
                          formik?.touched?.accountNumber &&
                          formik?.errors?.accountNumber}
                      </Text>
                    </>
                  ) : (
                    <Text
                      onDoubleClick={() =>
                        handleDoubleClick(
                          "accountNumber",
                          bankDataDetails?.accountNumber
                        )
                      }
                    > */}
                  <Text>
                    {bankDataDetails?.accountNumber
                      ? bankDataDetails?.accountNumber
                      : " - "}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2 }} mt={3}>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={"blackAlpha.900"}
                  >
                    Bank{" "}
                  </Text>

                  {/* <Input
                        id="text"
                        name="bank"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        value={formik?.values?.bank}
                        borderColor={
                          formik?.errors?.bank && formik?.touched?.bank
                            ? "red.300"
                            : null
                        }
                        autoFocus
                      />
                      <Text mb="10px" color={"red"}>
                        {" "}
                        {formik?.errors?.bank &&
                          formik?.touched?.bank &&
                          formik?.errors?.bank}
                      </Text> */}
                  <Text>
                    {bankDataDetails?.bank ? bankDataDetails?.bank : " - "}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2 }} mt={3}>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={"blackAlpha.900"}
                  >
                    Branch{" "}
                  </Text>

                  {/* <Input
                        id="text"
                        name="branch"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        value={formik?.values?.branch}
                        borderColor={
                          formik?.errors?.branch && formik?.touched?.branch
                            ? "red.300"
                            : null
                        }
                        autoFocus
                      />
                      <Text mb="10px" color={"red"}>
                        {" "}
                        {formik?.errors?.branch &&
                          formik?.touched?.branch &&
                          formik?.errors?.branch}
                      </Text> */}
                  <Text>
                    {bankDataDetails?.branch ? bankDataDetails?.branch : " - "}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2 }} mt={3}>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={"blackAlpha.900"}
                  >
                    swiftCode{" "}
                  </Text>

                  {/* <Input
                        id="text"
                        name="swiftCode"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        value={formik?.values?.swiftCode}
                        borderColor={
                          formik?.errors?.swiftCode &&
                          formik?.touched?.swiftCode
                            ? "red.300"
                            : null
                        }
                        autoFocus
                      />
                      <Text mb="10px" color={"red"}>
                        {" "}
                        {formik?.errors?.swiftCode &&
                          formik?.touched?.swiftCode &&
                          formik?.errors?.swiftCode}
                      </Text> */}
                  <Text>
                    {bankDataDetails?.swiftCode
                      ? bankDataDetails?.swiftCode
                      : " - "}
                  </Text>
                </Box>
              </GridItem>
              <Grid></Grid>
            </Grid>
          </Tabs>

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
                          setEdit(true);
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
      <Add
        isOpen={isOpen}
        size={"lg"}
        bankData={bankDetails}
        onClose={onClose}
        setAction={setAction}
        action={action}
      />
      <Edit
        isOpen={edit}
        size={"lg"}
        // contactData={tableColumns}
        selectedId={params?.id}
        // setSelectedId={setSelectedId}
        onClose={setEdit}
        setAction={setAction}
        getBankDetails={bankDetails}
      />
      <CommonDeleteModel
        isOpen={deleteModel}
        onClose={() => setDelete(false)}
        type="Bank Details"
        handleDeleteData={handleDeleteBankDetais}
        ids={params?.id}
      />
      {/* 
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
      <Editopportunityproject
        isOpen={isOpen}
        fetchData={fetchViewData}
        userAction={useraction}
        selectedId={params?.id}
        onClose={onClose}
        setAction={setAction}
        moduleId={opportunitydata?.[0]?._id}
        data={opportunitydata}
      /> */}
    </>
  );
};

export default View;
