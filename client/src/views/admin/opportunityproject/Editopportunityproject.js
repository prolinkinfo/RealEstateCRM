import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import ContactModel from "components/commonTableModel/ContactModel";
import { toast } from "react-toastify";
import { putApi } from "services/api";
import { postApi } from "services/api";
import * as yup from "yup";
import { LiaMousePointerSolid } from "react-icons/lia";
import { getApi } from "services/api";
import { useSelector } from "react-redux";
import { HasAccess } from "../../../redux/accessUtils";
import MultiPropertyModel from "components/commonTableModel/MultiPropertyModel";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import MultiLeadModel from "components/commonTableModel/MultiLeadModel";

const Editopportunityproject = (props) => {
  const {
    onClose,
    isOpen,
    view,
    setAction,
    data,
    userAction,
    userData,
    selectedId,
    fetchData,
    setUserAction,
  } = props;

  const [isLoding, setIsLoding] = useState(false);
  const [assignToLeadData, setAssignToLeadData] = useState([]);
  const [assignToContactData, setAssignToContactData] = useState([]);
  const [contactModelOpen, setContactModel] = useState(false);
  const [propertyModelOpen, setPropertyModelOpen] = useState(false);
  const [assignToProperyData, setAssignToPropertyData] = useState([]);
  const [leadModelOpen, setLeadModel] = useState(false);
  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    requirement: yup.string().required("Requirement is required"),
    property: yup.array().required("Property is required"),
    category: yup.string(),
  });

  const user = JSON.parse(window.localStorage.getItem("user"));

  const formik = useFormik({
    initialValues: {
      name: userAction === "add" ? "" : data?.name || "",
      requirement: userAction === "add" ? "" : data?.requirement || "",
      category: userAction === "add" ? "None" : data?.category || "None",
      contact: userAction === "add" ? "" : data?.contact || "",
      lead: userAction === "add" ? "" : data?.lead || "",
      property: userAction === "add" ? "" : data?.property,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      AddData(values);
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = formik;

  const contactData = useSelector((state) => state?.contactData?.data);
  const leadData = useSelector((state) => state?.leadData?.data);

  const getAllApi = async () => {
    values.start = props?.date;
    if (view === true) {
      if (values?.category === "Contact" && assignToContactData?.length <= 0) {
        setAssignToContactData(contactData);
      } else if (values?.category === "Lead" && assignToLeadData?.length <= 0) {
        setAssignToLeadData(leadData);
      }
    } else {
      try {
        let result;
        if (
          values?.category === "Contact" &&
          assignToContactData?.length <= 0
        ) {
          result = await getApi(
            user?.role === "superAdmin"
              ? "api/contact/"
              : `api/contact/?createBy=${user._id}`,
          );
          setAssignToContactData(result?.data);
        } else if (
          values?.category === "Lead" &&
          assignToLeadData?.length <= 0
        ) {
          result = await getApi(
            user?.role === "superAdmin"
              ? "api/lead/"
              : `api/lead/?createBy=${user?._id}`,
          );
          setAssignToLeadData(result?.data);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const propertyApiGet = async () => {
    const propertyOptionData = await getApi(
      user?.role === "superAdmin"
        ? "api/property"
        : `api/property/?createBy=${user?._id}`,
    );
    setAssignToPropertyData(propertyOptionData?.data);
  };

  useEffect(async () => {
    getAllApi();
  }, [props, values?.category]);

  useEffect(() => {
    propertyApiGet();
  }, []);

  const AddData = async () => {
    if (userAction === "add") {
      try {
        setIsLoding(true);

        let response = await postApi("api/opportunityproject/add", values);
        if (response && response?.status === 200) {
          onClose();
          resetForm();
          setAction((pre) => !pre);
          setUserAction("");
        } else {
          toast.error(response?.response?.data?.message);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoding(false);
      }
    } else if (userAction === "edit") {
      try {
        setIsLoding(true);
        let response = await putApi(
          `api/opportunityproject/edit/${selectedId}`,
          values,
        );
        if (response && response?.status === 200) {
          fetchData();
          let updatedUserData = userData; // Create a copy of userData
          if (user?._id === selectedId) {
            if (updatedUserData && typeof updatedUserData === "object") {
              updatedUserData = {
                ...updatedUserData,
                Name: values?.name,
                Requirement: values?.requirement,
              };
            }
            const updatedDataString = JSON.stringify(updatedUserData);
            localStorage.setItem("user", updatedDataString);
          }
          onClose();
          setAction((pre) => !pre);
          setUserAction("");
        } else {
          toast.error(response?.response?.data?.message);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoding(false);
      }
    }
  };
  const [leadAccess, contactAccess] = HasAccess(["Leads", "Contacts"]);
  const setValueProperty = assignToProperyData?.map((item) => ({
    ...item,
    value: item?._id,
    label: item?.name,
  }));

  const extractLabels = (selectedItems) => {
    return selectedItems?.map((item) => item?._id);
  };

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="space-between" display="flex">
          {userAction === "add"
            ? "Add Opportunity Project"
            : "Edit Opportunity Project"}
          <IconButton onClick={onClose} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          {/* Contact Model*/}
          <ContactModel
            isOpen={contactModelOpen}
            data={assignToContactData}
            onClose={setContactModel}
            values={values}
            fieldName="contact"
            setFieldValue={setFieldValue}
          />
          {/* Lead Model  */}
          <MultiLeadModel
            isOpen={leadModelOpen}
            data={assignToLeadData}
            onClose={setLeadModel}
            values={values}
            fieldName="lead"
            setFieldValue={setFieldValue}
          />
          {/* property model */}
          <MultiPropertyModel
            onClose={() => setPropertyModelOpen(false)}
            isOpen={propertyModelOpen}
            data={assignToProperyData}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
            fieldName="property"
            setFieldValue={setFieldValue}
            selectedItems={setValueProperty?.filter((item) =>
              values?.property?.includes(item._id),
            )}
          />

          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Name<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.name}
                name="name"
                placeholder="Name"
                fontWeight="500"
                borderColor={errors?.name && touched?.name ? "red.300" : null}
                error={formik?.touched?.name && Boolean(formik?.errors?.name)}
                helperText={formik?.touched?.name && formik?.errors?.name}
              />
              <Text mb="10px" color={"red"}>
                {errors?.name && touched?.name && errors?.name}
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
                Requirement<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.requirement}
                name="requirement"
                placeholder="Requirement"
                fontWeight="500"
                borderColor={
                  errors?.requirement && touched?.requirement ? "red.300" : null
                }
                error={
                  formik?.touched?.requirement &&
                  Boolean(formik?.errors?.requirement)
                }
                helperText={
                  formik?.touched?.requirement && formik?.errors?.requirement
                }
              />
              <Text mb="10px" color={"red"}>
                {errors?.requirement &&
                  touched?.requirement &&
                  errors?.requirement}
              </Text>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 12 }}>
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
                  setFieldValue("contact", null);
                  setFieldValue("lead", null);
                }}
                value={values?.category}
              >
                <Stack direction="row">
                  <Radio value="None">None</Radio>
                  <>
                    {(user?.role === "superAdmin" || contactAccess?.create) && (
                      <Radio value="Contact">Contact</Radio>
                    )}
                    {(user?.role === "superAdmin" || leadAccess?.create) && (
                      <Radio value="Lead">Lead</Radio>
                    )}
                  </>
                </Stack>
              </RadioGroup>
              <Text mb="10px" color={"red"}>
                {" "}
                {errors?.category && touched?.category && errors?.category}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 12 }}>
              {values?.category === "Contact" ? (
                <>
                  <GridItem colSpan={{ base: 12, md: 12 }}>
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Assign To Contact
                    </FormLabel>
                    <Flex>
                      <Select
                        value={values?.contact}
                        name="contact"
                        onChange={handleChange}
                        mb={
                          errors?.contact && touched?.contact
                            ? undefined
                            : "10px"
                        }
                        fontWeight="500"
                        placeholder={"Assign To"}
                        borderColor={
                          errors?.contact && touched?.contact ? "red.300" : null
                        }
                        helperText={
                          formik?.touched?.contact && formik?.errors?.contact
                        }
                      >
                        {assignToContactData?.map((item) => {
                          return (
                            <option value={item?._id} key={item?._id}>
                              {values?.category === "Contact"
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
                    <Text mb="10px" color={"red"}>
                      {" "}
                      {errors?.contact && touched?.contact && errors?.contact}
                    </Text>
                  </GridItem>
                </>
              ) : values?.category === "Lead" ? (
                <>
                  <GridItem colSpan={{ base: 12, md: 12 }}>
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Assign To Lead
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
                        helperText={
                          formik?.touched?.lead && formik?.errors?.lead
                        }
                      >
                        ?
                        {assignToLeadData?.map((item) => {
                          return (
                            <option value={item?._id} key={item?._id}>
                              {item?.leadName}
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
                    <Text mb="10px" color={"red"}>
                      {" "}
                      {errors?.lead && touched?.lead && errors?.lead}
                    </Text>
                  </GridItem>
                </>
              ) : (
                ""
              )}
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Flex alignItems={"end"} justifyContent={"space-between"}>
                <Text w={"100%"}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    style={{ marginBottom: "-15px" }}
                  >
                    Property<Text color={"red"}>*</Text>
                  </FormLabel>
                  <CUIAutoComplete
                    items={setValueProperty}
                    selectedItems={setValueProperty?.filter((item) =>
                      values?.property?.includes(item?._id),
                    )}
                    onSelectedItemsChange={(changes) => {
                      const selectProperty = extractLabels(
                        changes?.selectedItems,
                      );
                      setFieldValue("property", selectProperty);
                    }}
                    value={values?.property}
                    name="property"
                    onChange={handleChange}
                    mb={
                      errors?.property && touched?.property ? undefined : "10px"
                    }
                    fontWeight="500"
                    placeholder={"Assign To Property"}
                    borderColor={
                      errors?.property && touched?.property ? "red.300" : null
                    }
                  />
                </Text>
                <Text mb="10px" color={"red"}></Text>
                <IconButton
                  mb={6}
                  onClick={() => setPropertyModelOpen(true)}
                  fontSize="25px"
                  icon={<LiaMousePointerSolid />}
                />
              </Flex>
              <Text mb="10px" color={"red"} style={{ marginTop: "-23px" }}>
                {" "}
                {errors?.property && touched?.property && errors?.property}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            disabled={isLoding ? true : false}
            variant="brand"
            type="submit"
            onClick={handleSubmit}
          >
            {isLoding ? <Spinner /> : "Save"}
          </Button>

          <Button
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Editopportunityproject;
