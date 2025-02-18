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
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Box,
  Stack,
  Text,
  FormControl,
  Textarea,
} from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import MultiContactModel from "components/commonTableModel/MultiContactModel";
import MultiLeadModel from "components/commonTableModel/MultiLeadModel";
import Spinner from "components/spinner/Spinner";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { LiaMousePointerSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MeetingSchema } from "schema";
import { getApi, postApi } from "services/api";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
const AddMeeting = (props) => {
  const { onClose, isOpen, setAction, from, fetchData, view, leadName } = props;

  const [leaddata, setLeadData] = useState([]);
  const [contactdata, setContactData] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [contactModelOpen, setContactModel] = useState(false);
  const [leadModelOpen, setLeadModel] = useState(false);
  const todayTime = new Date().toISOString().split(".")[0];
  const leadData = useSelector((state) => state?.leadData?.data);
  const [setCondition, setSetCondition] = useState([]);
  const [countriesWithEmailAsLabel, setCountriesWithEmailAsLabel] = useState(
    []
  );
  const user = JSON.parse(localStorage.getItem("user"));

  const contactList = useSelector((state) => state?.contactData?.data);

  const initialValues = {
    agenda: "",
    attendes:
      props?.leadContect === "contactView" && props?.id ? [props?.id] : [],
    attendesLead:
      props?.leadContect === "leadView" && props?.id ? [props?.id] : [],
    location: "",
    related:
      props?.leadContect === "contactView"
        ? "Contact"
        : props?.leadContect === "leadView"
          ? "Lead"
          : "Contact",
    dateTime: "",
    notes: "",
    createBy: user?._id,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: MeetingSchema,
    onSubmit: (values, { resetForm }) => {
      AddData();
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

  const findLeadName = leaddata?.find(
    (item) => item?.leadName === leadName?.leadName
  );
  const AddData = async () => {
    try {
      setIsLoding(true);
      if (values?.attendes?.length > 0 || values?.attendesLead?.length > 0) {
        let response = await postApi("api/meeting/add", values);
        if (response?.status === 200) {
          formik.resetForm();
          props.onClose();
          fetchData(1);
          // setAction((pre) => !pre)
        }
      } else {
        toast.error("Select Related To");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const fetchAllData = async () => {
    if (view === true) {
      if (values?.related === "Contact" && contactdata?.length <= 0) {
        setContactData(contactList);
      } else if (values?.related === "Lead" && leaddata?.length <= 0) {
        setLeadData(leadData);
      }
    } else {
      let result;
      if (values?.related === "Contact" && contactdata?.length <= 0) {
        result = await getApi(
          user.role === "superAdmin"
            ? "api/contact/"
            : `api/contact/?createBy=${user?._id}`
        );
        setContactData(result?.data);
      } else if (values?.related === "Lead" && leaddata?.length <= 0) {
        result = await getApi(
          user?.role === "superAdmin"
            ? "api/lead/"
            : `api/lead/?createBy=${user?._id}`
        );
        setLeadData(result?.data);
      }
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [props?.id, values?.related]);

  const extractLabels = (selectedItems) => {
    return selectedItems?.map((item) => item?._id);
  };
  const theme = extendTheme({
    styles: {
      global: {
        mark: {
          backgroundColor: "transparent !important", // Removes yellow highlight
          color: "inherit !important",
        },
      },
    },
  });
  useEffect(() => {
    const conditionData =
      values?.related === "Contact" ? contactdata : leadData;
    setSetCondition(conditionData);
    const mappedCountries = Array?.isArray(conditionData)
      ? conditionData?.map((item) => ({
          ...item,
          value: item?._id,
          label:
            values?.related === "Contact" ? item?.fullName : item?.leadName,
        }))
      : [];
    setCountriesWithEmailAsLabel(mappedCountries);
  }, [leadData, values?.related, contactdata]);

  return (
    <ChakraProvider theme={theme}>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent height={"580px"}>
          <ModalHeader>Add Meeting </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY={"auto"} height={"400px"}>
            {/* Contact Model  */}
            <MultiContactModel
              data={contactdata}
              isOpen={contactModelOpen}
              onClose={setContactModel}
              fieldName="attendes"
              setFieldValue={setFieldValue}
              values={values}
            />
            {/* Lead Model  */}
            <MultiLeadModel
              data={leaddata}
              isOpen={leadModelOpen}
              onClose={setLeadModel}
              fieldName="attendesLead"
              setFieldValue={setFieldValue}
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
                  Agenda<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.agenda}
                  name="agenda"
                  placeholder="Agenda"
                  fontWeight="500"
                  borderColor={
                    errors?.agenda && touched?.agenda ? "red.300" : null
                  }
                />
                <Text fontSize="sm" mb="10px" color={"red"}>
                  {" "}
                  {errors?.agenda && touched?.agenda && errors?.agenda}
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
                  Related To<Text color={"red"}>*</Text>
                </FormLabel>
                <RadioGroup
                  onChange={(e) => setFieldValue("related", e)}
                  value={values?.related}
                >
                  <Stack direction="row">
                    {props?.leadContect === "contactView" && (
                      <Radio value="Contact">Contact</Radio>
                    )}
                    {props?.leadContect === "leadView" && (
                      <Radio value="Lead">Lead</Radio>
                    )}
                    {!props?.leadContect && (
                      <>
                        {" "}
                        <Radio value="Contact">Contact</Radio>
                        <Radio value="Lead">Lead</Radio>
                      </>
                    )}
                  </Stack>
                </RadioGroup>
                <Text mb="10px" color={"red"} fontSize="sm">
                  {" "}
                  {errors?.related && touched?.related && errors?.related}
                </Text>
              </GridItem>
              {values?.related &&
                ((values?.related === "Contact" && contactdata?.length > 0) ||
                  (values?.related === "Lead" && leaddata?.length > 0)) && (
                  <GridItem colSpan={{ base: 12 }}>
                    <Flex alignItems={"end"} justifyContent={"space-between"}>
                      <Text w={"100%"}>
                        <CUIAutoComplete
                          label={`Choose Preferred Attendes ${
                            values?.related === "Contact" ? "Contact" : "Lead"
                          }`}
                          placeholder="Type a Name"
                          highlightedIndex={-1}
                          inputStyle={{
                            backgroundColor: "white",
                          }}
                          listStyleProps={{
                            backgroundColor: "white",
                          }}
                          highlightItemBg="transparent"
                          name="attendes"
                          items={countriesWithEmailAsLabel}
                          className="custom-autoComplete"
                          selectedItems={countriesWithEmailAsLabel?.filter(
                            (item) =>
                              values?.related === "Contact"
                                ? values?.attendes?.includes(item?._id)
                                : values?.attendesLead?.includes(item?._id)
                          )}
                          onSelectedItemsChange={(changes) => {
                            const selectedLabels = extractLabels(
                              changes?.selectedItems
                            );
                            values?.related === "Contact"
                              ? setFieldValue("attendes", selectedLabels)
                              : setFieldValue("attendesLead", selectedLabels);
                          }}
                        />
                      </Text>
                      <IconButton
                        mb={6}
                        onClick={() =>
                          values?.related === "Contact"
                            ? setContactModel(true)
                            : setLeadModel(true)
                        }
                        fontSize="25px"
                        icon={<LiaMousePointerSolid />}
                      />
                    </Flex>
                    <Text color={"red"}>
                      {errors?.attendes &&
                        touched?.attendes &&
                        errors?.attendes}
                    </Text>
                  </GridItem>
                )}

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Location
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.location}
                  name="location"
                  placeholder="Location"
                  fontWeight="500"
                  borderColor={
                    errors?.location && touched?.location ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"} fontSize="sm">
                  {" "}
                  {errors?.location && touched?.location && errors?.location}
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
                  Date Time<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  type="datetime-local"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={dayjs(todayTime).format("YYYY-MM-DD HH:mm")}
                  value={values?.dateTime}
                  name="dateTime"
                  placeholder="Date Time"
                  fontWeight="500"
                  borderColor={
                    errors?.dateTime && touched?.dateTime ? "red.300" : null
                  }
                />
                <Text fontSize="sm" mb="10px" color={"red"}>
                  {" "}
                  {errors?.dateTime && touched?.dateTime && errors?.dateTime}
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
                  Notes
                </FormLabel>
                <Textarea
                  resize={"none"}
                  fontSize="sm"
                  placeholder="Notes"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.notes}
                  name="notes"
                  fontWeight="500"
                  borderColor={
                    errors?.notes && touched?.notes ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors?.notes && touched?.notes && errors?.notes}
                </Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="brand"
              me={2}
              disabled={isLoding ? true : false}
              onClick={handleSubmit}
            >
              {isLoding ? <Spinner /> : "Save"}
            </Button>
            <Button
              sx={{
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
    </ChakraProvider>
  );
};

export default AddMeeting;
