import {
  Box,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import { DeleteIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getApi } from "services/api";
import Delete from "../Delete";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";

export default function CheckTable(props) {
  const { columnsData, tableData, fetchData, isLoding } = props;
  const textColor = useColorModeValue("gray.500", "white");
  // const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [gopageValue, setGopageValue] = useState()
  const [deleteModel, setDelete] = useState(false);
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [callSelectedId, setCallSelectedId] = useState();

  const data = useMemo(() => tableData, [tableData]);
  const user = JSON.parse(localStorage.getItem("user"))

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
    if (fetchData) fetchData()
  }, [deleteModel, props.isOpen])

  return (
    <Card
      direction="column"
      w="100%"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={"secondaryGray.900"}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Leads  (<CountUpComponent targetNumber={data?.length} />)
        </Text>
        {/* <Menu /> */}
        {selectedValues.length > 0 && <DeleteIcon onClick={() => setDelete(true)} color={'red'} />}
      </Flex>
      {/* Delete model */}
      <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/lead/deleteMany' data={selectedValues} method='many' />
      <Box overflowY={"auto"} className="table-fix-container">
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead >
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
                      fontSize={{ sm: "14px", lg: "16px" }}
                      color=" secondaryGray.900"
                    >
                      <span style={{ textTransform: "capitalize" }}>
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
                            <Text color={textColor} fontSize="sm" fontWeight="500">
                              {cell?.row?.index + 1}
                            </Text>
                          </Flex>
                        );
                      } else if (cell?.column.Header === "Lead Name") {
                        data = (
                          <Link to={user?.role !== 'admin' ? `/leadView/${cell?.row?.values._id}` : `/admin/leadView/${cell?.row?.values._id}`}>
                            <Text
                              me="10px"
                              sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                              color='brand.600'
                              fontSize="sm"
                              fontWeight="500"
                            >
                              {cell?.value}
                            </Text>
                          </Link>
                        );
                      } else if (cell?.column.Header === "Lead Email") {
                        data = (
                          <Text
                            me="10px"
                            fontSize="sm"
                            fontWeight="500"
                            color='brand.600'
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
                            onClick={() => {
                              setAddEmailHistory(true)
                              setSelectedId(cell?.row?.values._id)
                            }
                            }
                          >
                            {cell?.value
                            }
                          </Text>
                        );
                      } else if (cell?.column.Header === "Lead PhoneNumber") {
                        data = (
                          <Text
                            me="10px"
                            fontSize="sm"
                            fontWeight="500"
                            color='brand.600'
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
                            onClick={() => {
                              setAddPhoneCall(true)
                              setCallSelectedId(cell?.row?.values._id)
                            }
                            }
                          >
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Lead Address") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="500">
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Lead Status") {
                        data = (
                          <Text color={"secondaryGray.900"} bgColor={cell?.value === "active" ? "green.500" : cell?.value === "sold" ? "red.300" : cell?.value === "pending" ? "yellow.400" : "#000"
                          } p={1} borderRadius={"20px"} textAlign={"center"} fontSize="sm" fontWeight="500" textTransform={"capitalize"}>
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Lead Owner") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="500">
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Lead Score") {
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
    </Card >
  );
}
