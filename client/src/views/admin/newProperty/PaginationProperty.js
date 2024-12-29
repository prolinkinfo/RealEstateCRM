import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const PaginationProperty = (props) => {
  const {
    currentPage,
    rangeData,
    setCurrentPage,
    setRangeData,
    nextPage,
    previousPage,
    dataLength,
  } = props;

  const [gopageValue, setGopageValue] = useState(currentPage + 1);

  const canPreviousPage = currentPage >= 1;

  const canNextPage = currentPage < Math?.ceil(dataLength / rangeData) - 1;

  useEffect(() => {
    setGopageValue(currentPage + 1);
  }, [currentPage]);

  const handlePageChange = (value) => {
    const page = value ? Number(value) : 0; // Ensure we handle 0-based indexing for internal logic
    if (page >= 0 && page <= Math?.ceil(dataLength / rangeData)) {
      setCurrentPage(page - 1);
    }
  };

  return (
    <Flex
      justifyContent={
        Math.ceil(dataLength / rangeData) !== 1 ? "space-between" : "end"
      }
      m={2}
      alignItems="center"
    >
      {Math.ceil(dataLength / rangeData) !== 1 && (
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => {
                setCurrentPage(0);
              }}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={() => {
                previousPage();
              }}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
      )}

      <Flex alignItems="center">
        {Math.ceil(dataLength / rangeData) !== 1 && (
          <>
            <Text flexShrink="0" mr={8}>
              Page{" "}
              <Text fontWeight="bold" as="span">
                {currentPage + 1}
              </Text>{" "}
              of{" "}
              <Text fontWeight="bold" as="span">
                {Math?.ceil(dataLength / rangeData)}
              </Text>
            </Text>
            <Text flexShrink="0">Go to page:</Text>
            <NumberInput
              ml={2}
              mr={8}
              w={28}
              min={0}
              max={Math.ceil(dataLength / rangeData)}
              value={gopageValue}
              onChange={(value) => handlePageChange(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </>
        )}
        <Select
          w={32}
          value={rangeData}
          onChange={(e) => {
            setRangeData(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50]?.map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </Select>
      </Flex>

      {Math.ceil(dataLength / rangeData) !== 1 && (
        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              onClick={() => {
                nextPage();
              }}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => {
                setCurrentPage(Math?.ceil(dataLength / rangeData) - 1);
              }}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      )}
    </Flex>
  );
};

export default PaginationProperty;
