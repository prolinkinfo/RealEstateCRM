// import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
// import { useColorModeValue } from '@chakra-ui/system';
// import Card from 'components/card/Card';
// import CountUpComponent from 'components/countUpComponent/countUpComponent';
// import Pagination from 'components/pagination/Pagination';
// import Spinner from 'components/spinner/Spinner';
// import { useMemo, useState } from 'react';
// import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
// import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';

// const CommonCheckTable = (props) => {
//     const { columnData, data, isLoding, title } = props;

//     const textColor = useColorModeValue("secondaryGray.900", "white");
//     const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
//     const columns = useMemo(() => columnData, [columnData]);
//     // const [selectedValues, setSelectedValues] = useState([]);
//     const [eventView, setEventView] = useState(false)
//     const [id, setId] = useState()
//     const [gopageValue, setGopageValue] = useState()

//     // const data = useMemo(() => tableData, [tableData]);

//     const tableInstance = useTable(
//         {
//             columns, data,
//             initialState: { pageIndex: 0 }
//         },
//         useGlobalFilter,
//         useSortBy,
//         usePagination
//     );

//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         prepareRow,
//         page,
//         canPreviousPage,
//         canNextPage,
//         pageOptions,
//         pageCount,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state: { pageIndex, pageSize }
//     } = tableInstance;

//     if (pageOptions.length < gopageValue) {
//         setGopageValue(pageOptions.length)
//     }

//     return (
//         <Card
//             direction="column"
//             w="100%"
//             px="0px"
//             overflowX={{ sm: "scroll", lg: "hidden" }}
//         >
//             <Flex px="25px" justify="space-between" mb="20px" align="center">
//                 <Text
//                     color={'secondaryGray.900'}
//                     fontSize="22px"
//                     fontWeight="700"
//                     lineHeight="100%"
//                 >
//                     {title} (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
//                 </Text>
//             </Flex>

//             <Box overflowY={"auto"} className={'table-fix-container'}>
//                 <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
//                     <Thead>
//                         {headerGroups?.map((headerGroup, index) => (
//                             <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
//                                 {headerGroup.headers?.map((column, index) => (
//                                     <Th
//                                         {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
//                                         pe="10px"
//                                         key={index}
//                                         borderColor={borderColor}
//                                     >
//                                         <Flex
//                                             justify="space-between"
//                                             align="center"
//                                             fontSize={{ sm: "10px", lg: "12px" }}
//                                             color="gray.400"
//                                         >
//                                             {column.render("Header")}
//                                             {column.isSortable !== false && (
//                                                 <span>
//                                                     {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />}
//                                                 </span>
//                                             )}
//                                         </Flex>
//                                     </Th>
//                                 ))}
//                             </Tr>
//                         ))}
//                     </Thead>
//                     <Tbody {...getTableBodyProps()}>
//                         {isLoding ?
//                             <Tr>
//                                 <Td colSpan={columns?.length}>
//                                     <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
//                                         <Spinner />
//                                     </Flex>
//                                 </Td>
//                             </Tr>
//                             : data?.length === 0 ? (
//                                 <Tr>
//                                     <Td colSpan={columns.length}>
//                                         <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
//                                             -- No Data Found --
//                                         </Text>
//                                     </Td>
//                                 </Tr>
//                             ) : page?.map((row, i) => {
//                                 prepareRow(row);
//                                 return (
//                                     <Tr {...row?.getRowProps()} key={i}>
//                                         {row?.cells?.map((cell, index) => {
//                                             let data = "";
//                                             columnData.forEach((item) => {
//                                                 if (cell?.column.Header === item.Header) {
//                                                     if (item.cell && typeof item.cell === 'function') {
//                                                         data = (
//                                                             <Flex align="center">
//                                                                 <Text color={textColor} fontSize="sm" fontWeight="700">
//                                                                     {item.cell(cell)}
//                                                                 </Text>
//                                                             </Flex>
//                                                         );
//                                                     } else {
//                                                         data = (
//                                                             <Flex align="center">
//                                                                 <Text color={textColor} fontSize="sm" fontWeight="700">
//                                                                     {item.Header === "#" ? cell?.row?.index + 1 : cell?.value}
//                                                                 </Text>
//                                                             </Flex>
//                                                         );
//                                                     }
//                                                 }
//                                             });
//                                             return (
//                                                 <Td
//                                                     {...cell?.getCellProps()}
//                                                     key={index}
//                                                     fontSize={{ sm: "14px" }}
//                                                     minW={{ sm: "150px", md: "200px", lg: "auto" }}
//                                                     borderColor="transparent"
//                                                 >
//                                                     {data}
//                                                 </Td>
//                                             );
//                                         })}
//                                     </Tr>
//                                 );
//                             })}
//                     </Tbody>
//                 </Table>
//             </Box>
//             {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}
//         </Card>
//     );
// }

// export default CommonCheckTable


import { useMemo, useState, useEffect } from 'react';
import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, Button, HStack, Tag, TagLabel, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Grid, GridItem, Checkbox, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import { BsColumnsGap } from "react-icons/bs";
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { SearchIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import * as XLSX from "xlsx";
import Card from 'components/card/Card';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import Pagination from 'components/pagination/Pagination';
import Spinner from 'components/spinner/Spinner';
import CustomSearchInput from "../search/search";
import AdvanceSearchUsingCustomFields from "../search/advanceSearch";
import DataNotFound from "../notFoundData";

const CommonCheckTable = (props) => {
    // const { isLoding, title, columnData, dataColumn, tableData, allData, ManageGrid, setSearchedData, deleteMany, setDisplaySearchData, displaySearchData, tableCustomFields, access, action, setAction, selectedColumns, setSelectedColumns, onOpen, setDelete, selectedValues, setSelectedValues, setIsImport, AdvanceSearch, BackButton, getTagValuesOutside, searchboxOutside, setGetTagValuesOutside, setSearchboxOutside } = props;
    const { isLoding, title, columnData, dataColumn, searchedDataOut, setSearchedDataOut, tableData, state, allData, ManageGrid, deleteMany, tableCustomFields, access, action, setAction, selectedColumns, setSelectedColumns, onOpen, setDelete, selectedValues, setSelectedValues, setIsImport, AdvanceSearch, searchDisplay, setSearchDisplay, BackButton, getTagValuesOutside, searchboxOutside, setGetTagValuesOutside, setSearchboxOutside } = props;

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    // const columns = useMemo(() => columnData, [columnData]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const columns = useMemo(() => dataColumn, [dataColumn]);
    const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn); // State to track changes

    const data = useMemo(() => (AdvanceSearch ? searchDisplay : displaySearchData) ? (AdvanceSearch ? searchedDataOut : searchedData) : tableData, [(AdvanceSearch ? searchDisplay : displaySearchData) ? (AdvanceSearch ? searchedDataOut : searchedData) : tableData]);
    const [manageColumns, setManageColumns] = useState(false);
    const [csvColumns, setCsvColumns] = useState([]);
    // const [searchbox, setSearchbox] = useState(searchboxOutside ? searchboxOutside : '');
    const [searchbox, setSearchbox] = useState('');
    const [getTagValues, setGetTagValues] = useState(props.getTagValuesOutSide ? props.getTagValuesOutSide : []);
    const [advaceSearch, setAdvaceSearch] = useState(false);
    const [column, setColumn] = useState('');
    const [gopageValue, setGopageValue] = useState();

    const tableInstance = useTable(
        {
            columns,
            data,
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

    // if (pageOptions?.length < gopageValue) {
    if (pageOptions && pageOptions?.length > 0 && pageOptions?.length < gopageValue) {
        setGopageValue(pageOptions.length)
    }

    const handleSearch = (results) => {
        AdvanceSearch ? setSearchedDataOut(results) : setSearchedData(results);
    };

    const handleClear = () => {
        AdvanceSearch ? props.setSearchDisplay(false) : setDisplaySearchData(false)
        if (searchboxOutside) {
            setSearchboxOutside('')
        } else {
            setSearchbox('');
        }
        setGetTagValues([]);
        if (props.getTagValuesOutSide) {
            setGetTagValuesOutside([]);
        }
        setGopageValue(1);
    };

    const handleClick = () => {
        onOpen();
    };

    const findStatus = () => {
        const searchResult = allData?.filter(
            (item) =>
                (!state || (item?.status && item?.status.toLowerCase().includes(state?.toLowerCase())))
        )
        let getValue = [state || undefined].filter(value => value);
        setGetTagValues(getValue)
        AdvanceSearch ? setSearchedDataOut && setSearchedDataOut(searchResult) : setSearchedData && setSearchedData(searchResult);
        AdvanceSearch ? setSearchDisplay && setSearchDisplay(true) : setDisplaySearchData && setDisplaySearchData(searchResult);
        // setSearchedData(searchResult);
        setDisplaySearchData(true)
        setAdvaceSearch(false)
    }
    useEffect(() => {
        state && findStatus()
    }, [state, allData]);

    let isColumnSelected;
    const toggleColumnVisibility = (columnKey) => {
        setColumn(columnKey);

        isColumnSelected = tempSelectedColumns?.some((column) => column?.accessor === columnKey);

        if (isColumnSelected) {
            const updatedColumns = tempSelectedColumns?.filter((column) => column?.accessor !== columnKey);
            setTempSelectedColumns(updatedColumns);
        } else {
            const columnToAdd = columnData?.find((column) => column?.accessor === columnKey);
            setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
        }
    };

    const handleCheckboxChange = (event, value) => {
        if (event.target.checked) {
            setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
        } else {
            setSelectedValues((prevSelectedValues) =>
                prevSelectedValues.filter((selectedValue) => selectedValue !== value)
            );
        }
    };

    const handleColumnClear = () => {
        isColumnSelected = selectedColumns?.some((selectedColumn) => selectedColumn?.accessor === column?.accessor)
        setTempSelectedColumns(columnData);
        setManageColumns(!manageColumns ? !manageColumns : false)
    };

    const handleExportLeads = (extension) => {
        selectedValues && selectedValues?.length > 0
            ? downloadCsvOrExcel(extension, selectedValues)
            : downloadCsvOrExcel(extension);
    };

    const downloadCsvOrExcel = async (extension, selectedIds) => {
        try {
            if (selectedIds && selectedIds?.length > 0) {
                const selectedRecordsWithSpecificFileds = tableData?.filter((rec) => selectedIds.includes(rec._id))?.map((rec) => {
                    const selectedFieldsData = {};
                    csvColumns.forEach((property) => {
                        selectedFieldsData[property.accessor] = rec[property.accessor];
                    });
                    return selectedFieldsData;
                });
                convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, title || 'data', extension);
            } else {
                const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
                    const selectedFieldsData = {};
                    csvColumns.forEach((property) => {
                        selectedFieldsData[property.accessor] = rec[property.accessor];
                    });
                    return selectedFieldsData;
                });
                convertJsonToCsvOrExcel(AllRecordsWithSpecificFileds, csvColumns, title || 'data', extension);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const convertJsonToCsvOrExcel = (jsonArray, csvColumns, fileName, extension) => {
        const csvHeader = csvColumns.map((col) => col.Header);

        const csvContent = [
            csvHeader,
            ...jsonArray.map((row) => csvColumns.map((col) => row[col.accessor]))
        ];

        const ws = XLSX.utils.aoa_to_sheet(csvContent);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, `${fileName}.${extension}`);    // .csv, .xlsx
        setSelectedValues([])
    };

    useEffect(() => {
        AdvanceSearch ? setSearchedDataOut && setSearchedDataOut(data) : setSearchedData && setSearchedData(data);
    }, []);

    useEffect(() => {
        setTempSelectedColumns(dataColumn);
    }, [dataColumn]);

    useEffect(() => {
        if (selectedColumns) {
            let tempCsvColumns = selectedColumns?.filter((col) => col?.Header !== '#' && col?.Header !== 'Action')?.map((field) => ({ Header: field?.Header, accessor: field?.accessor }));
            setCsvColumns([...tempCsvColumns])
        }
    }, [selectedColumns]);

    return (
        <>
            <Card
                direction="column"
                w="100%"
                overflowX={{ sm: "scroll", lg: "hidden" }}
            >
                <Grid templateColumns="repeat(12, 1fr)" gap={2}>
                    <GridItem colSpan={{ base: 12, md: 8 }} display={"flex"} alignItems={"center"}>
                        <Flex alignItems={"center"} flexWrap={"wrap"}>
                            <Text
                                color={'secondaryGray.900'}
                                fontSize="22px"
                                fontWeight="700"
                                lineHeight="100%"
                            >
                                {title} (<CountUpComponent key={data?.length} targetNumber={data?.length} />)
                            </Text>
                            {/* <CustomSearchInput setSearchbox={setSearchbox} setDisplaySearchData={setDisplaySearchData} searchbox={searchbox} allData={allData} dataColumn={columns} onSearch={handleSearch} setGetTagValues={setGetTagValues} setGopageValue={setGopageValue} /> */}
                            <CustomSearchInput setSearchbox={setSearchboxOutside ? setSearchboxOutside : setSearchbox} setDisplaySearchData={setSearchboxOutside ? props.setSearchDisplay : setDisplaySearchData} searchbox={searchboxOutside ? searchboxOutside : searchbox} allData={allData} dataColumn={columns} onSearch={handleSearch} setGetTagValues={props.setGetTagValuesOutside ? props.setGetTagValuesOutside : setGetTagValues} setGopageValue={setGopageValue} />
                            {
                                AdvanceSearch ? AdvanceSearch :
                                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvaceSearch(true)}>Advance Search</Button>
                            }
                            {(AdvanceSearch ? props.searchDisplay : displaySearchData) ? <Button variant="outline" colorScheme='red' size="sm" ms={2} onClick={() => handleClear()}>Clear</Button> : ""}
                            {(selectedValues?.length > 0 && access?.delete && !deleteMany) && <DeleteIcon cursor={"pointer"} onClick={() => setDelete(true)} color={'red'} ms={2} />}
                        </Flex>
                    </GridItem>
                    {/* Advance filter */}
                    <AdvanceSearchUsingCustomFields
                        setAdvaceSearch={setAdvaceSearch}
                        setGetTagValues={setGetTagValues}
                        isLoding={isLoding}
                        allData={allData}
                        setDisplaySearchData={setDisplaySearchData}
                        setSearchedData={setSearchedData}
                        advaceSearch={advaceSearch}
                        tableCustomFields={tableCustomFields}
                        setSearchbox={setSearchbox}
                    />
                    <GridItem colSpan={{ base: 12, md: 4 }} display={"flex"} justifyContent={"end"} alignItems={"center"} textAlign={"right"}>
                        {ManageGrid !== false &&
                            <Menu isLazy  >
                                <MenuButton p={4}>
                                    <BsColumnsGap />
                                </MenuButton>
                                <MenuList minW={'fit-content'} transform={"translate(1670px, 60px)"} zIndex={2} >
                                    <MenuItem onClick={() => setManageColumns(true)} width={"165px"}> Manage Columns
                                    </MenuItem>
                                    {typeof setIsImport === "function" && <MenuItem width={"165px"} onClick={() => setIsImport(true)}> Import {title}
                                    </MenuItem>}
                                    <MenuDivider />
                                    <MenuItem width={"165px"} onClick={() => handleExportLeads('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                                    <MenuItem width={"165px"} onClick={() => handleExportLeads('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
                                </MenuList>
                            </Menu>}
                        {(access?.create || access === true) && <Button onClick={() => handleClick()} size="sm" variant="brand" leftIcon={<AddIcon />}>Add New</Button>}
                        {BackButton && BackButton}
                    </GridItem>
                    <HStack spacing={4} mb={2}>
                        {(props.getTagValuesOutSide || []).concat(getTagValues || []).map((item) => (
                            <Tag
                                size={"md"}
                                p={2}
                                key={item}
                                borderRadius='full'
                                variant='solid'
                                colorScheme="gray"
                            >
                                <TagLabel>{item}</TagLabel>
                                {/* <TagCloseButton /> */}
                            </Tag>
                        ))}
                    </HStack>
                </Grid>
                <Box overflowY={"auto"} className="table-fix-container">
                    <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
                        <Thead zIndex={1}>
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
                                                align="center"
                                                justifyContent={column.center ? "center" : "start"}
                                                fontSize={{ sm: "14px", lg: "16px" }}
                                                color="secondaryGray.900"
                                            >
                                                <span style={{ textTransform: "capitalize", marginRight: "8px" }}>
                                                    {column.render("Header")}
                                                </span>
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
                                                <DataNotFound />
                                            </Text>
                                        </Td>
                                    </Tr>
                                ) : page?.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <Tr {...row?.getRowProps()}>
                                            {row?.cells?.map((cell, index) => {
                                                let data = "";
                                                columnData?.forEach((item) => {
                                                    if (cell?.column.Header === item.Header) {
                                                        if (item.cell && typeof item.cell === 'function') {
                                                            data = (
                                                                <Flex Flex align="center" justifyContent={item?.Header === 'Action' && 'center'
                                                                }>
                                                                    <Text color={textColor} fontSize="sm" fontWeight="700" >
                                                                        {item.cell(cell) === ' ' ? '-' : item.cell(cell)}
                                                                    </Text>
                                                                </Flex>
                                                            );
                                                        }
                                                        else {
                                                            data = (
                                                                <Flex align="center" >
                                                                    {item.Header === "#" && <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues?.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" />}
                                                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                                                        {item.Header === "#" ? cell?.row?.index + 1 : cell?.value ? cell?.value : '-'}
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
                {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage}
                    pageSize={pageSize} pageIndex={pageIndex} dataLength={15} />}

                {/* Manage Columns */}
                <Modal onClose={() => { setManageColumns(false); }} isOpen={manageColumns} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Manage Columns</ModalHeader>
                        <ModalCloseButton onClick={() => { setManageColumns(false); }} />
                        <ModalBody>
                            <div>
                                {columnData?.map((column) => (
                                    <Text display={"flex"} key={column?.accessor} py={2}>
                                        <Checkbox
                                            defaultChecked={selectedColumns?.some((selectedColumn) => selectedColumn?.accessor === column?.accessor)}
                                            onChange={() => toggleColumnVisibility(column?.accessor)}
                                            pe={2}
                                        />
                                        {column?.Header}
                                    </Text>
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='brand' mr={2} onClick={() => {
                                setSelectedColumns([...tempSelectedColumns]);
                                setManageColumns(false);
                            }} disabled={isLoding ? true : false} size='sm'>{isLoding ? <Spinner /> : 'Save'}</Button>
                            <Button variant='outline' colorScheme="red" size='sm' onClick={() => handleColumnClear()}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </Card >
        </>
    );
}

export default CommonCheckTable