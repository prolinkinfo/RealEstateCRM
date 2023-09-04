import {
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Table, Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
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
import Spinner from "components/spinner/Spinner";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function CheckTable(props) {
  const { columnsData } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);

  const [data, setData] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const [isLoding, setIsLoding] = useState(false)
  const [gopageValue, setGopageValue] = useState()
  const fetchData = async () => {
    setIsLoding(true)
    let result = await getApi(user.role === 'admin' ? 'api/email/' : `api/email/?sender=${user._id}`);
    setData(result?.data);
    setIsLoding(false)
  }

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
          {isLoding ?
            <Tr>
              <Td colSpan={columns?.length}>
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                  <Spinner />
                </Flex>
              </Td>
            </Tr>
            : data?.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length}>
                  <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    -- No Data Found --
                  </Text>
                </Td>
              </Tr>
            ) : page?.map((row, i) => {
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
                        <Link to={cell?.row?.original?.createBy ? user?.role !== 'admin' ? `/contactView/${cell?.row?.original.createBy}` : `/admin/contactView/${cell?.row?.original.createBy}` : user?.role !== 'admin' ? `/leadView/${cell?.row?.original.createByLead}` : `/admin/leadView/${cell?.row?.original.createByLead}`}>
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

      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => { gotoPage(0); setGopageValue(1) }}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={() => { previousPage(); setGopageValue((pre) => pre - 1) }}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
          <Text flexShrink="0">Go to page:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            value={gopageValue}
            onChange={(value) => {
              const page = value ? value - 1 : 0;
              gotoPage(page);
              setGopageValue(value)
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              onClick={() => { nextPage(); setGopageValue((pre) => pre + 1) }}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => { gotoPage(pageCount - 1); setGopageValue(pageCount) }}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Card >
  );
}
