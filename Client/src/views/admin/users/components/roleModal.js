import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Modal,Thead,Tbody, ModalBody,Tr,Th,Text,Td,Box, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, useColorModeValue, Checkbox } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useEffect, useMemo, useState } from 'react'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { getApi, postApi } from 'services/api'

const RoleModal = (props) => {
    const {
        columnsData,
        name,
        tableData,
        handleClick,
        fetchData,
        isOpen,
        setAction,
        _id,
        onClose,
        onOpen,
      } = props;
    
      const textColor = useColorModeValue("secondaryGray.900", "white");
      const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
      const columns = useMemo(() => columnsData, [columnsData]);
      const [selectedValues, setSelectedValues] = useState([]);
      const [isLoding, setIsLoding] = useState(false);
    
      const [deleteModel, setDelete] = useState(false);
      const [selectedId, setSelectedId] = useState();
      const [gopageValue, setGopageValue] = useState();
      const data = useMemo(() => tableData, [tableData]);
      const user = JSON.parse(localStorage.getItem("user"));
    
      const tableInstance = useTable(
        {
          columns,
          data,
          initialState: { pageIndex: 0 },
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
        state: { pageIndex, pageSize },
      } = tableInstance;
    
      if (pageOptions.length < gopageValue) {
        setGopageValue(pageOptions.length);
      }
    
      const handleCheckboxChange = (event, value) => {
        if (event.target.checked) {
          setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
        } else {
          setSelectedValues((prevSelectedValues) =>
            prevSelectedValues.filter((selectedValue) => selectedValue !== value)
          );
        }
      };

    return (
        <Modal onClose={onClose} size='full' isOpen={isOpen} >
            <ModalOverlay />
            <ModalContent >
                <ModalHeader>Change Role</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                            <Spinner />
                        </Flex> :
                         <Box overflowY={"auto"} className="table-fix-container">
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
                                                    {/* {column.isSortable !== false && (
                                                        <span>
                                                            {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />}
                                                        </span>
                                                    )} */}
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
                                                            <Flex align="center" >
                                                                <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" /> 
                                                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                                                    {cell?.row?.index + 1}
                                                                </Text>
                                                            </Flex>
                                                        );
                                                    } else if (cell?.column.Header === "Role Name") {
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
                                                    } else if (cell?.column.Header === "Description") {
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
                        </Box>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button variant='brand'  disabled={isLoding ? true : false} leftIcon={<AddIcon />}> {isLoding ? <Spinner /> : 'Add'}</Button>
                    <Button    variant="outline"
            colorScheme="red"
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }} onClick={() => onClose()}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}

export default RoleModal
