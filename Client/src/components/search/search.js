import React, { useState } from 'react';
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const CustomSearchInput = ({ allData, setSearchbox, setDisplaySearchData, searchbox, dataColumn, onSearch, setGetTagValues, setGopageValue }) => {

    const handleInputChange = (e) => {
        const searchTerm = e.target.value?.toLowerCase();

        const results = allData?.filter((item) => {
            // Check if any of the specified columns contains the search term
            return dataColumn?.some((column) => {
                const columnValue = item[column?.accessor];

                return (
                    columnValue &&
                        typeof columnValue === 'string' ?
                        columnValue?.toLowerCase()?.includes(searchTerm) : typeof columnValue === 'number' && columnValue?.toString()?.includes(searchTerm)
                );
            });
        });

        setSearchbox(searchTerm ? searchTerm : '');
        setDisplaySearchData(e.target.value === "" ? false : true)
        onSearch(results);
        setGetTagValues([]);

        if (e.target.value === "" && setGopageValue) {
            setGopageValue(1);
        }
    };

    return (
        <InputGroup width={{ sm: "100%", md: "30%" }} mx={{ sm: 0, md: 3 }} my={{ sm: "8px", md: "0" }} >
            <InputLeftElement
                size="sm"
                top="-3px"
                pointerEvents="none"
                zIndex='0'
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