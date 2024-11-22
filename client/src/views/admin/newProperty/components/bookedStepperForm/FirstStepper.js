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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import ContactModel from "components/commonTableModel/ContactModel.js";
import LeadModel from "components/commonTableModel/LeadModel";
import { useEffect, useState } from "react";
import { LiaMousePointerSolid } from "react-icons/lia";
import { getApi } from "services/api";
import ImageUpload from "./ImageUpload";

export const FirstStepper = (props) => {
  const {
    formik,
    assignToLeadData,
    setAssignToLeadData,
    assignToContactData,
    setAssignToContactData,
  } = props;
  const [selectedFile, setSelectedFile] = useState({});

  const [contactModel, setContactModel] = useState(false);
  const [leadModel, setLeadModel] = useState(false);
  const brandColor = useColorModeValue("brand.500", "white");

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    errors,
    touched,
  } = formik;

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
    const file = event?.target?.files[0];
    const fieldName = event?.target?.name;
    if (file) {
      setFieldValue(fieldName, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({ ...selectedFile, [fieldName]: reader?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(async () => {
    getAllAPi();
  }, [values?.category]);

  return (
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
      <Grid templateColumns="repeat(12, 1fr)" gap={3} onSubmit={handleSubmit}>
        <GridItem colSpan={{ base: 12 }}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            mb="8px"
          >
            Related <Text color={"red"}>*</Text>
          </FormLabel>
          <RadioGroup
            onChange={(e) => {
              setFieldValue("category", e);
              setFieldValue("contact", "");
              // setFieldValue("lead", "");
            }}
            onBlur={handleBlur}
            value={values.category || "contact"}
            defaultValue="contact"
          >
            <Stack direction="row" defaultValue={"lead"}>
              <Radio value="contact">Contact</Radio>
              {/* <Radio value="lead">Lead</Radio> */}
            </Stack>
          </RadioGroup>
        </GridItem>
        {/* {values?.category === "contact" ? ( */}
        <GridItem colSpan={{ base: 12 }}>
          <Flex justifyContent={"space-between"}>
            <Select
              value={values?.contact}
              onBlur={handleBlur}
              name="contact"
              onChange={handleChange}
              mb={errors?.contact && touched?.contact ? undefined : "10px"}
              fontWeight="500"
              placeholder={"Assign To Contact"}
              borderColor={
                errors?.contact && touched?.contact ? "red.300" : null
              }
            >
              {assignToContactData?.map((item) => {
                return (
                  <option value={item?._id} key={item?._id}>
                    {item?.fullName}
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
          <Text mb="10px" fontSize="sm" color={"red"}>
            {touched?.contact && errors?.contact && errors?.contact}
          </Text>
        </GridItem>
        {/* ) : values?.category === "lead" ? (
          <GridItem colSpan={{ base: 12 }}>
            <Flex justifyContent={"space-between"}>
              <Select
                value={values?.lead}
                onBlur={handleBlur}
                name="lead"
                onChange={handleChange}
                mb={errors?.lead && touched?.lead ? undefined : "10px"}
                fontWeight="500"
                placeholder={"Assign To Lead"}
                borderColor={errors?.lead && touched?.lead ? "red.300" : null}
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
            <Text mb="10px" fontSize="sm" color={"red"}>
              {touched?.lead && errors?.lead && errors?.lead}
            </Text>
          </GridItem>
        ) : (
          ""
        )} */}
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <ImageUpload
            value={values?.salesManagerSign}
            name="salesManagerSign"
            selectedFile={selectedFile?.salesManagerSign}
            handleFileChange={handleFileChange}
            brandColor={brandColor}
            placeHolder="Upload Signature"
            label="Sales Manager"
            id="salesManagerSign"
          />
        </GridItem>
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <ImageUpload
            value={values?.buyerImage}
            name="buyerImage"
            selectedFile={selectedFile?.buyerImage}
            handleFileChange={handleFileChange}
            brandColor={brandColor}
            placeHolder="Upload Signature"
            label="Buyer"
            id="buyerImage"
          />
        </GridItem>
      </Grid>
    </div>
  );
};
