// Chakra imports
import { Box, Flex, Heading, Image, Text, useColorModeValue } from "@chakra-ui/react";

export function SidebarBrand(props) {
  const { setOpenSidebar, openSidebar, from, largeLogo } = props;

  //   Chakra color mode
  let logoColor = useColorModeValue("gray.900", "white");
  let subtitleColor = useColorModeValue("gray.500", "secondaryGray.500");
  let brandBg = useColorModeValue("rgba(255, 255, 255, 0.94)", "navy.800");
  let borderColor = useColorModeValue("gray.100", "whiteAlpha.100");

  return (
    <Flex
      align="center"
      direction="column"
      flexShrink="0"
      bg={brandBg}
      backdropFilter="blur(18px)"
      borderBottom="1px solid"
      borderColor={borderColor}
      px={openSidebar ? "18px" : "12px"}
      pt="18px"
      pb="14px"
      zIndex="2"
    >
      <Flex align="center" w="100%" justify={openSidebar ? "flex-start" : "center"}>
        {largeLogo && (largeLogo[0]?.logoLgImg || largeLogo[0]?.logoSmImg) ? (
          <Image
            style={{
              width: openSidebar ? "178px" : "44px",
              height: "46px",
              objectFit: "contain",
            }}
            src={
              openSidebar === true
                ? largeLogo[0]?.logoLgImg
                : largeLogo[0]?.logoSmImg
            } // Set the source path of your image
            alt="Logo" // Set the alt text for accessibility
            cursor="pointer"
            onClick={() => !from && setOpenSidebar(!openSidebar)}
            userSelect="none"
          />
        ) : (
          <Flex
            align="center"
            cursor="pointer"
            onClick={() => !from && setOpenSidebar(!openSidebar)}
            userSelect="none"
            w="100%"
            justify={openSidebar ? "flex-start" : "center"}
          >
            <Flex
              align="center"
              justify="center"
              w="42px"
              h="42px"
              borderRadius="14px"
              bg="brand.600"
              color="white"
              fontWeight="800"
              fontSize="sm"
              me={openSidebar ? "12px" : "0"}
            >
              RP
            </Flex>
            {openSidebar && (
              <Box>
                <Heading color={logoColor} fontSize="lg" lineHeight="1.1">
                  Rental CRM
                </Heading>
                <Text color={subtitleColor} fontSize="xs" fontWeight="600" mt="3px">
                  Property Management
                </Text>
              </Box>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default SidebarBrand;
