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
  useColorModeValue
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import * as XLSX from 'xlsx';

// Custom components
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import moment from "moment";
import { useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import AddMeeting from "./Addmeeting";
import { AddIcon, DeleteIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { BsColumnsGap } from "react-icons/bs";
import * as yup from "yup"
import { useFormik } from "formik";
import { CiMenuKebab } from "react-icons/ci";
import CustomSearchInput from "components/search/search";

export default function CheckTable(props) {
  const { setMeeting, className, addMeeting, from, columnsData, dataColumn, tableData, fetchData, access, isLoding, allData, setSearchedData, setDisplaySearchData, displaySearchData, selectedColumns, setSelectedColumns, dynamicColumns, setDynamicColumns, setAction, action } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  // const columns = useMemo(() => columnsData, [columnsData]);
  const columns = useMemo(() => dataColumn, [dataColumn]);
  const data = useMemo(() => tableData, [tableData]);
  const user = JSON.parse(localStorage.getItem("user"))
  const [gopageValue, setGopageValue] = useState()
  const [searchbox, setSearchbox] = useState('');
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn);
  const [manageColumns, setManageColumns] = useState(false);
  const [getTagValues, setGetTagValues] = useState([]);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [deleteModel, setDelete] = useState(false);
  const [column, setColumn] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate()

  const csvColumns = [
    { Header: 'Agenda', accessor: 'agenda' },
    { Header: "Date & Time", accessor: "dateTime" },
    { Header: "Time Stamp", accessor: "timestamp" },
    { Header: "Create By", accessor: "createdByName" }
  ];

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

  let isColumnSelected;
  const toggleColumnVisibility = (columnKey) => {
    setColumn(columnKey)
    isColumnSelected = tempSelectedColumns?.some((column) => column?.accessor === columnKey);

    if (isColumnSelected) {
      const updatedColumns = tempSelectedColumns?.filter((column) => column?.accessor !== columnKey);
      setTempSelectedColumns(updatedColumns);
    } else {
      const columnToAdd = dynamicColumns.find((column) => column?.accessor === columnKey);
      setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
    }
  };

  const handleColumnClear = () => {
    isColumnSelected = selectedColumns?.some((selectedColumn) => selectedColumn?.accessor === column?.accessor)
    setTempSelectedColumns(dynamicColumns);
    setManageColumns(!manageColumns ? !manageColumns : false)
  }
  const initialValues = {
    agenda: '',
    createBy: '',
    startDate: '',
    endDate: '',
    timeStartDate: '',
    timeEndDate: ''
  }
  const validationSchema = yup.object({
    agenda: yup.string(),
    createBy: yup.string().email('Invalid email format'),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) => {
          const itemDate = new Date(item.dateTime);
          const momentDate = moment(itemDate).format('YYYY-MM-DD');
          const timeItemDate = new Date(item.timestamp);
          const timeMomentDate = moment(timeItemDate).format('YYYY-MM-DD');
          return (
            (!values?.agenda || (item?.agenda && item?.agenda.toLowerCase().includes(values?.agenda?.toLowerCase()))) &&
            (!values?.createBy || (item?.createBy && item?.createBy.toLowerCase().includes(values?.createBy?.toLowerCase()))) &&
            (!values?.startDate || (momentDate >= values.startDate)) &&
            (!values?.endDate || (momentDate <= values.endDate)) &&
            (!values.timeStartDate || (timeMomentDate >= values.timeStartDate)) &&
            (!values.timeEndDate || (timeMomentDate <= values.timeEndDate)))
        }
      )

      const dateFrom = `${values?.startDate && `From: ${values?.startDate}`} ${values?.endDate && `To: ${values?.endDate}`}`;
      const timeDateFrom = `${values?.timeStartDate && `From: ${values?.timeStartDate}`} ${values?.timeEndDate && `To: ${values?.timeEndDate}`}`
      let getValue = [values.agenda, values?.createBy, (values?.startDate || values?.endDate) && dateFrom, (values?.timeStartDate || values?.timeEndDate) && timeDateFrom].filter(value => value);
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

  const handleExportMeetings = (extension) => {
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
            if (property.accessor === "dateTime" || property.accessor === "timestamp") {
              selectedFieldsData[property.accessor] = moment(rec?.accessor).format('D/MM/YYYY LT');
            } else {
              selectedFieldsData[property.accessor] = rec[property.accessor];
            }
          });

          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, 'meeting', extension);
      } else {
        const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns.forEach((property) => {
            if (property.accessor === "dateTime" || property.accessor === "timestamp") {
              selectedFieldsData[property.accessor] = moment(rec?.accessor).format('D/MM/YYYY LT');
            } else {
              selectedFieldsData[property.accessor] = rec[property.accessor];
            }
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(AllRecordsWithSpecificFileds, csvColumns, 'meeting', extension);
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
    setSearchedData && setSearchedData(data);
  }, []);
  const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm, dirty } = formik


  useEffect(() => {
    if (fetchData) fetchData()
  }, [action])

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
                Meetings (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
              </Text>
              <CustomSearchInput setSearchbox={setSearchbox} setDisplaySearchData={setDisplaySearchData} searchbox={searchbox} allData={allData} dataColumn={dataColumn} onSearch={handleSearch} />
              <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} onClick={() => setAdvaceSearch(true)} size="sm">Advance Search</Button>
              {displaySearchData === true ? <Button variant="outline" size="sm" colorScheme='red' ms={2} onClick={() => { handleClear(); setSearchbox(''); setGetTagValues([]) }}>Clear</Button> : ""}
              {selectedValues.length > 0 && <DeleteIcon cursor={"pointer"} onClick={() => setDelete(true)} color={'red'} ms={2} />}
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
                <MenuItem width={"165px"} onClick={() => handleExportMeetings('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                <MenuItem width={"165px"} onClick={() => handleExportMeetings('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
              </MenuList>
            </Menu>
            {from !== "index" ? (access?.create && <Button onClick={() => setMeeting(true)} leftIcon={<SiGooglemeet />} size="sm" colorScheme="gray" >Add Meeting </Button>) :
              <GridItem colStart={6} textAlign={"right"}>
                {access?.create && <Button onClick={() => setMeeting(true)} variant="brand" size="sm" leftIcon={<AddIcon />}>Add New</Button>}
              </GridItem>}
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
        <Box overflowY={"auto"} className={className}>
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
                        } else if (cell?.column.Header === "agenda") {
                          data = (
                            access?.view ? <Link to={`/metting/${cell?.row?.values._id}`}>
                              <Text
                                me="10px"
                                sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                color='brand.600'
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value ? cell?.value : ' - '}
                              </Text>
                            </Link> : <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value ? cell?.value : ' - '}
                            </Text>
                          );
                        } else if (cell?.column.Header === "date & Time") {
                          data = (
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {moment(cell?.value).format('D/MM/YYYY LT')}
                            </Text>
                          );
                        } else if (cell?.column.Header === "create By") {
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
                        } else if (cell?.column.Header === "time stamp") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {/* {moment(cell?.value).toNow()} */}
                              {moment(cell?.value).format('(DD/MM) LT')}

                            </Text>
                          );
                        } else if (cell?.column.Header === "Action") {
                          data = (
                            <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                              <Menu isLazy  >
                                <MenuButton><CiMenuKebab /></MenuButton>
                                <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                                  {access?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/metting/${cell?.row?.values._id}`)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>}
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
      <AddMeeting setAction={setAction} isOpen={addMeeting} onClose={setMeeting} />
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
                  Agenda
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.agenda}
                  name="agenda"
                  placeholder='Enter Lead Name'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.agenda && touched.agenda && errors.agenda}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                  Create By
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.createBy}
                  name="createBy"
                  placeholder='Enter Lead Email'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.createBy && touched.createBy && errors.createBy}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Date & time
                </FormLabel>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  From
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values.startDate}
                  type="date"
                  name='startDate'
                  fontWeight='500'
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  To
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values.endDate}
                  type="date"
                  name='endDate'
                  fontWeight='500'
                />
              </GridItem>

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Time Stamp
                </FormLabel>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  From
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values.timeStartDate}
                  type="date"
                  name='timeStartDate'
                  fontWeight='500'
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  To
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values.timeEndDate}
                  type="date"
                  name='timeEndDate'
                  fontWeight='500'
                />
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
          <ModalHeader>Manage Column</ModalHeader>
          <ModalCloseButton onClick={() => { setManageColumns(false); resetForm() }} />
          <ModalBody>
            <div>
              {dynamicColumns.map((column) => (
                <Text display={"flex"} key={column?.accessor} py={2}>
                  <Checkbox
                    defaultChecked={selectedColumns?.some((selectedColumn) => selectedColumn?.accessor === column?.accessor)}
                    onChange={() => toggleColumnVisibility(column?.accessor)}
                    pe={2}
                  />
                  {column?.Header}
                </Text>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant='brand' size="sm" mr={2} onClick={() => {
              setSelectedColumns(tempSelectedColumns);
              setManageColumns(false);
              resetForm();
            }} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
            <Button colorScheme="red" variant="outline" size="sm" onClick={() => handleColumnClear()}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
