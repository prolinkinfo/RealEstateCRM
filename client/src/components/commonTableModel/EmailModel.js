import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { LiaMousePointerSolid } from "react-icons/lia";
import Spinner from "components/spinner/Spinner";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { emailSchema } from "schema";
import { postApi, getApi } from "services/api";
import { fetchEmailTempData } from "../../redux/slices/emailTempSlice";
import UserModel from "components/commonTableModel/UserModel";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import ContactModel from "./ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import MultiPropertyModel from "components/commonTableModel/MultiPropertyModel";
import * as yup from "yup";
import { useParams } from "react-router-dom";

const EmailModel = (props) => {
  const { onClose, isOpen, fetchData } = props;
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoding, setIsLoding] = useState(false);
  const [assignToLeadData, setAssignToLeadData] = useState([]);
  const [assignToContactData, setAssignToContactData] = useState([]);
  const [contactModelOpen, setContactModel] = useState(false);
  const [leadModelOpen, setLeadModel] = useState(false);
  const [propertyModelOpen, setPropertyModelOpen] = useState(false);
  const [assignToProperyData, setAssignToPropertyData] = useState([]);
  const todayTime = new Date()?.toISOString()?.split(".")[0];
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  const initialValues = {
    sender: user?._id,
    recipient: props.lead !== true ? props?.contactEmail : props?.leadEmail,
    subject: "",
    message: "",
    createByContact: props?.id && props?.lead !== true ? props?.id : "",
    createByLead: props?.id && props?.lead === true ? props?.id : "",
    startDate: "",
    property: [id],
    type: "message",
    html: "",
    createBy: user?._id,
    category: "Contact",
  };
  const validationSchema = yup.object({
    sender: yup.string().required("Sender Is required"),
    recipient: yup.string().email().required("Recipient Is required"),
    cc: yup.string().email(),
    bcc: yup.string().email(),
    relatedToContact: yup.string(),
    property: yup.array().required("property is required"),
    relatedToLead: yup.string(),
    subject: yup.string().required("Subject Is required"),
    message: yup.string(),
    startDate: yup.date().required("Start Date Is required"),
    createBy: yup.string(),
    createByLead: yup.string(),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      AddData();
      resetForm();
    },
  });
  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;

  const AddData = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/email/add", values);
      if (response.status === 200) {
        props.onClose();
        fetchData(1);
        // setAction((pre) => !pre)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };
  const fetchRecipientData = async () => {
    if (values?.createByContact) {
      let findEmail = assignToContactData.find(
        (item) => item?._id === values?.createByContact
      );
      if (findEmail) {
        setFieldValue("recipient", findEmail?.email);
      }
    } else if (values?.createByLead) {
      let findEmail = assignToLeadData?.find(
        (item) => item?._id === values?.createByLead
      );
      if (findEmail) {
        setFieldValue("recipient", findEmail?.leadEmail);
      }
    } else {
      setFieldValue("recipient", "");
    }
  };
  useEffect(() => {
    fetchRecipientData();
  }, [values?.createByContact, values?.createByLead]);

  const fetchEmailTemp = async () => {
    setIsLoding(true);
    const result = await dispatch(fetchEmailTempData());
    if (result?.payload?.status === 200) {
      setData(result?.payload?.data);
    } else {
      toast.error("Failed to fetch data", "error");
    }
    setIsLoding(false);
  };

  const getAllApi = async () => {
    values.start = props?.date;
    try {
      let result;
      if (values?.category === "Contact" && assignToContactData?.length <= 0) {
        result = await getApi(
          user?.role === "superAdmin"
            ? "api/contact/"
            : `api/contact/?createBy=${user?._id}`
        );
        setAssignToContactData(result?.data);
      } else if (values?.category === "Lead" && assignToLeadData <= 0) {
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

  const getPropertyData = async () => {
    const propertyOptionData = await getApi(
      user?.role === "superAdmin"
        ? "api/property"
        : `api/property/?createBy=${user?._id}`
    );
    setAssignToPropertyData(propertyOptionData?.data);
  };

  useEffect(() => {
    getPropertyData();
  }, []);

  useEffect(() => {
    getAllApi();
  }, [props, values?.category]);

  useEffect(async () => {
    const propertyOptionData = await getApi(
      user?.role === "superAdmin"
        ? "api/property"
        : `api/property/?createBy=${user?._id}`
    );
    setAssignToPropertyData(propertyOptionData?.data);
  }, []);

  useEffect(() => {
    if (values?.type === "template") fetchEmailTemp();
  }, [values?.type]);

  const getPropertyOptions = assignToProperyData?.map((item) => ({
    ...item,
    value: item?._id,
    label: item?.name,
  }));

  const extractLabels = (selectedItems) => {
    return selectedItems?.map((item) => item?._id);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent height={"580px"}>
        <ModalHeader>Add Email</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY={"auto"} height={"400px"}>
          {/* Contact Model  */}
          <ContactModel
            isOpen={contactModelOpen}
            data={assignToContactData}
            onClose={setContactModel}
            fieldName="createByContact"
            setFieldValue={setFieldValue}
          />
          {/* Lead Model  */}
          <LeadModel
            isOpen={leadModelOpen}
            data={assignToLeadData}
            onClose={setLeadModel}
            fieldName="createByLead"
            setFieldValue={setFieldValue}
          />
          {/* Property Model */}
          <MultiPropertyModel
            onClose={() => setPropertyModelOpen(false)}
            isOpen={propertyModelOpen}
            data={assignToProperyData}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
            fieldName="property"
            setFieldValue={setFieldValue}
            selectedItems={getPropertyOptions?.filter((item) =>
              values?.property?.includes(item?._id)
            )}
          />
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
                  setFieldValue("createByContact", "");
                  setFieldValue("createByLead", "");
                }}
                value={values.category}
              >
                <Stack direction="row">
                  <Radio value="Contact">Contact</Radio>
                  <Radio value="Lead">Lead</Radio>
                </Stack>
              </RadioGroup>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              {values.category === "Contact" ? (
                <>
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
                        value={values.createByContact}
                        name="createByContact"
                        onChange={handleChange}
                        mb={
                          errors.createByContact && touched.createByContact
                            ? undefined
                            : "10px"
                        }
                        fontWeight="500"
                        placeholder={"Assign To"}
                        borderColor={
                          errors.createByContact && touched.createByContact
                            ? "red.300"
                            : null
                        }
                      >
                        {assignToContactData?.map((item) => {
                          return (
                            <option value={item?._id} key={item?._id}>
                              {values.category === "Contact"
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
              ) : values?.category === "Lead" ? (
                <>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
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
                        value={values?.createByLead}
                        name="createByLead"
                        onChange={handleChange}
                        mb={
                          errors?.createByLead && touched?.createByLead
                            ? undefined
                            : "10px"
                        }
                        fontWeight="500"
                        placeholder={"Assign To"}
                        borderColor={
                          errors?.createByLead && touched?.createByLead
                            ? "red.300"
                            : null
                        }
                      >
                        {assignToLeadData?.map((item) => {
                          return (
                            <option value={item?._id} key={item?._id}>
                              {values.category === "Contact"
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
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Recipient<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                disabled
                value={values.recipient}
                name="recipient"
                placeholder="Recipient"
                fontWeight="500"
                borderColor={
                  errors?.recipient && touched?.recipient ? "red.300" : null
                }
              />
              <Text mb="10px" fontSize="sm" color={"red"}>
                {" "}
                {errors?.recipient && touched?.recipient && errors?.recipient}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Flex alignItems={"end"} justifyContent={"space-between"}>
                <Text w={"100%"}>
                  <CUIAutoComplete
                    label={`Property`}
                    items={getPropertyOptions}
                    selectedItems={getPropertyOptions?.filter((item) =>
                      values?.property?.includes(item._id)
                    )}
                    onSelectedItemsChange={(changes) => {
                      const selectProperty = extractLabels(
                        changes.selectedItems
                      );
                      setFieldValue("property", selectProperty);
                    }}
                    value={assignToProperyData?.name || values.property}
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
                <IconButton
                  mb={6}
                  onClick={() => setPropertyModelOpen(true)}
                  fontSize="25px"
                  icon={<LiaMousePointerSolid />}
                />
              </Flex>
              <Text color={"red"}>
                {" "}
                {errors?.attendes && touched?.attendes && errors?.attendes}
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
                Start Date<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                type="datetime-local"
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                min={dayjs(todayTime).format("YYYY-MM-DD HH:mm")}
                value={values.startDate}
                name="startDate"
                fontWeight="500"
                borderColor={
                  errors?.startDate && touched?.startDate ? "red.300" : null
                }
              />
              <Text fontSize="sm" mb="10px" color={"red"}>
                {" "}
                {errors?.startDate && touched?.startDate && errors?.startDate}
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
                Subject<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.subject}
                name="subject"
                placeholder="subject"
                fontWeight="500"
                borderColor={
                  errors?.subject && touched?.subject ? "red.300" : null
                }
              />
              <Text fontSize="sm" mb="10px" color={"red"}>
                {" "}
                {errors?.subject && touched?.subject && errors?.subject}
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
                Message
              </FormLabel>
              <RadioGroup
                onChange={(e) => {
                  setFieldValue("type", e);
                }}
                value={values?.type}
              >
                <Stack direction="row">
                  <Radio value="message">Message</Radio>
                  <Radio value="template">Template</Radio>
                </Stack>
              </RadioGroup>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              {values?.type === "message" ? (
                <>
                  <Textarea
                    resize={"none"}
                    fontSize="sm"
                    placeholder="Enter Message"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.message}
                    name="message"
                    fontWeight="500"
                    borderColor={
                      errors?.message && touched?.message ? "red.300" : null
                    }
                  />
                  <Text fontSize="sm" mb="10px" color={"red"}>
                    {" "}
                    {errors?.message && touched?.message && errors?.message}
                  </Text>
                </>
              ) : (
                <Select
                  name="html"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.html}
                  fontWeight="500"
                  placeholder={"Select Template"}
                >
                  {data?.map((item) => {
                    return (
                      <option value={item?.html} key={item._id}>
                        {item?.templateName}
                      </option>
                    );
                  })}
                </Select>
              )}
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            disabled={isLoding ? true : false}
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
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            size="sm"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EmailModel;
