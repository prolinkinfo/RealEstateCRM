import {
  Flex,
  Table, Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import EventView from "../eventView";

export default function CheckTable(props) {
  const { columnsData, data } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  // const [selectedValues, setSelectedValues] = useState([]);
  const [eventView, setEventView] = useState(false)
  const [id, setId] = useState()

  // const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns, data,
      // initialState: { pageIndex: 0, pageSize: 10 },
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
  initialState.pageSize = 10
  const { pageIndex } = state;

  const handleDateClick = (cell) => {
    setId(cell?.row?.values?._id)
    setEventView(true)
  }

  // const handlePageSizeChange = (e) => {
  //   setPageSize(e.target.value);
  // };


  // const handleCheckboxChange = (event, value) => {
  //   if (event.target.checked) {
  //     setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
  //   } else {
  //     setSelectedValues((prevSelectedValues) =>
  //       prevSelectedValues.filter((selectedValue) => selectedValue !== value)
  //     );
  //   }
  // };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "scroll" }}
    >
      <EventView isOpen={eventView} onClose={setEventView} info={id} />


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
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
                    {column.render("Header")}
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
          {data?.length === 0 && (
            <Tr>
              <Td colSpan={columns.length}>
                <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                  -- No Data Found --
                </Text>
              </Td>
            </Tr>
          )}
          {page?.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row?.getRowProps()} key={i}>
                {row?.cells?.map((cell, index) => {
                  let data = "";
                  if (cell?.column.Header === "#") {
                    data = (
                      <Flex align="center">
                        {/* <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" /> */}
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.row?.index + 1}
                        </Text>
                      </Flex>
                    );
                  } else if (cell?.column.Header === "Title") {
                    data = (
                      <Text
                        onClick={() => handleDateClick(cell)}
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                        color='green.400'
                        fontSize="sm"
                        fontWeight="700"
                      >
                        {cell?.value}
                      </Text>
                    );
                  } else if (cell?.column.Header === "Category") {
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
                  } else if (cell?.column.Header === "Assignment To") {
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
                  } else if (cell?.column.Header === "Start Date") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell?.value}
                      </Text>
                    );
                  } else if (cell?.column.Header === "End Date") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell?.value ? cell?.value : cell?.row?.values.start}
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

    </Card >
  );
}
