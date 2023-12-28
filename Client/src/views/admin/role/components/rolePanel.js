import { DeleteIcon } from "@chakra-ui/icons";
import {
    Button,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Spinner from "components/spinner/Spinner";
import React from "react";

const RolePanel = ({
  data,
  headerGroups,
  textColor,
  page,
  borderColor,
  columns,
  prepareRow,
  isLoding,
  getTableBodyProps,
  selectedValues,
  handleCheckboxChange,
  handleClick,
  setDelete, name,userRole
}) => {
  return (
    <>
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          {name} (
          <CountUpComponent key={data?.length} targetNumber={data?.length} />)
        </Text>
        {/* <Menu /> */}
        {selectedValues.length > 0 && (
          <DeleteIcon onClick={() => setDelete(true)} color={"red"} />
        )}

        <Button variant="brand" onClick={handleClick}>
          Change Access
        </Button>
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
            data?.map((row, i) => {
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
                            isChecked={selectedValues.includes(cell?.value)}
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
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.value ? "Yes" : "No"}
                        </Text>
                      );
                    } else if (cell?.column.Header === "view") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.value ? "Yes" : "No"}
                        </Text>
                      );
                    } else if (cell?.column.Header === "update") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.value ? "Yes" : "No"}
                        </Text>
                      );
                    } else if (cell?.column.Header === "delete") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
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
    </>
  );
};

export default RolePanel;
