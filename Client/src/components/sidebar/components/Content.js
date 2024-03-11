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
  const { routes, setOpenSidebar, openSidebar, from, largeLogo } = props;

  // SIDEBAR
  return (
    <Flex direction='column' height='100%'
      borderRadius='30px'>
      <Brand from={from} largeLogo={largeLogo}
        openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}
      />
      <Stack direction='column' mb='auto' pt={2}
      >

        <Box
        >
          <Links routes={routes} key={routes}
            openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}

          />
        </Box>
      </Stack>

      {/* <Box
        mt='60px'
        mb='40px'
        borderRadius='30px'>
        <SidebarCard />
      </Box> */}
    </Flex >
  );
}

export default SidebarContent;
