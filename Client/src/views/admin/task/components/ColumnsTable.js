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
import { useMemo, useState, useEffect } from "react";
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";
import { AddIcon } from "@chakra-ui/icons";

// Custom components
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import { Link, useParams } from "react-router-dom";
import EventView from "../eventView";
import AddTask from "./addTask";

export default function ColumnsTable(props) {
    const { columnsData, tableData, title, fetchData, action, setAction, access } = props;

    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);
    const [id, setId] = useState();
    const [eventView, setEventView] = useState(false);

    const [taskModel, setTaskModel] = useState(false);
    const [gopageValue, setGopageValue] = useState();
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

    const handleDateClick = (cell) => {
        setId(cell?.row?.original?._id)
        setEventView(true)
    }

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
                <Button onClick={() => setTaskModel(true)} leftIcon={<AddIcon />} colorScheme="gray" size="sm">Create Task</Button>
                <AddTask fetchData={fetchData} isOpen={taskModel} onClose={setTaskModel} from="lead" id={param.id} />
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
                                        if (cell?.column.Header === "Title") {
                                            data = (
                                                <Text sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                                                    color='brand.600' fontSize='sm' fontWeight='700' onClick={() => handleDateClick(cell)}>
                                                    {cell?.value}
                                                </Text>
                                            );
                                        } else if (cell?.column.Header === "Category") {
                                            data = (
                                                <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                    {cell?.value}
                                                </Text>
                                            )
                                        } else if (cell?.column.Header === "Assignment To") {
                                            data = (
                                                <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                    {cell?.value}
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

            <EventView fetchData={fetchData} isOpen={eventView} access={access} onClose={setEventView} info={id} setAction={setAction} action={action} />

            {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}

        </Card>
    );
}
