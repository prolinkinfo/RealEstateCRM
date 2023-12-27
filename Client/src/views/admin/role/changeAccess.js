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

function ChangeAccess({ isOpen, onOpen, onClose, data,headerGroups,textColor, borderColor,columns,prepareRow,isLoding,getTableBodyProps }) {
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Access</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th width="20px">Create</Th>
                    <Th width="20px">View</Th>
                    <Th width="20px">Update</Th>
                    <Th width="20px">Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item) => (
                    <Tr>
                      <Td>{item.title}</Td>
                      <Td textAlign="center">
                        <Checkbox />
                      </Td>
                      <Td textAlign="center">
                        <Checkbox />
                      </Td>
                      <Td textAlign="center">
                        <Checkbox />
                      </Td>
                      <Td textAlign="center">
                        <Checkbox />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer> */}
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
                                  sx={{
                                    "&:hover": {
                                      color: "blue.500",
                                      textDecoration: "underline",
                                    },
                                  }}
                                  color="brand.600"
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
                                <Checkbox />  
                                </Text>
                              );
                            } else if (cell?.column.Header === "view") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                <Checkbox />  
                                </Text>
                              );
                            } else if (cell?.column.Header === "update") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                               <Checkbox />   
                                </Text>
                              );
                            } else if (cell?.column.Header === "delete") {
                              data = (
                                <Text
                                  color={textColor}
                                  fontSize="sm"
                                  fontWeight="700"
                                >
                                 <Checkbox /> 
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
          </ModalBody>
          <ModalFooter>
            <Button variant="brand" onClick={onClose}>
              Save
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChangeAccess;
