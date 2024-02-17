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
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  MenuDivider,
  useColorModeValue
} from "@chakra-ui/react";
import * as yup from "yup"
import { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import * as XLSX from 'xlsx'

// Custom components
import { AddIcon, DeleteIcon, EditIcon, EmailIcon, PhoneIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import Delete from "../Delete";
import Add from "../Add";
import { BsColumnsGap } from "react-icons/bs";
import { useFormik } from "formik";
import { CiMenuKebab } from "react-icons/ci";
import Edit from "../Edit";
import ImportModal from "./ImportModel";
import { getApi } from "services/api";
import CustomSearchInput from "components/search/search";
import DataNotFound from "components/notFoundData";

export default function CheckTable(props) {
  const { columnsData, tableData, fetchData, isLoding, setAction, allData, access, dataColumn, onClose, emailAccess, callAccess, setSearchedData, onOpen, isOpen, displaySearchData, dynamicColumns, action, setDisplaySearchData, selectedColumns, setSelectedColumns, isHide } = props;
  const navigate = useNavigate();
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  // const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [contactData, setContactData] = useState([])
  const [getTagValues, setGetTagValues] = useState([]);
  const [deleteModel, setDelete] = useState(false);
  const [selectedId, setSelectedId] = useState()
  const [gopageValue, setGopageValue] = useState()
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [manageColumns, setManageColumns] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchbox, setSearchbox] = useState('');
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn);
  // const [data, setData] = useState([])
  const [edit, setEdit] = useState(false);
  const data = useMemo(() => tableData, [tableData]);
  const [isImportContact, setIsImportContact] = useState(false);
  const [column, setColumn] = useState('');


  const csvColumns = [
    { Header: 'Title', accessor: 'title', width: 20 },
    { Header: "First Name", accessor: "firstName" },
    { Header: "Last Name", accessor: "lastName" },
    { Header: "Phone Number", accessor: "phoneNumber" },
    { Header: "Email Address", accessor: "email" },
    { Header: "Contact Method", accessor: "preferredContactMethod" },
  ];

  const columns = useMemo(() => dataColumn, [dataColumn]);

  // const fetchData = async () => {
  //   let result = await getApi('api/contact/');
  //   setData(result.data);
  // }
  const user = JSON.parse(localStorage.getItem("user"))
  const size = "lg";

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
  const initialValues = {
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    preferredContactMethod: '',
  }
  const validationSchema = yup.object({
    title: yup.string(),
    firstName: yup.string(),
    email: yup.string().email("Email is invalid"),
    phoneNumber: yup.number().typeError('Enter Number').min(0, 'Phone Number is invalid').max(999999999999, 'Phone Number is invalid').notRequired(),
    lastName: yup.string(),
    preferredContactMethod: yup.string(),

  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values?.title || (item?.title && item?.title.toLowerCase().includes(values?.title?.toLowerCase()))) &&
          (!values?.firstName || (item?.firstName && item?.firstName.toLowerCase().includes(values?.firstName?.toLowerCase()))) &&
          (!values?.lastName || (item?.lastName && item?.lastName.toLowerCase().includes(values?.lastName?.toLowerCase()))) &&
          (!values?.email || (item?.email && item?.email.toLowerCase().includes(values?.email?.toLowerCase()))) &&
          (!values?.phoneNumber || (item?.phoneNumber && item?.phoneNumber.toString().includes(values?.phoneNumber))) &&
          (!values?.preferredContactMethod || (item?.preferredContactMethod && item?.preferredContactMethod.toLowerCase().includes(values?.preferredContactMethod?.toLowerCase())))
      )
      let getValue = [values.title, values?.firstName, values?.lastName, values?.email, values?.phoneNumber, values?.preferredContactMethod].filter(value => value);
      setGetTagValues(getValue)
      setSearchedData(searchResult);
      setDisplaySearchData(true)
      setAdvaceSearch(false)
      setSearchClear(true)
      resetForm();
    }
  })
  const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm, dirty } = formik
  const handleClear = () => {
    setDisplaySearchData(false)
  }
  let isColumnSelected;
  const toggleColumnVisibility = (columnKey) => {
    setColumn(columnKey)
    isColumnSelected = tempSelectedColumns?.some((column) => column?.accessor === columnKey);

    if (isColumnSelected) {
      const updatedColumns = tempSelectedColumns?.filter((column) => column?.accessor !== columnKey);
      setTempSelectedColumns(updatedColumns);
    } else {
      const columnToAdd = dynamicColumns?.find((column) => column?.accessor === columnKey);
      setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
    }
  };

  const handleColumnClear = () => {
    isColumnSelected = selectedColumns?.some((selectedColumn) => selectedColumn?.accessor === column?.accessor)
    setTempSelectedColumns(dynamicColumns);
    setManageColumns(!manageColumns ? !manageColumns : false)
  }

  const handleExportContacts = (extension) => {
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
        convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, 'contact', extension);
      } else {
        const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns.forEach((property) => {
            selectedFieldsData[property.accessor] = rec[property.accessor];
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(AllRecordsWithSpecificFileds, csvColumns, 'contact', extension);
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

  const handleSearch = (results) => {
    setSearchedData(results);
  };

  const fetchCustomData = async () => {
    const response = await getApi('api/custom-field?moduleName=Contact')
    setContactData(response.data)
  }

  useEffect(() => {
    if (fetchCustomData) fetchCustomData()
  }, [action])

  return (
    <>
      <Card
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Grid templateColumns="repeat(12, 1fr)" gap={2}>
          <GridItem colSpan={{ base: 12, md: 8 }} display={"flex"} alignItems={"center"}>
            <Flex alignItems={"center"} flexWrap={"wrap"}>
              {window.location.pathname === "/contacts" ?
                <Text
                  color={"secondaryGray.900"}
                  fontSize="22px"
                  fontWeight="700"
                >
                  Contacts (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
                </Text> : ""}
              {isHide ? null :
                <>
                  <CustomSearchInput setSearchbox={setSearchbox} setDisplaySearchData={setDisplaySearchData} searchbox={searchbox} allData={allData} dataColumn={dataColumn} onSearch={handleSearch} />
                  <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} onClick={() => setAdvaceSearch(true)} mt={{ sm: "5px", md: "0" }} size="sm">Advance Search</Button>
                </>
              }
              {displaySearchData === true ? <Button variant="outline" size="sm" colorScheme='red' ms={2} onClick={() => { handleClear(); setGetTagValues([]); setSearchbox(''); }}>Clear</Button> : ""}
              {(selectedValues.length > 0 && access?.delete) && <DeleteIcon cursor={"pointer"} onClick={() => setDelete(true)} color={'red'} ms={2} />}
            </Flex>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }} display={"flex"} justifyContent={"end"} alignItems={"center"} textAlign={"right"}>
            {isHide ? null :
              <Menu isLazy  >
                <MenuButton p={4}>
                  <BsColumnsGap />
                </MenuButton>
                <MenuList minW={'fit-content'} transform={"translate(1670px, 60px)"} zIndex={2}  >
                  <MenuItem onClick={() => setManageColumns(true)} width={"165px"}> Manage Columns
                  </MenuItem>
                  <MenuItem width={"165px"} onClick={() => setIsImportContact(true)}> Import Contacts
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem width={"165px"} onClick={() => handleExportContacts('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                  <MenuItem width={"165px"} onClick={() => handleExportContacts('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
                </MenuList>
              </Menu>
            }
            {!isHide && access?.create && <Button onClick={() => handleClick()} size={"sm"} variant="brand" leftIcon={<AddIcon />}>Add New</Button>}
          </GridItem>
          <HStack spacing={4} mb={2}>
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

        {/* Delete model */}
        <Delete setAction={setAction} isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/contact/deleteMany' data={selectedValues} method='many' />

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
                        justifyContent={column.center ? "center" : "start"}
                        align="center"
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
                        <DataNotFound />
                      </Text>
                    </Td>
                  </Tr>
                ) : data?.length > 0 && page?.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr {...row?.getRowProps()} key={i}>
                      {row?.cells?.map((cell, index) => {
                        let data = "";
                        if (cell?.column.Header === "#") {
                          data = (
                            <Flex align="center">
                              <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" />
                              <Text color={textColor} fontSize="sm" fontWeight="700">
                                {cell?.row?.index + 1}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "Title") {
                          data = (
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "First Name") {
                          data = (
                            access?.view ? <Link to={`/contactView/${cell?.row?.original._id}`}>
                              <Text
                                me="10px"
                                sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                color='brand.600'
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value}
                              </Text>
                            </Link> :
                              <Text
                                me="10px"
                                // sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                // color='brand.600'
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value}
                              </Text>
                          );
                        } else if (cell?.column.Header === "Last Name") {
                          data = (
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Phone Number") {
                          data = (
                            callAccess?.create ? <Text fontSize="sm" fontWeight="700"
                              onClick={() => {
                                setAddPhoneCall(true)
                                setSelectedId(cell?.row?.values._id)
                              }}
                              color='brand.600' sx={{ cursor: 'pointer', '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                              {cell?.value}
                            </Text> : <Text fontSize="sm" fontWeight="700"
                              color={textColor}>
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Email Address") {
                          data = (
                            emailAccess?.create ? <Text fontSize="sm" fontWeight="700"
                              onClick={() => {
                                setAddEmailHistory(true)
                                setSelectedId(cell?.row?.values._id)
                              }}
                              color='brand.600' sx={{ cursor: 'pointer', '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                              {cell?.value}
                            </Text> : <Text fontSize="sm" fontWeight="700"
                              color={textColor}>
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Contact Method") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Action") {
                          data = (
                            <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                              <Menu isLazy  >
                                <MenuButton><CiMenuKebab /></MenuButton>
                                <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                                  {access?.update && <MenuItem py={2.5} onClick={() => { setEdit(true); setSelectedId(cell?.row?.original._id) }} icon={<EditIcon mb={1} fontSize={15} />}>Edit</MenuItem>}
                                  {callAccess?.create && <MenuItem py={2.5} width={"165px"} onClick={() => {
                                    setAddPhoneCall(true)
                                    setSelectedId(cell?.row?.values._id)
                                  }} icon={<PhoneIcon mb={1} fontSize={15} />}>Create Call</MenuItem>}
                                  {emailAccess?.create && <MenuItem py={2.5} width={"165px"} onClick={() => {
                                    setAddEmailHistory(true)
                                    setSelectedId(cell?.row?.values._id)
                                  }} icon={<EmailIcon mb={1} fontSize={15} />}>Send Email</MenuItem>}
                                  {access?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/contactView/${cell?.row?.original._id}`)} icon={<ViewIcon mb={1} fontSize={15} />}>View</MenuItem>}
                                  {access?.delete && <MenuItem py={2.5} color={'red'} onClick={() => { setSelectedValues([cell?.row?.original._id]); setDelete(true) }} icon={<DeleteIcon mb={1} fontSize={15} />}>Delete</MenuItem>}
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

      </Card>
      {/* modal */}
      {isOpen && <Add
        isOpen={isOpen}
        size={size}
        contactData={contactData[0]}
        onClose={onClose}
        setAction={setAction} />}
      <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={selectedId} />
      <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} id={selectedId} />
      {edit && <Edit contactData={contactData[0]} isOpen={edit} size={size} onClose={setEdit} setAction={setAction} selectedId={selectedId} setSelectedId={setSelectedId} moduleId={contactData?.[0]?._id} />}
      <ImportModal text='Contact file' fetchData={fetchData} isOpen={isImportContact} onClose={setIsImportContact} />
      {/* Advance filter */}
      <Modal onClose={() => { setAdvaceSearch(false); resetForm(); }} isOpen={advaceSearch} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Advance Search</ModalHeader>
          <ModalCloseButton onClick={() => { setAdvaceSearch(false); resetForm() }} />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Title
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.title}
                  name="title"
                  placeholder='Enter Title'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.title && touched.title && errors.title}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  FirstName
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.firstName}
                  name="firstName"
                  placeholder='Enter FirstName'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.firstName && touched.firstName && errors.firstName}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                  LastName
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.lastName}
                  name="lastName"
                  placeholder='Enter LastName'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.lastName && touched.lastName && errors.lastName}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Phone Number
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.phoneNumber}
                  name="phoneNumber"
                  placeholder='Enter PhoneNumber'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Preferred Contact Method
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.preferredContactMethod}
                  name="preferredContactMethod"
                  placeholder='Enter Preferred Contact Method'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.preferredContactMethod && touched.preferredContactMethod && errors.preferredContactMethod}</Text>

              </GridItem>

            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='brand' mr={2} size="sm" onClick={handleSubmit} disabled={isLoding || !dirty ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
            <Button colorScheme="red" onClick={() => resetForm()} variant="outline" size='sm'>Clear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Manage Columns */}
      <Modal onClose={() => { setManageColumns(false); resetForm() }} isOpen={manageColumns} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Columns</ModalHeader>
          <ModalCloseButton onClick={() => { setManageColumns(false); resetForm() }} />
          <ModalBody>
            <div>
              {dynamicColumns.map((column) => (
                <Text display={"flex"} key={column?.accessor} py={2}>
                  <Checkbox
                    defaultChecked={selectedColumns.some((selectedColumn) => selectedColumn?.accessor === column?.accessor)}
                    onChange={() => toggleColumnVisibility(column?.accessor)}
                    pe={2}
                  />
                  {column?.Header}
                </Text>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='brand' mr={2} onClick={() => {
              setSelectedColumns(tempSelectedColumns);
              setManageColumns(false);
              resetForm();
            }} disabled={isLoding ? true : false} size='sm'>{isLoding ? <Spinner /> : 'Save'}</Button>
            <Button variant='outline' colorScheme="red" size='sm' onClick={() => handleColumnClear()}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
