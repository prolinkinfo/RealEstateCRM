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
import { putApi } from "services/api";
import DataNotFound from "components/notFoundData";

function ChangeAccess(props) {
  const {
    columnsData,
    name,
    tableData,
    fetchData,
    setAccess,
    _id,
    setRoleModal,
    editModal, setEditModal,
  } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [isLoding, setIsLoding] = useState(false);

  const [gopageValue, setGopageValue] = useState();
  const data = useMemo(() => tableData || [], [tableData]);

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
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length);
  }

  const initialValues = {
    roleName: name,
    access: tableData,
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      EditData();
    },
  });

  const {
    values,
    handleSubmit,
    setFieldValue,
    resetForm
  } = formik;

  // const handleCheckboxChange = (index, fieldName, secondFieldName) => (event) => {
  //   const { checked } = event.target;

  //   let updatedAccess = values.access.map((item, idx) => {
  //     if (idx === index) {
  //       const updatedItem = { ...item, [fieldName]: checked };
  //       if (secondFieldName && checked === false) {
  //         updatedItem[secondFieldName] = checked;
  //         updatedItem.update = checked;
  //         updatedItem.delete = checked;
  //       } else if (secondFieldName) {
  //         updatedItem[secondFieldName] = checked;
  //       }

  //       return updatedItem;
  //     }
  //     return item;
  //   });
  //   const leadsIndex = values.access.findIndex(accessItem => accessItem.title === "Leads");
  //   const contactsIndex = values.access.findIndex(accessItem => accessItem.title === "Contacts");

  //   const lc = ((updatedAccess[index]?.title === "Leads" || updatedAccess[index]?.title === "Contacts") && (!updatedAccess[contactsIndex]?.view && !updatedAccess[leadsIndex]?.view))

  //   const mm = updatedAccess?.map((i, idx) => {
  //     let newItem = { ...i };
  //     if (secondFieldName && checked === false && lc) {
  //       if (i.title === "Emails" || i.title === "Calls" || i.title === "Meetings") {
  //         newItem.create = false;
  //         newItem.delete = false;
  //         newItem.update = false;
  //         newItem.view = false;
  //       }
  //     }
  //     return newItem;
  //   })

  //   // setFieldValue('access', updatedAccess);
  //   setFieldValue('access', mm);
  // };

  const handleCheckboxChange = (index, fieldName, secondFieldName) => (event) => {
    const { checked } = event.target;
    const leadsIndex = values.access.findIndex(accessItem => accessItem.title === "Leads");
    const contactsIndex = values.access.findIndex(accessItem => accessItem.title === "Contacts");

    const updatedAccess = values.access.map((item, idx) => {
      if (idx === index) {
        const updatedItem = { ...item, [fieldName]: checked };
        if (secondFieldName && !checked) {
          updatedItem[secondFieldName] = updatedItem.update = updatedItem.delete = checked;
        } else if (secondFieldName) {
          updatedItem[secondFieldName] = checked;
        }
        return updatedItem;
      }
      return item;
    });

    const finalUpdatedAccessWith = updatedAccess.map((item, idx) => {
      if (secondFieldName && checked === false && (!updatedAccess[contactsIndex]?.view && !updatedAccess[leadsIndex]?.view)) {
        if (["Emails", "Calls", "Meetings"].includes(item.title)) {
          return {
            ...item,
            create: false,
            delete: false,
            update: false,
            view: false
          };
        }
      }
      return item;
    });

    setFieldValue('access', finalUpdatedAccessWith);
  };

  const EditData = async () => {
    try {
      setIsLoding(true);
      setAccess(values?.access)
      let response = await putApi(`api/role-access/edit/${_id}`, values);
      if (response.status === 200) {
        setEditModal(false)
        fetchData()
        setRoleModal(true)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const disable = (cell) => {
    if (["Emails", "Calls", "Meetings"].includes(cell.title)) {
      return !values?.access?.some((i => (i.title === "Contacts" || i.title === "Leads") && i.view));
    }
    return false;
  }

  useEffect(() => {
    fetchData()
  }, [editModal])

  useEffect(() => {
    if (Array.isArray(data) && data?.length > 0) {
      setPageSize(data?.length); // Ensure the pageSize is set to the length of the data
    }
  }, [data, setPageSize]);

  return (
    <Modal onClose={() => setEditModal(false)} isOpen={editModal} isCentered size={"xl"}>
      <ModalOverlay />
      <ModalContent height={"580px"} maxWidth={"2xl"}>
        <ModalHeader textTransform={"capitalize"}>{name} Access</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow={"auto"} height={"400px"}>
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
                              <Checkbox
                                disabled={disable(cell?.row?.original)}
                                isChecked={values?.access[i]?.create}
                                defaultChecked={values?.access[i]?.create}
                                onChange={handleCheckboxChange(i, 'create', "view")}
                              />
                            </Text>
                          );
                        } else if (cell?.column.Header === "view") {
                          data = (
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              <Checkbox
                                disabled={disable(cell?.row?.original)}
                                isChecked={values?.access[i]?.view}
                                defaultChecked={values?.access[i]?.view}
                                onChange={handleCheckboxChange(i, 'view', "create")}
                              />
                            </Text>
                          );
                        } else if (cell?.column.Header === "update") {
                          data = (
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              <Checkbox
                                disabled={!values?.access[i]?.view}
                                isChecked={values?.access[i]?.update}
                                defaultChecked={values?.access[i]?.update}
                                onChange={handleCheckboxChange(i, 'update')}
                              />
                            </Text>
                          );
                        } else if (cell?.column.Header === "delete") {
                          data = (
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              <Checkbox
                                disabled={!values?.access[i]?.view}
                                isChecked={values?.access[i]?.delete}
                                defaultChecked={values?.access[i]?.delete}
                                onChange={handleCheckboxChange(i, 'delete')}
                              />
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
          <Button size="sm" variant="brand" onClick={handleSubmit}>
            Save
          </Button>
          <Button size="sm"
            onClick={() => { resetForm(); setEditModal(false); setRoleModal(true); }}
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
  );
}

export default ChangeAccess;
