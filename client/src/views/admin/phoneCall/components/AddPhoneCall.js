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
  Text,
  Textarea,
  Flex,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { LiaMousePointerSolid } from "react-icons/lia";
import Spinner from "components/spinner/Spinner";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { phoneCallSchema } from "schema";
import { getApi, postApi } from "services/api";
import UserModel from "components/commonTableModel/UserModel";

const AddPhoneCall = (props) => {
  const { onClose, isOpen, viewData, fetchData, setAction, cData, LData } =
    props;

  const [isLoding, setIsLoding] = useState(false);
  const todayTime = new Date().toISOString().split(".")[0];
  const user = JSON.parse(localStorage.getItem("user"));
  const [assignToSalesData, setAssignToSalesData] = useState([]);
  const [salesPersonsModelOpen, setSalesPersonsModelOpen] = useState(false);

  const initialValues = {
    sender: user?._id,
    recipient: "",
    callDuration: "",
    callNotes: "",
    createByContact: "",
    createByLead: "",
    startDate: "",
    createBy: user?._id,
    salesAgent: "", // sales person user id
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: phoneCallSchema,
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
      let response = await postApi("api/phoneCall/add", values);
      if (response?.status === 200) {
        props?.onClose();
        fetchData(1);
        // setAction((pre) => !pre)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  // const fetchDataR = async () => {
  //     if (props?.viewData?.lead?.leadPhoneNumber) {
  //         if (props.id && props.lead !== true) {
  //             setFieldValue('recipient', props?.viewData?.contact?.phoneNumber);
  //             setFieldValue('createByContact', props?.id);
  //             values.recipient = props?.viewData?.contact?.phoneNumber
  //         } else if (props.id && props.lead === true) {
  //             let response = await getApi('api/lead/view/', props.id)
  //             if (response?.status === 200) {
  //                 setFieldValue('recipient', response?.data?.lead?.leadPhoneNumber);
  //                 setFieldValue('createByLead', props.id);
  //                 values.recipient = response?.data?.lead?.leadPhoneNumber
  //             }
  //         }
  //     } else {
  //         if (props.id && props.lead !== true) {
  //             if (cData) {
  //                 setFieldValue('recipient', cData?.phoneNumber);
  //                 setFieldValue('createByContact', props?.id);
  //                 values.recipient = cData?.phoneNumber
  //             }
  //             // let response = await getApi('api/contact/view/', props.id)
  //             // if (response?.status === 200) {
  //             //     setFieldValue('recipient', response?.data?.contact?.phoneNumber);
  //             //     setFieldValue('createByContact', props?.id);
  //             //     values.recipient = response?.data?.contact?.phoneNumber
  //             // }
  //         } else if (props.id && props.lead === true) {
  //             let response = await getApi('api/lead/view/', props.id)
  //             if (response?.status === 200) {
  //                 setFieldValue('recipient', response?.data?.lead?.leadPhoneNumber);
  //                 setFieldValue('createByLead', props.id);
  //                 values.recipient = response?.data?.lead?.leadPhoneNumber
  //             }
  //         }
  //     }
  // }

  const fetchUsersData = async () => {
    setIsLoding(true);
    try {
      let result = await getApi("api/user/");

      let salesPersons =
        result?.data?.user?.filter((userData) =>
          userData?.roles?.some((role) => role?.roleName === "Sales")
        ) || [];
      setAssignToSalesData(salesPersons);
    } catch (error) {
      console.error("Failed to fetch users data:", error);
    } finally {
      setIsLoding(false);
    }
  };

  const fetchDataR = async () => {
    if (LData && LData?._id && props?.lead === true) {
      setFieldValue(
        "recipient",
        LData?.leadPhoneNumber || viewData?.lead?.leadMobile
      );
      setFieldValue("createByLead", props?.id);
      values.recipient = LData?.leadPhoneNumber || viewData?.lead?.leadMobile;
    } else if (cData && cData?._id && props?.lead !== true) {
      setFieldValue("recipient", cData?.phoneNumber);
      setFieldValue("createByContact", props?.id);
      values.recipient = cData?.phoneNumber;
    }
  };

  useEffect(() => {
    fetchDataR();
    fetchUsersData();
  }, [props?.id, cData, LData, viewData]);

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Call </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* User Model for sales person */}
          <UserModel
            onClose={() => setSalesPersonsModelOpen(false)}
            isOpen={salesPersonsModelOpen}
            fieldName={"salesAgent"}
            setFieldValue={setFieldValue}
            data={assignToSalesData}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
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
                Recipient<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                type="number"
                disabled
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.recipient}
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
            <GridItem colSpan={{ base: 12, md: 6 }}>
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
                value={values?.startDate}
                name="startDate"
                fontWeight="500"
                borderColor={
                  errors?.startDate && touched?.startDate ? "red.300" : null
                }
              />
              <Text mb="10px" fontSize="sm" color={"red"}>
                {" "}
                {errors.startDate && touched.startDate && errors.startDate}
              </Text>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Call Duration<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.callDuration}
                name="callDuration"
                placeholder="call Duration"
                fontWeight="500"
                borderColor={
                  errors?.callDuration && touched?.callDuration
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" fontSize="sm" color={"red"}>
                {" "}
                {errors?.callDuration &&
                  touched?.callDuration &&
                  errors?.callDuration}
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
                Assign To Sales Agent<Text color={"red"}>*</Text>
              </FormLabel>
              <Flex justifyContent={"space-between"}>
                <Select
                  value={values?.salesAgent}
                  name="salesAgent"
                  onChange={handleChange}
                  mb={
                    errors?.salesAgent && touched?.salesAgent
                      ? undefined
                      : "10px"
                  }
                  fontWeight="500"
                  placeholder={"Assign To Sales Agent"}
                  borderColor={
                    errors?.salesAgent && touched?.salesAgent ? "red.300" : null
                  }
                >
                  {assignToSalesData?.map((item) => {
                    return (
                      <option
                        value={item._id}
                        key={item?._id}
                      >{`${item?.firstName} ${item?.lastName}`}</option>
                    );
                  })}
                </Select>
                <IconButton
                  onClick={() => setSalesPersonsModelOpen(true)}
                  ml={2}
                  fontSize="25px"
                  icon={<LiaMousePointerSolid />}
                />
              </Flex>
              <Text mb="10px" fontSize="sm" color={"red"}>
                {" "}
                {errors?.salesAgent &&
                  touched?.salesAgent &&
                  errors?.salesAgent}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="brand"
            disabled={isLoding ? true : false}
            onClick={handleSubmit}
          >
            {isLoding ? <Spinner /> : "Save"}
          </Button>
          <Button
            size="sm"
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
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPhoneCall;
