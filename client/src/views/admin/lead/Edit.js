import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  GridItem,
  IconButton,
  Flex,
  Select,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { putApi } from "services/api";
import { getApi } from "services/api";
import { generateValidationSchema } from "../../../utils";
import CustomForm from "../../../utils/customForm";
import * as yup from "yup";
import UserModel from "components/commonTableModel/UserModel";
import { LiaMousePointerSolid } from "react-icons/lia";
import SelectPorpertyModel from "components/commonTableModel/SelectPorpertyModel";
// import { fetchLeadData } from "redux/slices/leadSlice";
import { fetchLeadData } from "../../../redux/slices/leadSlice";
import { useDispatch } from "react-redux";

const Edit = (props) => {
  const { data } = props;
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [isLoding, setIsLoding] = useState(false);
  const initialFieldValues = Object.fromEntries(
    (props?.leadData?.fields || [])?.map((field) => [field?.name, ""])
  );
  const [propertyModel, setPropertyModel] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [userModel, setUserModel] = useState(false);
  const [userData, setUserData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    ...initialFieldValues,
    createBy: JSON.parse(localStorage.getItem("user"))._id,
  });
  const param = useParams();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: yup
      .object()
      .shape(generateValidationSchema(props?.leadData?.fields)),
    onSubmit: (values, { resetForm }) => {
      EditData();
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

  const EditData = async () => {
    try {
      setIsLoding(true);
      let response = await putApi(
        `api/form/edit/${param?.id || props?.selectedId}`,
        { ...values, moduleId: props?.moduleId }
      );
      if (response?.status === 200) {
        props.onClose();
        props.setAction((pre) => !pre);
        dispatch(fetchLeadData());
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
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

  const handleClose = () => {
    props.onClose(false);
    props.setSelectedId && props?.setSelectedId();
    formik.resetForm();
  };

  let response;
  const fetchData = async () => {
    if (data) {
      setInitialValues((prev) => ({
        ...prev,
        ...data,
        associatedListing: data?.associatedListing?._id,
      }));
    } else if (props?.selectedId) {
      try {
        setIsLoding(true);
        response = await getApi("api/lead/view/", props?.selectedId);
        let editData = response?.data?.lead;
        setInitialValues((prev) => ({
          ...prev,
          ...editData,
          associatedListing: editData?.associatedListing?._id,
        }));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoding(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [props?.selectedId, data]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    let result = await getApi("api/user/");
    setUserData(result?.data?.user);
  };

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
            Edit {values?.leadName || "Lead "}
            <IconButton onClick={handleClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
            {isLoding ? (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                width="100%"
              >
                <Spinner />
              </Flex>
            ) : (
              <CustomForm
                moduleData={props?.leadData}
                values={values}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            )}
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
                    value={values?.associatedListing || ""}
                    name="associatedListing"
                    onChange={handleChange}
                    fontWeight="500"
                    placeholder="select associated listing"
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
                    fontWeight="500"
                    placeholder="select user"
                  >
                    {userData?.map((item) => {
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
              </GridItem>
            </Grid>
          </DrawerBody>
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
            data={userData}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
          />
          <DrawerFooter>
            <Button
              sx={{ textTransform: "capitalize" }}
              variant="brand"
              size="sm"
              type="submit"
              disabled={isLoding ? true : false}
              onClick={handleSubmit}
            >
              {isLoding ? <Spinner /> : "Update"}
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={handleClose}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Edit;
