import {
  Button,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  ModalFooter,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const BankDetails = (props) => {
  const { formik } = props;

  const { values, handleChange, handleSubmit, setFieldValue, errors, touched } = formik;

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={3}>
        <GridItem colSpan={{ base: 6 }}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            mb="8px"
          >
            Account Name<Text color={"red"}>*</Text>
          </FormLabel>
          <Input
            fontSize="sm"
            onChange={handleChange}
            value={values?.accountName}
            name="accountName"
            placeholder="Enter Account Name"
            fontWeight="500"
            borderColor={
              errors?.accountName && touched?.accountName ? "red.300" : null
            }
          />
          <Text mb="10px" color={"red"} fontSize="sm">
            {" "}
            {errors?.accountName && touched?.accountName && errors?.accountName}
          </Text>
        </GridItem>
        <GridItem colSpan={{ base: 6 }}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            mb="8px"
          >
            Bank<Text color={"red"}>*</Text>
          </FormLabel>
          <Input
            fontSize="sm"
            onChange={handleChange}
            value={values?.bank}
            name="bank"
            placeholder="Enter Bank"
            fontWeight="500"
            borderColor={errors?.bank && touched?.bank ? "red.300" : null}
          />
          <Text mb="10px" color={"red"} fontSize="sm">
            {" "}
            {errors?.bank && touched?.bank && errors?.bank}
          </Text>
        </GridItem>
        <GridItem colSpan={{ base: 6 }}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            mb="8px"
          >
            Branch<Text color={"red"}>*</Text>
          </FormLabel>
          <Input
            fontSize="sm"
            onChange={handleChange}
            value={values?.branch}
            name="branch"
            placeholder="Enter Branch"
            fontWeight="500"
            borderColor={errors?.branch && touched?.branch ? "red.300" : null}
          />
          <Text mb="10px" color={"red"} fontSize="sm">
            {" "}
            {errors?.branch && touched?.branch && errors?.branch}
          </Text>
        </GridItem>
        <GridItem colSpan={{ base: 6 }}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            mb="8px"
          >
            Account Number<Text color={"red"}>*</Text>
          </FormLabel>
          <Input
            fontSize="sm"
            onChange={handleChange}
            value={values?.accountNumber}
            name="accountNumber"
            placeholder="Enter Account Number"
            fontWeight="500"
            borderColor={
              errors?.accountNumber && touched?.accountNumber ? "red.300" : null
            }
          />
          <Text mb="10px" color={"red"} fontSize="sm">
            {" "}
            {errors?.accountNumber &&
              touched?.accountNumber &&
              errors?.accountNumber}
          </Text>
        </GridItem>
        <GridItem colSpan={{ base: 12 }}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            mb="8px"
          >
            Swift Code<Text color={"red"}>*</Text>
          </FormLabel>
          <Input
            fontSize="sm"
            onChange={handleChange}
            value={values?.swiftCode}
            name="swiftCode"
            placeholder="Enter swiftCode"
            fontWeight="500"
            borderColor={
              errors?.swiftCode && touched?.swiftCode ? "red.300" : null
            }
          />
          <Text mb="10px" color={"red"} fontSize="sm">
            {" "}
            {errors?.swiftCode && touched?.swiftCode && errors?.swiftCode}
          </Text>
        </GridItem>

        <GridItem colSpan={{ base: 12 }}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            mb="8px"
          >
            Currency<Text color={"red"}>*</Text>
          </FormLabel>
          <RadioGroup
            defaultValue="ksh"
            onChange={(e) => {
              setFieldValue("currency", e);
              setFieldValue("ksh", "");
              setFieldValue("usd", "");
            }}
            value={values?.currency || "ksh"}
          >
            <Stack direction="row">
              <Radio value="ksh" defaultValue={"ksh"}>
                KSH
              </Radio>
              <Radio value="usd">USD</Radio>
            </Stack>
          </RadioGroup>
        </GridItem>

        <GridItem colSpan={{ base: 12 }}>
          <Flex justifyContent={"space-between"}>
            <Input
              fontSize="sm"
              name="currency"
              onChange={handleChange}
              value={values?.currency}
              borderColor={
                errors?.currency && touched?.currency ? "red.300" : null
              }
            />
          </Flex>
          <Text mb="10px" color={"red"} fontSize="sm">
            {" "}
            {errors?.currency && touched?.currency && errors?.currency}
          </Text>
        </GridItem>
      </Grid>
    </>
  );
};
