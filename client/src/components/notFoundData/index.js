import { Box, Button, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { FiInbox } from "react-icons/fi";

const DataNotFound = ({ title, message, actionLabel, onAction }) => {
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const iconBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const emptyBg = useColorModeValue("white", "whiteAlpha.50");

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      minH="180px"
      py="34px"
      px="20px"
      border="1px dashed"
      borderColor={borderColor}
      borderRadius="16px"
      bg={emptyBg}
    >
      <Flex
        align="center"
        justify="center"
        w="46px"
        h="46px"
        borderRadius="14px"
        bg={iconBg}
        color="brand.500"
        mb="14px"
      >
        <Icon as={FiInbox} w="22px" h="22px" />
      </Flex>
      <Text color="secondaryGray.900" fontSize="md" fontWeight="900">
        {title || "No records yet"}
      </Text>
      <Text color={mutedText} fontSize="sm" fontWeight="500" mt="6px" maxW="360px">
        {message || "Create a record or adjust your filters to see data here."}
      </Text>
      {actionLabel && onAction && (
        <Button mt="18px" size="sm" colorScheme="brand" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Flex>
  );
};

export default DataNotFound;
