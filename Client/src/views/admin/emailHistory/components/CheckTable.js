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
import { useEffect, useMemo, useState } from "react";
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
import { Link } from "react-router-dom";
// import Delete from "../Delete";
import { getApi } from "services/api";
import moment from "moment";
import CountUpComponent from "components/countUpComponent/countUpComponent";

export default function CheckTable(props) {
  const { columnsData } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);

  const [data, setData] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))

  const fetchData = async () => {
    let result = await getApi(user.role === 'admin' ? 'api/email/' : `api/email/?sender=${user._id}`);
    setData(result?.data);
  }

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



  // const handlePageSizeChange = (e) => {
  //   setPageSize(e.target.value);
  // };

  useEffect(() => {
    fetchData()
  }, [props.isOpen])

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "scroll" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Emails (<CountUpComponent targetNumber={data?.length} />)
        </Text>
      </Flex>

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
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.row?.index + 1}
                        </Text>
                      </Flex>
                    );
                  } else if (cell?.column.Header === "sender Email") {
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
                  } else if (cell?.column.Header === "recipient") {
                    data = (
                      <Link to={user?.role !== 'admin' ? `/Email/${cell?.row?.values._id}` : `/admin/Email/${cell?.row?.values._id}`}>
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
                  } else if (cell?.column.Header === "create From") {
                    data = (
                      <Link to={user?.role !== 'admin' ? `/contactView/${cell?.row?.original.createBy}` : `/admin/contactView/${cell?.row?.original.createBy}`}>
                        <Text
                          me="10px"
                          sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                          color='green.400'
                          fontSize="sm"
                          fontWeight="700"
                        >
                          {cell?.value ? cell?.value : ' - '}
                        </Text>
                      </Link>

                    );
                  } else if (cell?.column.Header === "timestamp") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {moment(cell?.value).toNow()}
                      </Text>
                    );
                  } else if (cell?.column.Header === "create at") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {moment(cell?.row?.values.timestamp).format('(DD/MM) h:mma')}
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
