import {
  Flex,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Radio,
  RadioGroup,
  Select,
  Input,
  Stack,
  useDisclosure,
  Button,
  Box,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { MdUpload } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { getApi } from "services/api";
import * as yup from "yup";
import ContactModel from "components/commonTableModel/ContactModel.js";
import LeadModel from "components/commonTableModel/LeadModel";
import MultiLeadModel from "components/commonTableModel/MultiLeadModel";

import { LiaMousePointerSolid } from "react-icons/lia";
import Card from "components/card/Card";
import ProfileCard from "./image upload";

export const FirstStepper = (props) => {
  const { formik } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [secondSelectedFile, setSecondSelectedFile] = useState(null);
  const [assignToLeadData, setAssignToLeadData] = useState([]);
  const [assignToContactData, setAssignToContactData] = useState([]);
  const [contactModel, setContactModel] = useState(false);
  const [leadModel, setLeadModel] = useState(false);
  const brandColor = useColorModeValue("brand.500", "white");

  const { values, handleChange, handleSubmit, setFieldValue, errors, touched } =
    formik;

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
    } catch (e) {
      console.log(e);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result); // Set the selected file as a data URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };
  const handleSecondFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSecondSelectedFile(reader.result); // Set the selected file as a data URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };
  useEffect(async () => {
    getAllAPi();
  }, [values?.category]);

  return (
    <>
      <div className="contact-info-form">
        <ContactModel
          isOpen={contactModel}
          data={assignToContactData}
          onClose={setContactModel}
          fieldName="contact"
          setFieldValue={setFieldValue}
        />
        <LeadModel
          isOpen={leadModel}
          data={assignToLeadData}
          onClose={setLeadModel}
          fieldName="lead"
          setFieldValue={setFieldValue}
        />
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
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <Flex justifyContent={"space-between"}>
                    <Select
                      value={values?.contact}
                      name="contact"
                      onChange={handleChange}
                      mb={
                        errors.contact && touched.contact ? undefined : "10px"
                      }
                      fontWeight="500"
                      placeholder={"Assign To Contact"}
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
                  <Flex justifyContent={"space-between"}>
                    <Select
                      value={values?.lead}
                      name="lead"
                      onChange={handleChange}
                      mb={errors?.lead && touched?.lead ? undefined : "10px"}
                      fontWeight="500"
                      placeholder={"Assign To Lead"}
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
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <ProfileCard
              selectedFile={selectedFile} // State variable to hold the uploaded file
              handleFileChange={handleFileChange}
              setFieldValue={setFieldValue} // Function to update the state
              brandColor={brandColor} // Replace with your brand color
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <ProfileCard
              selectedFile={secondSelectedFile} // State variable to hold the uploaded file
              handleFileChange={handleSecondFileChange}
              setFieldValue={setFieldValue} // Function to update the state
              brandColor={brandColor} // Replace with your brand color
            />
          </GridItem>
        </Grid>
      </div>
    </>
  );
};
