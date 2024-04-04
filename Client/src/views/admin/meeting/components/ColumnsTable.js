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
import { useMemo, useState, useEffect } from "react";
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";

// Custom components
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import { Link, useParams } from "react-router-dom";
import AddMeeting from "./Addmeeting";
import { AddIcon } from "@chakra-ui/icons";
import DataNotFound from "components/notFoundData";

export default function ColumnsTable(props) {
    const { columnsData, tableData, title, fetchData, action, setAction, access } = props;
    const buttonbg = useColorModeValue("gray.200", "white");
    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);
    const [meetingModel, setMeetingModel] = useState(false);
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

    const textColor = useColorModeValue("gray.500", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const param = useParams()


    useEffect(() => {
        // Update gopageValue only after the initial render 
        if (gopageValue === undefined && pageOptions.length < gopageValue) {
            setGopageValue(pageOptions.length);
        }
    }, [pageOptions, gopageValue]);

    const firstValue = Object?.values(param)[0];
    const splitValue = firstValue?.split('/')

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
                    {title}  (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
                </Heading>
                <Button size="sm" onClick={() => setMeetingModel(true)} leftIcon={<AddIcon />} colorScheme="gray" bg={buttonbg}>Add New </Button>
                <AddMeeting fetchData={fetchData} isOpen={meetingModel} onClose={setMeetingModel} leadContect={splitValue[0]} from="lead" id={param.id} setAction={setAction} />
            </Flex>
            <Box overflowY={'auto'} className="table-container p0" >
                <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
                    <Thead>
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
                        {data?.length === 0 ? (
                            <Tr>
                                <Td colSpan={columns?.length}>
                                    <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                        <DataNotFound />
                                    </Text>
                                </Td>
                            </Tr>
                        ) : page?.map((row, index) => {
                            prepareRow(row);
                            return (
                                <Tr {...row?.getRowProps()} key={index}>
                                    {row?.cells?.map((cell, index) => {
                                        let data = "";
                                        if (cell?.column.Header === "agenda") {
                                            data = (access?.view ?
                                                <Link to={`/metting/${cell?.row?.original._id}`}>
                                                    <Text sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }} color='brand.600' fontSize='sm' fontWeight='700'>
                                                        {cell?.value ? cell?.value : ' - '}
                                                    </Text>
                                                </Link> :
                                                <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                    {cell?.value ? cell?.value : ' - '}
                                                </Text>
                                            );
                                        } else if (cell?.column.Header === "date Time") {
                                            data = (
                                                <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                    {moment(cell?.value).format('D/MM/YYYY LT')}
                                                </Text>
                                            )
                                        } else if (cell?.column.Header === "times tamp") {
                                            data = (
                                                <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                    {moment(cell?.value).format('(DD/MM) LT')}
                                                </Text>
                                            );
                                        } else if (cell?.column.Header === "create By") {
                                            data = (
                                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                                    {cell?.value ? cell?.value : ' - '}
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

        </Box>
    );
}
