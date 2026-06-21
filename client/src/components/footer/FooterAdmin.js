/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  const textColor = useColorModeValue("gray.500", "gray.400");
  const linkColor = useColorModeValue("gray.600", "gray.300");
  return (
    <Flex
      zIndex="3"
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent="space-between"
      px={{ base: "24px", md: "40px" }}
      py="18px"
    >
      <Text
        color={textColor}
        fontSize="xs"
        fontWeight="600"
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "8px", xl: "0px" }}
      >
        &copy; {1900 + new Date().getYear()}{" "}
        <Text as="span" fontWeight="600" ms="4px">
          <Link
            fontWeight="700"
            color={linkColor}
            target="_blank"
            href="https://prolinkinfotech.com/"
          >
            Prolink Infotech.
          </Link>{" "}
          Support:{" "}
          <Link
            href="mailto:alternatecrm@gmail.com"
            fontWeight="700"
            color={linkColor}
            target="_blank"
          >
            alternatecrm@gmail.com
          </Link>
        </Text>
      </Text>
      {/* <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://prolinkinfotech.com/'>
            Support
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://www.simmmple.com/licenses?ref=horizon-chakra-free'>
            License
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://simmmple.com/terms-of-service?ref=horizon-chakra-free'>
            Terms of Use
          </Link>
        </ListItem>
        <ListItem>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://www.blog.simmmple.com/?ref=horizon-chakra-free'>
            Blog
          </Link>
        </ListItem>
      </List> */}
    </Flex>
  );
}
