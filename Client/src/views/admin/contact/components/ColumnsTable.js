import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
import moment from 'moment';
import { useMemo, useState, useEffect, useRef } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import { BsFillSendFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import AddEmailHistory from "../../emailHistory/components/AddEmail";

export default function ColumnsTable(props) {
  const { columnsData, tableData, title, fetchData, emailAccess } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const [addEmailHistory, setAddEmailHistory] = useState(false);
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

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const param = useParams()

  useEffect(() => {
    // Update gopageValue only after the initial render 
    if (gopageValue === undefined && pageOptions.length < gopageValue) {
      setGopageValue(pageOptions.length);
    }
  }, [pageOptions, gopageValue]);

  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      style={{ border: '1px solid gray.200' }}
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px='25px' justify='space-between' mb='10px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          {title}  (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
        </Text>
        {emailAccess?.create && <Button onClick={() => setAddEmailHistory(true)} rightIcon={<BsFillSendFill />} colorScheme="gray" >Send Email</Button>}
        <AddEmailHistory lead={props.lead} fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={param.id} />
      </Flex>
      <Box overflowY={'auto'} className="table-container p0" >
        <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
          <Thead>
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
            {data?.length === 0 ? (
              <Tr>
                <Td colSpan={columns?.length}>
                  <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    -- No Data Found --
                  </Text>
                </Td>
              </Tr>
            ) : page?.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row?.getRowProps()} key={index}>
                  {row?.cells?.map((cell, index) => {
                    let data = "";
                    if (cell?.column.Header === "sender") {
                      data = (
                        <Flex align='center'>
                          <Text
                            me='10px'
                            color={textColor}
                            fontSize='sm'
                            fontWeight='700'>
                            {cell?.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell?.column.Header === "recipient") {
                      data = (
                        <Flex align='center'>
                          <Link to={`/Email/${cell?.row?.original._id}`}>
                            <Text sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                              color='green.400' fontSize='sm' fontWeight='700'>
                              {cell?.value}
                            </Text>
                          </Link>
                        </Flex>
                      );
                    } else if (cell?.column.Header === "Created") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {moment(cell?.row?.values.timestamp).format('h:mma (DD/MM)')}
                        </Text>
                      );
                    } else if (cell?.column.Header === "time stamp") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {moment(cell?.value).fromNow()}
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

    </Card>
  );
}
