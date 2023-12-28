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
  useColorModeValue,
  Tr,
} from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Spinner from "components/spinner/Spinner";
import { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// const RolePanel = ({
//   // data,
//   // headerGroups,
//   // textColor,
//   // page,
//   // borderColor,
//   // columns,
//   // prepareRow,
//   // isLoding,
//   // getTableBodyProps,
//   // selectedValues,
//   // handleCheckboxChange,
//   // handleClick,
//   // setDelete, name, userRole
// }) => {
const RolePanel = (props) => {

  const { columnsData, name, tableData, handleClick, fetchData, isLoding, setAction } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);

  const [deleteModel, setDelete] = useState(false);
  const [selectedId, setSelectedId] = useState()
  const [gopageValue, setGopageValue] = useState()
  // const [data, setData] = useState([])
  const data = useMemo(() => tableData, [tableData]);

  // const fetchData = async () => {
  //   let result = await getApi('api/contact/');
  //   setData(result.data);
  // }
  const user = JSON.parse(localStorage.getItem("user"))


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
