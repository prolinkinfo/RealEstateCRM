import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
// Chakra imports
import {
  Box,
  Button, Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue
} from "@chakra-ui/react";


// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { postApi } from "services/api";
import { loginSchema } from "schema";

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = React.useState(false);
  const showPass = () => setShow(!show);

  const initialValues = {
    username: '',
    password: ''
  }
  const { errors, values, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      login()
      resetForm();
    }
  })
  const navigate = useNavigate()

  const login = async () => {
    let response = await postApi('api/user/login', values)
    if (response && response.status === 200) {
      navigate('/admin')
    } else {
      alert(response.response.data?.error)
    }
  }

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          {/* <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}>
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Sign in with Google
          </Button>
          <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              or
            </Text>
            <HSeparator />
          </Flex> */}
          <FormControl isInvalid={errors.username && touched.username} >
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              // isRequired={true}
              // variant='auth'
              fontSize='sm'
              onChange={handleChange} onBlur={handleBlur}
              value={values.username}
              name="username"
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@simmmple.com'
              mb={errors.username && touched.username ? undefined : '24px'}
              fontWeight='500'
              size='lg'
              borderColor={errors.username && touched.username ? "red.300" : null}
              className={errors.username && touched.username ? "isInvalid" : null}
            />
            {errors.username && touched.username && <FormErrorMessage mb='24px'> {errors.username}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={errors.password && touched.password} mb="24px">
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Enter Your Password'
                name='password'
                mb={errors.password && touched.password ? undefined : '24px'}
                value={values.password} onChange={handleChange} onBlur={handleBlur}
                size='lg'
                variant='auth'
                type={show ? "text" : "password"}
                borderColor={errors.password && touched.password ? "red.300" : null}
                className={errors.password && touched.password ? "isInvalid" : null}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={showPass}
                />
              </InputRightElement>
            </InputGroup>
            {errors.password && touched.password && <FormErrorMessage mb='24px'> {errors.password}</FormErrorMessage>}
            <Flex justifyContent='space-between' align='center' mb='24px'>
              {/* <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Keep me logged in
                </FormLabel>
              </FormControl> */}
              {/* <NavLink to='/auth/forgot-password'>
                <Text
                  color={textColorBrand}
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'>
                  Forgot password?
                </Text>
              </NavLink> */}
            </Flex>
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              onClick={handleSubmit}
              mb='24px'>
              Sign In
            </Button>
          </FormControl>
          {/* <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Not registered yet?
              <NavLink to='/auth/sign-up'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex> */}
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
