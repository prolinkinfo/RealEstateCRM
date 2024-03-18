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
  Select,
  Table, Tag, TagLabel, Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure
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
import { CiMenuKebab } from "react-icons/ci";
import Add from '../add';
import * as yup from "yup"
import { useFormik } from "formik";
import { BsColumnsGap } from "react-icons/bs";
import { AddIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { MdLeaderboard } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { HasAccess } from "../../../../redux/accessUtils";
import CustomSearchInput from "components/search/search";
import DataNotFound from "components/notFoundData";

export default function CheckTable(props) {
  const { columnsData, tableData, fetchData, isLoding, allData, access, dataColumn, setSearchedData, setDisplaySearchData, displaySearchData, columnsToExclude, selectedColumns, setSelectedColumns, dynamicColumns, setDynamicColumns, setAction, action } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => dataColumn, [dataColumn]);
  const data = useMemo(() => tableData, [tableData]);
  const user = JSON.parse(localStorage.getItem("user"))
  const [gopageValue, setGopageValue] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchbox, setSearchbox] = useState('');
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [getTagValues, setGetTagValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [column, setColumn] = useState('');
  const navigate = useNavigate()

  const csvColumns = [
    { Header: 'sender Name', accessor: 'senderName' },
    { Header: "recipient", accessor: "createByName", },
    { Header: "Realeted To", accessor: "" },              // accessor - createByLead, createBy
    // { Header: "Timestamp", accessor: "timestamp", },
    { Header: "Created", access: "timestamp" },
  ];

  let isColumnSelected;
  const toggleColumnVisibility = (columnKey) => {
    setColumn(columnKey)
    isColumnSelected = tempSelectedColumns?.some((column) => column?.Header === columnKey);

    if (isColumnSelected) {
      const updatedColumns = tempSelectedColumns?.filter((column) => column?.Header !== columnKey);
      setTempSelectedColumns(updatedColumns);
    } else {
      const columnToAdd = dynamicColumns?.find((column) => column?.Header === columnKey);
      setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
    }
  };

  const handleColumnClear = () => {
    isColumnSelected = selectedColumns?.some((selectedColumn) => selectedColumn?.accessor === column?.accessor)
    setTempSelectedColumns(dynamicColumns);
    setManageColumns(!manageColumns ? !manageColumns : false)
  }
  const initialValues = {
    senderName: '',
    realetedTo: '',
    createByName: '',
  }
  const validationSchema = yup.object({
    senderName: yup.string(),
    realetedTo: yup.string(),
    createByName: yup.string()
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values?.senderName || (item?.senderName && item?.senderName.toLowerCase().includes(values?.senderName?.toLowerCase()))) &&
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
      setSearchbox('');
    }
  })
  const handleClear = () => {
    setDisplaySearchData(false)
  }

  useEffect(() => {
    setSearchedData && setSearchedData(data);
  }, []);
  const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm, dirty } = formik
  const handleClick = () => {
    onOpen()
  }

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

  const handleExportEmails = (extension) => {
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
        convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, 'email', extension);
      } else {
        const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
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
        convertJsonToCsvOrExcel(AllRecordsWithSpecificFileds, csvColumns, 'email', extension);
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

  const [contactAccess, leadAccess] = HasAccess(['Contacts', 'Leads'])

  const handleSearch = (results) => {
    setSearchedData(results);
  };

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
              <Text
                color={"secondaryGray.900"}
                fontSize="22px"
                fontWeight="700"
                lineHeight="100%"
              >
                Emails (<CountUpComponent key={data?.length} targetNumber={data?.length} />)

              </Text>
              <CustomSearchInput setSearchbox={setSearchbox} setDisplaySearchData={setDisplaySearchData} searchbox={searchbox} allData={allData} dataColumn={dataColumn} onSearch={handleSearch} setGetTagValues={setGetTagValues} />
              <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} onClick={() => setAdvaceSearch(true)} mt={{ sm: "5px", md: "0" }} size="sm">Advance Search</Button>
              {displaySearchData === true ? <Button variant="outline" size="sm" colorScheme='red' ms={2} onClick={() => { handleClear(); setSearchbox(''); setGetTagValues([]) }}>Clear</Button> : ""}
            </Flex>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }} display={"flex"} justifyContent={"end"} alignItems={"center"} textAlign={"right"}>
            <Menu isLazy  >
              <MenuButton p={4}>
                <BsColumnsGap />
              </MenuButton>
              <MenuList minW={'fit-content'} transform={"translate(1670px, 60px)"} zIndex={2}  >
                <MenuItem onClick={() => setManageColumns(true)} width={"165px"}> Manage Columns
                </MenuItem>
                {/* <MenuItem width={"165px"} onClick={() => setIsImportLead(true)}> Import Leads
                </MenuItem> */}
                <MenuDivider />
                <MenuItem width={"165px"} onClick={() => handleExportEmails('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                <MenuItem width={"165px"} onClick={() => handleExportEmails('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
              </MenuList>
            </Menu>
            <GridItem colStart={6} textAlign={"right"}>
              {access?.create && <Button onClick={() => handleClick()} variant="brand" size="sm" leftIcon={<AddIcon />}>Add New</Button>}
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
                textTransform={"capitalize"}
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
                      {/* <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                      {column.isSortable !== false && (
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />}
                        </span>
                      )}
                    </Flex> */}
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
                        <DataNotFound />
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
                              {/* <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" /> */}
                              <Text color={textColor} fontSize="sm" fontWeight="700">
                                {cell?.row?.index + 1}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "sender Name") {
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
                        } else if (cell?.column.Header === "recipient") {
                          data = (
                            access?.view ? <Link to={`/Email/${cell?.row?.values._id}`}>
                              <Text
                                me="10px"
                                sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                color='brand.600'
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value}
                              </Text>
                            </Link> : <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Realeted To") {
                          data = (
                            <>
                              {cell?.row?.original.createBy && contactAccess?.view ? <Link to={`/contactView/${cell?.row?.original.createBy}`}>
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
                                  {access?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/Email/${cell?.row?.values._id}`)} icon={<ViewIcon mb={'2px'} fontSize={15} />}>View</MenuItem>}
                                  {cell?.row?.original?.createBy && contactAccess?.view ?
                                    <MenuItem width={"165px"} py={2.5} color={'black'} onClick={() => navigate(cell?.row?.original?.createBy && `/contactView/${cell?.row?.original.createBy}`)} icon={cell?.row?.original.createBy && <IoIosContact fontSize={15} />}>  {(cell?.row?.original.createBy && contactAccess?.view) && "contact"}
                                    </MenuItem>
                                    : ''}
                                  {cell?.row?.original.createByLead && leadAccess?.view ? <MenuItem width={"165px"} py={2.5} color={'black'} onClick={() => navigate(`/leadView/${cell?.row?.original.createByLead}`)} icon={cell?.row?.original.createByLead && leadAccess?.view && <MdLeaderboard style={{ marginBottom: '4px' }} fontSize={15} />}>{cell?.row?.original.createByLead && leadAccess?.view && 'lead'}</MenuItem> : ''}
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
      <Add isOpen={isOpen} size={"sm"} onClose={onClose} setAction={setAction} />
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
                  Sender Name
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.senderName}
                  name="senderName"
                  placeholder='Enter Sender Name'
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
                  CreateBy Name
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.createByName}
                  name="createByName"
                  placeholder='Enter CreateBy Name'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.createByName && touched.createByName && errors.createByName}</Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="brand" size="sm" mr={2} onClick={handleSubmit} disabled={isLoding || !dirty ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
            <Button variant="outline" colorScheme="red" size="sm" onClick={() => resetForm()}>Clear</Button>
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
                <Text display={"flex"} key={column?.Header} py={2}>
                  <Checkbox
                    defaultChecked={selectedColumns?.some((selectedColumn) => selectedColumn?.Header === column?.Header)}
                    onChange={() => toggleColumnVisibility(column?.Header)}
                    pe={2}
                  />
                  {column?.Header}
                </Text>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="brand" size="sm" mr={2} onClick={() => {
              setSelectedColumns(tempSelectedColumns);
              setManageColumns(false);
              resetForm();
            }} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
            <Button variant="outline" colorScheme="red" onClick={() => handleColumnClear()} size="sm">Clear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  );
}
