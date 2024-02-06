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
import { AddIcon, DeleteIcon, EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import Delete from "../Delete";
import Add from "../Add";
import { BsColumnsGap } from "react-icons/bs";
import * as yup from "yup"
import { useFormik } from "formik";
import { CiMenuKebab } from "react-icons/ci";
import Edit from "../Edit";
import ImportModal from "./ImportModal";
import CustomSearchInput from "components/search/search";

export default function CheckTable(props) {
  const { columnsData, setAction, tableData, fetchData, dataColumn, access, isLoding, allData, setSearchedData, setDisplaySearchData, displaySearchData, selectedColumns, setSelectedColumns, dynamicColumns, setDynamicColumns, action } = props;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  // const columns = useMemo(() => columnsData, [columnsData]);
  const columns = useMemo(() => dataColumn, [dataColumn]);
  const data = useMemo(() => tableData, [tableData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchbox, setSearchbox] = useState('');
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [getTagValues, setGetTagValues] = useState([]);
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn);
  const [isImportProperty, setIsImportProperty] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [deleteModel, setDelete] = useState(false);
  // const data = useMemo(() => tableData, [tableData]);
  // const [data, setData] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const [gopageValue, setGopageValue] = useState()
  const size = "lg";
  const navigate = useNavigate();

  const csvColumns = [
    { Header: 'Property Type', accessor: 'propertyType' },
    { Header: "Listing Price", accessor: "listingPrice" },
    { Header: "Square Footage", accessor: "squareFootage" },
    { Header: "Year Built", accessor: "yearBuilt" },
    { Header: "Number of Bedrooms", accessor: "numberofBedrooms" },
    { Header: "Number of Bathrooms", accessor: "numberofBathrooms" },
  ];

  // const fetchData = async () => {
  //   setIsLoding(true)
  //   let result = await getApi(user.role === 'superAdmin' ? 'api/property/' : `api/property/?createBy=${user._id}`);
  //   setData(result.data);
  //   setIsLoding(false)
  // }

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
    propertyType: '',
    listingPrice: '',
    squareFootage: '',
    yearBuilt: '',
    numberOfBedrooms: '',
    numberOfBathrooms: ''
  }
  const validationSchema = yup.object({
    propertyType: yup.string(),
    squareFootage: yup.string(),
    listingPrice: yup.string(),
    yearBuilt: yup.string(),
    numberOfBedrooms: yup.string(),
    numberOfBathrooms: yup.string(),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values?.propertyType || (item?.propertyType && item?.propertyType.toLowerCase().includes(values?.propertyType?.toLowerCase()))) &&
          (!values?.listingPrice || (item?.listingPrice && item?.listingPrice.toString().includes(values?.listingPrice?.toLowerCase()))) &&
          (!values?.squareFootage || (item?.squareFootage && item?.squareFootage.toString().includes(values?.squareFootage))) &&
          (!values?.yearBuilt || (item?.yearBuilt && item?.yearBuilt.toString().includes(values?.yearBuilt))) &&
          (!values?.numberOfBedrooms || (item?.numberofBedrooms && item?.numberofBedrooms.toString() === values?.numberOfBedrooms)) &&
          (!values?.numberOfBathrooms || (item?.numberofBathrooms && item?.numberofBathrooms.toString() === values?.numberOfBathrooms)),
      )

      let getValue = [values.propertyType, values?.numberOfBedrooms, values?.numberOfBathrooms, values?.listingPrice, values?.squareFootage, values?.yearBuilt].filter(value => value);
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
  const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm, dirty } = formik

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

  const handleExportProperties = (extension) => {
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
        convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, 'property', extension);
      } else {
        const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns.forEach((property) => {
            selectedFieldsData[property.accessor] = rec[property.accessor];
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(AllRecordsWithSpecificFileds, csvColumns, 'property', extension);
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
        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={4} mx={4}>
          <GridItem colSpan={8} >
            <Flex alignItems={"center"} flexWrap={"wrap"}>
              <Text
                color={"secondaryGray.900"}
                fontSize="22px"
                fontWeight="700"
              >
                Properties (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
              </Text>
              <CustomSearchInput setSearchbox={setSearchbox} setDisplaySearchData={setDisplaySearchData} searchbox={searchbox} allData={allData} dataColumn={dataColumn} onSearch={handleSearch} />
              <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} onClick={() => setAdvaceSearch(true)} size="sm">Advance Search</Button>
              {displaySearchData === true ? <Button variant="outline" size="sm" colorScheme='red' ms={2} onClick={() => { handleClear(); setSearchbox(''); setGetTagValues([]) }}>Clear</Button> : ""}
              {(selectedValues.length > 0 && access?.delete) && <DeleteIcon cursor={"pointer"} onClick={() => setDelete(true)} color={'red'} ms={2} />}
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
                <MenuItem width={"165px"} onClick={() => setIsImportProperty(true)}> Import Properties
                </MenuItem>
                <MenuDivider />
                <MenuItem width={"165px"} onClick={() => handleExportProperties('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                <MenuItem width={"165px"} onClick={() => handleExportProperties('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
              </MenuList>
            </Menu>
            {access?.create && <Button onClick={() => handleClick()} size="sm"
              variant="brand" leftIcon={<AddIcon />}>Add New</Button>}
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
        {/* Delete model */}
        <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} setAction={setAction} url='api/property/deleteMany' data={selectedValues} method='many' />

        <Box overflowY={"auto"} className="table-fix-container">
          <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
            <Thead zIndex={9}>
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
                        <span style={{ textTransform: "capitalize", marginRight: "8px" }}> {column.render("Header")}</span>
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
                  <Td colSpan={columns?.length} >
                    <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
                : data?.length === 0 ? (
                  <Tr>
                    <Td colSpan={columns.length} className="tableData">
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
                        } else if (cell?.column.Header === "property Type") {
                          data = (
                            access?.view ? <Link to={`/propertyView/${cell?.row?.values._id}`}>
                              <Text
                                className="tableData"
                                me="10px"
                                sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                color='brand.600'
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value}
                              </Text>
                            </Link> : <Text
                              className="tableData"
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "property Address") {
                          data = (
                            <Text
                              className="tableData"
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "listing Price") {
                          data = (
                            <Text
                              className="tableData"
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "square Footage") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700" className="tableData" textAlign={"center"}>
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "year Built") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700" className="tableData" textAlign={"center"}>
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "number of Bedrooms") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700" className="tableData" textAlign={"center"}>
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "number of Bathrooms") {
                          data = (
                            <Text color={textColor} fontSize="sm" fontWeight="700" className="tableData" textAlign={"center"}>
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
                                  {access?.view && <MenuItem py={2.5} color={'green'} onClick={() => navigate(`/propertyView/${cell?.row?.values._id}`)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>}
                                  {access?.delete && <MenuItem py={2.5} color={'red'} onClick={() => { setSelectedValues([cell?.row?.original._id]); setDelete(true) }} icon={<DeleteIcon fontSize={15} />}>Delete</MenuItem>}
                                </MenuList>
                              </Menu>
                            </Text>
                          )
                        }
                        return (
                          <Td
                            className="tableData"
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
      <Add isOpen={isOpen} size={size} onClose={onClose} setAction={setAction} />
      <Edit isOpen={edit} size={size} selectedId={selectedId} setSelectedId={setSelectedId} onClose={setEdit} setAction={setAction} />
      <ImportModal text='Property file' fetchData={fetchData} isOpen={isImportProperty} onClose={setIsImportProperty} />

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
                  Property Type
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.propertyType}
                  name="propertyType"
                  placeholder='Enter Property Type'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.propertyType && touched.propertyType && errors.propertyType}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                  Listing Price
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.listingPrice}
                  name="listingPrice"
                  placeholder='Enter Listing Price'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.listingPrice && touched.listingPrice && errors.listingPrice}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Square Footage
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.squareFootage}
                  name="squareFootage"
                  placeholder='Enter Square Footage'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.squareFootage && touched.squareFootage && errors.squareFootage}</Text>

              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Year Built
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.yearBuilt}
                  name="yearBuilt"
                  placeholder='Enter Lead Owner'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.yearBuilt && touched.yearBuilt && errors.yearBuilt}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Number of Bedrooms
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.numberOfBedrooms}
                  name="numberOfBedrooms"
                  placeholder='Enter Number of Bedrooms'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.numberOfBedrooms && touched.numberOfBedrooms && errors.numberOfBedrooms}</Text>

              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Number of Bathrooms
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.numberOfBathrooms}
                  name="numberOfBathrooms"
                  placeholder='Enter Number of Bathrooms'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.numberOfBathrooms && touched.numberOfBathrooms && errors.numberOfBathrooms}</Text>

              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="outline" colorScheme='green' mr={2} onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Search'}</Button>
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
              {dynamicColumns?.map((column) => (
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
            <Button size="sm" colorScheme="red" onClick={() => resetForm()}>Clear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

  );
}
