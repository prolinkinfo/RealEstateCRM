// Chakra Imports
import {
  Box,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import AdminNavbarLinks from "components/navbar/NavbarLinksAdmin";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { AiOutlineMenuUnfold } from "react-icons/ai";
import { AiOutlineMenuFold } from "react-icons/ai";

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);

    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  });

  const {
    secondary,
    message,
    brandText,
    under,
    setOpenSidebar,
    openSidebar,
    largeLogo,
    routes,
  } = props;
  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("gray.900", "white");
  let secondaryText = useColorModeValue("gray.500", "secondaryGray.500");
  let navbarPosition = "fixed";
  let navbarFilter = "none";
  let navbarBackdrop = "blur(20px)";
  let navbarShadow = useColorModeValue(
    scrolled
      ? "0px 18px 45px rgba(15, 23, 42, 0.1)"
      : "0px 10px 30px rgba(15, 23, 42, 0.06)",
    "none",
  );
  let navbarBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(11,20,55,0.72)");
  let navbarBorder = useColorModeValue("rgba(226, 232, 240, 0.9)", "whiteAlpha.200");
  let secondaryMargin = "0px";
  let paddingX = "18px";
  let gap = "0px";
  let toggleBg = useColorModeValue("white", "whiteAlpha.100");
  const pageTitle = under?.sidebarName || brandText;
  const sectionLabel = under?.separator || "Workspace";
  const changeNavbar = () => {
    if (window?.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  return (
    <Box
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius={{ base: "0px", xl: "22px" }}
      borderWidth="1px"
      borderStyle="solid"
      zIndex={10}
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      display={secondary ? "block" : "flex"}
      minH={{ base: "76px", md: "78px" }}
      justifyContent={{ xl: "space-between" }}
      lineHeight="25.6px"
      mx={{ base: "0px", xl: "12px" }}
      mt={secondaryMargin}
      pb="6px"
      right={{ base: "0px" }}
      // right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
      px={{
        sm: paddingX,
        md: "18px",
      }}
      ps={{
        xl: "18px",
      }}
      pt="8px"
      top={{ base: "0px", xl: "12px" }}
      w={{
        base: "100vw",
        xl: openSidebar ? "calc(100vw - 322px)" : "calc(100vw - 124px)",
        // base: 'calc(100vw - 0%)',
        // md: 'calc(100vw - 0%)',
        // lg: 'calc(100vw - 0%)',
        // xl: openSidebar === true ? 'calc(100vw - 286px)' : 'calc(100vw - 80px)',
        // '2xl': openSidebar === true ? 'calc(100vw - 286px)' : 'calc(100vw - 80px)'
      }}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "column",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
        mb={gap}
      >
        <Box
          //  mb={{ sm: '8px', md: '10px' }}
          //  pt="15px"
          display="flex"
          alignItems="center"
          minW="0"
        >
          <Flex
            display={{ sm: "none", xl: "flex" }}
            align="center"
            justify="center"
            w="42px"
            h="42px"
            borderRadius="14px"
            border="1px solid"
            borderColor={navbarBorder}
            color={mainText}
            bg={toggleBg}
            onClick={() => setOpenSidebar(!openSidebar)}
            cursor="pointer"
            me="14px"
            transition="all 0.18s ease"
            _hover={{ transform: "translateY(-1px)", boxShadow: "0px 8px 18px rgba(15, 23, 42, 0.08)" }}
          >
            {openSidebar ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
          </Flex>
          <Link color={mainText} display={{ sm: "flex", xl: "none" }}>
            {largeLogo && largeLogo[0]?.logoLgImg ? (
              <Image
                style={{ width: "100%", height: "52px" }}
                src={largeLogo[0]?.logoLgImg}
                alt="Logo"
                cursor="pointer"
                userSelect="none"
                my={2}
              />
            ) : (
              <Heading my={4} cursor={"pointer"} userSelect={"none"}>
                {openSidebar === true ? "Prolink" : "Pr"}
              </Heading>
            )}
          </Link>

          <Box minW="0" ps={{ base: "10px", xl: "0" }}>
            <Text
              color={secondaryText}
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              mb="3px"
            >
              {sectionLabel}
            </Text>
            <Heading
              color={mainText}
              fontSize={{ base: "xl", md: "2xl" }}
              lineHeight="1.1"
              fontWeight="800"
              textTransform="capitalize"
              noOfLines={1}
            >
              {pageTitle}
            </Heading>
          </Box>
        </Box>
        <Box ms="auto" w={{ sm: "100%", md: "unset" }}>
          <AdminNavbarLinks
            setOpenSidebar={setOpenSidebar}
            openSidebar={openSidebar}
            onOpen={props?.onOpen}
            logoText={props?.logoText}
            secondary={props?.secondary}
            fixed={props?.fixed}
            scrolled={scrolled}
            routes={routes}
          />
        </Box>
      </Flex>
      {secondary ? <Text color="white">{message}</Text> : null}
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes?.string,
  variant: PropTypes?.string,
  secondary: PropTypes?.bool,
  fixed: PropTypes?.bool,
  onOpen: PropTypes?.func,
};
