import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";

const PaymentSchedule = (props) => {
  const { formik } = props;
  const { values, handleChange, setFieldValue, handleBlur, errors, touched } =
    formik;
  console.log(errors?.installments);

  const handleRemoveItem = (index) => {
    setFieldValue(
      "installments",
      values?.installments?.filter((item, i) => i !== index)
    );
  };

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      {/* { values?.installments?.[i]} */}
      <GridItem colSpan={{ base: 12 }}>
        <Box>
          <Table variant="simple" size="sm" mt={5} backgroundColor="#fff">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>No</Th>
                <Th>Start Date</Th>
                <Th>percentage (%)</Th>
                <Th>Months</Th>
                <Th>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {values?.installments?.map((item, i) => (
                <Tr>
                  <Td className="text-center">
                    {values?.installments?.length !== 1 && (
                      <IconButton
                        icon={<CloseIcon />}
                        onClick={() => handleRemoveItem(i)}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        style={{ fontSize: "10px" }}
                      />
                    )}
                  </Td>
                  <Td>{i + 1}</Td>
                  <Td>
                    <Input
                      type="date"
                      fontSize="sm"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={dayjs().format("YYYY-MM-DD")}
                      name={`installments.[${i}].startDate`}
                      value={
                        values?.installments?.[i]?.startDate &&
                        dayjs(values?.installments?.[i]?.startDate).format(
                          "YYYY-MM-DD"
                        )
                      }
                      fontWeight="500"
                      borderColor={
                        errors?.installments?.[i]?.startDate &&
                        touched?.installments?.[i]?.startDate
                          ? "red.300"
                          : null
                      }
                    />
                    <Text mb="10px" color={"red"}>
                      {errors?.installments?.[i]?.startDate &&
                        touched?.installments?.[i]?.startDate &&
                        errors?.installments?.[i]?.startDate}
                    </Text>
                  </Td>
                  <Td>
                    <Input
                      fontSize="sm"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.installments?.[i]?.per}
                      name={`installments.[${i}].per`}
                      placeholder="(%)"
                      fontWeight="500"
                      type="number"
                      max={100}
                      borderColor={
                        errors?.installments?.[i]?.per &&
                        touched?.installments?.[i]?.per
                          ? "red.300"
                          : null
                      }
                    />
                    <Text mb="10px" color={"red"}>
                      {errors?.installments?.[i]?.per &&
                        touched?.installments?.[i]?.per &&
                        errors?.installments?.[i]?.per}
                    </Text>
                  </Td>
                  <Td>{i}</Td>
                  <Td>
                    <Input
                      fontSize="sm"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.installments?.[i]?.total}
                      name={`installments.[${i}].total`}
                      placeholder="Total"
                      fontWeight="500"
                      borderColor={
                        errors?.installments?.[i]?.total &&
                        touched?.installments?.[i]?.total
                          ? "red.300"
                          : null
                      }
                    />
                    <Text mb="10px" color={"red"}>
                      {errors?.installments?.[i]?.total &&
                        touched?.installments?.[i]?.total &&
                        errors?.installments?.[i]?.total}
                    </Text>
                  </Td>
                </Tr>
              ))}
              <Tr>
                <Td>
                  <IconButton
                    icon={<AddIcon />}
                    onClick={() =>
                      setFieldValue("installments", [
                        ...values?.installments,
                        {
                          no: values?.installments?.length + 1,
                          startDate: "",
                          per: "",
                          months: "",
                          Total: "",
                        },
                      ])
                    }
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                    style={{ fontSize: "10px" }}
                  />
                </Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </GridItem>
      {/* <GridItem colSpan={{ base: 12 }}>
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
                    onBlur={handleBlur}
                    value={values?.accountName}
                    name="accountName"
                    placeholder="Enter Account Name"
                    fontWeight="500"
                    borderColor={
                        errors?.accountName && touched?.accountName ? "red.300" : null
                    }
                />
                <Text mb="10px" color={"red"} fontSize="sm">
                    {errors?.accountName && touched?.accountName && errors?.accountName}
                </Text>
            </GridItem> */}
    </Grid>
  );
};

export default PaymentSchedule;
