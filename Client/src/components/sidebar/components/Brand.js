
// Chakra imports
import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand(props) {
  const { setOpenSidebar, openSidebar, from } = props;

  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Flex>
        <Heading my={4}
          cursor={"pointer"} onClick={() => !from && setOpenSidebar(!openSidebar)} userSelect={"none"}>{openSidebar === true ? "Prolink" : "Pr"}</Heading>
        {/* <Text border={"1px solid gray"} borderRadius={"50%"} my={4} onClick={() => setOpenSidebar(!openSidebar)} cursor={"pointer"} userSelect={"none"}
          display={{ sm: "none", xl: "inline-flex" }} fontSize={"22px"}
        >{openSidebar === true ? <HiOutlineChevronLeft /> : <HiOutlineChevronRight />}</Text> */}

      </Flex>
      <HSeparator
      />
    </Flex>
  );
}

export default SidebarBrand;
