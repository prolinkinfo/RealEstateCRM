import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Flex,
  Text,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import ChangeAccess from "../changeAccess";
import UserModal from "./userModal";
import { getApi } from "services/api";
import DataNotFound from "components/notFoundData";

function RoleModal(props) {
  const {
    name,
    tableData,
    fetchData,
    columnsData,
    isOpen,
    setAction,
    setAccess,
    _id,
    onOpen,
    setRoleModal,
  } = props;

  const tableColumns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10
    },
    { Header: 'email Id', accessor: 'username' },
    { Header: "first Name", accessor: "firstName", },
    { Header: "last Name", accessor: "lastName", },
    { Header: "role", accessor: "role", },
  ];

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [isLoding, setIsLoding] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [openUser, setOpenUser] = useState();
  const [gopageValue, setGopageValue] = useState();
  const data = useMemo(() => tableData || [], [tableData]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [userdata, setUserData] = useState([]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 500 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    state: { pageIndex, pageSize },
  } = tableInstance;

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length);
  }

  const userFetchData = async () => {
    if (_id) {
      let result = await getApi('api/role-access/assignedUsers/', _id);
      setUserData(result?.data);
    }
  }

  useEffect(() => {
    userFetchData()
  }, [_id])

  return (
    <>
      <Modal onClose={() => setRoleModal(false)} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent height={"580px"} maxWidth={"2xl"}>
          <ModalHeader>
            <Flex justifyContent={'space-between'}>
              <Text textTransform={"capitalize"}>{name} Access</Text>
              <Text style={{
                marginRight: "25px",
                fontSize: "15px",
                fontWeight: "700",
                marginTop: '5px',
                color: 'blue',
                cursor: 'pointer',
                textDecoration: 'underline'
              }} onClick={() => { setOpenUser(true); setRoleModal(false); }}>View user's in {name} role</Text>
              <ModalCloseButton mt='2' />
            </Flex>
          </ModalHeader>
          <ModalBody overflow={"auto"} height={"400px"}>
            <Table>
              <Thead>
                {headerGroups?.map((headerGroup, index) => (
                  <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers?.map((column, index) => (
                      <Th
                        sx={{ width: "10px" }}
                        key={index}
                        borderColor={borderColor}
                        display={column.display === false && "none"}
                      >
                        {column.display !== false && column.render("Header")}
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
                          if (cell?.column.Header === "title") {
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
                                {cell?.value ? 'Yes' : 'No'}
                              </Text>
                            );
                          } else if (cell?.column.Header === "view") {
                            data = (
                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value ? 'Yes' : 'No'}
                              </Text>
                            );
                          } else if (cell?.column.Header === "update") {
                            data = (
                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value ? 'Yes' : 'No'}
                              </Text>
                            );
                          } else if (cell?.column.Header === "delete") {
                            data = (
                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.value ? 'Yes' : 'No'}
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
                              sx={{
                                display: cell?.column.Header === "#" && "none",
                              }}
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
          </ModalBody>
          <ModalFooter>
            <Button variant="brand" size="sm" onClick={() => { setEditModal(true); setRoleModal(false) }}>
              Change Access
            </Button>
            <Button
              size="sm"
              onClick={() => setRoleModal(false)}
              variant="outline"
              colorScheme="red"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ChangeAccess tableData={tableData ?? []} accessRole={tableData ?? []} setAccess={setAccess} setRoleModal={setRoleModal} columnsData={columnsData ?? []} _id={_id} fetchData={fetchData} name={name} setEditModal={setEditModal} setAction={setAction} editModal={editModal} />
      <UserModal isOpen={openUser}
        setRoleModal={setRoleModal}
        setOpenUser={setOpenUser}
        onOpen={onOpen}
        columnsData={tableColumns ?? []}
        tableData={userdata ?? []}
        setAction={setAction}
        _id={_id}
        fetchData={userFetchData}
        userdata={userdata}
      />
    </>
  );
}

export default RoleModal;
