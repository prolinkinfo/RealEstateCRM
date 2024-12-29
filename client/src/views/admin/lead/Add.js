import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Select,
  Text,
} from "@chakra-ui/react";
import SelectPorpertyModel from "components/commonTableModel/SelectPorpertyModel";
import UserModel from "components/commonTableModel/UserModel";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { LiaMousePointerSolid } from "react-icons/lia";
import { getApi } from "services/api";
import { postApi } from "services/api";
import { generateValidationSchema } from "utils";
import CustomForm from "utils/customForm";
import * as yup from "yup";
import Edit from "./Edit";

const Add = (props) => {
  const [isLoding, setIsLoding] = useState(false);
  const [propertyModel, setPropertyModel] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [data, setData] = useState([]);
  const [userModel, setUserModel] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const initialFieldValues = Object.fromEntries(
    (props?.leadData?.fields || [])?.map((field) => [field?.name, ""])
  );
  const initialValues = {
    ...initialFieldValues,
    associatedListing: "",
    assignUser: "",
    createBy: JSON.parse(localStorage.getItem("user"))?._id,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: yup
      .object()
      .shape(generateValidationSchema(props?.leadData?.fields)),
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

  const fetchData = async () => {
    setIsLoding(true);
    let result = await getApi("api/user/");
    setData(result?.data?.user);
    setIsLoding(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const AddData = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/form/add", {
        ...values,
        moduleId: props?.leadData?._id,
      });
      if (response?.status === 200) {
        props.onClose();
        formik.resetForm();
        props.setAction((pre) => !pre);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    props.onClose();
  };

  const getPropertyList = async () => {
    let result = await getApi(
      user?.role === "superAdmin"
        ? "api/property"
        : `api/property/?createBy=${user?._id}`
    );

    setPropertyList(result?.data);
  };

  useEffect(() => {
    getPropertyList();
  }, []);

  return (
    <div>
      <Drawer isOpen={props?.isOpen} size={props?.size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            alignItems={"center"}
            justifyContent="space-between"
            display="flex"
          >
            Add Lead
            <IconButton onClick={props?.onClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
            <CustomForm
              moduleData={props?.leadData}
              values={values}
              setFieldValue={setFieldValue}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
            <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={2}>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Associated Listing
                </FormLabel>
                <Flex justifyContent="space-between">
                  <Select
                    value={values?.associatedListing}
                    name="associatedListing"
                    onChange={handleChange}
                    mb={
                      errors?.associatedListing && touched?.associatedListing
                        ? undefined
                        : "10px"
                    }
                    fontWeight="500"
                    placeholder="select associated listing"
                    borderColor={
                      errors?.associatedListing && touched?.associatedListing
                        ? "red.300"
                        : null
                    }
                  >
                    {propertyList?.map((item) => {
                      return (
                        <option value={item?._id} key={item?._id}>
                          {item?.name}
                        </option>
                      );
                    })}
                  </Select>
                  <IconButton
                    onClick={() => setPropertyModel(true)}
                    ml={2}
                    fontSize="25px"
                    icon={<LiaMousePointerSolid />}
                  />
                </Flex>
                <Text mb="10px" fontSize="sm" color={"red"}>
                  {errors?.associatedListing &&
                    touched?.associatedListing &&
                    errors?.associatedListing}
                </Text>
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={2}>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Assign to User
                </FormLabel>
                <Flex justifyContent="space-between">
                  <Select
                    value={values?.assignUser}
                    name="assignUser"
                    onChange={handleChange}
                    mb={
                      errors?.assignUser && touched?.assignUser
                        ? undefined
                        : "10px"
                    }
                    fontWeight="500"
                    placeholder="select user"
                    borderColor={
                      errors?.assignUser && touched?.assignUser
                        ? "red.300"
                        : null
                    }
                  >
                    {data?.map((item) => {
                      return (
                        <option value={item?._id} key={item?._id}>
                          {item?.firstName} {item?.lastName}
                        </option>
                      );
                    })}
                  </Select>
                  <IconButton
                    onClick={() => setUserModel(true)}
                    ml={2}
                    fontSize="25px"
                    icon={<LiaMousePointerSolid />}
                  />
                </Flex>
                <Text mb="10px" fontSize="sm" color={"red"}>
                  {errors?.assignUser &&
                    touched?.assignUser &&
                    errors?.assignUser}
                </Text>
              </GridItem>
            </Grid>
          </DrawerBody>
          <DrawerFooter>
            <Button
              sx={{ textTransform: "capitalize" }}
              size="sm"
              disabled={isLoding ? true : false}
              variant="brand"
              type="submit"
              onClick={handleSubmit}
            >
              {isLoding ? <Spinner /> : "Save"}
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={handleCancel}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <SelectPorpertyModel
        onClose={() => setPropertyModel(false)}
        isOpen={propertyModel}
        data={propertyList}
        isLoding={isLoding}
        setIsLoding={setIsLoding}
        fieldName="associatedListing"
        setFieldValue={setFieldValue}
      />
      <UserModel
        onClose={() => setUserModel(false)}
        isOpen={userModel}
        fieldName={"assignUser"}
        setFieldValue={setFieldValue}
        data={data}
        isLoding={isLoding}
        setIsLoding={setIsLoding}
      />
    </div>
  );
};

export default Add;
