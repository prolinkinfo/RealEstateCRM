import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import Card from 'components/card/Card';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import Pagination from 'components/pagination/Pagination';
import Spinner from 'components/spinner/Spinner';
import { useMemo, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';

const CommonCheckTable = (props) => {
    const { columnData, data, isLoding, title } = props;

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const columns = useMemo(() => columnData, [columnData]);
    // const [selectedValues, setSelectedValues] = useState([]);
    const [eventView, setEventView] = useState(false)
    const [id, setId] = useState()
    const [gopageValue, setGopageValue] = useState()

    // const data = useMemo(() => tableData, [tableData]);

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

    return (
        <Card
            direction="column"
            w="100%"
            px="0px"
            overflowX={{ sm: "scroll", lg: "hidden" }}
        >
            <Flex px="25px" justify="space-between" mb="20px" align="center">
                <Text
                    color={'secondaryGray.900'}
                    fontSize="22px"
                    fontWeight="700"
                    lineHeight="100%"
                >
                    {title} (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
                </Text>
            </Flex>

            <Box overflowY={"auto"} className={'table-fix-container'}>
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
                                            columnData.forEach((item) => {
                                                if (cell?.column.Header === item.Header) {
                                                    if (item.cell && typeof item.cell === 'function') {
                                                        data = (
                                                            <Flex align="center">
                                                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                                                    {item.cell(cell)}
                                                                </Text>
                                                            </Flex>
                                                        );
                                                    } else {
                                                        data = (
                                                            <Flex align="center">
                                                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                                                    {item.Header === "#" ? cell?.row?.index + 1 : cell?.value}
                                                                </Text>
                                                            </Flex>
                                                        );
                                                    }
                                                }
                                            });
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
            </Box>
            {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}
        </Card>
    );
}

export default CommonCheckTable