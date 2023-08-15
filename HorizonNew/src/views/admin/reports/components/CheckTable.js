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
import { DeleteIcon } from "@chakra-ui/icons";
import Delete from "views/admin/contact/Delete";




export default function CheckTable(props) {
    const { columnsData, barData } = props;

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const columns = useMemo(() => columnsData, [columnsData]);
    const [selectedValues, setSelectedValues] = useState([]);

    const [deleteModel, setDelete] = useState(false);
    // const [data, setData] = useState(barData)
    const data = useMemo(() => barData, [barData]);

    // const fetchData = async () => {
    //     //   let result = await getApi('api/contact/');
    //     setData(barData);
    // }


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
                    Reporting Information Table ({data.length})
                </Text>
                {/* <Menu /> */}
                {selectedValues.length > 0 && <DeleteIcon onClick={() => setDelete(true)} color={'red'} />}
            </Flex>
            {/* Delete model */}
            <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/contact/deleteMany' data={selectedValues} method='many' />

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
                    {data.length === 0 && (
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
                                    } else if (cell?.column.Header === "Name") {
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
                                    } else if (cell?.column.Header === "Email Sent") {
                                        data = (

                                            <Text
                                                me="10px"
                                                color={textColor}
                                                fontSize="sm"
                                                fontWeight="700"
                                            >
                                                {/* {Array.isArray(reportChart.EmailDetails) && reportChart.EmailDetails.map((item => item.totalEmails))} */}
                                                {cell?.value}
                                            </Text>
                                        );
                                    } else if (cell?.column.Header === "Text Sent") {
                                        data = (
                                            <Text
                                                me="10px"
                                                color={textColor}
                                                fontSize="sm"
                                                fontWeight="700"
                                            >
                                                {/* {Array.isArray(reportChart.TextSent) && reportChart.TextSent.map((item => item.totalTextSent))} */}
                                                {cell?.value}
                                            </Text>
                                        );
                                    }
                                    else if (cell?.column.Header === "Outbound Calls") {
                                        data = (
                                            <Text
                                                me="10px"
                                                color={textColor}
                                                fontSize="sm"
                                                fontWeight="700"
                                            >
                                                {/* {Array.isArray(reportChart.outboundcall) && reportChart.outboundcall.map((item => item.totalCall))} */}
                                                {cell?.value}
                                            </Text>
                                        );
                                    }
                                    else if (cell?.column.Header === "Email Received") {
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
                                    }
                                    else if (cell?.column.Header === "Text Received") {
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
                {/* <Select width={20} defaultValue={pageSize} variant='outline' value={pageSize} onChange={handlePageSizeChange} >
            <option disabled>-----select option-----</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select> */}

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
