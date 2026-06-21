import React from "react";

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Content from "components/sidebar/components/Content";
import PropTypes from "prop-types";

// Assets
import { IoMenuOutline } from "react-icons/io5";

function Sidebar(props) {
  const { routes, setOpenSidebar, openSidebar, largeLogo } = props;

  let variantChange = "0.2s linear";
  let shadow = useColorModeValue(
    "0px 18px 50px rgba(15, 23, 42, 0.08)",
    "unset",
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue("rgba(255, 255, 255, 0.96)", "navy.800");
  let borderColor = useColorModeValue("rgba(226, 232, 240, 0.9)", "whiteAlpha.200");
  let sidebarMargins = "12px";
  // SIDEBAR
  return (
    <Box
      display={{ sm: "none", xl: "block" }}
      w="100%"
      position="fixed"
      minH="100%"
    >
      <Box
        bg={sidebarBg}
        transition={variantChange}
        // w='280px'
        w={openSidebar ? "286px" : "88px"}
        h="calc(100vh - 24px)"
        m={sidebarMargins}
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="24px"
        boxShadow={shadow}
        backdropFilter="blur(18px)"
        display="flex"
        flexDirection="column"
      >
        <Content
          routes={routes}
          largeLogo={largeLogo}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive(props) {
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  let menuColor = useColorModeValue("gray.700", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  let menuBorder = useColorModeValue("gray.200", "whiteAlpha.200");
  let menuShadow = useColorModeValue("0px 8px 20px rgba(15, 23, 42, 0.06)", "none");
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { routes, setOpenSidebar, openSidebar } = props;
  // let isWindows = navigator.platform.startsWith("Win");
  //  BRAND
  const handlesidebarClose = () => {
    // setOpenSidebar(false)
    onClose();
  };
  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
      <Flex
        ref={btnRef}
        w="40px"
        h="40px"
        align="center"
        justify="center"
        borderRadius="14px"
        bg={menuBg}
        border="1px solid"
        borderColor={menuBorder}
        boxShadow={menuShadow}
        onClick={() => {
          onOpen();
          setOpenSidebar(true);
        }}
      >
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          _hover={{ cursor: "pointer" }}
        />
      </Flex>

      <Drawer
        isOpen={isOpen}
        onClose={handlesidebarClose}
        placement={document?.documentElement?.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          boxShadow={"xl"}
          w="285px"
          maxW="285px"
          bg={sidebarBackgroundColor}
          borderRightRadius="24px"
          maxH="100vh"
          overflow="hidden"
        >
          <DrawerCloseButton
            zIndex="3"
            onClose={handlesidebarClose}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody
            maxW="285px"
            px="0rem"
            pb="0"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            <Content
              from={"modal"}
              routes={routes}
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

Sidebar.propTypes = {
  logoText: PropTypes?.string,
  routes: PropTypes?.arrayOf(PropTypes?.object),
  variant: PropTypes?.string,
};

export default Sidebar;
