import { useMemo, useState, useEffect } from 'react';
import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, Button, HStack, Tag, TagLabel, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Grid, GridItem, Checkbox, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, TagCloseButton } from '@chakra-ui/react';
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
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { getSearchData, setGetTagValues, setSearchValue } from '../../redux/slices/advanceSearchSlice'

const CommonCheckTable = (props) => {
    const { isLoding, title, columnData, size, dataColumn, setSearchedDataOut, state, allData, ManageGrid, deleteMany, tableCustomFields, access, selectedColumns, setSelectedColumns, onOpen, setDelete, selectedValues, setSelectedValues, setIsImport, checkBox, AdvanceSearch, searchDisplay, setSearchDisplay, BackButton, searchboxOutside, setGetTagValuesOutside, setSearchboxOutside, selectType, customSearch } = props;
    const { dataLength } = props;
    const { handleSearchType } = props;
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const columns = useMemo(() => dataColumn, [dataColumn]);
    const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn); // State to track changes

    const searchedDataOut = useSelector((state) => state?.advanceSearchData?.searchResult)
    const searchValue = useSelector((state) => state?.advanceSearchData?.searchValue)
    const getTagValues = useSelector((state) => state?.advanceSearchData?.getTagValues)
    const data = useMemo(() => (AdvanceSearch ? searchDisplay : displaySearchData) ? (AdvanceSearch ? searchedDataOut : searchedData) : allData, [(AdvanceSearch ? searchDisplay : displaySearchData) ? (AdvanceSearch ? searchedDataOut : searchedData) : allData]);
    const [manageColumns, setManageColumns] = useState(false);
    const [csvColumns, setCsvColumns] = useState([]);
    const [searchbox, setSearchbox] = useState('');
    const [advaceSearch, setAdvaceSearch] = useState(false);
    const [column, setColumn] = useState('');
    const [gopageValue, setGopageValue] = useState();

    const dispatch = useDispatch();

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

    if (pageOptions && pageOptions?.length > 0 && pageOptions?.length < gopageValue) {
        setGopageValue(pageOptions.length)
    }

    const handleSearch = (results) => {
        AdvanceSearch && dispatch(getSearchData({ searchData: results, type: handleSearchType }))
        AdvanceSearch ? setSearchedDataOut(results) : setSearchedData(results);
    };

    const handleAdvanceSearch = (values) => {
        dispatch(setSearchValue(values))
        const searchResult = AdvanceSearch ? dispatch(getSearchData({ values: values, allData: allData, type: title })) : allData?.filter(item => {
            return tableCustomFields.every(field => {
                const fieldValue = values[field.name];
                const itemValue = item[field.name];

                if (field.type === 'select') {
                    return !fieldValue || itemValue === fieldValue;
                }
                else if (field.type === 'number') {
                    return (
                        [null, undefined, ''].includes(fieldValue) ||
                        (itemValue !== undefined &&
                            itemValue.toString().includes(fieldValue.toString()))
                    );
                }
                else if (field.type === 'date') {
                    const fromDate = values[`from${field.name}`];
                    const toDate = values[`to${field.name}`];

                    if (!fromDate && !toDate) {
                        return true; // No date range specified
                    }

                    const timeItemDate = new Date(itemValue);
                    const timeMomentDate = moment(timeItemDate).format('YYYY-MM-DD');

                    return (
                        (!fromDate || (timeMomentDate >= fromDate)) &&
                        (!toDate || (timeMomentDate <= toDate))
                    );
                }
                else {
                    // Default case for text, email
                    return !fieldValue || itemValue?.toLowerCase()?.includes(fieldValue?.toLowerCase());
                }
            });
        });

        const getValue = tableCustomFields.reduce((result, field) => {
            if (field.type === 'date') {
                const fromDate = values[`from${field.name}`];
                const toDate = values[`to${field.name}`];

                if (fromDate || toDate) {
                    result.push({
                        name: [`from${field.name}`, `to${field.name}`],
                        value: `From: ${fromDate} To: ${toDate}`
                    })
                }
            } else if (values[field.name]) {
                result.push({
                    name: [field.name],
                    value: values[field.name]
                })
            }

            return result;
        }, []);
        dispatch(setGetTagValues(getValue))
        setSearchedData(searchResult);
        setDisplaySearchData(true);
        setAdvaceSearch(false);
        if (setSearchbox) {
            setSearchbox('');
        }
    }


    const handleClear = () => {
        setSearchDisplay && setSearchDisplay(false)
        setDisplaySearchData && setDisplaySearchData(false)
        if (searchboxOutside) {
            setSearchboxOutside('')
        } else {
            setSearchbox('');
        }
        dispatch(setGetTagValues([]))
        if (props?.getTagValuesOutSide) {
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
                (!state || (item?.status && item?.status?.toLowerCase().includes(state?.toLowerCase())))
        )
        let getValue = [state || undefined].filter(value => value);

        dispatch(setGetTagValues(getValue))
        AdvanceSearch ? setSearchedDataOut && setSearchedDataOut(searchResult) : setSearchedData && setSearchedData(searchResult);
        AdvanceSearch ? setSearchDisplay && setSearchDisplay(true) : setDisplaySearchData && setDisplaySearchData(searchResult);
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
        if (selectType === "single") {
            if (event.target.checked) {
                setSelectedValues && setSelectedValues(value);
            } else {
                setSelectedValues();
            }
        } else if (event.target.checked) {
            setSelectedValues && setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
        } else {
            setSelectedValues && setSelectedValues((prevSelectedValues) =>
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
                const selectedRecordsWithSpecificFileds = allData?.filter((rec) => selectedIds.includes(rec._id))?.map((rec) => {
                    const selectedFieldsData = {};
                    csvColumns?.forEach((property) => {
                        selectedFieldsData[property.accessor] = rec[property.accessor];
                    });
                    return selectedFieldsData;
                });
                convertJsonToCsvOrExcel(selectedRecordsWithSpecificFileds, csvColumns, title || 'data', extension);
            } else {
                const AllRecordsWithSpecificFileds = allData?.map((rec) => {
                    const selectedFieldsData = {};
                    csvColumns?.forEach((property) => {
                        selectedFieldsData[property?.accessor] = rec[property?.accessor];
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
        const csvHeader = csvColumns?.map((col) => col?.Header);

        const csvContent = [
            csvHeader,
            ...jsonArray?.map((row) => csvColumns?.map((col) => row[col?.accessor]))
        ];

        const ws = XLSX.utils.aoa_to_sheet(csvContent);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, `${fileName}.${extension}`);    // .csv, .xlsx
        setSelectedValues([])
    };

    const handleRemove = (name) => {
        const filter = (getTagValues || []).filter((item) => {
            if (Array.isArray(name?.name)) {
                return name.name?.toString() !== item.name?.toString();
            }
        });

        let updatedSearchValue = { ...searchValue };
        for (let key in updatedSearchValue) {
            if (updatedSearchValue.hasOwnProperty(key)) {
                if (name.name.includes(key)) {
                    delete updatedSearchValue[key];
                }
                if (updatedSearchValue[key] === "") {
                    delete updatedSearchValue[key];
                }
            }
        }

        handleAdvanceSearch(updatedSearchValue)

        dispatch(setGetTagValues(filter))
        if (filter?.length === 0) {
            handleClear();
        }
    }

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
                            {
                                title &&
                                <Text
                                    color={'secondaryGray.900'}
                                    fontSize="22px"
                                    fontWeight="700"
                                    lineHeight="100%"
                                    textTransform={'capitalize'}
                                >
                                    {title} (<CountUpComponent key={data?.length} targetNumber={dataLength || data?.length} />)
                                </Text>
                            }
                            {customSearch !== false && <CustomSearchInput setSearchbox={setSearchboxOutside ? setSearchboxOutside : setSearchbox} setDisplaySearchData={setSearchboxOutside ? props.setSearchDisplay : setDisplaySearchData} searchbox={searchboxOutside ? searchboxOutside : searchbox} allData={allData} dataColumn={columns} onSearch={handleSearch} setGetTagValues={props.setGetTagValuesOutside ? props.setGetTagValuesOutside : setGetTagValues} setGopageValue={setGopageValue} />}
                            {
                                AdvanceSearch ? AdvanceSearch : AdvanceSearch !== false &&
                                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvaceSearch(true)}>Advance Search</Button>
                            }
                            {(searchDisplay || displaySearchData) ? <Button variant="outline" colorScheme='red' size="sm" ms={2} onClick={() => handleClear()}>Clear</Button> : ""}
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
                        handleAdvanceSearch={handleAdvanceSearch}
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
                                    {
                                        allData && allData?.length > 0 &&
                                        <>
                                            <MenuDivider />
                                            <MenuItem width={"165px"} onClick={() => handleExportLeads('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                                            <MenuItem width={"165px"} onClick={() => handleExportLeads('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
                                        </>
                                    }
                                </MenuList>
                            </Menu>}
                        {(access?.create || access === true) && <Button onClick={() => handleClick()} size="sm" variant="brand" leftIcon={<AddIcon />}>Add New</Button>}
                        {BackButton && BackButton}
                    </GridItem>
                    <HStack spacing={4} mb={2}>
                        {(getTagValues || []).map((item) => (
                            <Tag
                                size={"md"}
                                p={2}
                                key={item.value}
                                borderRadius='full'
                                variant='solid'
                                colorScheme="gray"
                            >
                                <TagLabel>{item.value}</TagLabel>
                                <TagCloseButton onClick={() => handleRemove(item)} />
                            </Tag>
                        ))}
                    </HStack>
                </Grid>
                <Box overflowY={"auto"} className={size ? `small-table-fix-container` : `table-fix-container`}>
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
                                                                <Flex Flex align="center" justifyContent={item?.Header === 'Action' && 'center'}>
                                                                    <Text color={textColor} fontSize="sm" fontWeight="700" >
                                                                        {item.cell(cell) === ' ' ? '-' : item.cell(cell)}
                                                                    </Text>
                                                                </Flex>
                                                            );
                                                        }
                                                        else {
                                                            data = (
                                                                <Flex align="center" >
                                                                    {(item.Header === "#" && (checkBox || checkBox === undefined)) && <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues?.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" />}

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

            </Card>
        </>
    );
}

export default CommonCheckTable