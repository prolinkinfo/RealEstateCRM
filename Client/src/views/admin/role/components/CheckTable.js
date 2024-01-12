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
  useDisclosure,
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
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import ChangeAccess from "../changeAccess";
import RoleModal from "./roleModal";
import AddRole from "../Add";
import { IoIosArrowBack } from "react-icons/io";

export default function CheckTable(props) {
  const { columnsData, name, tableData, handleClick, fetchData, isLoding, setAction, _id, action } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);

  const [roleModal, setRoleModal] = useState(false);
  const [access, setAccess] = useState([])
  const [roleName, setRoleName] = useState('')
  const [roleId, setRoleId] = useState('')
  const [gopageValue, setGopageValue] = useState()
  // const [data, setData] = useState([])
  const data = useMemo(() => tableData, [tableData]);
  const [addRoleModal, setAddRoleModal] = useState(false);
  const navigate = useNavigate();
  // const fetchData = async () => {
  //   let result = await getApi('api/contact/');
  //   setData(result.data);
  // }
  const user = JSON.parse(localStorage.getItem("user"))

  const rowColumns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
      display: false
    },

    { Header: "title", accessor: "title" },
    { Header: "create", accessor: "create", width: '20px' },
    { Header: "view", accessor: "view", width: '20px' },
    { Header: "update", accessor: "update", width: '20px' },
    { Header: "delete", accessor: "delete", width: '20px' },
  ]


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
          <GridItem colSpan={8}>
            <Flex alignItems="center" flexWrap='wrap'>
              <Text
                color={"secondaryGray.900"}
                fontSize="22px"
                fontWeight="700"
                lineHeight="100%"
              >
                Roles (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
              </Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={4} justifyContent="end" alignItems="center" textAlign="right">
            <Button onClick={() => setAddRoleModal(true)} variant="brand" size="sm">Add</Button>
            <Button onClick={() => navigate('/admin-setting')} variant="brand" size="sm" ml={2} leftIcon={<IoIosArrowBack />}>Back</Button>
          </GridItem>
        </Grid>

        <Box overflowY={"auto"} className="table-fix-container">
          <Table>
            <Thead>
              {headerGroups?.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers?.map((column, index) => (
                    <Th
                      // sx={{ width: "20%" }}
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

                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.row?.index + 1}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "Role Name") {
                          data = (
                            <Text
                              me="10px"
                              onClick={() => { setRoleModal(true); setRoleName(cell?.value); setRoleId(cell?.row?.original?._id); setAccess(cell?.row?.original?.access) }}
                              color='brand.600'
                              sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Description") {
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
                            // minW={{ sm: "150px", md: "200px", lg: "auto" }}
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
        </Box>

        {/* {data.map(item => ( */}

        {access && <RoleModal isOpen={roleModal}
          setRoleModal={setRoleModal}
          onOpen={onOpen}
          isLoding={isLoding} columnsData={rowColumns} name={roleName} _id={roleId} tableData={access} fetchData={fetchData} setAction={setAction} />}
      </Card>

      <AddRole isOpen={addRoleModal} size={"sm"} setAction={setAction} onClose={setAddRoleModal} />
    </>
  );
}
