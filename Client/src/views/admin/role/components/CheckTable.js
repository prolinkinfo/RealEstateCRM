import {
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Menu,
  Button,
  Tab,
  TabList,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getApi } from "services/api";
import ChangeAccess from "../changeAccess";

export default function CheckTable(props) {
  const { columnsData, action, setAction, onOpen,isOpen ,onClose } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [deleteModel, setDelete] = useState(false);
  // const data = useMemo(() => tableData, [tableData]);
  const [data, setData] = useState([
    {
      title: "Lead",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Contacts",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Property",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Task",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Meeting",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Call",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Email",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
  ]);
  const [isLoding, setIsLoding] = useState(false);
  const [gopageValue, setGopageValue] = useState();

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
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
    state: { pageIndex, pageSize },
  } = tableInstance;

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length);
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
    props.onOpen();
  };

  return (
    <>
      <Tabs>
        <Grid templateColumns="repeat(3, 1fr)" mb={3} gap={1}>
          <GridItem colSpan={2}>
            <TabList
              sx={{
                border: "none",
                "& button:focus": { boxShadow: "none" },
                "& button": {
                  margin: "0 5px",
                  border: "2px solid #8080803d",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  borderBottom: 0,
                },
                '& button[aria-selected="true"]': {
                  border: "2px solid brand.200",
                  borderBottom: 0,
                },
              }}
            >
              <Tab>Admin</Tab>
              <Tab>Team Leads</Tab>
              <Tab>Managers</Tab>
              <Tab>Executives</Tab>
              <Tab>Tele Callers</Tab>
            </TabList>
          </GridItem>
        </Grid>
        <Card
          direction="column"
          w="100%"
          px="0px"
          overflowX={{ sm: "scroll", lg: "hidden" }}
        >
          <TabPanels>
            <TabPanel pt={4} p={0}>
              <Flex px="25px" justify="space-between" mb="20px" align="center">
                <Text
                  color={textColor}
                  fontSize="22px"
                  fontWeight="700"
                  lineHeight="100%"
                >
                  Admin (
                  <CountUpComponent
                    key={data?.length}
                    targetNumber={data?.length}
                  />
                  )
                </Text>
                {/* <Menu /> */}
                {selectedValues.length > 0 && (
                  <DeleteIcon onClick={() => setDelete(true)} color={"red"} />
                )}

                <Button variant="brand" onClick={handleClick}>Change Access</Button>
              </Flex>
              <Table>
                <Thead>
                  {headerGroups?.map((headerGroup, index) => (
                    <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers?.map((column, index) => (
                        <Th
                          sx={{ width: "10px" }}
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
                            {/* {column.isSortable !== false && (
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <FaSortDown />
                                  ) : (
                                    <FaSortUp />
                                  )
                                ) : (
                                  <FaSort />
                                )}
                              </span>
                            )} */}
                          </Flex>
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                  {isLoding ? (
                    <Tr>
                      <Td colSpan={columns?.length}>
                        <Flex
                          justifyContent={"center"}
                          alignItems={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          <Spinner />
                        </Flex>
                      </Td>
                    </Tr>
                  ) : data?.length === 0 ? (
                    <Tr>
                      <Td colSpan={columns.length}>
                        <Text
                          textAlign={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          -- No Data Found --
                        </Text>
                      </Td>
                    </Tr>
                  ) : (
                    page?.map((row, i) => {
                      prepareRow(row);
                      return (
                        <Tr {...row?.getRowProps()} key={i}>
                          {row?.cells?.map((cell, index) => {
                            let data = "";
                            if (cell?.column.Header === "#") {
                              data = (
                                <Flex align="center">
                                  <Checkbox
                                    colorScheme="brandScheme"
                                    value={selectedValues}
                                    isChecked={selectedValues.includes(
                                      cell?.value
                                    )}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, cell?.value)
                                    }
                                    me="10px"
                                  />
                                  <Text
                                    color={textColor}
                                    fontSize="sm"
                                    fontWeight="700"
                                  >
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
                            } else if (cell?.column.Header === "create") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "view") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "update") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "delete") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
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
                    })
                  )}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel pt={4} p={0}>
              <Flex px="25px" justify="space-between" mb="20px" align="center">
                <Text
                  color={textColor}
                  fontSize="22px"
                  fontWeight="700"
                  lineHeight="100%"
                >
                  Team Leads (
                  <CountUpComponent
                    key={data?.length}
                    targetNumber={data?.length}
                  />
                  )
                </Text>
                {/* <Menu /> */}
                {selectedValues.length > 0 && (
                  <DeleteIcon onClick={() => setDelete(true)} color={"red"} />
                )}

                <Button variant="brand" onClick={handleClick}>Change Access</Button>
              </Flex>
              <Table>
                <Thead>
                  {headerGroups?.map((headerGroup, index) => (
                    <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers?.map((column, index) => (
                        <Th
                          sx={{ width: "10px" }}
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
                            {/* {column.isSortable !== false && (
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <FaSortDown />
                                  ) : (
                                    <FaSortUp />
                                  )
                                ) : (
                                  <FaSort />
                                )}
                              </span>
                            )} */}
                          </Flex>
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                  {isLoding ? (
                    <Tr>
                      <Td colSpan={columns?.length}>
                        <Flex
                          justifyContent={"center"}
                          alignItems={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          <Spinner />
                        </Flex>
                      </Td>
                    </Tr>
                  ) : data?.length === 0 ? (
                    <Tr>
                      <Td colSpan={columns.length}>
                        <Text
                          textAlign={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          -- No Data Found --
                        </Text>
                      </Td>
                    </Tr>
                  ) : (
                    page?.map((row, i) => {
                      prepareRow(row);
                      return (
                        <Tr {...row?.getRowProps()} key={i}>
                          {row?.cells?.map((cell, index) => {
                            let data = "";
                            if (cell?.column.Header === "#") {
                              data = (
                                <Flex align="center">
                                  <Checkbox
                                    colorScheme="brandScheme"
                                    value={selectedValues}
                                    isChecked={selectedValues.includes(
                                      cell?.value
                                    )}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, cell?.value)
                                    }
                                    me="10px"
                                  />
                                  <Text
                                    color={textColor}
                                    fontSize="sm"
                                    fontWeight="700"
                                  >
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
                            } else if (cell?.column.Header === "create") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "view") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "update") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "delete") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
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
                    })
                  )}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel pt={4} p={0}>
              <Flex px="25px" justify="space-between" mb="20px" align="center">
                <Text
                  color={textColor}
                  fontSize="22px"
                  fontWeight="700"
                  lineHeight="100%"
                >
                  Managers (
                  <CountUpComponent
                    key={data?.length}
                    targetNumber={data?.length}
                  />
                  )
                </Text>
                {/* <Menu /> */}
                {selectedValues.length > 0 && (
                  <DeleteIcon onClick={() => setDelete(true)} color={"red"} />
                )}

                <Button variant="brand" onClick={handleClick}>Change Access</Button>
              </Flex>
              <Table>
                <Thead>
                  {headerGroups?.map((headerGroup, index) => (
                    <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers?.map((column, index) => (
                        <Th
                          sx={{ width: "10px" }}
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
                            {/* {column.isSortable !== false && (
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <FaSortDown />
                                  ) : (
                                    <FaSortUp />
                                  )
                                ) : (
                                  <FaSort />
                                )}
                              </span>
                            )} */}
                          </Flex>
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                  {isLoding ? (
                    <Tr>
                      <Td colSpan={columns?.length}>
                        <Flex
                          justifyContent={"center"}
                          alignItems={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          <Spinner />
                        </Flex>
                      </Td>
                    </Tr>
                  ) : data?.length === 0 ? (
                    <Tr>
                      <Td colSpan={columns.length}>
                        <Text
                          textAlign={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          -- No Data Found --
                        </Text>
                      </Td>
                    </Tr>
                  ) : (
                    page?.map((row, i) => {
                      prepareRow(row);
                      return (
                        <Tr {...row?.getRowProps()} key={i}>
                          {row?.cells?.map((cell, index) => {
                            let data = "";
                            if (cell?.column.Header === "#") {
                              data = (
                                <Flex align="center">
                                  <Checkbox
                                    colorScheme="brandScheme"
                                    value={selectedValues}
                                    isChecked={selectedValues.includes(
                                      cell?.value
                                    )}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, cell?.value)
                                    }
                                    me="10px"
                                  />
                                  <Text
                                    color={textColor}
                                    fontSize="sm"
                                    fontWeight="700"
                                  >
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
                            } else if (cell?.column.Header === "create") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "view") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "update") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "delete") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
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
                    })
                  )}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel pt={4} p={0}>
            <Flex px="25px" justify="space-between" mb="20px" align="center">
                <Text
                  color={textColor}
                  fontSize="22px"
                  fontWeight="700"
                  lineHeight="100%"
                >
                  Executives (
                  <CountUpComponent
                    key={data?.length}
                    targetNumber={data?.length}
                  />
                  )
                </Text>
                {/* <Menu /> */}
                {selectedValues.length > 0 && (
                  <DeleteIcon onClick={() => setDelete(true)} color={"red"} />
                )}

                <Button variant="brand" onClick={handleClick}>Change Access</Button>
              </Flex>
              <Table>
                <Thead>
                  {headerGroups?.map((headerGroup, index) => (
                    <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers?.map((column, index) => (
                        <Th
                          sx={{ width: "10px" }}
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
                            {/* {column.isSortable !== false && (
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <FaSortDown />
                                  ) : (
                                    <FaSortUp />
                                  )
                                ) : (
                                  <FaSort />
                                )}
                              </span>
                            )} */}
                          </Flex>
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                  {isLoding ? (
                    <Tr>
                      <Td colSpan={columns?.length}>
                        <Flex
                          justifyContent={"center"}
                          alignItems={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          <Spinner />
                        </Flex>
                      </Td>
                    </Tr>
                  ) : data?.length === 0 ? (
                    <Tr>
                      <Td colSpan={columns.length}>
                        <Text
                          textAlign={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          -- No Data Found --
                        </Text>
                      </Td>
                    </Tr>
                  ) : (
                    page?.map((row, i) => {
                      prepareRow(row);
                      return (
                        <Tr {...row?.getRowProps()} key={i}>
                          {row?.cells?.map((cell, index) => {
                            let data = "";
                            if (cell?.column.Header === "#") {
                              data = (
                                <Flex align="center">
                                  <Checkbox
                                    colorScheme="brandScheme"
                                    value={selectedValues}
                                    isChecked={selectedValues.includes(
                                      cell?.value
                                    )}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, cell?.value)
                                    }
                                    me="10px"
                                  />
                                  <Text
                                    color={textColor}
                                    fontSize="sm"
                                    fontWeight="700"
                                  >
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
                            } else if (cell?.column.Header === "create") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "view") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "update") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "delete") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
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
                    })
                  )}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel pt={4} p={0}>
            <Flex px="25px" justify="space-between" mb="20px" align="center">
                <Text
                  color={textColor}
                  fontSize="22px"
                  fontWeight="700"
                  lineHeight="100%"
                >
                  Tele Callers (
                  <CountUpComponent
                    key={data?.length}
                    targetNumber={data?.length}
                  />
                  )
                </Text>
                {/* <Menu /> */}
                {selectedValues.length > 0 && (
                  <DeleteIcon onClick={() => setDelete(true)} color={"red"} />
                )}
                  <Button variant="brand" onClick={handleClick}>Change Access</Button>
              </Flex>
              <Table>
                <Thead>
                  {headerGroups?.map((headerGroup, index) => (
                    <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers?.map((column, index) => (
                        <Th
                          sx={{ width: "10px" }}
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
                            {/* {column.isSortable !== false && (
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <FaSortDown />
                                  ) : (
                                    <FaSortUp />
                                  )
                                ) : (
                                  <FaSort />
                                )}
                              </span>
                            )} */}
                          </Flex>
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                  {isLoding ? (
                    <Tr>
                      <Td colSpan={columns?.length}>
                        <Flex
                          justifyContent={"center"}
                          alignItems={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          <Spinner />
                        </Flex>
                      </Td>
                    </Tr>
                  ) : data?.length === 0 ? (
                    <Tr>
                      <Td colSpan={columns.length}>
                        <Text
                          textAlign={"center"}
                          width="100%"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          -- No Data Found --
                        </Text>
                      </Td>
                    </Tr>
                  ) : (
                    page?.map((row, i) => {
                      prepareRow(row);
                      return (
                        <Tr {...row?.getRowProps()} key={i}>
                          {row?.cells?.map((cell, index) => {
                            let data = "";
                            if (cell?.column.Header === "#") {
                              data = (
                                <Flex align="center">
                                  <Checkbox
                                    colorScheme="brandScheme"
                                    value={selectedValues}
                                    isChecked={selectedValues.includes(
                                      cell?.value
                                    )}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, cell?.value)
                                    }
                                    me="10px"
                                  />
                                  <Text
                                    color={textColor}
                                    fontSize="sm"
                                    fontWeight="700"
                                  >
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
                            } else if (cell?.column.Header === "create") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "view") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "update") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
                                </Text>
                              );
                            } else if (cell?.column.Header === "delete") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                  {cell?.value ? "Yes" : "No"}
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
                    })
                  )}
                </Tbody>
              </Table>
            </TabPanel>
          </TabPanels>
        </Card>
      </Tabs>
      <ChangeAccess isOpen={isOpen} onClose={onClose} onOpen={onOpen} borderColor={borderColor}
       data={page} headerGroups={headerGroups} textColor={textColor} column={columns} getTableBodyProps={getTableBodyProps}
       page={data} setData={setData} isLoding={isLoding} prepareRow={prepareRow} />
    </>
  );
}
