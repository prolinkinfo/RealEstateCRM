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
  Table, Tag, TagLabel, Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  MenuDivider,
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
import * as yup from "yup"
// Custom components
import { AddIcon, DeleteIcon, EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import EventView from "../eventView";
import AddTask from "./addTask";
import { BsColumnsGap } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import ImportModal from "views/admin/lead/components/ImportModal";
import { CiMenuKebab } from "react-icons/ci";
import EditTask from "./editTask";
import DeleteTask from "./deleteTask";
import * as XLSX from 'xlsx'
import { HasAccess } from "../../../../redux/accessUtils";

export default function CheckTable(props) {
  const { tableData, fetchData, isLoding, allData, access, setSearchedData, setDisplaySearchData, displaySearchData, selectedColumns, setSelectedColumns, dynamicColumns, setDynamicColumns, setAction, action, className } = props;

  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => selectedColumns, [selectedColumns]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [deleteModel, setDelete] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [edit, setEdit] = useState(false);
  const [isImportLead, setIsImportLead] = useState(false);
  const [searchbox, setSearchbox] = useState('');
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(selectedColumns);
  const [eventView, setEventView] = useState(false)
  const [id, setId] = useState()
  const [gopageValue, setGopageValue] = useState()
  const user = JSON.parse(localStorage.getItem("user"))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const data = useMemo(() => tableData, [tableData]);
  const navigate = useNavigate();

  const contactAccess = HasAccess('Contacts')
  const leadAccess = HasAccess('Lead')

  const csvColumns = [
    { Header: 'Title', accessor: 'title' },
    { Header: "Related", accessor: "category" },
    { Header: "Assignment To", accessor: "assignmentTo" },
    { Header: "Start Date", accessor: "start" },
    { Header: "End Date", accessor: "end" },
  ];

  const toggleColumnVisibility = (columnKey) => {
    const isColumnSelected = tempSelectedColumns.some((column) => column.accessor === columnKey);

    if (isColumnSelected) {
      const updatedColumns = tempSelectedColumns.filter((column) => column.accessor !== columnKey);
      setTempSelectedColumns(updatedColumns);
    } else {
      const columnToAdd = dynamicColumns.find((column) => column.accessor === columnKey);
      setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
    }
  };
  const initialValues = {
    title: '',
    category: '',
    start: '',
    end: '',
    leadAddress: '',
    assignmentToName: '',
    fromLeadScore: '',
    toLeadScore: ''
  }
  const validationSchema = yup.object({
    title: yup.string(),
    category: yup.string(),
    start: yup.string().email("Lead Email is invalid"),
    end: yup.number().typeError('Enter Number').min(0, 'Lead Phone Number is invalid').max(999999999999, 'Lead Phone Number is invalid').notRequired(),
    leadAddress: yup.string(),
    assignmentToName: yup.string(),
    fromLeadScore: yup.number().min(0, "From Lead Score is invalid"),
    toLeadScore: yup.number().min(yup.ref('fromLeadScore'), "To Lead Score must be greater than or equal to From Lead Score")
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values?.title || (item?.title && item?.title.toLowerCase().includes(values?.title?.toLowerCase()))) &&
          (!values?.category || (item?.category && item?.category.toLowerCase().includes(values?.category?.toLowerCase()))) &&
          (!values?.start || (item?.start && item?.start.toLowerCase().includes(values?.start?.toLowerCase()))) &&
          (!values?.end || (item?.end && item?.end.toString().includes(values?.end))) &&
          (!values?.assignmentToName || (item?.assignmentToName && item?.assignmentToName.toLowerCase().includes(values?.assignmentToName?.toLowerCase()))) &&
          ([null, undefined, ''].includes(values?.fromLeadScore) || [null, undefined, ''].includes(values?.toLeadScore) ||
            ((item?.leadScore || item?.leadScore === 0) &&
              (parseInt(item?.leadScore, 10) >= parseInt(values.fromLeadScore, 10) || 0) &&
              (parseInt(item?.leadScore, 10) <= parseInt(values.toLeadScore, 10) || 0)))
      )
      let getValue = [values.title, values?.category, values?.start, values?.end, values?.assignmentToName, (![null, undefined, ''].includes(values?.fromLeadScore) && `${values.fromLeadScore}-${values.toLeadScore}`) || undefined].filter(value => value);
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

  const handleDateClick = (cell) => {
    setId(cell?.row?.values?._id)
    setEventView(true)
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

  const handleExportTasks = (extension) => {
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
        convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, 'task', extension);
      } else {
        const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns.forEach((property) => {
            selectedFieldsData[property.accessor] = rec[property.accessor];
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(AllRecordsWithSpecificFileds, csvColumns, 'task', extension);
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
  return (
    <>
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={4} mx={4}>
          <GridItem colSpan={8} >
            <Flex alignItems={"center"} flexWrap={"wrap"}>
              <Text
                color={"secondaryGray.900"}
                fontSize="22px"
                fontWeight="700"
              >
                Task  (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
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
                      for (const key in item) {
                        if (
                          item[key] &&
                          typeof item[key] === "string" &&
                          item[key].toLowerCase().includes(e.target.value.toLowerCase())
                        ) {
                          return true;
                        }
                      }
                      return false;
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
                {/* <MenuItem width={"165px"} onClick={() => setIsImportLead(true)}> Import Leads
                </MenuItem> */}
                <MenuDivider />
                <MenuItem width={"165px"} onClick={() => handleExportTasks('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                <MenuItem width={"165px"} onClick={() => handleExportTasks('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
              </MenuList>
            </Menu>
            {access?.create && <Button onClick={() => handleClick()} size="sm" variant="brand">Create Task</Button>}
            {/* {setTaskModel && <Button onClick={() => setTaskModel(true)} leftIcon={<AddIcon />} colorScheme="gray" >Create Task</Button>} */}
          </GridItem>
          <HStack spacing={4}>
            {getTagValues && getTagValues?.map((item) => (
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
                        } else if (cell?.column.Header === "Title") {
                          data = (
                            <Text
                              onClick={() => handleDateClick(cell)}
                              me="10px"
                              sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                              color='brand.600'
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Related") {
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
                        } else if (cell?.column.Header === "Assignment To") {
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
                        } else if (cell?.column.Header === "Start Date") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "End Date") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell?.value ? cell?.value : cell?.row?.values.start}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Action") {
                          data = (
                            <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                              <Menu isLazy  >
                                <MenuButton><CiMenuKebab /></MenuButton>
                                <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                                  {access?.update && <MenuItem py={2.5} onClick={() => { setEdit(true); setSelectedId(cell?.row?.original._id) }} icon={<EditIcon fontSize={15} />}>Edit</MenuItem>}
                                  {access?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/view/${cell?.row?.original._id}`)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>}
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
      </Card>


      <AddTask isOpen={isOpen} fetchData={fetchData} onClose={onClose} />
      <EditTask isOpen={edit} onClose={setEdit} viewClose={onClose} id={selectedId} setAction={setAction} />
      <EventView fetchData={fetchData} isOpen={eventView} access={access} contactAccess={contactAccess} leadAccess={leadAccess} onClose={setEventView} info={id} setAction={setAction} action={action} />
      <DeleteTask isOpen={deleteModel} onClose={setDelete} viewClose={onClose} url='api/task/delete/' method='one' id={selectedValues} redirectPage={"/task"} setAction={setAction} />
      <ImportModal text='Lead file' fetchData={fetchData} isOpen={isImportLead} onClose={setIsImportLead} />
      {/* Advance filter modal*/}
      <Modal onClose={() => { setAdvaceSearch(false); resetForm() }} isOpen={advaceSearch} isCentered>
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
                  Related
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.category}
                  name="category"
                  placeholder='Enter Related'
                  fontWeight='500'
                />

                <Text mb='10px' color={'red'}> {errors.category && touched.category && errors.category}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                  Start Date
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.start}
                  name="start"
                  placeholder='Enter Start Date'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.start && touched.start && errors.start}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  End Date
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.end}
                  name="end"
                  placeholder='Enter  End Date'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.end && touched.end && errors.end}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Assignment To
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.assignmentToName}
                  name="assignmentToName"
                  placeholder='Enter Assignment To'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.assignmentToName && touched.assignmentToName && errors.assignmentToName}</Text>

              </GridItem>


            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" colorScheme='green' mr={2} onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
            <Button colorScheme="red" onClick={() => resetForm()}>Clear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Manage Columns modal*/}
      <Modal onClose={() => { setManageColumns(false); resetForm() }} isOpen={manageColumns} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Column</ModalHeader>
          <ModalCloseButton onClick={() => { setManageColumns(false); resetForm() }} />
          <ModalBody>
            <div>
              {dynamicColumns.map((column) => (
                <Text display={"flex"} key={column.accessor} py={2}>
                  <Checkbox
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
