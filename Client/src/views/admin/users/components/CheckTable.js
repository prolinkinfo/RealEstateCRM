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
  Table,
  Tag,
  TagLabel,
  Tbody,
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

// Custom components
import { AddIcon, DeleteIcon, EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Delete from "../Delete";
import AddUser from "../Add";
import { useFormik } from "formik";
import * as yup from "yup"
import { BsColumnsGap } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import Edit from "../Edit";


export default function CheckTable(props) {
  // const { columnsData, action, setAction } = props;
  const { columnsData, tableData, fetchData, isLoding, allData, setSearchedData, setDisplaySearchData, displaySearchData, selectedColumns, setSelectedColumns, dynamicColumns, setDynamicColumns, setAction, action } = props;

  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  // const columns = useMemo(() => columnsData, [columnsData]);
  const columns = useMemo(() => selectedColumns, [selectedColumns]);
  const data = useMemo(() => tableData, [tableData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"))
  const [deleteModel, setDelete] = useState(false);
  const [gopageValue, setGopageValue] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [searchbox, setSearchbox] = useState('');
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(selectedColumns);
  const [getTagValues, setGetTagValues] = useState([]);
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const navigate = useNavigate()
  const [column, setColumn] = useState('');

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
  const initialValues = {
    firstName: '',
    username: '',
    lastName: '',
  }
  const validationSchema = yup.object({
    firstName: yup.string(),
    username: yup.string().email("Lead Email is invalid"),
    lastName: yup.string(),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values?.firstName || (item?.firstName && item?.firstName.toLowerCase().includes(values?.firstName?.toLowerCase()))) &&
          (!values?.username || (item?.username && item?.username.toLowerCase().includes(values?.username?.toLowerCase()))) &&
          (!values?.lastName || (item?.lastName && item?.lastName.toLowerCase().includes(values?.lastName?.toLowerCase())))
      )
      let getValue = [values.firstName, values?.username, values?.lastName,].filter(value => value);
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
                Users (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
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
              {selectedValues.length > 0 && <DeleteIcon onClick={() => setDelete(true)} color={'red'} ms={2} />}
            </Flex>
          </GridItem>
          <GridItem colSpan={4} display={"flex"} justifyContent={"end"} alignItems={"center"} textAlign={"right"}>
            <Menu isLazy  >
              <MenuButton p={4}>
                <BsColumnsGap />
              </MenuButton>
              <MenuList minW={'fit-content'} transform={"translate(1670px, 60px)"} zIndex={2}  >
                <MenuItem onClick={() => setManageColumns(true)} width={"165px"}> Manage Columns
                </MenuItem>
                {/* <MenuItem width={"165px"} onClick={() => setIsImportLead(true)}> Import Leads
                </MenuItem>
                <MenuDivider />
                <MenuItem width={"165px"} onClick={() => handleExportLeads('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                <MenuItem width={"165px"} onClick={() => handleExportLeads('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem> */}
              </MenuList>
            </Menu>
            <Button onClick={() => handleClick()} variant="brand" size="sm">Add User</Button>
            <Button onClick={() => navigate('/admin-setting')} variant="brand" size="sm" leftIcon={<IoIosArrowBack />} ml={2}>Back</Button>
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
        {/* Delete model */}
        <Delete isOpen={deleteModel} onClose={setDelete} setAction={setAction} setSelectedValues={setSelectedValues} url='api/user/deleteMany' data={selectedValues} method='many' />

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
                            <Flex align="center" >
                              {cell?.row?.original?.role !== 'superAdmin' ? <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" /> : <Text me="28px"></Text>}
                              <Text color={textColor} fontSize="sm" fontWeight="700">
                                {cell?.row?.index + 1}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "email Id") {
                          data = (
                            <Link to={`/userView/${cell?.row?.values._id}`}>
                              <Text
                                me="10px"
                                sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                color='brand.600'
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value}
                              </Text>
                            </Link>
                          );
                        } else if (cell?.column.Header === "first Name") {
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
                        } else if (cell?.column.Header === "last Name") {
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
                        } else if (cell?.column.Header === "role") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Action") {
                          data = (
                            <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                              <Menu isLazy  >
                                {console.log(cell?.row?.original?.role === 'superAdmin')}
                                <MenuButton><CiMenuKebab /></MenuButton>
                                <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                                  <MenuItem py={2.5} onClick={() => { setEdit(true); setSelectedId(cell?.row?.original._id) }} icon={<EditIcon fontSize={15} />}>Edit</MenuItem>
                                  <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/userView/${cell?.row?.values._id}`)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>
                                  {cell?.row?.original?.role === 'superAdmin' ? '' : <MenuItem py={2.5} color={'red'} onClick={() => { setSelectedValues([cell?.row?.original._id]); setDelete(true) }} icon={<DeleteIcon fontSize={15} />}>Delete</MenuItem>}
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
      <AddUser isOpen={isOpen} size={"sm"} setAction={setAction} onClose={onClose} />
      <Edit isOpen={edit} size={"sm"} setAction={setAction} onClose={onClose} setEdit={setEdit} selectedId={selectedId} />
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
                  First Name
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.firstName}
                  name="firstName"
                  placeholder='Enter First Name'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.firstName && touched.firstName && errors.firstName}</Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Last Name
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.lastName}
                  name="lastName"
                  placeholder='Enter Last Name'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.lastName && touched.lastName && errors.lastName}</Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                  Email Id
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.username}
                  name="username"
                  placeholder='Enter User Name'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.username && touched.username && errors.username}</Text>

              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="outline" colorScheme='green' mr={2} onClick={handleSubmit} disabled={isLoding || !dirty ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
            <Button size="sm" colorScheme="red" onClick={() => resetForm()}>Clear</Button>
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
            <Button size="sm" variant="outline" colorScheme='green' mr={2} onClick={() => {
              setSelectedColumns(tempSelectedColumns);
              setManageColumns(false);
              resetForm();
            }} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
            <Button size="sm" colorScheme="red" onClick={() => handleColumnClear()}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
