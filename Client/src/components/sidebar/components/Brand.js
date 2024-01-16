
// Chakra imports
import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand(props) {
  const { setOpenSidebar, openSidebar, from } = props;

  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column' style={{
      position: "sticky",
      top: "0",
      left: "0",
      background: "#fff"
    }}>
      <Flex>
        <Heading my={4}
          cursor={"pointer"} onClick={() => !from && setOpenSidebar(!openSidebar)} userSelect={"none"}>{openSidebar === true ? "Prolink" : "Pr"}</Heading>
      </Flex>
      <HSeparator
      />
    </Flex>
  );
}

export default SidebarBrand;
