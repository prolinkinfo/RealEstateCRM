import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CommonDeleteModel from "components/commonDeleteModel";
import DataNotFound from "components/notFoundData";
import { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteManyApi } from "services/api";
import Spinner from "../../../components/spinner/Spinner";
import { HasAccess } from "../../../redux/accessUtils";
import { fetchPropertyCustomFiled } from "../../../redux/slices/propertyCustomFiledSlice";
import { fetchPropertyData } from "../../../redux/slices/propertySlice";
import Add from "./Add";
import ImportModal from "./components/ImportModal";
import Edit from "./Edit";
import PaginationProperty from "./PaginationProperty";
import { BsColumnsGap } from "react-icons/bs";

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [permission] = HasAccess(["Properties"]);
  const [isLoding, setIsLoding] = useState(false);
  // const [data, setData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  // const [dataColumn, setDataColumn] = useState([]);
  // const [selectedColumns, setSelectedColumns] = useState([]);
  const [action, setAction] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [propertyData, setPropertyData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [deleteModel, setDelete] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedValues, setSelectedValues] = useState([]);
  const [isImportProperty, setIsImportProperty] = useState(false);

  //pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [rangeData, setRangeData] = useState(10)
  const [gotoPage, setGotoPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageOptions, setpageOptions] = useState(Array.from({ length: pageSize }));
  const pageCount = 5

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const previousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  console.log(currentPage, "currentPage");


  const data = useSelector((state) => state?.propertyData?.data);



  const fetchCustomDataFields = async () => {
    setIsLoding(true);
    const result = await dispatch(fetchPropertyCustomFiled());
    if (result.payload.status === 200) {
      setPropertyData(result?.payload?.data);
    } else {
      toast.error("Failed to fetch data", "error");
    }
    const actionHeader = {
      Header: "Action",
      accessor: "action",
      isSortable: false,
      center: true,
      cell: ({ row }) => (
        <Text fontSize="md" fontWeight="900" textAlign={"center"}>
          <Menu isLazy>
            <MenuButton>
              <CiMenuKebab />
            </MenuButton>
            <MenuList
              minW={"fit-content"}
              transform={"translate(1520px, 173px);"}
            >
              {permission?.update && (
                <MenuItem
                  py={2.5}
                  icon={<EditIcon fontSize={15} mb={1} />}
                  onClick={() => {
                    setEdit(true);
                    setSelectedId(row?.values?._id);
                  }}
                >
                  Edit
                </MenuItem>
              )}
              {permission?.view && (
                <MenuItem
                  py={2.5}
                  color={"green"}
                  icon={<ViewIcon mb={1} fontSize={15} />}
                  onClick={() => {
                    navigate(`/propertyView/${row?.values?._id}`);
                  }}
                >
                  View
                </MenuItem>
              )}
              {permission?.delete && (
                <MenuItem
                  py={2.5}
                  color={"red"}
                  icon={<DeleteIcon fontSize={15} mb={1} />}
                  onClick={() => {
                    setDelete(true);
                    setSelectedValues([row?.values?._id]);
                    setSelectedId(row?.values?._id);
                  }}
                >
                  Delete
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Text>
      ),
    };
    const tempTableColumns = [
      { Header: "#", accessor: "_id", isSortable: false, width: 10 },
      ...(result?.payload?.data && result.payload.data.length > 0
        ? result.payload.data[0]?.fields
          ?.filter((field) => field?.isTableField === true && field?.isView)
          ?.map((field) => ({
            Header: field?.label,
            accessor: field?.name,
            cell: (cell) => (
              <div className="selectOpt">
                <Text
                  onClick={() => {
                    navigate(`/propertyView/${cell?.row?.original?._id}`);
                  }}
                  me="10px"
                  sx={{
                    "&:hover": {
                      color: "blue.500",
                      textDecoration: "underline",
                    },
                    cursor: "pointer",
                  }}
                  color="brand.600"
                  fontSize="sm"
                  fontWeight="700"
                >
                  {cell?.value || "-"}
                </Text>
              </div>
            ),
          })) || []
        : []),
      ...(result?.payload?.data?.[0]?.fields || []) // Ensure result.payload[0].fields is an array
        .filter((field) => field?.isTableField === true && !field?.isView) // Filter out fields where isTableField is true
        .map((field) => ({ Header: field?.label, accessor: field?.name })),
      ...(permission?.update || permission?.view || permission?.delete
        ? [actionHeader]
        : []),
    ];

    setColumns(tempTableColumns);
    setIsLoding(false);
  };

  const handleDeleteProperties = async (ids) => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi("api/property/deleteMany", ids);
      if (response.status === 200) {
        setSelectedValues([]);
        setDelete(false);
        setAction((pre) => !pre);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

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

  useEffect(() => {
    dispatch(fetchPropertyData());
    fetchCustomDataFields();
  }, [action]);

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };
  const displayedData = data.slice(
    currentPage * rangeData,
    (currentPage + 1) * rangeData
  );

  return (
    <div>
      {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
                {!isLoding &&
                    <GridItem colSpan={6}>
                        <CommonCheckTable
                            title={"Properties"}
                            isLoding={isLoding}
                            columnData={columns ?? []}
                            // dataColumn={dataColumn ?? []}
                            allData={data ?? []}
                            tableData={data}
                            tableCustomFields={propertyData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
                            access={permission}
                            // action={action}
                            // setAction={setAction}
                            // selectedColumns={selectedColumns}
                            // setSelectedColumns={setSelectedColumns}
                            // isOpen={isOpen}
                            // onClose={onclose}
                            onOpen={onOpen}
                            selectedValues={selectedValues}
                            setSelectedValues={setSelectedValues}
                            setDelete={setDelete}
                            setIsImport={setIsImportProperty}
                        />
                    </GridItem>
                }
            </Grid> */}
      <Flex justifyContent={"end"} alignItems={'center'} mb={3}>
        {selectedValues.length > 0 && (
          <Button
            variant="outline"
            colorScheme="brand"
            color={"red"}
            mr={2}
            leftIcon={<DeleteIcon />}
            onClick={() => {
              setDelete(true);
            }}
            size="sm"
          >
            Delete
          </Button>
        )}
        <Menu isLazy>
          <MenuButton p={4}>
            <BsColumnsGap />
          </MenuButton>
          <MenuList
            minW={"fit-content"}
            transform={"translate(1670px, 60px)"}
            zIndex={2}
          >
            <MenuItem width="165px"
              onClick={() => setIsImportProperty(true)}
            >
              Import Properties
            </MenuItem>
            <MenuDivider />
            <MenuItem
              width="165px"
            //  onClick={() => handleExportLeads("csv")}
            >
              {selectedValues && selectedValues?.length > 0
                ? "Export Selected Data as CSV"
                : "Export as CSV"}
            </MenuItem>
            <MenuItem
              width="165px"
            // onClick={() => handleExportLeads("xlsx")}
            >
              {selectedValues && selectedValues?.length > 0
                ? "Export Selected Data as Excel"
                : "Export as Excel"}
            </MenuItem>
          </MenuList>
        </Menu>
        <Button
          size="sm"
          variant="brand"
          me={1}
          onClick={() => onOpen()}
          leftIcon={<AddIcon />}
        >
          Add New
        </Button>
      </Flex>

      <Grid templateColumns="repeat(12, 1fr)" gap={3} my={3}>
        <GridItem cursor="pointer" rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
          <Card className="light-green" style={{ padding: "15px" }}>
            Available
          </Card>
        </GridItem>
        <GridItem cursor="pointer" rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
          <Card className="light-yellow" style={{ padding: "15px" }}>
            Booked
          </Card>
        </GridItem>
        <GridItem cursor="pointer" rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
          <Card className="light-blue" style={{ padding: "15px" }}>
            Sold
          </Card>
        </GridItem>
        <GridItem cursor="pointer" rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
          <Card className="light-red" style={{ padding: "15px" }}>
            Blocked
          </Card>
        </GridItem>
      </Grid>

      {isLoding ? (
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          width="100%"
          fontSize="sm"
          fontWeight="700"
        >
          <Spinner />
        </Flex>
      ) : displayedData && displayedData.length > 0 ? (
        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
          {displayedData?.map((item, i) => (
            <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }} key={i} >
              <Card >
                <Flex alignItems={"center"} justifyContent={"space-between"} >
                  <Flex>
                    <Checkbox
                      colorScheme="brandScheme"
                      value={selectedValues}
                      isChecked={selectedValues.includes(item?._id)}
                      onChange={(event) =>
                        handleCheckboxChange(event, item?._id)
                      }
                      me="10px"
                    />
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
                      label={item?.name}
                      bg="gray.200"
                      color="gray"
                      textTransform={"capitalize"}
                      fontSize="sm"
                    >
                      <Heading
                        size="md"
                        fontWeight={"500"}
                        onClick={() => {
                          navigate(`/propertyView/${item?._id}`);
                        }}
                        sx={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "8rem",
                          overflow: "hidden",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {item?.name}
                      </Heading>
                    </Tooltip>
                  </Flex>
                  <Menu isLazy>
                    <MenuButton>
                      <CiMenuKebab />
                    </MenuButton>
                    <MenuList
                      minW={"fit-content"}
                      transform={"translate(1520px, 173px);"}
                    >
                      {permission?.update && (
                        <MenuItem
                          py={2.5}
                          icon={<EditIcon fontSize={15} mb={1} />}
                          onClick={() => {
                            setEdit(true);
                            setSelectedId(item?._id);
                          }}
                        >
                          Edit
                        </MenuItem>
                      )}
                      {permission?.view && (
                        <MenuItem
                          py={2.5}
                          color={"green"}
                          icon={<ViewIcon mb={1} fontSize={15} />}
                          onClick={() => {
                            navigate(`/propertyView/${item?._id}`);
                          }}
                        >
                          View
                        </MenuItem>
                      )}
                      {permission?.delete && (
                        <MenuItem
                          py={2.5}
                          color={"red"}
                          icon={<DeleteIcon fontSize={15} mb={1} />}
                          onClick={() => {
                            setSelectedValues([item?._id]);
                            setDelete(true);
                          }}
                        >
                          Delete
                        </MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                  {/* <Flex>
                    <Button
                      size="sm"
                      variant="outline"
                      me={2}
                      color={"green"}
                      onClick={() => {
                        setEdit(true);
                        setSelectedId(item?._id);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      me={2}
                      color={"red"}
                      onClick={() => {
                        setSelectedValues(item?._id)
                        setDelete(true)
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Flex> */}
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
      )}

      {isOpen && (
        <Add
          propertyData={propertyData[0]}
          isOpen={isOpen}
          size={"lg"}
          onClose={onClose}
          setAction={setAction}
        />
      )}
      {edit && (
        <Edit
          isOpen={edit}
          size={"lg"}
          propertyData={propertyData[0]}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onClose={setEdit}
          setAction={setAction}
        />
      )}
      {deleteModel && (
        <CommonDeleteModel
          isOpen={deleteModel}
          onClose={() => setDelete(false)}
          type="Properties"
          handleDeleteData={handleDeleteProperties}
          ids={selectedValues}
        />
      )}
      {isImportProperty && (
        <ImportModal
          text="Property file"
          isOpen={isImportProperty}
          onClose={setIsImportProperty}
          customFields={propertyData?.[0]?.fields || []}
        />
      )}
      <Card mt={3} p={2}>
        {/* <Grid templateColumns="repeat(6, 1fr)" gap={1} style={{ display: 'block', margin: 'auto' }}>
          <GridItem colSpan={{ base: 2 }} > */}
        <PaginationProperty currentPage={currentPage} dataLength={data?.length} nextPage={nextPage} previousPage={previousPage} setpageOptions={setpageOptions} pageCount={pageCount} pageOptions={pageOptions} gotoPage={gotoPage} pageSize={pageSize} setPageSize={setPageSize} setGotoPage={setGotoPage} setCurrentPage={setCurrentPage} rangeData={rangeData} setRangeData={setRangeData} />

        {/* </GridItem>
        </Grid> */}
      </Card>
    </div>
  );
};

export default Index;
