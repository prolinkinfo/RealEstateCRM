// chakra imports
import { Box, Flex, Stack } from "@chakra-ui/react";
//   Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React from "react";

// FUNCTIONS

function SidebarContent(props) {
  const { routes, setOpenSidebar, openSidebar, from, largeLogo } = props;
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(148, 163, 184, 0.45)",
      borderRadius: "999px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "rgba(100, 116, 139, 0.65)",
    },
  };

  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      minH="0"
      w="100%"
      borderRadius="24px"
      overflow="hidden"
    >
      <Brand
        from={from}
        largeLogo={largeLogo}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />
      <Stack
        direction="column"
        flex="1"
        minH="0"
        overflowY="auto"
        overflowX="hidden"
        pt={2}
        pb={6}
        sx={scrollbarStyles}
      >
        <Box px="0">
          <Links
            routes={routes}
            key={routes}
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
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
