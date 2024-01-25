import React, { useState } from 'react';
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const CustomSearchInput = ({ allData, setSearchbox, setDisplaySearchData, searchbox, dataColumn, onSearch }) => {

    const handleInputChange = (e) => {
        const searchTerm = e.target.value;

        const results = allData.filter((item) => {
            // Check if any of the specified columns contains the search term
            return dataColumn.some((column) => {
                const columnValue = item[column.accessor];

                return (
                    columnValue &&
                        typeof columnValue === 'string' ?
                        columnValue.toLowerCase().includes(searchTerm) : typeof columnValue === 'number' && columnValue.toString().includes(searchTerm)
                );
            });
        });

        setSearchbox(searchTerm ? searchTerm : '');
        setDisplaySearchData(e.target.value === "" ? false : true)
        onSearch(results);
    };

    return (
        <InputGroup width="30%" mx={3}>
            <InputLeftElement
                size="sm"
                top="-3px"
                pointerEvents="none"
                children={<SearchIcon color="gray.300" borderRadius="16px" />}
            />
            <Input
                type="text"
                size="sm"
                fontSize="sm"
                value={searchbox}
                onChange={handleInputChange}
                fontWeight="500"
                placeholder="Search..."
                borderRadius="16px"
            />
        </InputGroup>
    );
};

export default CustomSearchInput;