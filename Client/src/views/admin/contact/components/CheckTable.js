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

// Custom components
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import Delete from "../Delete";
import Add from "../Add";
import { BsColumnsGap } from "react-icons/bs";
import { useFormik } from "formik";

export default function CheckTable(props) {
  const { columnsData, tableData, fetchData, isLoding, setAction, allData, onClose, setSearchedData, onOpen, isOpen, displaySearchData, dynamicColumns, setDisplaySearchData, selectedColumns, setSelectedColumns } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [deleteModel, setDelete] = useState(false);
  const [selectedId, setSelectedId] = useState()
  const [gopageValue, setGopageValue] = useState()
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [manageColumns, setManageColumns] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(selectedColumns);
  // const [data, setData] = useState([])
  const data = useMemo(() => tableData, [tableData]);

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
    }
  })
  const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik
  const handleClear = () => {
    setDisplaySearchData(false)
  }

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
                color={textColor}
                fontSize="22px"
                fontWeight="700"
                lineHeight="100%"
              >
                Contacts (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
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
                    setDisplaySearchData(true)

                  }}
                  fontWeight='500'
                  placeholder="Search..." borderRadius="16px" />
              </InputGroup>
              <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} onClick={() => setAdvaceSearch(true)} size="sm">Advance Search</Button>
              {displaySearchData === true ? <Button variant="outline" size="sm" colorScheme='red' ms={2} onClick={() => { handleClear(); setGetTagValues([]) }}>clear</Button> : ""}
              {selectedValues.length > 0 && <DeleteIcon onClick={() => setDelete(true)} color={'red'} />}
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
                <MenuItem width={"165px"}> Import Leads
                </MenuItem>
              </MenuList>
            </Menu>
            <Button onClick={() => handleClick()} size={"sm"} variant="brand">Add</Button>
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
        <Delete setAction={setAction} isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/contact/deleteMany' data={selectedValues} method='many' />

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
                        } else if (cell?.column.Header === "title") {
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
                        } else if (cell?.column.Header === "first Name") {
                          data = (
                            <Link to={user?.role !== 'admin' ? `/contactView/${cell?.row?.original._id}` : `/admin/contactView/${cell?.row?.original._id}`}>
                              <Text
                                me="10px"
                                sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                color='green.400'
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value}
                              </Text>
                            </Link>
                          );
                        } else if (cell?.column.Header === "last Name") {
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
                        } else if (cell?.column.Header === "phone Number") {
                          data = (
                            <Text fontSize="sm" fontWeight="700"
                              onClick={() => {
                                setAddPhoneCall(true)
                                setSelectedId(cell?.row?.values._id)
                              }}
                              color='green.400' sx={{ cursor: 'pointer', '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Email Address") {
                          data = (
                            <Text fontSize="sm" fontWeight="700"
                              onClick={() => {
                                setAddEmailHistory(true)
                                setSelectedId(cell?.row?.values._id)
                              }}
                              color='green.400' sx={{ cursor: 'pointer', '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "physical Address") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "mailing Address") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Contact Method") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell?.value}
                            </Text>
                          );
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
      <Add
        isOpen={isOpen}
        size={size}
        onClose={onClose}
        setAction={setAction} />
      <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={selectedId} />
      <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} id={selectedId} />
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
            <Button variant="outline" colorScheme='green' mr={2} onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
            <Button colorScheme="red" onClick={() => resetForm()}>Clear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Manage Columns */}
      <Modal onClose={() => { setManageColumns(false); resetForm() }} isOpen={manageColumns} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Advance Search</ModalHeader>
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
