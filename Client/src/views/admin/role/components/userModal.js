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
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Pagination from "components/pagination/Pagination";
import RoleUser from "./roleUser";
import { getApi } from "services/api";
import DataNotFound from "components/notFoundData";

function UserModal(props) {
  const {
    tableData,
    columnsData,
    isOpen,
    _id,
    setRoleModal,
    setOpenUser,
    fetchData,
  } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const data = useMemo(() => tableData, [tableData]);
  const [userModal, setUserModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [gopageValue, setGopageValue] = useState();

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

  const userFetchData = async () => {
    let result = await getApi('api/user/?role=user');
    setUserData(result?.data?.user);
  }

  useEffect(() => {
    userFetchData()
  }, [])



  return (
    <>
      <Modal onClose={() => setOpenUser(false)} isOpen={isOpen} isCentered size={"4xl"} style={{ height: "560px" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader height={"580px"} >
            <Flex justifyContent={'space-between'}>
              <Text>Users</Text>
              <Button variant="brand" size="sm" me={'2rem'} onClick={() => { setOpenUser(false); setUserModal(true) }}>Manage Users</Button>
              <ModalCloseButton mt='2' />
            </Flex>
          </ModalHeader>
          <ModalBody overflow={"auto"} height={"400px"}>
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
                          <span style={{
                            textTransform: "capitalize",
                          }}>
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
                          <DataNotFound />
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
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                  {cell?.row?.index + 1}
                                </Text>
                              </Flex>
                            );
                          } else if (cell?.column.Header === "email Id") {
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
            {data?.length > 5 && (
              <Pagination
                gotoPage={gotoPage}
                gopageValue={gopageValue}
                setGopageValue={setGopageValue}
                pageCount={pageCount}
                canPreviousPage={canPreviousPage}
                previousPage={previousPage}
                canNextPage={canNextPage}
                pageOptions={pageOptions}
                setPageSize={setPageSize}
                nextPage={nextPage}
                pageSize={pageSize}
                pageIndex={pageIndex}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              onClick={() => {
                setOpenUser(false);
                setRoleModal(true);
              }}
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
      <RoleUser
        fetchData={fetchData}
        userModal={userModal}
        setOpenUser={setOpenUser}
        _id={_id}
        setUserModal={setUserModal}
        userFetchData={userFetchData}
        userRole={tableData}
        tableData={userData || []}
        columnsData={columnsData || []}
      />
    </>
  );
}

export default UserModal;
