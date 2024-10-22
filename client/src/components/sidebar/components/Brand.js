
// Chakra imports
import { Flex, Heading, Image, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/slices/imageSlice";

export function SidebarBrand(props) {
  const { setOpenSidebar, openSidebar, from, largeLogo } = props;

  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column' style={{
      position: "sticky",
      top: "0",
      left: "0",
      background: "#fff",

    }}>
      <Flex>
        {largeLogo && (largeLogo[0]?.logoLgImg || largeLogo[0]?.logoSmImg) ? <Image
          style={{ width: "100%", height: '52px' }}
          src={openSidebar === true ? largeLogo[0]?.logoLgImg : largeLogo[0]?.logoSmImg} // Set the source path of your image
          alt="Logo" // Set the alt text for accessibility
          cursor="pointer"
          onClick={() => !from && setOpenSidebar(!openSidebar)}
          userSelect="none"
          my={2}
        /> : <Heading my={4}
          cursor={"pointer"} onClick={() => !from && setOpenSidebar(!openSidebar)} userSelect={"none"}>{openSidebar === true ? "Prolink" : "Pr"}</Heading>}
      </Flex>

    </Flex>
  );
}

export default SidebarBrand;
