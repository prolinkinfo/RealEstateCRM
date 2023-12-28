import React from "react";
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
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";

function ChangeAccess({
  isOpen,
  onOpen,
  onClose,
  data,
  headerGroups,
  textColor,
  page,
  setData,
  borderColor,
  columns,
  prepareRow,
  isLoding,
  getTableBodyProps,
}) {
  const handleCheckboxChange = (index, key) => {
    const updatedPermissions = [...page];
    updatedPermissions[index][key] = !updatedPermissions[index][key];
    setData(updatedPermissions);
  };

  const handleSave = () => {
    // Here, you can implement the logic to save the updated permissions
    // For example, send a POST request to an API endpoint
    console.log("Saving permissions:", page);
    // Replace the above console.log with your saving logic
  };

  return (
    <>
      {/* <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Access</ModalHeader>
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
                  data?.map((row, i) => {
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
                                  checked={cell?.value}
                                  onChange={() =>
                                    handleCheckboxChange(index, "create")
                                  }
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
                                  checked={cell?.value}
                                  onChange={() =>
                                    handleCheckboxChange(index, "view")
                                  }
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
                                  checked={cell?.value}
                                  onChange={() =>
                                    handleCheckboxChange(index, "update")
                                  }
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
                                  checked={cell?.value}
                                  onChange={() =>
                                    handleCheckboxChange(index, "delete")
                                  }
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
                              sx={{ display: cell?.column.Header === '#' && 'none' }}
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
            <Button variant="brand" onClick={handleSave}>
              Save
            </Button>
            <Button
              onClick={onClose}
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
      </Modal> */}
    </>
  );
}

export default ChangeAccess;
