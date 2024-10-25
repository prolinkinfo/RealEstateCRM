import {
  Flex,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { getApi } from "services/api";
import * as yup from "yup";
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import { LiaMousePointerSolid } from "react-icons/lia";

export const FirstStepper = (props) => {
  const { formik } = props;

  const [assignToLeadData, setAssignToLeadData] = useState([]);
  const [assignToContactData, setAssignToContactData] = useState([]);
  const [contactModelOpen, setContactModel] = useState(false);
  const [leadModelOpen, setLeadModel] = useState(false);

  const { isOpen, onClose } = useDisclosure();
  console.log(isOpen, onClose, "ooooo");
  
  const { values, handleChange, handleSubmit, setFieldValue, errors, touched } =
    formik;
  console.log(values, "vv");

  const user = JSON.parse(localStorage.getItem("user"));

  const getAllAPi = async () => {
    try {
      let result;
      if (values?.category === "contact" && assignToContactData?.length <= 0) {
        result = await getApi(
          user?.role === "superAdmin"
            ? "api/contact/"
            : `api/contact/?createBy=${user?._id}`
        );
        setAssignToContactData(result?.data);
      } else if (values?.category === "lead" && assignToLeadData <= 0) {
        result = await getApi(
          user?.role === "superAdmin"
            ? "api/lead/"
            : `api/lead/?createBy=${user?._id}`
        );
        setAssignToLeadData(result?.data);
      }
      // else if (
      //   (values?.category === "property" && console.log(""),
      //   assignToProperyData.length <= 0)
      // ) {
      //   result = await getApi(
      //     user?.role === "superAdmin"
      //       ? "api/property"
      //       : `api/property/?createBy=${user?._id}`
      //   );
      //   setAssignToPropertyData(result?.data);
      // }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => {
    getAllAPi();
  }, [values?.category]);

  {
    /* Contact Model  */
  }
  <ContactModel
    isOpen={contactModelOpen}
    data={assignToContactData}
    onClose={setContactModel}
    fieldName="contact"
    setFieldValue={setFieldValue}
  />;
  {
    console.log(isOpen, "isOpen");
  }
  {
    console.log(onClose, "onClose");
  }

  {
    /* Lead Model  */
  }
  <LeadModel
    isOpen={leadModelOpen}
    data={assignToLeadData}
    onClose={setLeadModel}
    fieldName="lead"
    setFieldValue={setFieldValue}
  />;
  return (
    <>
      <div className="contact-info-form">
        {/* <h3>Contact Info</h3> */}
        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              mb="8px"
            >
              Related
            </FormLabel>
            <RadioGroup
              onChange={(e) => {
                setFieldValue("category", e);
                setFieldValue("contact", "");
                setFieldValue("lead", "");
              }}
              value={values.category || "lead"}
              defaultValue="lead"
            >
              <Stack direction="row" defaultValue={"lead"}>
                <Radio value="contact">Contact</Radio>
                <Radio value="lead">Lead</Radio>
              </Stack>
            </RadioGroup>
          </GridItem>
          <GridItem colSpan={{ base: 12 }}>
            {values?.category === "contact" ? (
              <>
                {console.log("11")}
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Recipient (Contact)
                  </FormLabel>
                  <Flex justifyContent={"space-between"}>
                    <Select
                      value={values?.contact}
                      name="contact"
                      onChange={handleChange}
                      mb={
                        errors.contact && touched.contact ? undefined : "10px"
                      }
                      fontWeight="500"
                      placeholder={"Assign To"}
                      borderColor={
                        errors.contact && touched.contact ? "red.300" : null
                      }
                    >
                      {assignToContactData?.map((item) => {
                        return (
                          <option value={item?._id} key={item?._id}>
                            {values?.category === "contact"
                              ? `${item?.fullName}`
                              : item?.leadName}
                          </option>
                        );
                      })}
                    </Select>
                    <IconButton
                      onClick={() => setContactModel(true)}
                      ml={2}
                      fontSize="25px"
                      icon={<LiaMousePointerSolid />}
                    />
                  </Flex>
                </GridItem>
              </>
            ) : values?.category === "lead" ? (
              <>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  {console.log("22")}

                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Recipient (Lead)
                  </FormLabel>
                  <Flex justifyContent={"space-between"}>
                    <Select
                      value={values?.lead}
                      name="lead"
                      onChange={handleChange}
                      mb={errors?.lead && touched?.lead ? undefined : "10px"}
                      fontWeight="500"
                      placeholder={"Assign To"}
                      borderColor={
                        errors?.lead && touched?.lead ? "red.300" : null
                      }
                    >
                      {assignToLeadData?.map((item) => {
                        return (
                          <option value={item?._id} key={item?._id}>
                            {values?.category === "contact"
                              ? `${item?.firstName} ${item?.lastName}`
                              : item?.leadName}
                          </option>
                        );
                      })}
                    </Select>
                    <IconButton
                      onClick={() => setLeadModel(true)}
                      ml={2}
                      fontSize="25px"
                      icon={<LiaMousePointerSolid />}
                    />
                  </Flex>
                </GridItem>
              </>
            ) : (
              ""
            )}
          </GridItem>
        </Grid>
      </div>
    </>
  );
};
