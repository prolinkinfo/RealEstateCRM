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
  Tfoot,
  Tr,
  Th,
  Flex,
  Text,
  Td,
  TableCaption,
  TableContainer,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { putApi } from "services/api";
import ChangeAccess from "../changeAccess";

function RoleModal(props) {
  const {
    name,
    tableData,
    handleClick,
    fetchData,
    columnsData,
    isOpen,
    setAction,
    _id,
    onClose,
    setRoleModal,
  } = props;



  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isLoding, setIsLoding] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [gopageValue, setGopageValue] = useState();
  const data = useMemo(() => tableData, [tableData]);
  const user = JSON.parse(localStorage.getItem("user"));

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


  return (
    <>
      <Modal onClose={() => setRoleModal(false)} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name} Access</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                        display={column.display === false && "none"}
                      >
                        <Flex
                          justify="space-between"
                          align="center"
                          fontSize={{ sm: "10px", lg: "12px" }}
                          color="gray.400"
                        >
                          {column.display !== false && column.render("Header")}
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
            <Button variant="brand" onClick={() => { setEditModal(true); setRoleModal(false) }}>
              Change Access
            </Button>
            <Button
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
      <ChangeAccess tableData={tableData} columnsData={columnsData} _id={_id} fetchData={fetchData} name={name} setEditModal={setEditModal} setAction={setAction} editModal={editModal} />
    </>
  );
}

export default RoleModal;
