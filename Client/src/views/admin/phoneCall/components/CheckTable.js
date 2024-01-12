import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table, Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  HStack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  MenuDivider,
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
import Card from "components/card/Card";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
// import Delete from "../Delete";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import moment from "moment";
import { getApi } from "services/api";
import { useFormik } from "formik";
import * as yup from "yup"
import AddPhoneCall from "../add";
import { SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { BsColumnsGap } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosContact } from 'react-icons/io';
import { MdLeaderboard } from 'react-icons/md';
import { HasAccess } from "../../../../redux/accessUtils";

export default function CheckTable(props) {
  const { columnsData, tableData, fetchData, isLoding, allData, setSearchedData, access, setDisplaySearchData, displaySearchData, selectedColumns, setSelectedColumns, dynamicColumns, setDynamicColumns, setAction, action } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  // const columns = useMemo(() => columnsData, [columnsData]);
  const columns = useMemo(() => selectedColumns, [selectedColumns]);
  const data = useMemo(() => tableData, [tableData]);
  // const [data, setData] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const [gopageValue, setGopageValue] = useState()
  const [manageColumns, setManageColumns] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchClear, setSearchClear] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(selectedColumns);
  const [getTagValues, setGetTagValues] = useState([]);
  const [searchbox, setSearchbox] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const navigate = useNavigate()

  const csvColumns = [
    { Header: 'Sender', accessor: 'senderName' },
    { Header: "Recipient", accessor: "createByName" },
    { Header: "Realeted To", accessor: "" },              // accessor - createByLead, createBy
    // { Header: "Timestamp", accessor: "timestamp" },
    { Header: "Created", accessor: "timestamp" }
  ];

  const contactAccess = HasAccess('Contacts')
  const leadAccess = HasAccess('Lead')

  const toggleColumnVisibility = (columnKey) => {
    const isColumnSelected = tempSelectedColumns.some((column) => column.Header === columnKey);

    if (isColumnSelected) {
      const updatedColumns = tempSelectedColumns.filter((column) => column.Header !== columnKey);
      setTempSelectedColumns(updatedColumns);
    } else {
      const columnToAdd = dynamicColumns.find((column) => column.Header === columnKey);
      setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
    }
  };
  const initialValues = {
    senderName: '',
    realetedTo: '',
    createByName: '',
  }
  const validationSchema = yup.object({
    senderName: yup.string(),
    realetedTo: yup.string(),
    createByName: yup.string(),

  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values?.senderName || (item?.senderName && item?.senderName.toLowerCase().includes(values?.senderName?.toLowerCase()))) &&
          // (!values?.realetedTo || (item?.realetedTo && item?.realetedTo.toLowerCase().includes(values?.realetedTo?.toLowerCase()))) &&
          (!values?.realetedTo || (values.realetedTo === "contact" ? item.createBy : item.createByLead)) &&
          (!values?.createByName || (item?.createByName && item?.createByName.toLowerCase().includes(values?.createByName?.toLowerCase())))
      )
      let getValue = [values.senderName, values?.realetedTo, values?.createByName].filter(value => value);
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

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

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

  const handleClick = () => {
    onOpen()
  }

  const handleExportCalls = (extension) => {
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
            if (property.Header === "Realeted To") {
              selectedFieldsData[property.accessor] = rec?.createByLead ? 'lead' : rec.createBy ? 'contact' : '';
            } else if (property.Header === "Created") {
              selectedFieldsData[property.accessor] = moment(rec?.timestamp).format('D/MM/YYYY LT');
            }
            else {
              selectedFieldsData[property.accessor] = rec[property.accessor];
            }
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, 'call', extension);
      } else {
        const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns.forEach((property) => {
            if (property.Header === "Realeted To") {
              selectedFieldsData[property.accessor] = rec?.createByLead ? 'lead' : rec.createBy ? 'contact' : '';
            } else if (property.Header === "Created") {
              selectedFieldsData[property.accessor] = moment(rec?.timestamp).format('D/MM/YYYY LT');
            } else {
              selectedFieldsData[property.accessor] = rec[property.accessor];
            }
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(AllRecordsWithSpecificFileds, csvColumns, 'call', extension);
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
    fetchData()
  }, [action])


  return (
    <>
      <Card
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >


        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={4} mx={4}>
          <GridItem colSpan={8} >
            <Flex alignItems={"center"} flexWrap={"wrap"}>
              <Text
                color={"secondaryGray.900"}
                fontSize="22px"
                fontWeight="700"
                lineHeight="100%"
              >
                Calls (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
              </Text>
              <InputGroup width={"30%"} mx={3}>
                <InputLeftElement
                  size="sm"
                  top={"-3px"}
                  pointerEvents="none"
                  children={<SearchIcon color="gray.300" borderRadius="16px" />}
                />
                <Input type="text"
                  size="sm"
                  fontSize='sm'
                  value={searchbox}
                  onChange={(e) => {
                    const results = allData.filter((item) => {
                      // Iterate through each property of the object
                      for (const key in item) {
                        // Check if the value of the property contains the search term
                        if (
                          item[key] &&
                          typeof item[key] === "string" &&
                          item[key].toLowerCase().includes(e.target.value.toLowerCase())
                        ) {
                          return true; // If found, include in the results
                        }
                      }
                      return false; // If not found in any field, exclude from the results
                    });
                    setSearchedData(results)
                    setSearchbox(e.target.value)
                    setDisplaySearchData(e.target.value === "" ? false : true)

                  }}
                  fontWeight='500'
                  placeholder="Search..." borderRadius="16px" />
              </InputGroup>
              <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} onClick={() => setAdvaceSearch(true)} size="sm">Advance Search</Button>
              {displaySearchData === true ? <Button variant="outline" size="sm" colorScheme='red' ms={2} onClick={() => { handleClear(); setSearchbox(''); setGetTagValues([]) }}>clear</Button> : ""}

            </Flex>
          </GridItem>
          <GridItem colSpan={4} display={"flex"} justifyContent={"end"} alignItems={"center"} textAlign={"right"}>
            <Menu isLazy  >
              <MenuButton p={4}>
                <BsColumnsGap />
              </MenuButton>
              <MenuList minW={'fit-content'} transform={"translate(1670px, 60px)"} >
                <MenuItem onClick={() => setManageColumns(true)} width={"165px"}> Manage Columns
                </MenuItem>
                {/* <MenuItem width={"165px"} onClick={() => setIsImportCall(true)}> Import Calls
                </MenuItem> */}
                <MenuDivider />
                <MenuItem width={"165px"} onClick={() => handleExportCalls('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                <MenuItem width={"165px"} onClick={() => handleExportCalls('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
              </MenuList>
            </Menu>
            <GridItem colStart={6} textAlign={"right"}>
              {access?.create && <Button size="sm" onClick={() => handleClick()} variant="brand">Add Call</Button>}
            </GridItem>
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
            <Thead>
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
                        color=" secondaryGray.900"
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
                        } else if (cell?.column.Header === "sender") {
                          data = (
                            access?.view ? <Link to={`/phone-call/${cell?.row?.values._id}`}>
                              <Text
                                me="10px"
                                sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                color='brand.600'
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value ? cell?.value : ' - '}
                              </Text>
                            </Link> :
                              <Text
                                me="10px"
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value ? cell?.value : ' - '}
                              </Text>
                          );
                        } else if (cell?.column.Header === "recipient") {
                          data = (
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value ? cell?.value : ' - '}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Realeted To") {
                          data = (
                            <>
                              {cell?.row?.original?.createBy && contactAccess?.view ? <Link to={`/contactView/${cell?.row?.original.createBy}`}>
                                <Text
                                  me="10px"
                                  sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                  color={'brand.600'}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.row?.original.createBy && "contact"}
                                </Text>
                              </Link> :
                                <Text
                                  me="10px"
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.row?.original.createBy && "contact"}
                                </Text>}

                              {leadAccess?.view && cell?.row?.original.createByLead ? <Link to={`/leadView/${cell?.row?.original.createByLead}`}>
                                <Text
                                  me="10px"
                                  sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                  color={'brand.600'}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.row?.original.createByLead && "lead"}
                                </Text>
                              </Link> : <Text
                                me="10px"
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.row?.original.createByLead && "lead"}
                              </Text>}
                            </>
                          );
                        } else if (cell?.column.Header === "timestamp") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {moment(cell?.value).toNow()}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Created") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {moment(cell?.row?.values.timestamp).format('(DD/MM) h:mma')}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Action") {
                          data = (
                            <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                              <Menu isLazy  >
                                <MenuButton><CiMenuKebab /></MenuButton>
                                <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                                  {access?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/phone-call/${cell?.row?.values._id}`)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>}
                                  {cell?.row?.original?.createBy && contactAccess?.view ?
                                    <MenuItem width={"165px"} py={2.5} color={'black'} onClick={() => navigate(cell?.row?.original?.createBy && `/contactView/${cell?.row?.original.createBy}`)} icon={cell?.row?.original.createBy && <IoIosContact fontSize={15} />}>  {(cell?.row?.original.createBy && contactAccess?.view) && "contact"}
                                    </MenuItem>
                                    : ''}
                                  {cell?.row?.original.createByLead && leadAccess?.view ? <MenuItem width={"165px"} py={2.5} color={'black'} onClick={() => navigate(`/leadView/${cell?.row?.original.createByLead}`)} icon={cell?.row?.original.createByLead && leadAccess?.view && <MdLeaderboard fontSize={15} />}>{cell?.row?.original.createByLead && leadAccess?.view && 'lead'}</MenuItem> : ''}
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
      <AddPhoneCall isOpen={isOpen} size={"sm"} setAction={setAction} onClose={onClose} />
      {/* Advance filter */}
      <Modal onClose={() => { setAdvaceSearch(false); resetForm() }} isOpen={advaceSearch} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Advance Search</ModalHeader>
          <ModalCloseButton onClick={() => { setAdvaceSearch(false); resetForm() }} />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  senderName
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.senderName}
                  name="senderName"
                  placeholder='Enter senderName'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.senderName && touched.senderName && errors.senderName}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Realeted To
                </FormLabel>
                <Select
                  value={values?.realetedTo}
                  fontSize='sm'
                  name="realetedTo"
                  onChange={handleChange}
                  fontWeight='500'
                  placeholder={'Select Realeted To'}
                >
                  <option value='contact'>Contact</option>
                  <option value='lead'>Lead</option>
                </Select>
                <Text mb='10px' color={'red'}> {errors.realetedTo && touched.realetedTo && errors.realetedTo}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                  Recipient
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.createByName}
                  name="createByName"
                  placeholder='Enter Recipient'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.createByName && touched.createByName && errors.createByName}</Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" colorScheme='green' mr={2} onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
            <Button colorScheme="red" onClick={() => resetForm()}>Clear</Button>
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
                <Text display={"flex"} key={column.Header} py={2}>
                  <Checkbox
                    defaultChecked={selectedColumns.some((selectedColumn) => selectedColumn.Header === column.Header)}
                    onChange={() => toggleColumnVisibility(column.Header)}
                    pe={2}
                  />
                  {column.Header}
                </Text>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" colorScheme='green' mr={2} onClick={() => {
              setSelectedColumns(tempSelectedColumns);
              setManageColumns(false);
              resetForm();
            }} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
            <Button colorScheme="red" onClick={() => resetForm()}>Clear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
