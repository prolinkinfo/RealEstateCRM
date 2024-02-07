import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Switch,
  Table,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  MenuDivider,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import * as XLSX from 'xlsx'

// Custom components
import { CloseIcon, DeleteIcon, DownloadIcon, EditIcon, EmailIcon, PhoneIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import Delete from "../Delete";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import Add from "../Add";
import { AddIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import Edit from "../Edit";
import { Formik, useFormik } from "formik";
import { BsColumnsGap } from "react-icons/bs";
import * as yup from "yup"
import ImportModal from "./ImportModal";
import { HasAccess } from "../../../../redux/accessUtils";
import CustomSearchInput from "components/search/search";
import { putApi } from "services/api";

export default function CheckTable(props) {
  const { columnsData, tableData, dataColumn, fetchData, isLoding, setIsLoding, allData, access, setSearchedData, setDisplaySearchData, displaySearchData, selectedColumns, setSelectedColumns, dynamicColumns, setDynamicColumns, callAccess, emailAccess, setAction, action } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [leadData, setLeadData] = useState([])
  const columns = useMemo(() => dataColumn, [dataColumn]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [gopageValue, setGopageValue] = useState()
  const [deleteModel, setDelete] = useState(false);
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [callSelectedId, setCallSelectedId] = useState();
  const navigate = useNavigate();
  const data = useMemo(() => tableData, [tableData]);
  const user = JSON.parse(localStorage.getItem("user"))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [edit, setEdit] = useState(false);
  const [isImportLead, setIsImportLead] = useState(false);
  const [searchbox, setSearchbox] = useState('');
  const [column, setColumn] = useState('');
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn); // State to track changes

  const csvColumns = [
    { Header: 'Name', accessor: 'leadName' },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Email", accessor: "leadEmail" },
    { Header: "Phone Number", accessor: "leadPhoneNumber" },
    { Header: "Owner", accessor: "leadOwner" },
    { Header: "Score", accessor: "leadScore" },
  ];

  let isColumnSelected;
  const toggleColumnVisibility = (columnKey) => {
    setColumn(columnKey)
    isColumnSelected = tempSelectedColumns.some((column) => column.accessor === columnKey);

    if (isColumnSelected) {
      const updatedColumns = tempSelectedColumns.filter((column) => column.accessor !== columnKey);
      setTempSelectedColumns(updatedColumns);
      console.log(columnKey, "1111111111")
    } else {
      const columnToAdd = dynamicColumns.find((column) => column.accessor === columnKey);
      setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
      console.log(columnToAdd.accessor, "2222222")
    }
  };
  console.log("selectedColumns", selectedColumns)
  const handleColumnClear = () => {
    isColumnSelected = selectedColumns.some((selectedColumn) => selectedColumn.accessor === column.accessor)
    setTempSelectedColumns(dynamicColumns);
    // setManageColumns(!manageColumns ? !manageColumns : false)
    console.log(tempSelectedColumns)
  }

  const initialValues = {
    leadName: '',
    leadStatus: '',
    leadEmail: '',
    leadPhoneNumber: '',
    leadAddress: '',
    leadOwner: '',
    fromLeadScore: '',
    toLeadScore: ''
  }
  const validationSchema = yup.object({
    leadName: yup.string(),
    leadStatus: yup.string(),
    leadEmail: yup.string().email("Lead Email is invalid"),
    leadPhoneNumber: yup.number().typeError('Enter Number').min(0, 'Lead Phone Number is invalid').max(999999999999, 'Lead Phone Number is invalid').notRequired(),
    leadAddress: yup.string(),
    leadOwner: yup.string(),
    fromLeadScore: yup.number().min(0, "From Lead Score is invalid"),
    toLeadScore: yup.number().min(yup.ref('fromLeadScore'), "To Lead Score must be greater than or equal to From Lead Score")
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values?.leadName || (item?.leadName && item?.leadName.toLowerCase().includes(values?.leadName?.toLowerCase()))) &&
          (!values?.leadStatus || (item?.leadStatus && item?.leadStatus.toLowerCase().includes(values?.leadStatus?.toLowerCase()))) &&
          (!values?.leadEmail || (item?.leadEmail && item?.leadEmail.toLowerCase().includes(values?.leadEmail?.toLowerCase()))) &&
          (!values?.leadPhoneNumber || (item?.leadPhoneNumber && item?.leadPhoneNumber.toString().includes(values?.leadPhoneNumber))) &&
          (!values?.leadOwner || (item?.leadOwner && item?.leadOwner.toLowerCase().includes(values?.leadOwner?.toLowerCase()))) &&
          ([null, undefined, ''].includes(values?.fromLeadScore) || [null, undefined, ''].includes(values?.toLeadScore) ||
            ((item?.leadScore || item?.leadScore === 0) &&
              (parseInt(item?.leadScore, 10) >= parseInt(values.fromLeadScore, 10) || 0) &&
              (parseInt(item?.leadScore, 10) <= parseInt(values.toLeadScore, 10) || 0)))
      )
      let getValue = [values.leadName, values?.leadStatus, values?.leadEmail, values?.leadPhoneNumber, values?.leadOwner, (![null, undefined, ''].includes(values?.fromLeadScore) && `${values.fromLeadScore}-${values.toLeadScore}`) || undefined].filter(value => value);
      setGetTagValues(getValue)
      setSearchedData(searchResult);
      setDisplaySearchData(true)
      setAdvaceSearch(false)
      setSearchClear(true)
      resetForm();
    }
  })
  const handleClear = () => {
    setDisplaySearchData(false)
  }

  const resetForm1 = () => {
    setTempSelectedColumns(dynamicColumns)
  }

  useEffect(() => {
    setSearchedData && setSearchedData(data);
  }, []);
  const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik
  const tableInstance = useTable(
    {
      columns, data,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance;


  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length)
  }

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

  const handleClick = () => {
    onOpen()
  }

  const fetchCustomData = async () => {
    const response = await getApi('api/custom-field?moduleName=lead')
    // const response = await getApi('api/custom-field?moduleName=templead6')
    setLeadData(response.data)
  }

  useEffect(() => {
    if (fetchCustomData) fetchCustomData()
  }, [action])

  const size = "lg";

  const handleExportLeads = (extension) => {
    if (selectedValues && selectedValues?.length > 0) {
      downloadCsvOrExcel(extension, selectedValues);
    }
    else {
      downloadCsvOrExcel(extension);
    }
  }

  const downloadCsvOrExcel = async (extension, selectedIds) => {
    try {
      if (selectedIds && selectedIds?.length > 0) {
        const selectedRecordsWithSpecificFileds = tableData?.filter((rec) => selectedIds.includes(rec._id))?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns.forEach((property) => {
            selectedFieldsData[property.accessor] = rec[property.accessor];
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, 'lead', extension);
      } else {
        const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns.forEach((property) => {
            selectedFieldsData[property.accessor] = rec[property.accessor];
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(AllRecordsWithSpecificFileds, csvColumns, 'lead', extension);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const convertJsonToCsvOrExcel = (jsonArray, csvColumns, fileName, extension) => {
    const csvHeader = csvColumns.map((col) => col.Header);

    const csvContent = [
      csvHeader,
      ...jsonArray.map((row) => csvColumns.map((col) => row[col.accessor]))
    ];

    const ws = XLSX.utils.aoa_to_sheet(csvContent);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, `${fileName}.${extension}`);    // .csv, .xlsx
    setSelectedValues([])
  };

  useEffect(() => {
    if (fetchData) fetchData()
  }, [action])

  const handleSearch = (results) => {
    setSearchedData(results);
  };
  const setStatusData = async (cell, e) => {
    try {
      setIsLoding(true)
      let response = await putApi(`api/lead/changeStatus/${cell?.row?.original?._id}`, { leadStatus: e.target.value });
      if (response.status === 200) {
        setAction((pre) => !pre)
      }
    } catch (e) {
      console.log(e);
    }
    finally {
      setIsLoding(false)
    }
  }
  const changeStatus = (cell) => {
    switch (cell.value) {
      case 'pending':
        return 'pending';
      case 'active':
        return 'completed';
      case 'sold':
        return 'onHold';
      default:
        return '';
    }
  }

  return (
    <>
      <Card
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={4}>
          <GridItem colSpan={8} >
            <Flex alignItems={"center"} flexWrap={"wrap"}>
              <Text
                color={"secondaryGray.900"}
                fontSize="22px"
                fontWeight="700"
              >
                Leads  (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
              </Text>
              <CustomSearchInput setSearchbox={setSearchbox} setDisplaySearchData={setDisplaySearchData} searchbox={searchbox} allData={allData} dataColumn={dataColumn} onSearch={handleSearch} />
              <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} onClick={() => setAdvaceSearch(true)} size="sm">Advance Search</Button>
              {displaySearchData ? <Button variant="outline" size="sm" colorScheme='red' ms={2} onClick={() => { handleClear(); setSearchbox(''); setGetTagValues([]) }}>Clear</Button> : ""}
              {(selectedValues.length > 0 && access?.delete) && <DeleteIcon cursor={"pointer"} onClick={() => setDelete(true)} color={'red'} ms={2} />}
            </Flex>
          </GridItem>
          <GridItem colSpan={4} display={"flex"} justifyContent={"end"} alignItems={"center"} textAlign={"right"}>
            <Menu isLazy  >
              <MenuButton p={4}>
                <BsColumnsGap />
              </MenuButton>
              <MenuList minW={'fit-content'} transform={"translate(1670px, 60px)"} zIndex={2} >
                <MenuItem onClick={() => setManageColumns(true)} width={"165px"}> Manage Columns
                </MenuItem>
                <MenuItem width={"165px"} onClick={() => setIsImportLead(true)}> Import Leads
                </MenuItem>
                <MenuDivider />
                <MenuItem width={"165px"} onClick={() => handleExportLeads('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                <MenuItem width={"165px"} onClick={() => handleExportLeads('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
              </MenuList>
            </Menu>
            {access?.create && <Button onClick={() => handleClick()} size="sm"
              variant="brand" leftIcon={<AddIcon />}>Add New</Button>}
          </GridItem>
          <HStack spacing={4}>
            {getTagValues && getTagValues.map((item) => (
              <Tag
                size={"md"}
                p={2}
                key={item}
                borderRadius='full'
                variant='solid'
                colorScheme="gray"
              >
                <TagLabel>{item}</TagLabel>
                {/* <TagCloseButton /> */}
              </Tag>
            ))}
          </HStack>
        </Grid>

        <Box overflowY={"auto"} className="table-fix-container">
          <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
            <Thead zIndex={1}>
              {headerGroups?.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers?.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                    >
                      <Flex
                        align="center"
                        justifyContent={column.center ? "center" : "start"}
                        fontSize={{ sm: "14px", lg: "16px" }}
                        color="secondaryGray.900"
                      >
                        <span style={{ textTransform: "capitalize", marginRight: "8px" }}>
                          {column.render("Header")}
                        </span>
                        {column.isSortable !== false && (
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />}
                          </span>
                        )}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>

              {isLoding ?
                <Tr>
                  <Td colSpan={columns?.length}>
                    <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
                : data?.length === 0 ? (
                  <Tr>
                    <Td colSpan={columns.length}>
                      <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                        -- No Data Found --
                      </Text>
                    </Td>
                  </Tr>
                ) : page?.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr {...row?.getRowProps()} key={i} className="leadRow">
                      {row?.cells?.map((cell, index) => {
                        let data = "";
                        if (cell?.column.Header === "#") {
                          data = (
                            <Flex align="center">
                              <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" />
                              <Text color={textColor} fontSize="sm"
                                // fontWeight="500"
                                fontWeight="700"
                              >
                                {cell?.row?.index + 1}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "Name") {
                          data = (
                            access?.view ? <Link to={`/leadView/${cell?.row?.values._id}`}>
                              <Text
                                me="10px"
                                sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                color='brand.600'
                                fontSize="sm"
                                // fontWeight="500"
                                fontWeight="700"
                              >
                                {cell?.value}
                              </Text>
                            </Link> :
                              <Text
                                me="10px"
                                fontSize="sm"
                                // fontWeight="500"
                                fontWeight="700"
                              >
                                {cell?.value}
                              </Text>
                          );
                        } else if (cell?.column.Header === "Email") {
                          data = (
                            emailAccess?.create ? <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                              color='brand.600'
                              sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
                              onClick={() => {
                                setAddEmailHistory(true)
                                setSelectedId(cell?.row?.values._id)
                              }
                              }
                            >
                              {cell?.value}
                            </Text> : <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Phone Number") {
                          data = (
                            callAccess?.create ? <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                              color='brand.600'
                              sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
                              onClick={() => {
                                setAddPhoneCall(true)
                                setCallSelectedId(cell?.row?.values._id)
                              }
                              }
                            >
                              {cell?.value}
                            </Text> : <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Address") {
                          data = (
                            <Text color={textColor} fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Status") {
                          data = (
                            <Select placeholder='Select option' className={changeStatus(cell)} onChange={(e) => setStatusData(cell, e)} height={7} width={130} value={cell?.value} style={{ fontSize: "14px" }}>
                              <option value='active'>Active</option>
                              <option value='sold'>Sold</option>
                              <option value='pending'>Pending</option>
                            </Select>
                          );
                        } else if (cell?.column.Header === "Owner") {
                          data = (
                            <Text color={textColor} fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Score") {
                          data = (
                            <Text color={
                              cell?.value < 40
                                ? 'red.600'
                                : cell?.value < 80
                                  ? 'yellow.400'
                                  : 'green.600'
                            } fontSize="md" fontWeight="900" textAlign={"center"} >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Action") {
                          data = (
                            <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                              <Menu isLazy  >
                                <MenuButton><CiMenuKebab /></MenuButton>
                                <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                                  {access?.update && <MenuItem py={2.5} onClick={() => { setEdit(true); setSelectedId(cell?.row?.original._id) }} icon={<EditIcon fontSize={15} />}>Edit</MenuItem>}
                                  {callAccess?.create && <MenuItem py={2.5} width={"165px"} onClick={() => { setAddPhoneCall(true); setCallSelectedId(cell?.row?.values._id) }} icon={<PhoneIcon fontSize={15} />}>Create Call</MenuItem>}
                                  {emailAccess?.create && <MenuItem py={2.5} width={"165px"} onClick={() => { setAddEmailHistory(true); setSelectedId(cell?.row?.values._id) }} icon={<EmailIcon fontSize={15} />}>Send Email</MenuItem>}
                                  {access?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/leadView/${cell?.row?.original._id}`)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>}
                                  {access?.delete && <MenuItem py={2.5} color={'red'} onClick={() => { setSelectedValues([cell?.row?.original._id]); setDelete(true) }} icon={<DeleteIcon fontSize={15} />}>Delete</MenuItem>}
                                </MenuList>
                              </Menu>
                            </Text>
                          )
                        }
                        return (
                          <Td
                            {...cell?.getCellProps()}
                            key={index}
                            fontSize={{ sm: "14px" }}
                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                            borderColor="transparent"
                          >
                            {data}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </Box>
        {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}

        <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} data={data?.contact} lead='true' id={selectedId} />
        <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} data={data?.contact} id={callSelectedId} lead='true' />

        {isOpen && <Add isOpen={isOpen} size={size} setLeadData={setLeadData} leadData={leadData[0]} onClose={onClose} setAction={setAction} action={action} />}
        <Edit isOpen={edit} size={size} selectedId={selectedId} setSelectedId={setSelectedId} onClose={setEdit} setAction={setAction} />
        <ImportModal text='Lead file' fetchData={fetchData} isOpen={isImportLead} onClose={setIsImportLead} />

      </Card>
      {/* Advance filter */}
      <Modal onClose={() => { setAdvaceSearch(false); resetForm() }} isOpen={advaceSearch} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Advance Search</ModalHeader>
          <ModalCloseButton onClick={() => { setAdvaceSearch(false); resetForm() }} />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Name
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.leadName}
                  name="leadName"
                  placeholder='Enter Lead Name'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.leadName && touched.leadName && errors.leadName}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Status
                </FormLabel>
                <Select
                  value={values?.leadStatus}
                  fontSize='sm'
                  name="leadStatus"
                  onChange={handleChange}
                  fontWeight='500'
                  placeholder={'Select Lead Status'}
                >
                  <option value='active'>active</option>
                  <option value='pending'>pending</option>
                  <option value='sold'>sold</option>
                </Select>
                <Text mb='10px' color={'red'}> {errors.leadStatus && touched.leadStatus && errors.leadStatus}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                  Email
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.leadEmail}
                  name="leadEmail"
                  placeholder='Enter Lead Email'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.leadEmail && touched.leadEmail && errors.leadEmail}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Phone Number
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.leadPhoneNumber}
                  name="leadPhoneNumber"
                  placeholder='Enter Lead PhoneNumber'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.leadPhoneNumber && touched.leadPhoneNumber && errors.leadPhoneNumber}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Owner
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.leadOwner}
                  name="leadOwner"
                  placeholder='Enter Lead Owner'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.leadOwner && touched.leadOwner && errors.leadOwner}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Score
                </FormLabel>
                <Flex justifyContent={"space-between"}>
                  <Box w={"49%"}>
                    <Input
                      fontSize='sm'
                      onChange={(e) => {
                        setFieldValue('toLeadScore', e.target.value)
                        handleChange(e)
                      }}
                      onBlur={handleBlur}
                      value={values.fromLeadScore}
                      name="fromLeadScore"
                      placeholder='From Lead Score'
                      fontWeight='500'
                      type='number'
                      borderColor={errors.fromLeadScore && touched.fromLeadScore ? "red.300" : null}
                    />

                  </Box>
                  <Box w={"49%"} >
                    <Input
                      fontSize='sm'
                      onChange={(e) => {
                        values.fromLeadScore <= e.target.value && handleChange(e)
                      }}
                      onBlur={handleBlur}
                      value={values.toLeadScore}
                      name="toLeadScore"
                      placeholder='To Lead Score'
                      fontWeight='500'
                      type='number'
                      borderColor={errors.toLeadScore && touched.toLeadScore ? "red.300" : null}
                      disabled={[null, undefined, ''].includes(values.fromLeadScore) || values.fromLeadScore < 0}
                    />
                  </Box>
                </Flex>
                <Text mb='10px' color={'red'}> {errors.fromLeadScore && touched.fromLeadScore && errors.fromLeadScore}</Text>

              </GridItem>

            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" colorScheme='green' size="sm" mr={2} onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
            <Button colorScheme="red" size="sm" onClick={() => resetForm()}>Clear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Manage Columns */}
      <Modal onClose={() => { setManageColumns(false) }} isOpen={manageColumns} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Columns</ModalHeader>
          <ModalCloseButton onClick={() => { setManageColumns(false) }} />
          <ModalBody>
            <div>
              {dynamicColumns.map((column) => (
                <Text display={"flex"} key={column.accessor} py={2}>
                  <Checkbox
                    value={selectedColumns.some((selectedColumn) => selectedColumn.accessor === column.accessor)}
                    defaultChecked={selectedColumns.some((selectedColumn) => selectedColumn.accessor === column.accessor)}
                    onChange={() => toggleColumnVisibility(column.accessor)}
                    pe={2}
                  />
                  {column.Header}
                </Text>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" colorScheme='green' size="sm" mr={2} onClick={() => {
              setSelectedColumns(tempSelectedColumns);
              setManageColumns(false);
              resetForm();
            }} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
            <Button size="sm" colorScheme="red" onClick={() => handleColumnClear()}>Clear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Delete model */}
      <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/lead/deleteMany' data={selectedValues} method='many' setAction={setAction} />
    </>

  );
}
