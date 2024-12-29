import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CommonDeleteModel from "components/commonDeleteModel";
import DataNotFound from "components/notFoundData";
import CommonCheckTable from "components/reactTable/checktable";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import moment from "moment";
import { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaFilePdf, FaHome } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdMoveDown, MdMoveUp } from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdBlock } from "react-icons/md";
import { deleteApi, getApi, postApi, postApiBlob } from "services/api";
import CustomView from "utils/customView";
import csv from "../../../assets/img/fileImage/csv.png";
import file from "../../../assets/img/fileImage/file.png";
import jpg from "../../../assets/img/fileImage/jpg.png";
import pdf from "../../../assets/img/fileImage/pdf.png";
import png from "../../../assets/img/fileImage/png.png";
import xls from "../../../assets/img/fileImage/xls.png";
import xlsx from "../../../assets/img/fileImage/xlsx.png";
import { HasAccess } from "../../../redux/accessUtils";
import { fetchContactCustomFiled } from "../../../redux/slices/contactCustomFiledSlice";
import { fetchPropertyCustomFiled } from "../../../redux/slices/propertyCustomFiledSlice";
import Add from "./Add";
import AddEditUnits from "./components/AddEditUnits";
import BookedModel from "./components/BookedModel";
import ChangeStatusModel from "./components/ChangeStatusModel";
import PropertyPhoto from "./components/propertyPhoto";
import UnitTypeView from "./components/UnitTypeView";
import Edit from "./Edit";

const View = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const param = useParams();
  const textColor = useColorModeValue("gray.500", "white");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();
  const [unitTypeList, setUnitTypeList] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [edit, setEdit] = useState(false);
  const [deleteModel, setDelete] = useState(false);
  const [action, setAction] = useState(false);
  const [propertyPhoto, setPropertyPhoto] = useState(false);
  const [showProperty, setShowProperty] = useState(false);
  const [virtualToursorVideos, setVirtualToursorVideos] = useState(false);
  const [floorPlans, setFloorPlans] = useState(false);
  const [propertyDocuments, setPropertyDocuments] = useState(false);
  const [actionType, setActionType] = useState("Add");
  const [selectedUnitType, setSelectedUnitType] = useState({});
  const [addUnit, setAddUnit] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [displayPropertyPhoto, setDisplayPropertyPhoto] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [unitOpenModel, setUnitOpenModel] = useState(false);
  const [selectedViewUnitType, setSelectedViewUnitType] = useState({});
  const [deleteunitModelUnitType, setDeleteModelUnitType] = useState(false);
  const [selectedFloorItem, setSelectedFloorItem] = useState({});

  const [blockedModelOpen, setBlockedModelOpen] = useState(false);
  const [availableModelOpen, setAvailableModelOpen] = useState(false);
  const [soldModelOpen, setSoldModelOpen] = useState(false);
  // const [soldopen, setSoldOpen] = useState(false);
  const [bookedOpen, setBookedOpen] = useState(false);

  const dispatch = useDispatch();
  const propertyData = useSelector(
    (state) => state?.propertyCustomFiled?.data?.data
  );

  const [contactData, setContactData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [type, setType] = useState(false);
  const navigate = useNavigate();

  const size = "lg";

  const handleSetUnitTypeList = (data) => {
    const unitType = data?.sort((a, b) => a?.order - b?.order);
    setUnitTypeList(unitType);
  };

  const handleUpdatePosition = async (values) => {
    try {
      setIsLoding(true);
      let response = await postApi(`api/property/add-units/${param?.id}`, {
        units: values,
        type: "E",
      });
      if (response && response?.status === 200) {
        setAction((pre) => !pre);
      } else {
        // toast.error(response.response.data?.message)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const handleEditOpen = (row) => {
    setAddUnit(true);
    setActionType("Edit");
    setSelectedUnitType(row);
  };

  const handleDeleteUnitType = (row) => {
    setDeleteModelUnitType(true);
    setSelectedUnitType(row);
  };

  const handleChangeOrder = (row, type) => {
    const newRows = [...unitTypeList];
    const currentIndex = row?.index;

    if (currentIndex === undefined) return;

    let targetIndex = type === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newRows?.length) return;

    [newRows[currentIndex].order, newRows[targetIndex].order] = [
      newRows[targetIndex].order,
      newRows[currentIndex].order,
    ];

    setUnitTypeList(newRows);

    handleUpdatePosition(newRows);
    // handleSetUnitTypeList(newRows);
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
            {moment(cell?.row?.values?.timestamp).format("h:mma (DD/MM)")}
          </Text>
        </div>
      ),
    },
  ];

  const fetchCustomDataFields = async () => {
    setIsLoding(true);
    const result = await dispatch(fetchContactCustomFiled());
    setContactData(result?.payload?.data);

    const tempTableColumns = [
      { Header: "#", accessor: "_id", isSortable: false, width: 10 },
      ...result?.payload?.data?.[0]?.fields
        ?.filter((field) => field?.isTableField === true)
        ?.map((field) => ({ Header: field?.label, accessor: field?.name })),
    ];
    setColumns(tempTableColumns);
    setIsLoding(false);
  };

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

  const unitsColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Name", accessor: "name" },
    { Header: "Sqm", accessor: "sqm" },
    { Header: "Price", accessor: "price" },
    { Header: "Executive", accessor: "executive" },
    {
      Header: "Action",
      center: true,
      cell: ({ row }) => (
        <Flex className="selectOpt">
          <Tooltip
            hasArrow
            label={"Move Up"}
            bg="gray.200"
            color="gray"
            textTransform={"capitalize"}
            fontSize="sm"
          >
            <Button
              size="sm"
              disabled={row?.index === 0}
              onClick={() => handleChangeOrder(row, "up")}
              variant="outline"
              me={2}
            >
              <MdMoveUp />
            </Button>
          </Tooltip>
          <Tooltip
            hasArrow
            label={"Move Down"}
            bg="gray.200"
            color="gray"
            textTransform={"capitalize"}
            fontSize="sm"
          >
            <Button
              size="sm"
              disabled={row?.index === unitTypeList?.length - 1}
              onClick={() => handleChangeOrder(row, "down")}
              variant="outline"
              me={2}
            >
              <MdMoveDown />
            </Button>
          </Tooltip>
          <Tooltip
            hasArrow
            label="Edit"
            bg="gray.200"
            color="gray"
            textTransform="capitalize"
            fontSize="sm"
          >
            <Button
              color="green"
              size="sm"
              onClick={() => handleEditOpen(row?.original)}
              variant="outline"
              me={2}
            >
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip
            hasArrow
            label="Delete"
            bg="gray.200"
            color="gray"
            textTransform="capitalize"
            fontSize="sm"
          >
            <Button
              color="red"
              variant="outline"
              size="sm"
              onClick={() => handleDeleteUnitType(row?.original)}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const fetchData = async (i) => {
    setIsLoding(true);
    let response = await getApi("api/property/view/", param?.id);
    setData(response?.data?.property);
    handleSetUnitTypeList(response?.data?.property?.unitType);
    setFilteredContacts(response?.data?.filteredContacts);
    setIsLoding(false);
  };

  const generatePDF = () => {
    const element = document.getElementById("reports");
    if (element) {
      element.style.display = "block";
      element.style.width = "100%"; // Adjust width for mobile
      element.style.height = "auto";
      html2pdf()
        .from(element)
        .set({
          margin: [0, 0, 0, 0],
          filename: `Property_Details_${moment().format("DD-MM-YYYY")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save()
        .then(() => {
          element.style.display = "";
        });
    } else {
      console.error("Element with ID 'reports' not found.");
    }
  };

  const handleDeleteProperties = async (id) => {
    try {
      setIsLoding(true);
      let response = await deleteApi("api/property/delete/", id);
      if (response?.status === 200) {
        setDelete(false);
        setAction((pre) => !pre);
        navigate("/properties");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

  const handleDeleteUnitTypes = async () => {
    setIsLoding(true);
    let response = await postApi(`api/property/delete-unit-type/${param?.id}`, {
      unitTypeId: selectedUnitType?._id,
    });
    if (response?.status === 200) {
      setDeleteModelUnitType(false);
      setAction((pre) => !pre);
    }
  };

  const [permission, emailAccess, callAccess] = HasAccess([
    "Properties",
    "Emails",
    "Calls",
  ]);

  const changeStatus = (status) => {
    switch (status) {
      case "Available":
        return "light-green";
      case "Booked":
        return "light-yellow";
      case "Sold":
        return "light-blue";
      case "Blocked":
        return "light-red";
      default:
        return "";
    }
  };

  const handleStatusChange = async (floor, selectedItem, newStatus) => {
    try {
      const paylaod = {
        unit: {
          ...selectedItem,
          status: newStatus,
        },
        floor,
      };
      setIsLoding(true);
      let response = await postApi(
        `api/property/change-unit-status/${param?.id}`,
        paylaod
      );
      if (response && response?.status === 200) {
        setAction((pre) => !pre);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const getOrdinalSuffix = (number) => {
    const suffix = ["th", "st", "nd", "rd"][number % 10] || "th";
    return number % 100 === 11 || number % 100 === 12 || number % 100 === 13
      ? "th"
      : suffix;
  };

  const handleViewUnitType = (item, floorName) => {
    setUnitOpenModel(true);
    setSelectedViewUnitType({
      unitType: data?.unitType?.find((unit) => unit?._id === item?.unitType),
      unit: item,
      floorName,
    });
  };

  const statusCount = data?.units?.reduce((acc, floor) => {
    floor?.flats?.forEach((flat) => {
      const status =
        flat?.status?.charAt(0)?.toUpperCase() +
        flat?.status?.slice(1)?.toLowerCase();

      if (acc[status]) {
        acc[status]++;
      } else {
        acc[status] = 1;
      }
    });
    return acc;
  }, {});

  useEffect(() => {
    dispatch(fetchPropertyCustomFiled());
    fetchData();
    fetchCustomDataFields();
  }, [action]);

  return (
    <>
      <Add
        isOpen={isOpen}
        size={size}
        onClose={onClose}
        propertyData={propertyData?.[0]}
      />

      <AddEditUnits
        isOpen={addUnit}
        size={size}
        actionType={actionType}
        selectedUnitType={selectedUnitType}
        setAction={setAction}
        onClose={() => {
          setSelectedUnitType({});
          setAddUnit(false);
          setActionType("");
        }}
      />

      <Edit
        isOpen={edit}
        size={size}
        onClose={setEdit}
        setAction={setAction}
        propertyData={propertyData?.[0]}
        data={data}
      />

      <CommonDeleteModel
        isOpen={deleteModel}
        onClose={() => setDelete(false)}
        type="Property"
        handleDeleteData={handleDeleteProperties}
        ids={param?.id}
      />

      <CommonDeleteModel
        isOpen={deleteunitModelUnitType}
        onClose={() => setDeleteModelUnitType(false)}
        handleDeleteData={handleDeleteUnitTypes}
        type="Unit Types"
      />

      <UnitTypeView
        data={selectedViewUnitType}
        isOpen={unitOpenModel}
        onClose={() => setUnitOpenModel(false)}
        unitTypeList={unitTypeList}
        setAction={setAction}
      />

      <ChangeStatusModel
        isOpen={availableModelOpen}
        clickOnYes={() => {
          handleStatusChange(
            selectedFloorItem?.floor,
            selectedFloorItem?.item,
            selectedFloorItem?.status
          );
          setAvailableModelOpen(false);
        }}
        title="Available"
        message="Are you sure to change status available?"
        onClose={() => setAvailableModelOpen(false)}
      />

      <ChangeStatusModel
        isOpen={soldModelOpen}
        clickOnYes={() => {
          handleStatusChange(
            selectedFloorItem?.floor,
            selectedFloorItem?.item,
            selectedFloorItem?.status
          );
          setSoldModelOpen(false);
        }}
        title="Sold"
        message="Are you sure to change status sold?"
        onClose={() => setSoldModelOpen(false)}
      />

      <ChangeStatusModel
        isOpen={blockedModelOpen}
        clickOnYes={() => {
          handleStatusChange(
            selectedFloorItem?.floor,
            selectedFloorItem?.item,
            selectedFloorItem?.status
          );
          setBlockedModelOpen(false);
        }}
        title="Blocked"
        message="Are you sure to change status block?"
        onClose={() => setBlockedModelOpen(false)}
      />

      <BookedModel
        selectedFloorItem={selectedFloorItem}
        isOpen={bookedOpen}
        setAction={setAction}
        onClose={() => setBookedOpen(false)}
      />

      {isLoding ? (
        <Flex justifyContent={"center"} alignItems={"center"} width="100%">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading size="lg" mt={0} m={3}>
            {data?.name || ""}
          </Heading>
          <Tabs onChange={handleTabChange} index={selectedTab}>
            <Grid templateColumns={"repeat(12, 1fr)"} mb={3} gap={1}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
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
                >
                  <Tab>Information</Tab>
                  {(emailAccess?.view || callAccess?.view) && (
                    <Tab> Communication</Tab>
                  )}
                  <Tab>Units</Tab>
                  <Tab>Gallery</Tab>
                </TabList>
              </GridItem>
              <GridItem
                colSpan={{ base: 12, md: 6 }}
                mt={{ sm: "3px", md: "5px" }}
              >
                <Flex justifyContent={"right"}>
                  <Menu>
                    {(user?.role === "superAdmin" ||
                      permission?.create ||
                      permission?.update ||
                      permission?.delete) && (
                        <MenuButton
                          variant="outline"
                          size="sm"
                          colorScheme="blackAlpha"
                          va
                          mr={2.5}
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                        >
                          Actions
                        </MenuButton>
                      )}
                    <MenuDivider />
                    <MenuList minWidth={2}>
                      {(user?.role === "superAdmin" || permission?.create) && (
                        <MenuItem
                          alignItems={"start"}
                          color={"blue"}
                          onClick={() => onOpen()}
                          icon={<AddIcon />}
                        >
                          Add
                        </MenuItem>
                      )}
                      {(user?.role === "superAdmin" || permission?.update) && (
                        <MenuItem
                          alignItems={"start"}
                          onClick={() => setEdit(true)}
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
                      {(user?.role === "superAdmin" || permission?.delete) && (
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
                  <Link to="/properties">
                    <Button
                      size="sm"
                      leftIcon={<IoIosArrowBack />}
                      variant="brand"
                    >
                      Back
                    </Button>
                  </Link>
                </Flex>
              </GridItem>
            </Grid>

            <TabPanels>
              <TabPanel pt={4} p={0}>
                <CustomView
                  data={propertyData?.[0]}
                  fieldData={data}
                  fetchData={fetchData}
                  editUrl={`api/property/edit/${param.id}`}
                  moduleId={propertyData?.[0]?._id}
                  id="reports"
                />
                {filteredContacts?.length > 0 && (
                  <GridItem colSpan={{ base: 12 }} mt={4}>
                    <Grid templateColumns={{ base: "1fr" }}>
                      <GridItem colSpan={2}>
                        <Grid templateColumns={"repeat(2, 1fr)"}>
                          <GridItem colSpan={{ base: 2 }}>
                            <CommonCheckTable
                              AdvanceSearch={false}
                              ManageGrid={false}
                              access={false}
                              columnData={columns ?? []}
                              // dataColumn={columns ?? []}
                              title={"Interested Contact"}
                              allData={filteredContacts ?? []}
                              tableData={filteredContacts}
                              // selectedColumns={selectedColumns}
                              // setSelectedColumns={setSelectedColumns}
                              size={"md"}
                              tableCustomFields={
                                contactData?.[0]?.fields?.filter(
                                  (field) => field?.isTableField === true
                                ) || []
                              }
                              customSearch={true}
                              checkBox={false}
                            />
                          </GridItem>
                        </Grid>
                      </GridItem>
                    </Grid>
                  </GridItem>
                )}
              </TabPanel>

              {/* communication */}
              <TabPanel pt={4} p={0}>
                <GridItem colSpan={{ base: 4 }}>
                  <Grid
                    overflow={"hidden"}
                    templateColumns={{ base: "1fr" }}
                    gap={4}
                  >
                    <Grid templateColumns={"repeat(12, 1fr)"} gap={4}>
                      {emailAccess?.view && (
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Card>
                            <CommonCheckTable
                              title={"Email"}
                              isLoding={isLoding}
                              columnData={columnsDataColumns ?? []}
                              allData={[]}
                              tableData={[]}
                              AdvanceSearch={false}
                              tableCustomFields={[]}
                              checkBox={false}
                              deleteMany={true}
                              ManageGrid={false}
                              onOpen={() => { }}
                              addBtn={false}
                              access={emailAccess}
                            />
                          </Card>
                        </GridItem>
                      )}
                      {callAccess?.view && (
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Card>
                            <CommonCheckTable
                              title={"Call"}
                              isLoding={isLoding}
                              columnData={callColumns ?? []}
                              allData={[]}
                              tableData={[]}
                              AdvanceSearch={false}
                              tableCustomFields={[]}
                              checkBox={false}
                              deleteMany={true}
                              ManageGrid={false}
                              onOpen={() => { }}
                              addBtn={false}
                              access={callAccess}
                            />
                          </Card>
                        </GridItem>
                      )}
                    </Grid>
                  </Grid>
                </GridItem>
              </TabPanel>

              <TabPanel pt={4} p={0}>
                <CommonCheckTable
                  title={"Units"}
                  isLoding={isLoding}
                  columnData={unitsColumns ?? []}
                  allData={unitTypeList ?? []}
                  tableData={unitTypeList ?? []}
                  AdvanceSearch={false}
                  tableCustomFields={[]}
                  checkBox={false}
                  deleteMany={true}
                  ManageGrid={false}
                  onOpen={() => setAddUnit(true)}
                  access={permission}
                />

                {/* Status Card */}
                <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={3}>
                  <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
                    <Card className="light-green" style={{ padding: "15px" }}>
                      Available <span>{statusCount?.Available || "0"}</span>
                    </Card>
                  </GridItem>
                  <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
                    <Card className="light-yellow" style={{ padding: "15px" }}>
                      Booked <span>{statusCount?.Booked || "0"}</span>
                    </Card>
                  </GridItem>
                  <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
                    <Card className="light-blue" style={{ padding: "15px" }}>
                      Sold <span>{statusCount?.Sold || "0"}</span>
                    </Card>
                  </GridItem>
                  <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
                    <Card className="light-red" style={{ padding: "15px" }}>
                      Blocked <span>{statusCount?.Blocked || "0"}</span>
                    </Card>
                  </GridItem>
                </Grid>

                {(data?.units || [])?.map((floor) =>
                  Array?.isArray(floor?.flats) && floor?.flats?.length > 0 ? (
                    <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={3}>
                      <GridItem rowSpan={2} colSpan={{ base: 12 }}>
                        {`${floor?.floorNumber}`}
                        <sup>{getOrdinalSuffix(floor?.floorNumber)}</sup> Floor
                      </GridItem>
                      {floor?.flats?.map((item, i) => (
                        <GridItem
                          rowSpan={2}
                          colSpan={{ base: 12, md: 6, lg: 3 }}
                          key={i}
                        >
                          <Card>
                            <Flex
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Flex>
                                <Flex
                                  className={changeStatus(item?.status)}
                                  style={{
                                    height: "30px",
                                    width: "30px",
                                    borderRadius: "50%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: "10PX",
                                  }}
                                >
                                  <FaHome />
                                </Flex>
                                <Tooltip
                                  hasArrow
                                  label={item?.flateName?.toString() || "-"}
                                  bg="gray.200"
                                  color="gray"
                                  textTransform="capitalize"
                                  fontSize="sm"
                                >
                                  {item?.flateName?.toString() || "-"}
                                </Tooltip>
                              </Flex>
                              <Flex alignItems="center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleViewUnitType(item, {
                                      floorNumber: floor?.floorNumber,
                                      floorNumberSuffix: getOrdinalSuffix(
                                        floor?.floorNumber
                                      ),
                                    })
                                  }
                                  me={2}
                                  colorScheme="green"
                                >
                                  <ViewIcon />
                                </Button>
                                <Menu isLazy placement="top">
                                  <MenuButton>
                                    <CiMenuKebab />
                                  </MenuButton>
                                  <MenuList
                                    minW={"fit-content"}
                                    transform={"translate(1520px, 173px);"}
                                  >
                                    {item?.status !== "Available" && (
                                      <MenuItem
                                        py={2.5}
                                        icon={
                                          <TbStatusChange
                                            fontSize={15}
                                            mb={1}
                                          />
                                        }
                                        onClick={() => {
                                          setAvailableModelOpen(true);
                                          setSelectedFloorItem({
                                            floor,
                                            item,
                                            status: "Available",
                                          });
                                        }}
                                      >
                                        Available
                                      </MenuItem>
                                    )}
                                    {!["Booked", "Sold", "Blocked"]?.includes(
                                      item?.status
                                    ) && (
                                        <MenuItem
                                          py={2.5}
                                          icon={
                                            <TbStatusChange
                                              fontSize={15}
                                              mb={1}
                                            />
                                          }
                                          onClick={() => {
                                            setBookedOpen(true);
                                            setSelectedFloorItem({
                                              floor,
                                              item,
                                              status: "Booked",
                                            });
                                          }}
                                        >
                                          Booked
                                        </MenuItem>
                                      )}
                                    {item?.status === "Booked" &&
                                      item?.status !== "Sold" && (
                                        <MenuItem
                                          py={2.5}
                                          icon={
                                            <TbStatusChange
                                              fontSize={15}
                                              mb={1}
                                            />
                                          }
                                          onClick={() => {
                                            setSoldModelOpen(true);
                                            setSelectedFloorItem({
                                              floor,
                                              item,
                                              status: "Sold",
                                            });
                                          }}
                                        >
                                          Sold
                                        </MenuItem>
                                      )}
                                    {user?.role === "superAdmin" &&
                                      item?.status !== "Blocked" && (
                                        <MenuItem
                                          py={2.5}
                                          icon={
                                            <MdBlock
                                              fontSize={15}
                                              mb={1}
                                            />
                                          }
                                          onClick={() => {
                                            setBlockedModelOpen(true);
                                            setSelectedFloorItem({
                                              floor,
                                              item,
                                              status: "Blocked",
                                            });
                                          }}
                                        >
                                          Blocked
                                        </MenuItem>
                                      )}
                                  </MenuList>
                                </Menu>
                              </Flex>
                            </Flex>
                          </Card>
                        </GridItem>
                      ))}
                    </Grid>
                  ) : (
                    <Card mt="5">
                      <Text
                        textAlign={"center"}
                        width="100%"
                        color={"gray.500"}
                        fontSize="sm"
                        fontWeight="700"
                      >
                        <DataNotFound />
                      </Text>
                    </Card>
                  )
                )}
              </TabPanel>

              <TabPanel pt={4} p={0}>
                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <Card>
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={12}>
                          <Box>
                            <Flex
                              flexWrap={"wrap"}
                              mb={3}
                              justifyContent={"space-between"}
                              alingItem={"center"}
                            >
                              <Heading size="md">Property Photos</Heading>
                              <Button
                                size="sm"
                                leftIcon={<AddIcon />}
                                onClick={() => setPropertyPhoto(true)}
                                variant="brand"
                              >
                                Add New
                              </Button>
                              <PropertyPhoto
                                text="Property Photos"
                                fetchData={fetchData}
                                isOpen={propertyPhoto}
                                onClose={setPropertyPhoto}
                                id={param?.id}
                              />
                            </Flex>
                            <HSeparator />
                          </Box>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                          <Flex
                            overflowY={"scroll"}
                            height={"150px"}
                            alingItem={"center"}
                          >
                            {data?.propertyPhotos?.length > 0 ? (
                              data &&
                              data?.propertyPhotos?.length > 0 &&
                              data?.propertyPhotos?.map((item) => (
                                <Image
                                  width={"150px"}
                                  m={1}
                                  src={item.img}
                                  alt="Your Image"
                                />
                              ))
                            ) : (
                              <Text
                                textAlign={"center"}
                                width="100%"
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                <DataNotFound />
                              </Text>
                            )}
                          </Flex>
                          {data?.propertyPhotos?.length > 0 ? (
                            <Flex justifyContent={"end"} mt={1}>
                              <Button
                                size="sm"
                                colorScheme="brand"
                                variant="outline"
                                onClick={() => {
                                  setDisplayPropertyPhoto(true);
                                  setType("photo");
                                }}
                              >
                                Show more
                              </Button>
                            </Flex>
                          ) : (
                            ""
                          )}
                        </GridItem>
                      </Grid>
                    </Card>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <Card>
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={12}>
                          <Box>
                            <Flex
                              flexWrap={"wrap"}
                              mb={3}
                              justifyContent={"space-between"}
                              alingItem={"center"}
                            >
                              <Heading size="md">
                                Virtual Tours or Videos
                              </Heading>
                              <Button
                                size="sm"
                                leftIcon={<AddIcon />}
                                onClick={() => setVirtualToursorVideos(true)}
                                variant="brand"
                              >
                                Add New
                              </Button>
                              <PropertyPhoto
                                text="Virtual Tours or Videos"
                                fetchData={fetchData}
                                isOpen={virtualToursorVideos}
                                onClose={setVirtualToursorVideos}
                                id={param?.id}
                              />
                            </Flex>
                            <HSeparator />
                          </Box>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                          <Flex
                            overflowY={"scroll"}
                            height={"150px"}
                            alingItem={"center"}
                          >
                            {data?.virtualToursOrVideos?.length > 0 ? (
                              data &&
                              data?.virtualToursOrVideos?.length > 0 &&
                              data?.virtualToursOrVideos?.map((item) => (
                                <video
                                  width="200"
                                  controls
                                  autoplay
                                  loop
                                  style={{ margin: "0 5px" }}
                                >
                                  <source src={item?.img} type="video/mp4" />
                                  <source src={item?.img} type="video/ogg" />
                                </video>
                              ))
                            ) : (
                              <Text
                                textAlign={"center"}
                                width="100%"
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                <DataNotFound />
                              </Text>
                            )}
                          </Flex>
                        </GridItem>
                      </Grid>
                    </Card>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <Card>
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={12}>
                          <Box>
                            <Flex
                              flexWrap={"wrap"}
                              mb={3}
                              justifyContent={"space-between"}
                              alingItem={"center"}
                            >
                              <Heading size="md">Floor Plans</Heading>
                              <Button
                                size="sm"
                                leftIcon={<AddIcon />}
                                onClick={() => setFloorPlans(true)}
                                variant="brand"
                              >
                                Add New
                              </Button>
                              <PropertyPhoto
                                text="Floor Plans"
                                fetchData={fetchData}
                                isOpen={floorPlans}
                                onClose={setFloorPlans}
                                id={param?.id}
                              />
                            </Flex>
                            <HSeparator />
                          </Box>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                          <Flex
                            overflowY={"scroll"}
                            height={"150px"}
                            alingItem={"center"}
                          >
                            {data?.floorPlans?.length > 0 ? (
                              data &&
                              data?.floorPlans?.length > 0 &&
                              data?.floorPlans?.map((item) => (
                                <Image
                                  key={item?.createOn}
                                  width={"30%"}
                                  m={1}
                                  src={item?.img}
                                  alt="Your Image"
                                />
                              ))
                            ) : (
                              <Text
                                textAlign={"center"}
                                width="100%"
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                <DataNotFound />
                              </Text>
                            )}
                          </Flex>
                          {data?.floorPlans?.length > 0 ? (
                            <Flex justifyContent={"end"} mt={1}>
                              <Button
                                size="sm"
                                colorScheme="brand"
                                variant="outline"
                                onClick={() => {
                                  setDisplayPropertyPhoto(true);
                                  setType("floor");
                                }}
                              >
                                Show more
                              </Button>
                            </Flex>
                          ) : (
                            ""
                          )}
                        </GridItem>
                      </Grid>
                    </Card>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <Card>
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={12}>
                          <Box>
                            <Flex
                              flexWrap={"wrap"}
                              mb={3}
                              justifyContent={"space-between"}
                              alingItem={"center"}
                            >
                              <Heading size="md">Property Documents</Heading>
                              <Button
                                size="sm"
                                variant="brand"
                                leftIcon={<AddIcon />}
                                onClick={() => setPropertyDocuments(true)}
                              >
                                Add New
                              </Button>
                              <PropertyPhoto
                                text="Property Documents"
                                fetchData={fetchData}
                                isOpen={propertyDocuments}
                                onClose={setPropertyDocuments}
                                id={param?.id}
                              />
                            </Flex>
                            <HSeparator />
                          </Box>
                        </GridItem>
                        <GridItem
                          colSpan={12}
                          sx={{ maxHeight: "200px", overflowX: "auto" }}
                        >
                          {data?.propertyDocuments?.length > 0 ? (
                            data &&
                            data?.propertyDocuments?.length > 0 &&
                            data?.propertyDocuments?.map((item) => {
                              const parts = item?.filename?.split(".");
                              const lastIndex = parts[parts?.length - 1];
                              return (
                                <Flex alignItems={"center"} mt="3">
                                  {lastIndex === "xlsx" && (
                                    <Image src={xlsx} boxSize="50px" />
                                  )}
                                  {lastIndex === "jpg" && (
                                    <Image src={jpg} boxSize="50px" />
                                  )}
                                  {lastIndex === "png" && (
                                    <Image src={png} boxSize="50px" />
                                  )}
                                  {lastIndex === "pdf" && (
                                    <Image src={pdf} boxSize="50px" />
                                  )}
                                  {lastIndex === "xls" && (
                                    <Image src={xls} boxSize="50px" />
                                  )}
                                  {lastIndex === "csv" && (
                                    <Image src={csv} boxSize="50px" />
                                  )}
                                  {!(
                                    lastIndex === "xls" ||
                                    lastIndex === "csv" ||
                                    lastIndex === "png" ||
                                    lastIndex === "pdf" ||
                                    lastIndex === "xlsx" ||
                                    lastIndex === "jpg"
                                  ) && <Image src={file} boxSize="50px" />}
                                  <Text
                                    ml={2}
                                    color="green.400"
                                    onClick={() => window.open(item?.img)}
                                    cursor={"pointer"}
                                    sx={{
                                      "&:hover": {
                                        color: "blue.500",
                                        textDecoration: "underline",
                                      },
                                    }}
                                  >
                                    {item?.filename}
                                  </Text>
                                </Flex>
                              );
                            })
                          ) : (
                            <Text
                              textAlign={"center"}
                              width="100%"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              <DataNotFound />
                            </Text>
                          )}
                        </GridItem>
                      </Grid>
                      {data?.propertyDocuments?.length > 0 ? (
                        <Flex justifyContent={"end"} mt={1}>
                          <Button
                            size="sm"
                            colorScheme="brand"
                            variant="outline"
                            onClick={() => {
                              setShowProperty(true);
                              setType("Doucument");
                            }}
                          >
                            Show more
                          </Button>
                        </Flex>
                      ) : (
                        ""
                      )}
                    </Card>
                  </GridItem>
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {(permission?.delete ||
            permission?.update ||
            user?.role === "superAdmin") && (
              <Card mt={3}>
                <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                  <GridItem colStart={6}>
                    <Flex justifyContent={"right"}>
                      {permission?.update && (
                        <Button
                          onClick={() => setEdit(true)}
                          size="sm"
                          leftIcon={<EditIcon />}
                          mr={2.5}
                          variant="outline"
                          colorScheme="green"
                        >
                          Edit
                        </Button>
                      )}
                      {permission?.delete && (
                        <Button
                          style={{ background: "red.800" }}
                          size="sm"
                          onClick={() => setDelete(true)}
                          leftIcon={<DeleteIcon />}
                          colorScheme="red"
                        >
                          Delete
                        </Button>
                      )}
                    </Flex>
                  </GridItem>
                </Grid>
              </Card>
            )}
        </>
      )}

      {/* property photo modal */}
      <Modal
        onClose={() => setDisplayPropertyPhoto(false)}
        isOpen={displayPropertyPhoto}
      >
        <ModalOverlay />
        <ModalContent maxWidth={"6xl"} height={"750px"}>
          <ModalHeader>
            {type === "photo"
              ? "Property All Photos"
              : type === "video"
                ? "Virtual Tours or Videos"
                : type === "floor"
                  ? "Floors plans"
                  : ""}
          </ModalHeader>
          <ModalCloseButton onClick={() => setDisplayPropertyPhoto(false)} />
          <ModalBody overflowY={"auto"} height={"700px"}>
            <div style={{ columns: 3 }}>
              {type === "photo"
                ? data &&
                data?.propertyPhotos?.length > 0 &&
                data?.propertyPhotos?.map((item) => (
                  <a href={item?.img} target="_blank">
                    <Image
                      width={"100%"}
                      m={1}
                      mb={4}
                      src={item?.img}
                      alt="Your Image"
                    />
                  </a>
                ))
                : type === "video"
                  ? data &&
                  data?.virtualToursOrVideos?.length > 0 &&
                  data?.virtualToursOrVideos?.map((item) => (
                    <a href={item.img} target="_blank">
                      <video
                        width="380"
                        controls
                        autoplay
                        loop
                        style={{ margin: " 5px" }}
                      >
                        <source src={item?.img} type="video/mp4" />
                        <source src={item?.img} type="video/ogg" />
                      </video>
                    </a>
                  ))
                  : type === "floor"
                    ? data &&
                    data?.floorPlans?.length > 0 &&
                    data?.floorPlans?.map((item) => (
                      <a href={item?.img} target="_blank">
                        <Image
                          width={"100%"}
                          m={1}
                          mb={4}
                          src={item?.img}
                          alt="Your Image"
                        />
                      </a>
                    ))
                    : ""}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              mr={2}
              onClick={() => setDisplayPropertyPhoto(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* property document modal */}
      <Modal onClose={() => setShowProperty(false)} isOpen={showProperty}>
        <ModalOverlay />
        <ModalContent maxWidth={"xl"} height={"750px"}>
          <ModalHeader>Property All Document</ModalHeader>
          <ModalCloseButton onClick={() => setShowProperty(false)} />
          <ModalBody overflowY={"auto"} height={"700px"}>
            {data?.propertyDocuments?.length > 0 ? (
              data &&
              data?.propertyDocuments?.length > 0 &&
              data?.propertyDocuments?.map((item) => {
                const parts = item?.filename?.split(".");
                const lastIndex = parts[parts?.length - 1];
                return (
                  <Flex alignItems={"center"} mt="3">
                    {lastIndex === "xlsx" && (
                      <Image src={xlsx} boxSize="50px" />
                    )}
                    {lastIndex === "jpg" && <Image src={jpg} boxSize="50px" />}
                    {lastIndex === "png" && <Image src={png} boxSize="50px" />}
                    {lastIndex === "pdf" && <Image src={pdf} boxSize="50px" />}
                    {lastIndex === "xls" && <Image src={xls} boxSize="50px" />}
                    {lastIndex === "csv" && <Image src={csv} boxSize="50px" />}
                    {!(
                      lastIndex === "xls" ||
                      lastIndex === "csv" ||
                      lastIndex === "png" ||
                      lastIndex === "pdf" ||
                      lastIndex === "xlsx" ||
                      lastIndex === "jpg"
                    ) && <Image src={file} boxSize="50px" />}
                    <Text
                      ml={2}
                      color="green.400"
                      onClick={() => window?.open(item?.img)}
                      cursor={"pointer"}
                      sx={{
                        "&:hover": {
                          color: "blue.500",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {item?.filename}
                    </Text>
                  </Flex>
                );
              })
            ) : (
              <Text
                textAlign={"center"}
                width="100%"
                color={textColor}
                fontSize="sm"
                fontWeight="700"
              >
                <DataNotFound />
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              mr={2}
              onClick={() => setShowProperty(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default View;
