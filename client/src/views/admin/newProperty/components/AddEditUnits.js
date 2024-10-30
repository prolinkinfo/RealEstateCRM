import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { postApi } from "services/api";
import * as yup from "yup";
import { IoLogoUsd } from "react-icons/io";
import { putApi } from "services/api";

const AddEditUnits = (props) => {
  const { isOpen, onClose, setAction, selectedUnitType, actionType } = props;
  const param = useParams();
  const [isLoding, setIsLoding] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: "",
    sqm: "",
    price: "",
    executive: "",
  });

  const validationSchema = yup.object({
    name: yup.string().required("Name Is required"),
    sqm: yup
      .number()
      .required("Sqm Is required")
      .typeError("Sqm must be a number"),
    price: yup
      .number()
      .required("Price Is required")
      .typeError("Price must be a number"),
    executive: yup.string().required("Executive Is required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      AddUpdateData();
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = formik;

  const AddUpdateData = async () => {
    try {
      setIsLoding(true);
      let response;
      if (actionType === "Edit") {
        response = await putApi(`api/property/edit-unit/${param?.id}`, values);
      } else {
        response = await postApi(`api/property/add-units/${param?.id}`, {
          units: values,
          type: "A",
        });
      }

      if (response && response.status === 200) {
        onClose();
        resetForm();
        setAction((pre) => !pre);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const handelClose = () => {
    resetForm();
    onClose();
    setInitialValues({
      name: "",
      sqm: "",
      price: "",
      executive: "",
    });
  };

  useEffect(() => {
    actionType === "Edit" && setInitialValues(selectedUnitType);
  }, [selectedUnitType]);

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="space-between" display="flex">
          {actionType === "Edit" ? "Edit" : "Add"} Unit
          <IconButton onClick={handelClose} icon={<CloseIcon />} />
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
                Name<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.name}
                name="name"
                placeholder="Enter Name"
                fontWeight="500"
                borderColor={errors?.name && touched?.name ? "red.300" : null}
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
                Sqm<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.sqm}
                name="sqm"
                placeholder="Enter Sqm"
                fontWeight="500"
                borderColor={errors?.sqm && touched?.sqm ? "red.300" : null}
              />
              <Text mb="10px" color={"red"}>
                {errors?.sqm && touched?.sqm && errors?.sqm}
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
                Executive<Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.executive}
                name="executive"
                placeholder="Enter Executive"
                fontWeight="500"
                borderColor={
                  errors?.executive && touched?.executive ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors?.executive && touched?.executive && errors?.executive}
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
                Price<Text color={"red"}>*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.price}
                  name="price"
                  placeholder="Enter Price"
                  fontWeight="500"
                  borderColor={
                    errors?.price && touched?.price ? "red.300" : null
                  }
                />
                <InputRightElement
                  pointerEvents="none"
                  children={<IoLogoUsd color="gray.300" borderRadius="16px" />}
                />
              </InputGroup>
              <Text mb="10px" color={"red"}>
                {errors?.price && touched?.price && errors?.price}
              </Text>
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
            {isLoding ? <Spinner /> : actionType === "Edit" ? "Update" : "Save"}
          </Button>
          <Button
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={handelClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddEditUnits;
