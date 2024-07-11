import {
  Box,
  Button,
  Flex,
  Heading,
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
import { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import { MdOutlineMessage } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddPhoneCall from "../../phoneCall/components/AddPhoneCall";
import { AddIcon } from "@chakra-ui/icons";
import DataNotFound from "components/notFoundData";

export default function PhoneCall(props) {
  const { columnsData, tableData, title, fetchData, callAccess } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const [addModel, setAddModel] = useState(false);
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
  const buttonbg = useColorModeValue("gray.200", "white");
  const param = useParams()
  const navigate = useNavigate()
  return (
    <Box
      direction='column'
      w='100%'
      px='0px'
      style={{ border: '1px solid gray.200' }}
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex justify='space-between' mb='10px' align='center'>
        <Heading size="md" mb={3}>
          {title} (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
        </Heading>
        {/* <Menu /> */}
        {!props.text ? callAccess?.create && <Button onClick={() => setAddModel(true)} leftIcon={<AddIcon />} size="sm" colorScheme="gray" bg={buttonbg}>Add New</Button> : <Button onClick={() => navigate('/communication-integration')} size="sm" leftIcon={<MdOutlineMessage />} colorScheme="gray" >send text Msg</Button>}
        <AddPhoneCall lead={props.lead} fetchData={fetchData} isOpen={addModel} onClose={setAddModel} id={param.id} />
      </Flex>
      <Box overflowY={'auto'} className="table-container" >
        <Table  {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
          <Thead >
            {headerGroups?.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justifyContent={column.center ? "center" : "start"}
                      align="center"
                      fontSize={{ sm: "14px", lg: "16px" }}
                      color="secondaryGray.900"
                    >
                      <span style={{ textTransform: "capitalize", marginRight: "8px" }}>
                        {column.render("Header")}
                      </span>
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
                  {row?.cells.map((cell, index) => {
                    let data = "";
                    if (cell?.column.Header === "sender") {
                      data = (
                        <Flex align='center'>
                          <Text fontSize='sm'
                            color={textColor}
                            fontWeight='700'>
                            {cell?.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell?.column.Header === "recipient") {
                      data = (
                        <Flex align='center'>
                          <Link to={props.text ? `/text-msg/${cell?.row?.original._id}` : `/phone-call/${cell?.row?.original._id}`}>
                            <Text
                              me='10px'
                              sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                              color='brand.600'
                              fontSize='sm'
                              fontWeight='700'>
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

    </Box >
  );
}
