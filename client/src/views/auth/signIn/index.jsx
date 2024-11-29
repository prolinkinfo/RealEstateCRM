import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { postApi } from "services/api";
import { loginSchema } from "schema";
import { toast } from "react-toastify";
import Spinner from "components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/slices/imageSlice";
import { setUser } from "../../../redux/slices/localSlice";
import longLogo from "../../../assets/img/ZUQRUF_LOGO_sides.png";


function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [isLoding, setIsLoding] = React.useState(false);
  const [checkBox, setCheckBox] = React.useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the fetchRoles action on component mount
    dispatch(fetchImage("?isActive=true"));
  }, [dispatch]);

  const image = useSelector((state) => state?.images?.images);

  const [show, setShow] = React.useState(false);
  const showPass = () => setShow(!show);

  const initialValues = {
    username: "",
    password: "",
  };
  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    resetForm,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      login();
    },
  });
  const navigate = useNavigate();

  const login = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/user/login", values, checkBox);
      if (response && response?.status === 200) {
        navigate("/superAdmin");
        toast.success("Login Successfully!");
        resetForm();
        dispatch(setUser(response?.data?.user))
      } else {
        toast.error(response?.response?.data?.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  return (

<DefaultAuth
  illustrationBackground={image?.length > 0 && image[0]?.authImg}
  image={image?.length > 0 && image[0]?.authImg}
>
  <Grid
    templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
    gap={6}
    alignItems="center"
    justifyContent="space-evenly"
    w="100%"
    maxW="1200px"
    mx="auto"
    px={{ base: "20px", lg: "40px" }}
    py={{ base: "40px", lg: "14vh" }}
    h="100%"
  >
    {/* Left Side: Form Content */}
    <GridItem>
      <Flex
        direction="column"
        w="100%"
        background="transparent"
        borderRadius="15px"
        maxWidth="420px"
        mx="auto"
      >
        <Box mb="20px">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={errors?.username && touched?.username} mb="24px">
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              fontSize="sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.username}
              name="username"
              type="email"
              placeholder="mail@simmmple.com"
              size="lg"
              borderColor={
                errors?.username && touched?.username ? "red.300" : null
              }
              className={
                errors?.username && touched?.username ? "isInvalid" : null
              }
            />
            {errors?.username && touched?.username && (
              <FormErrorMessage>{errors?.username}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={errors?.password && touched?.password} mb="24px">
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                fontSize="sm"
                placeholder="Enter Your Password"
                name="password"
                value={values?.password}
                onChange={handleChange}
                onBlur={handleBlur}
                size="lg"
                type={show ? "text" : "password"}
                borderColor={
                  errors?.password && touched?.password ? "red.300" : null
                }
                className={
                  errors?.password && touched?.password ? "isInvalid" : null
                }
              />
              <InputRightElement display="flex" alignItems="center">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={showPass}
                />
              </InputRightElement>
            </InputGroup>
            {errors?.password && touched?.password && (
              <FormErrorMessage>{errors?.password}</FormErrorMessage>
            )}
          </FormControl>

          <Flex justifyContent="space-between" align="center" mb="24px">
            <FormControl display="flex" alignItems="center">
              <Checkbox
                onChange={(e) => setCheckBox(e?.target?.checked)}
                id="remember-login"
                value={checkBox}
                defaultChecked
                colorScheme="brandScheme"
                me="10px"
              />
              <FormLabel
                htmlFor="remember-login"
                mb="0"
                fontWeight="normal"
                color={textColor}
                fontSize="sm"
              >
                Keep me logged in
              </FormLabel>
            </FormControl>
          </Flex>

          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50px"
            type="submit"
            isLoading={isLoding}
            loadingText="Signing In"
          >
            Sign In
          </Button>
        </form>
      </Flex>
    </GridItem>

    {/* Right Side: Image */}
    <GridItem>
      <Flex
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          src={longLogo}
          alt="Logo"
          w={{ base: "80%", lg: "100%" }}
          maxW="400px"
          objectFit="contain"
        />
      </Flex>
    </GridItem>
  </Grid>
</DefaultAuth>

  );
}

export default SignIn;
