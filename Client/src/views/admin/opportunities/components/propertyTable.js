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

// Custom components
import Card from "components/card/Card";
import Pagination from "components/pagination/Pagination";
import { useState } from "react";
import { Link } from "react-router-dom";
import DataNotFound from "components/notFoundData";

export default function PropertyTable(props) {
  const { columnsData, tableData, title, selectedValues, setSelectedValues } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const user = JSON.parse(localStorage.getItem("user"))
  const [gopageValue, setGopageValue] = useState()

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

  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

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
    <Card
      direction='column'
      w='100%'
      px='0px'
      style={{ border: '1px solid gray.200' }
      }
      overflowX={{ sm: "scroll", lg: "hidden" }}>
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
                      fontSize={{ sm: "14px", lg: "14px" }}
                      color="secondaryGray.900">
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
                    <DataNotFound />
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
                          <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" />
                          <Text color={textColor} fontSize="sm" fontWeight="700">
                            {cell?.row?.index + 1}
                          </Text>
                        </Flex>
                      );
                    } else if (cell?.column.Header === "property Type") {
                      data = (
                        <Link to={user?.role !== 'superAdmin' ? `/propertyView/${cell?.row?.original?._id}` : `/propertyView/${cell?.row?.original?._id}`}>
                          <Text
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                            color='brand.600'
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell?.value}
                          </Text>
                        </Link>
                      );
                    } else if (cell?.column.Header === "property Address") {
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
                    } else if (cell?.column.Header === "listing Price") {
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
                    } else if (cell?.column.Header === "square Footage") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.value}
                        </Text>
                      );
                    } else if (cell?.column.Header === "year Built") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.value}
                        </Text>
                      );
                    } else if (cell?.column.Header === "number of Bedrooms") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.value}
                        </Text>
                      );
                    } else if (cell?.column.Header === "number of Bathrooms") {
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

      {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}

    </Card >
  );
}
