import {
  Box,
  Flex,
  Grid,
  GridItem,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
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
import { AddIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Spinner from "components/spinner/Spinner";
import {  useNavigate } from "react-router-dom";
import RoleModal from "./roleModal";
import AddRole from "../Add";
import { IoIosArrowBack } from "react-icons/io";
import DataNotFound from "components/notFoundData";

export default function CheckTable(props) {
  const { columnsData, tableData,  fetchData, isLoding, setAction } = props;
  const { onOpen } = useDisclosure();

  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);

  const [roleModal, setRoleModal] = useState(false);
  const [access, setAccess] = useState([])
  const [accessRole, setAccessRole] = useState([])
  const [roleName, setRoleName] = useState('')
  const [roleId, setRoleId] = useState('')
  const [gopageValue, setGopageValue] = useState()
  const data = useMemo(() => tableData, [tableData]);
  const [addRoleModal, setAddRoleModal] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchData()
  }, [])

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
            <Button onClick={() => setAddRoleModal(true)} variant="brand" size="sm" leftIcon={<AddIcon />}>Add New</Button>
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
                      {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                    >
                      <Flex
                        align="center"
                        justifyContent={column.center ? "center" : "start"}
                        fontSize={{ sm: "14px", lg: "16px" }}
                        color="secondaryGray.900"
                      >
                        <span style={{ textTransform: "capitalize", marginRight: "8px" }}>
                          {column.render("Header")}
                        </span>
                     
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
                        <DataNotFound />
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
                              onClick={() => { setRoleModal(true); setRoleName(cell?.value); setRoleId(cell?.row?.original?._id); setAccess(cell?.row?.original?.access); setAccessRole(cell?.row?.original?.access) }}
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


        {access && <RoleModal isOpen={roleModal}
          setRoleModal={setRoleModal}
          onOpen={onOpen}
          isLoding={isLoding} columnsData={rowColumns} name={roleName} _id={roleId} tableData={access} accessRole={accessRole} setAccessRole={setAccessRole} setAccess={setAccess} fetchData={fetchData} setAction={setAction} />}
      </Card>

      <AddRole isOpen={addRoleModal} size={"sm"} setAction={setAction} onClose={setAddRoleModal} />
    </>
  );
}
