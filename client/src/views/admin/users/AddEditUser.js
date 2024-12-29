import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import MultiRoleModel from "components/commonTableModel/MultiRoleModel";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { LiaMousePointerSolid } from "react-icons/lia";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { userSchema } from "schema";
import { getApi, postApi, putApi } from "services/api";
import { setUser } from "../../../redux/slices/localSlice";

const AddEditUser = (props) => {
  const {
    onClose,
    isOpen,
    setAction,
    data,
    userAction,
    userData,
    selectedId,
    fetchData,
    setUserAction,
  } = props;
  const [isLoding, setIsLoding] = useState(false);
  const [show, setShow] = React.useState(false);
  const [roles, setRoles] = React.useState([]);
  const [roleModelOpen, setRoleModelOpen] = useState(false);
  const [assignToRoleData, setAssignToRoleData] = useState([]);
  const showPass = () => setShow(!show);
  const dispatch = useDispatch();

  const initialValues = {
    firstName: userAction === "add" ? "" : data?.firstName,
    lastName: userAction === "add" ? "" : data?.lastName,
    username: userAction === "add" ? "" : data?.username,
    phoneNumber: userAction === "add" ? "" : data?.phoneNumber,
    password: userAction === "add" ? "" : data?.password,
    roles: userAction === "add" ? [] : data?.roles?.map((item) => item?._id),
  };
  const user = JSON.parse(window.localStorage.getItem("user"));

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
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
    resetForm,
  } = formik;

  const AddData = async () => {
    if (userAction === "add") {
      try {
        setIsLoding(true);
        let response = await postApi("api/user/register", values);
        if (response && response?.status === 200) {
          resetForm();
          setAction((pre) => !pre);
          setUserAction("");
          onClose();
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
        let response = await putApi(`api/user/edit/${selectedId}`, values);
        if (response && response?.status === 200) {
          // setEdit(false)
          fetchData();
          if (user?._id === selectedId) {
            let updatedUserData = data; // Create a copy of userData
            if (updatedUserData && typeof updatedUserData === "object") {
              // Create a new object with the updated firstName
              updatedUserData = {
                ...updatedUserData,
                firstName: values?.firstName,
                lastName: values?.lastName,
              };
            }
            const updatedDataString = JSON.stringify(updatedUserData);
            localStorage.setItem("user", updatedDataString);
            dispatch(setUser(updatedDataString));
          }

          setUserAction("");
          setAction((pre) => !pre);
          onClose();
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
  const extractLabels = (selectedItems) => {
    return selectedItems?.map((item) => item?._id);
  };
  const fetchRoleData = async () => {
    setIsLoding(true);
    let result = await getApi("api/role-access");
    setRoles(
      result.data?.map((item) => ({
        ...item,
        value: item?._id,
        label: item?.roleName,
      }))
    );
    setIsLoding(false);
  };

  useEffect(() => {
    fetchRoleData();
  }, []);
  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="space-between" display="flex">
          {userAction === "add" ? "Add" : "Edit"} User
          <IconButton onClick={onClose} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                First Name<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.firstName}
                name="firstName"
                placeholder="firstName"
                fontWeight="500"
                borderColor={
                  errors?.firstName && touched?.firstName ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors?.firstName && touched?.firstName && errors?.firstName}
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
                Last Name
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.lastName}
                name="lastName"
                placeholder="Last Name"
                fontWeight="500"
                borderColor={
                  errors?.lastName && touched?.lastName ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors?.lastName && touched?.lastName && errors?.lastName}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Flex alignItems={"end"} justifyContent={"space-between"}>
                <Text w={"100%"}>
                  <CUIAutoComplete
                    label={`Choose Role`}
                    placeholder="Type a Name"
                    name="roles"
                    items={roles}
                    mb={errors?.roles && touched?.roles ? undefined : "10px"}
                    className="custom-autoComplete"
                    selectedItems={roles?.filter((item) =>
                      values?.roles?.includes(item?._id)
                    )}
                    onSelectedItemsChange={(changes) => {
                      const selectedLabels = extractLabels(
                        changes?.selectedItems
                      );
                      setFieldValue("roles", selectedLabels);
                    }}
                    borderColor={
                      errors?.roles && touched?.roles ? "red.300" : null
                    }
                  />
                </Text>
                <IconButton
                  mb={6}
                  onClick={() => setRoleModelOpen(true)}
                  fontSize="25px"
                  icon={<LiaMousePointerSolid />}
                />
              </Flex>
              <Text color={"red"}>
                {errors?.roles && touched?.roles && errors?.roles}
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
                Email<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.username}
                name="username"
                disabled={userAction === "edit"}
                placeholder="Email Address"
                fontWeight="500"
                borderColor={
                  errors?.username && touched?.username ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors?.username && touched?.username && errors?.username}
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
                Phone Number<Text color={"red"}>*</Text>
              </FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                />
                <Input
                  type="tel"
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.phoneNumber}
                  name="phoneNumber"
                  fontWeight="500"
                  borderColor={
                    errors?.phoneNumber && touched?.phoneNumber
                      ? "red.300"
                      : null
                  }
                  placeholder="Phone number"
                  borderRadius="16px"
                />
              </InputGroup>
              <Text mb="10px" color={"red"}>
                {errors?.phoneNumber &&
                  touched?.phoneNumber &&
                  errors?.phoneNumber}
              </Text>
            </GridItem>
            {userAction !== "edit" && (
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Password
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Enter Your Password"
                    name="password"
                    size="lg"
                    variant="auth"
                    type={show ? "text" : "password"}
                    value={values?.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      errors?.password && touched?.password ? "red.300" : null
                    }
                    className={
                      errors?.password && touched?.password ? "isInvalid" : null
                    }
                  />
                  <InputRightElement
                    display="flex"
                    alignItems="center"
                    mt="4px"
                  >
                    <Icon
                      color={"gray.400"}
                      _hover={{ cursor: "pointer" }}
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                      onClick={showPass}
                    />
                  </InputRightElement>
                </InputGroup>
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors?.password && touched?.password && errors?.password}
                </Text>
              </GridItem>
            )}
          </Grid>
          <MultiRoleModel
            isOpen={roleModelOpen}
            data={assignToRoleData}
            role={roles}
            onClose={() => setRoleModelOpen(false)}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
            fieldName="roles"
            setFieldValue={setFieldValue}
          // columnsData={columns ?? []}
          />
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

export default AddEditUser;
