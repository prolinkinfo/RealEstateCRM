// chakra imports
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
//   Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import SidebarCard from "components/sidebar/components/SidebarCard";
import React from "react";
import { HiOutlineChevronDoubleRight, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

// FUNCTIONS

function SidebarContent(props) {
  const { routes, setOpenSidebar, openSidebar, from } = props;

  // SIDEBAR
  return (
    <Flex direction='column' height='100%'
      pt='2px'
      // px="16px"
      borderRadius='30px'>
      <Brand from={from} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <Stack direction='column' mb='auto'
      //  mt='8px'
      >
        {/* <Text border={"1px solid gray"} borderRadius={"50%"} my={4} onClick={() => setOpenSidebar(!openSidebar)} cursor={"pointer"} userSelect={"none"}
          display={{ sm: "none", xl: "inline-flex" }} fontSize={"22px"} position={"absolute"} left={"254px"}
        >{openSidebar === true ? <HiOutlineChevronLeft /> : <HiOutlineChevronRight />}</Text> */}
        <Box
        //  ps='20px'
        // pe={{ md: "16px", "2xl": "1px" }}
        >
          <Links routes={routes} key={routes} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        </Box>
      </Stack>

      {/* <Box
        mt='60px'
        mb='40px'
        borderRadius='30px'>
        <SidebarCard />
      </Box> */}
    </Flex>
  );
}

export default SidebarContent;
