import React, { useState } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

const UnitTypeView = (props) => {
  const { onClose, isOpen } = props;
  const [isLoding, setIsLoding] = useState(false);

  const initialValues = {
    name: "",
    sqm: "",
    price: "",
  };
  const validationSchema = yup.object({
    name: yup.string().required("Name Is required"),
    sqm: yup.number().required("Sqm Is required").typeError("Sqm must be a number"),
    price: yup.number().required("Price Is required").typeError("Price must be a number"),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // AddData();
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
    resetForm,
  } = formik;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Units</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 12 }}>
                    <Text>Name</Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                    <Text>Sqm</Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                    <Text>Price</Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            {/* <Button
              variant="brand"
              size="sm"
              disabled={isLoding ? true : false}
              onClick={handleSubmit}
            >
              {isLoding ? <Spinner /> : "Save"}
            </Button> */}
            {/* <Button size="sm" variant='brand' disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Save'}</Button> */}
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
    </>
  );
};
export default UnitTypeView;
