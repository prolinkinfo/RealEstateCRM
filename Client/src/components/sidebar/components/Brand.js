
// Chakra imports
import { Flex, Heading, Image, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/imageSlice";

export function SidebarBrand(props) {
  const { setOpenSidebar, openSidebar, from } = props;

  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the fetchRoles action on component mount
    dispatch(fetchImage("?isActive=true"));
  }, [dispatch]);

  const image = useSelector((state) => state?.images?.image);

  return (
    <Flex align='center' direction='column' style={{
      position: "sticky",
      top: "0",
      left: "0",
      background: "#fff"
    }}>
      <Flex>
        {/* <Heading my={4}
          cursor={"pointer"} onClick={() => !from && setOpenSidebar(!openSidebar)} userSelect={"none"}>{openSidebar === true ? "Prolink" : "Pr"}</Heading> */}
        {(image[0]?.logoLgImg && image[0]?.logoSmImg) ? <Image
          style={{ width: "150px", height: '60px' }}
          src={openSidebar === true ? image[0]?.logoLgImg : image[0]?.logoSmImg} // Set the source path of your image
          alt="Logo" // Set the alt text for accessibility
          cursor="pointer"
          onClick={() => !from && setOpenSidebar(!openSidebar)}
          userSelect="none"
          my={2}
        /> : <Heading my={4}
          cursor={"pointer"} onClick={() => !from && setOpenSidebar(!openSidebar)} userSelect={"none"}>{openSidebar === true ? "Prolink" : "Pr"}</Heading>}
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
