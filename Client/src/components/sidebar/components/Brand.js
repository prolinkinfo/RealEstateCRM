import React from "react";

// Chakra imports
import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand(props) {
  const { setOpenSidebar, openSidebar } = props;

  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Heading my={4} onClick={() => setOpenSidebar(!openSidebar)} cursor={"pointer"} userSelect={"none"}>{openSidebar === true ? "Prolink" : "Pr"}</Heading>
      <HSeparator
      // mb='20px'
      />
    </Flex>
  );
}

export default SidebarBrand;
