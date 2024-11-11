import {
  Button,
  Flex,
  FormLabel,
  Box,
  Grid,
  GridItem,
  Input,
  Radio,
  RadioGroup,
  useDisclosure,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Card from "components/card/Card";
import { FaFilePdf, FaSave } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import moment from "moment";
import { postApi, getApi } from "services/api";
import { Tooltip } from "@chakra-ui/react";
import BankDetailsModel from "./BankDetailsModel";

export const BankDetails = (props) => {
  const {
    formik,
    assignToLeadData,
    assignToContactData,
    setSelectedRecord,
    selectedRecord,
  } = props;
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [bankAllDetails, setBankAllDetails] = useState([]);
  const initialLimit = 5;
  const [visibleCount, setVisibleCount] = useState(initialLimit);
  const [bankDetailsModel, setBankDetailsModel] = useState(false);

  const {
    values,
    handleChange,
    setFieldValue,
    handleBlur,
    errors,
    touched,
    isValid,
    dirty,
  } = formik;

  const findLeadName = assignToLeadData?.find(
    (item) => item?._id === values?.lead
  );

  const findContactName = assignToContactData?.find(
    (item) => item?._id === values?.contact
  );

  const downloadRecipient = () => {
    const element = document.getElementById("recipient");
    const hideBtn = document.getElementById("hide-btn");

    if (element) {
      element.style.paddingTop = "50px";
      element.style.display = "block";
      hideBtn.style.display = "none";

      const originalContent = element.innerHTML;
      element.innerHTML += `
      <style>
        table {
          width: 80%;
          border-collapse: collapse;
          margin: auto;
        }
        td {
        padding: 5px 5px 20px 5px;
        border: 1px solid #ccc;
        text-align: left;
        }
        </style>
        <table>
        <tr>
          <td><b>Name:</b></td>
          <td>${findLeadName?.leadName || findContactName?.fullName}</td>
        </tr>
        <tr>
          <td><b>Account Name:</b></td>
          <td>${values?.accountName}</td>
        </tr>
        <tr>
          <td><b>Branch:</b></td>
          <td> ${values?.branch}</td>
        </tr>
        <tr>
          <td><b>Account Number:</b></td>
          <td>${values?.accountNumber}</td>
        </tr>
        <tr>
          <td><b>SwiftCode:</b></td>
          <td> ${values?.swiftCode}</td>
        </tr>
        <tr>
          <td><b>Currency:</b></td>
          <td> ${values?.currency}</td>
        </tr>
        <tr>
          <td><b>Ammount:</b></td>
          <td>${values?.amount}</td>
        </tr>
        </table>
      `;
      html2pdf()
        .from(element)
        .set({
          margin: [0, 0, 0, 0],
          filename: `Bank_Details_${moment().format("DD-MM-YYYY")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save()
        .then(() => {
          element.style.paddingTop = "0px";
          hideBtn.style.display = "";
          element.innerHTML = originalContent;
        });
    } else {
      console.error("Bank Details Not Found");
    }
  };

  const getBankDetails = async () => {
    try {
      const response = await getApi("api/bank-details");
      setBankAllDetails(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBankDetails();
  }, []);

  const saveBankDetails = async (bankDetails) => {
    try {
      await postApi("api/bank-details/add", bankDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRadioChange = (selectedId) => {
    const record = bankAllDetails?.data?.find(
      (item) => item?._id === selectedId
    );
    setSelectedRecord(record);
    if (record) {
      setFieldValue("accountNumber", record?.accountNumber);
      setFieldValue("accountName", record?.accountName);
      setFieldValue("bank", record?.bank);
      setFieldValue("branch", record?.branch);
      setFieldValue("swiftCode", record?.swiftCode);
    }
  };

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={3} mb={3}>
        {bankAllDetails?.data?.length > 0 ? (
          bankAllDetails?.data?.slice(0, visibleCount)?.map((item, index) => (
            <GridItem key={index} colSpan={{ base: 2, sm: 3, md: 4, lg: 2 }}>
              <Card style={{ background: "#F9F9F9" }}>
                <RadioGroup
                  onChange={handleRadioChange}
                  value={selectedRecord?._id}
                >
                  <Box display="flex" alignItems="center">
                    <Radio value={item?._id} mr={2} />
                    <Text fontWeight="bold">{item?.accountName}</Text>
                  </Box>
                </RadioGroup>
                <Tooltip label={item?.accountNumber} hasArrow>
                  <Text style={{ width: "100px" }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {item?.accountNumber?.toString()?.length > 6
                      ? item?.accountNumber?.toString()?.slice(0, 6) + "..."
                      : item?.accountNumber}
                  </Text>
                </Tooltip>
              </Card>
            </GridItem>
          ))
        ) : (
          <Text>{""}</Text>
        )}

        {visibleCount < bankAllDetails?.data?.length && (
          <GridItem
            colSpan={{ base: 2 }}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={() => setBankDetailsModel(true)}
              style={{
                padding: "25px 20px",
                backgroundColor: "#F9F9F9",
                borderRadius: "15px",
                marginTop: "20px",
              }}
            >
              View More
            </Button>
          </GridItem>
        )}
      </Grid>

      <Grid templateColumns="repeat(12, 1fr)" gap={3}>
        <GridItem colSpan={{ base: 6 }}>
          <Text id="recipient"></Text>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            mb="8px"
          >
            Account Name
            <Text color={"red"}>*</Text>
          </FormLabel>
          <Input
            fontSize="sm"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.accountName}
            id="accountName"
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
            onBlur={handleBlur}
            name="bank"
            placeholder="Enter Bank"
            fontWeight="500"
            borderColor={errors?.bank && touched?.bank ? "red.300" : null}
          />
          <Text mb="10px" color={"red"} fontSize="sm">
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
            onBlur={handleBlur}
            value={values?.branch}
            name="branch"
            placeholder="Enter Branch"
            fontWeight="500"
            borderColor={errors?.branch && touched?.branch ? "red.300" : null}
          />
          <Text mb="10px" color={"red"} fontSize="sm">
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
            onBlur={handleBlur}
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
            onBlur={handleBlur}
            value={values?.swiftCode}
            name="swiftCode"
            placeholder="Enter swift Code"
            fontWeight="500"
            borderColor={
              errors?.swiftCode && touched?.swiftCode ? "red.300" : null
            }
          />
          <Text mb="10px" color={"red"} fontSize="sm">
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
            onChange={(e) => {
              setFieldValue("currency", e);
            }}
            onBlur={handleBlur}
            value={values?.currency}
          >
            <Stack direction="row">
              <Radio value="ksh">KSH</Radio>
              <Radio value="usd">USD</Radio>
            </Stack>
          </RadioGroup>
        </GridItem>

        <GridItem colSpan={{ base: 12 }}>
          <Flex justifyContent={"space-between"}>
            <Input
              fontSize="sm"
              name="amount"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter amount"
              value={values?.amount}
              borderColor={errors?.amount && touched?.amount ? "red.300" : null}
            />
          </Flex>
          <Text mb="10px" color={"red"} fontSize="sm">
            {errors?.amount && touched?.amount && errors?.amount}
          </Text>
        </GridItem>
        <GridItem
          colSpan={{ base: 6 }}
          display={"flex"}
          justifyContent={"flex-start"}
        >
          {" "}
          <Button
            onClick={() => downloadRecipient()}
            size="sm"
            id="hide-btn"
            variant="outline"
            colorScheme="brand"
            disabled={!isValid || !dirty}
            leftIcon={<FaFilePdf />}
          >
            Download Recipient
          </Button>
        </GridItem>
        <GridItem
          colSpan={{ base: 6 }}
          display={"flex"}
          justifyContent={"flex-end"}
        >
          <Button
            onClick={() => saveBankDetails(values)}
            size="sm"
            id="hide-btn"
            variant="outline"
            disabled={!isValid || !dirty}
            colorScheme="brand"
            leftIcon={<FaSave />}
          >
            Save Bank Details
          </Button>
        </GridItem>
        <BankDetailsModel
          isOpen={bankDetailsModel}
          onClose={() => setBankDetailsModel(false)}
          bankAllDetails={bankAllDetails}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          setFieldValue={setFieldValue}
        />
      </Grid>
    </>
  );
};
