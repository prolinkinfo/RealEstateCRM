import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Select,
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

  const handleRemoveItem = (index) => {
    setFieldValue(
      "installments",
      values?.installments?.filter((item, i) => i !== index)
    );
  };
  
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      <GridItem colSpan={{ base: 12 }}>
        <Box>
          <Table variant="simple" size="sm" mt={5} backgroundColor="#fff">
            <Thead borderBottom="1px solid #c4c9cf">
              <Tr>
                <Th></Th>
                <Th>title</Th>
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
                  <Td>
                    {/* <Select
                      value={values?.installments?.[i]?.title}
                      name={`installments.[${i}].title`}
                      onChange={handleChange}
                      mb={
                        errors?.installments?.[i]?.title &&
                          touched?.installments?.[i]?.title
                          ? undefined
                          : "10px"
                      }
                      fontWeight="500"
                      placeholder={"Title"}
                      borderColor={
                        errors?.installments?.[i]?.title &&
                          touched?.installments?.[i]?.title
                          ? "red.300"
                          : null
                      }
                    >
                      {[
                        "Furnishing Amount",
                        "Agreement Amount",
                        "Down Payment",
                        "Loan Amount",
                        "Registration",
                        "Service Tax",
                        "Stamp Duty",
                        "VAT",
                        "Legal Charges",
                        "Society Charges",
                        "Maintenance Charges",
                      ]?.map((item) => {
                        return (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        );
                      })}
                    </Select> */}
                    <Input
                      fontSize="sm"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.installments?.[i]?.title}
                      name={`installments.[${i}].title`}
                      placeholder="Title"
                      fontWeight="500"
                      max={100}
                      borderColor={
                        errors?.installments?.[i]?.title &&
                        touched?.installments?.[i]?.title
                          ? "red.300"
                          : null
                      }
                    />
                    <Text mb="10px" color={"red"}>
                      {errors?.installments?.[i]?.title &&
                        touched?.installments?.[i]?.title &&
                        errors?.installments?.[i]?.title}
                    </Text>
                  </Td>
                  <Td>
                    <Input
                      type="date"
                      fontSize="sm"
                      onChange={(e) => {
                        const currentDate = dayjs();
                        const targetDate = dayjs(e?.target?.value);

                        const months = targetDate.diff(currentDate, "month");
                        const days = targetDate.diff(
                          currentDate.add(months, "month"),
                          "day"
                        );

                        let result = "";
                        if (months > 0)
                          result += `${months} month${months > 1 ? "s" : ""}, `;
                        result += `${days} day${days > 1 ? "s" : ""}`;

                        setFieldValue(`installments.[${i}].months`, result);
                        handleChange(e);
                      }}
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
                  <Td>{values?.installments?.[i]?.months || "-"}</Td>
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
                          title: "",
                          startDate: "",
                          per: "",
                          months: "",
                          total: "",
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
