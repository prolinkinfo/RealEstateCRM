/* eslint-disable */
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import {
  Box,
  Divider,
  Flex,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.900", "white");
  let inactiveColor = useColorModeValue("gray.600", "secondaryGray.500");
  let mutedColor = useColorModeValue("gray.500", "secondaryGray.600");
  let activeIcon = useColorModeValue("brand.600", "brand.300");
  let textColor = useColorModeValue("gray.600", "secondaryGray.500");
  let brandColor = useColorModeValue("brand.500", "brand.300");
  let activeBg = useColorModeValue("brand.50", "whiteAlpha.100");
  let hoverBg = useColorModeValue("gray.50", "whiteAlpha.50");
  let sectionColor = useColorModeValue("gray.500", "secondaryGray.600");
  let dividerColor = useColorModeValue("gray.200", "whiteAlpha.200");
  let sectionBg = useColorModeValue("gray.50", "whiteAlpha.50");
  let rentalSectionBg = useColorModeValue("brand.50", "whiteAlpha.100");
  let legacySectionBg = useColorModeValue("gray.100", "whiteAlpha.50");
  let activeBorder = useColorModeValue("brand.100", "whiteAlpha.200");
  let activeShadow = useColorModeValue(
    "0px 12px 28px rgba(66, 42, 251, 0.10)",
    "none",
  );

  const user = JSON.parse(localStorage.getItem("user"));

  const { routes, setOpenSidebar, openSidebar } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    const normalizedRoute = routeName?.toLowerCase();
    const normalizedPath = location?.pathname?.toLowerCase();

    return (
      normalizedPath === normalizedRoute ||
      normalizedPath === `/admin${normalizedRoute}` ||
      normalizedPath?.startsWith(`${normalizedRoute}/`) ||
      normalizedPath?.startsWith(`/admin${normalizedRoute}/`)
    );
  };

  const getSectionStyles = (section) => {
    if (section === "Rental Management") {
      return {
        bg: rentalSectionBg,
        color: brandColor,
        marker: brandColor,
        opacity: 1,
      };
    }

    if (section === "Legacy CRM / Sales CRM") {
      return {
        bg: legacySectionBg,
        color: mutedColor,
        marker: mutedColor,
        opacity: 0.78,
      };
    }

    return {
      bg: sectionBg,
      color: sectionColor,
      marker: sectionColor,
      opacity: 0.92,
    };
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    let currentSection = "";

    return routes?.map((route, index) => {
      const routeLabel = route?.sidebarName || route?.name;
      if (route?.separator) currentSection = route?.separator;
      const isActive = activeRoute(route?.path);
      const isLegacy = currentSection === "Legacy CRM / Sales CRM";
      const isAdmin = currentSection === "Admin";
      const sectionStyles = getSectionStyles(route?.separator || currentSection);

      if (route?.category) {
        return (
          <Box key={index}>
            <Text
              fontSize="xs"
              color={sectionColor}
              fontWeight="800"
              letterSpacing="0"
              textTransform="uppercase"
              px={openSidebar ? "18px" : "0"}
              pt="18px"
              pb="10px"
              textAlign={openSidebar ? "left" : "center"}
            >
              {routeLabel}
            </Text>
            {createLinks(route?.items)}
          </Box>
        );
      } else if (
        !route?.under &&
        user?.role &&
        route?.layout?.includes(`/${user?.role}`)
      ) {
        return (
          <Box key={index}>
            {route?.separator && (
              <Box px={openSidebar ? "12px" : "20px"} pt="22px" pb="8px">
                {openSidebar ? (
                  <Flex
                    align="center"
                    gap="8px"
                    bg={sectionStyles.bg}
                    borderRadius="12px"
                    px="10px"
                    py="8px"
                    opacity={sectionStyles.opacity}
                    maxW="100%"
                    overflow="hidden"
                  >
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="999px"
                      bg={sectionStyles.marker}
                      flexShrink={0}
                    />
                    <Text
                      color={sectionStyles.color}
                      fontSize="10px"
                      fontWeight="800"
                      letterSpacing="0"
                      lineHeight="1"
                      textTransform="uppercase"
                      noOfLines={1}
                    >
                      {route?.separator}
                    </Text>
                  </Flex>
                ) : (
                  <Divider borderColor={dividerColor} />
                )}
              </Box>
            )}
            <NavLink to={route?.path}>
            {route.icon ? (
              <Box
                mx={openSidebar ? "12px" : "10px"}
                mb="4px"
                borderRadius="14px"
                bg={isActive ? activeBg : "transparent"}
                boxShadow={isActive ? activeShadow : "none"}
                border="1px solid"
                borderColor={isActive ? activeBorder : "transparent"}
                transition="all 0.18s ease"
                opacity={isLegacy && !isActive ? 0.62 : 1}
                _hover={{
                  bg: isActive ? activeBg : hoverBg,
                  opacity: 1,
                  transform: openSidebar ? "translateX(2px)" : "none",
                }}
              >
                <HStack
                  spacing={openSidebar ? "12px" : "0"}
                  minH="44px"
                  px={openSidebar ? "12px" : "0"}
                  justify={openSidebar ? "flex-start" : "center"}
                >
                  {openSidebar === true ? (
                    <Flex
                      w="100%"
                      alignItems="center"
                      justifyContent="flex-start"
                      // onClick={() => setOpenSidebar(!openSidebar)}
                    >
                      <Box
                        color={
                          isActive ? activeIcon : isLegacy || isAdmin ? mutedColor : textColor
                        }
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        w="20px"
                        minW="20px"
                      >
                        {route?.icon}
                      </Box>
                      <Text
                        me="auto"
                        textOverflow={"ellipsis"}
                        overflowX="hidden"
                        whiteSpace="nowrap"
                        width="190px"
                        ms="12px"
                        fontSize="sm"
                        color={
                          isActive ? activeColor : isLegacy || isAdmin ? mutedColor : textColor
                        }
                        fontWeight={isActive ? "800" : isLegacy ? "600" : "700"}
                      >
                        <Tooltip hasArrow label={routeLabel}>
                          {routeLabel}
                        </Tooltip>
                      </Text>
                    </Flex>
                  ) : (
                    <Flex
                      w="100%"
                      alignItems="center"
                      justifyContent="center"
                      //  onClick={() => setOpenSidebar(!openSidebar)}
                    >
                      <Box
                        color={
                          isActive ? activeIcon : isLegacy || isAdmin ? mutedColor : textColor
                        }
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {route?.icon}
                      </Box>
                    </Flex>
                  )}
                  {openSidebar && (
                    <Box
                      w="4px"
                      h="24px"
                      bg={isActive ? brandColor : "transparent"}
                      borderRadius="8px"
                    />
                  )}
                </HStack>
              </Box>
            ) : (
              <Box
                mx={openSidebar ? "12px" : "10px"}
                mb="4px"
                borderRadius="14px"
                bg={isActive ? activeBg : "transparent"}
                _hover={{ bg: isActive ? activeBg : hoverBg }}
              >
                <HStack
                  spacing="12px"
                  minH="42px"
                  px={openSidebar ? "12px" : "0"}
                  justify={openSidebar ? "flex-start" : "center"}
                >
                  <Text
                    me="auto"
                    color={
                      isActive ? activeColor : isAdmin ? mutedColor : inactiveColor
                    }
                    fontSize="sm"
                    fontWeight={isActive ? "700" : "600"}
                  >
                    {openSidebar ? routeLabel : routeLabel?.charAt(0)}
                  </Text>
                  {openSidebar && (
                    <Box
                      h="24px"
                      w="4px"
                      bg={isActive ? brandColor : "transparent"}
                      borderRadius="8px"
                    />
                  )}
                </HStack>
              </Box>
            )}
            </NavLink>
          </Box>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
