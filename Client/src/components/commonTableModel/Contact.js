import {
  Box, Checkbox,
  Flex, Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
import { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

// Custom components
import Card from "components/card/Card";
import { Link } from "react-router-dom";
import CountUpComponent from "components/countUpComponent/countUpComponent";

export default function ContactTable(props) {
  const { columnsData, tableData, title, selectedValues, setSelectedValues } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const user = JSON.parse(localStorage.getItem("user"))

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    // setPageSize,
  } = tableInstance;

  initialState.pageSize = 7;

  const { pageIndex } = state;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues(value);
    } else {
      setSelectedValues(null);
    }
  };


  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      style={{ border: '1px solid gray.200' }
      }
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          {title}  (<CountUpComponent targetNumber={data?.length} />)
        </Text>
      </Flex>
      <Box overflowY={'auto'} className="table-container-property" >
        <Table  {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
          <Thead >
            {headerGroups?.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe='10px'
                    key={index}
                    borderColor={borderColor}>
                    <Flex
                      justify='space-between'
                      align='center'
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color='gray.400'>
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody  {...getTableBodyProps()}>
            {data?.length === 0 && (
              <Tr>
                <Td colSpan={columns.length}>
                  <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    -- No Data Found --
                  </Text>
                </Td>
              </Tr>
            )}
            {page?.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row?.getRowProps()} key={index}>
                  {row?.cells?.map((cell, index) => {
                    let data = "";
                    if (cell?.column.Header === "#") {
                      data = (
                        <Flex align="center">
                          {/* <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => setSelectedValues(event, cell?.value)} me="10px" /> */}
                          <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues === cell?.value} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" />
                          <Text color={textColor} fontSize="sm" fontWeight="700">
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
                    } else if (cell?.column.Header === "first Name") {
                      data = (
                        <Link to={user?.role !== 'admin' ? `/contactView/${cell?.row?.original._id}` : `/admin/contactView/${cell?.row?.original._id}`}>
                          <Text
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                            color='green.400'
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell?.value}
                          </Text>
                        </Link>
                      );
                    } else if (cell?.column.Header === "last Name") {
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
                    } else if (cell?.column.Header === "phone Number") {
                      data = (
                        <Text fontSize="sm" fontWeight="700"
                          color={textColor}>
                          {cell?.value}
                        </Text>
                      );
                    } else if (cell?.column.Header === "Email Address") {
                      data = (
                        <Text fontSize="sm" fontWeight="700"
                          color={textColor}>
                          {cell?.value}
                        </Text>
                      );
                    } else if (cell?.column.Header === "physical Address") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.value}
                        </Text>
                      );
                    } else if (cell?.column.Header === "mailing Address") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.value}
                        </Text>
                      );
                    } else if (cell?.column.Header === "Contact Method") {
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
                        borderColor='transparent'>
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: "1rem" }}>


        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <GrFormPrevious />
        </button>
        <span style={{ margin: "0 0.5rem" }}>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          <GrFormNext />
        </button>
      </div>
    </Card>
  );
}
