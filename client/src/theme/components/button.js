import { mode } from "@chakra-ui/theme-tools";
export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        borderRadius: "16px",
        boxShadow: "45px 76px 113px 7px rgba(112, 144, 176, 0.08)",
        transition: ".25s all ease",
        boxSizing: "border-box",
        _focus: {
          boxShadow: "none",
        },
        _active: {
          boxShadow: "none",
        },
      },
      variants: {
        outline: () => ({
          borderRadius: "16px",
        }),
        brand: (props) => ({
          bg: mode("orange.600", "orange.400")(props),
          // bg: mode("orange.500", "orange.300")(props),
          color: "white",
          _focus: {
            bg: mode("#ed9f79", "#ed9f79")(props),
            // bg: mode("orange.500", "orange.400")(props),
          },
          _active: {
            bg: mode("#c0562140;", "#c0562140;")(props),
          },
          _hover: {
            bg: mode("#eb9971", "#eb9971")(props),
          },
        }),
        darkBrand: (props) => ({
          bg: mode("orange.900", "orange.400")(props),
          color: "white",
          _focus: {
            bg: mode("orange.900", "orange.400")(props),
          },
          _active: {
            bg: mode("orange.900", "orange.400")(props),
          },
          _hover: {
            bg: mode("orange.800", "orange.400")(props),
          },
        }),
        lightBrand: (props) => ({
          bg: mode("#F2EFFF", "whiteAlpha.100")(props),
          color: mode("orange.500", "white")(props),
          _focus: {
            bg: mode("#F2EFFF", "whiteAlpha.100")(props),
          },
          _active: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          },
          _hover: {
            bg: mode("secondaryGray.400", "whiteAlpha.200")(props),
          },
        }),
        light: (props) => ({
          bg: mode("secondaryGray.400", "whiteAlpha.100")(props),
          color: mode("secondaryGray.900", "white")(props),
          _focus: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          },
          _active: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          },
          _hover: {
            bg: mode("secondaryGray.400", "whiteAlpha.200")(props),
          },
        }),
        action: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("secondaryGray.300", "orange.400")(props),
          color: mode("orange.500", "white")(props),
          _focus: {
            bg: mode("secondaryGray.300", "orange.400")(props),
          },
          _active: { bg: mode("secondaryGray.300", "orange.400")(props) },
          _hover: {
            bg: mode("secondaryGray.200", "orange.400")(props),
          },
        }),
        setup: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("transparent", "orange.400")(props),
          border: mode("1px solid", "0px solid")(props),
          borderColor: mode("secondaryGray.400", "transparent")(props),
          color: mode("secondaryGray.900", "white")(props),
          _focus: {
            bg: mode("transparent", "orange.400")(props),
          },
          _active: { bg: mode("transparent", "orange.400")(props) },
          _hover: {
            bg: mode("secondaryGray.100", "orange.400")(props),
          },
        }),
      },
    },
  },
};
