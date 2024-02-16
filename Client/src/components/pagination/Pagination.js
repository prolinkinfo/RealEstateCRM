import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text, Tooltip } from '@chakra-ui/react';
import React from 'react'
import { useEffect } from 'react';

const Pagination = (props) => {
    const { gotoPage, gopageValue, setGopageValue, pageCount, canPreviousPage, previousPage, canNextPage, pageOptions, setPageSize, nextPage, pageSize, pageIndex } = props

    useEffect(() => {
        setGopageValue(1)
    }, [])

    return (

        <Flex justifyContent={pageOptions?.length !== 1 ? "space-between" : "end"} mt={2} alignItems="center" >
            {pageOptions?.length !== 1 && <Flex>
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
            </Flex>}

            <Flex alignItems="center">
                {pageOptions?.length !== 1 && <>
                    <Text flexShrink="0" mr={8}>
                        Page{" "}
                        <Text fontWeight="bold" as="span">
                            {pageIndex + 1}
                        </Text>{" "}
                        of{" "}
                        <Text fontWeight="bold" as="span">
                            {pageOptions?.length}
                        </Text>
                    </Text>
                    <Text flexShrink="0">Go to page:</Text>{" "}
                    <NumberInput
                        ml={2}
                        mr={8}
                        w={28}
                        min={1}
                        max={pageOptions?.length}
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
                </>}
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

            {pageOptions?.length !== 1 &&
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
                </Flex>}
        </Flex>
    )
}

export default Pagination
