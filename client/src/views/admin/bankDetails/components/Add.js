import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Grid,
  GridItem,
  Text,
  IconButton,
  Input,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { postApi } from "services/api";
import * as yup from "yup";

const Add = (props) => {
  const [isLoding, setIsLoding] = useState(false);

  const initialValues = {
    accountName: "",
    accountNumber: "",
    bank: "",
    branch: "",
    swiftCode: "",
  };

  const validationSchema = yup.object({
    accountName: yup.string().required("AccountName Is required"),
    accountNumber: yup.number().required("AccountNumber Is required"),
    bank: yup.string().required("Bank Is required"),
    branch: yup.string().required("Branch Is required"),
    swiftCode: yup.number().required("SwiftCode Is required"),
  });
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: () => {
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
  } = formik;

  const AddData = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/bank-details/add", values);
      if (response?.status === 200) {
        props.onClose();
        props.setAction((pre) => !pre);
        formik.resetForm();
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
            Add BankDetails
            <IconButton onClick={props?.onClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Account Name<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.accountName}
                  name="accountName"
                  placeholder="Account Name"
                  fontWeight="500"
                  borderColor={
                    errors?.accountName && touched?.accountName
                      ? "red.300"
                      : null
                  }
                  error={
                    formik?.touched?.accountName &&
                    Boolean(formik?.errors?.accountName)
                  }
                  helperText={
                    formik?.touched?.accountName && formik?.errors?.accountName
                  }
                />
                <Text mb="10px" color={"red"}>
                  {errors?.accountName &&
                    touched?.accountName &&
                    errors?.accountName}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Account Number<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.accountNumber}
                  name="accountNumber"
                  placeholder="Account Number"
                  fontWeight="500"
                  borderColor={
                    errors?.accountNumber && touched?.accountNumber
                      ? "red.300"
                      : null
                  }
                  error={
                    formik?.touched?.accountNumber &&
                    Boolean(formik?.errors?.accountNumber)
                  }
                  helperText={
                    formik?.touched?.accountNumber &&
                    formik?.errors?.accountNumber
                  }
                />
                <Text mb="10px" color={"red"}>
                  {errors?.accountNumber &&
                    touched?.accountNumber &&
                    errors?.accountNumber}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Bank<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.bank}
                  name="bank"
                  placeholder="Bank"
                  fontWeight="500"
                  borderColor={errors?.bank && touched?.bank ? "red.300" : null}
                  error={formik?.touched?.bank && Boolean(formik?.errors?.bank)}
                  helperText={formik?.touched?.bank && formik?.errors?.bank}
                />
                <Text mb="10px" color={"red"}>
                  {errors?.bank && touched?.bank && errors?.bank}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Branch<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.branch}
                  name="branch"
                  placeholder="Branch"
                  fontWeight="500"
                  borderColor={
                    errors?.branch && touched?.branch ? "red.300" : null
                  }
                  error={
                    formik?.touched?.branch && Boolean(formik?.errors?.branch)
                  }
                  helperText={formik?.touched?.branch && formik?.errors?.branch}
                />
                <Text mb="10px" color={"red"}>
                  {errors?.branch && touched?.branch && errors?.branch}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Swift Code<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.swiftCode}
                  name="swiftCode"
                  placeholder="Swift Code"
                  fontWeight="500"
                  borderColor={
                    errors?.swiftCode && touched?.swiftCode ? "red.300" : null
                  }
                  error={
                    formik?.touched?.swiftCode &&
                    Boolean(formik?.errors?.swiftCode)
                  }
                  helperText={
                    formik?.touched?.swiftCode && formik?.errors?.swiftCode
                  }
                />
                <Text mb="10px" color={"red"}>
                  {errors?.swiftCode && touched?.swiftCode && errors?.swiftCode}
                </Text>
              </GridItem>
            </Grid>
          </DrawerBody>

          <DrawerFooter>
            <Button
              sx={{ textTransform: "capitalize" }}
              variant="brand"
              disabled={isLoding ? true : false}
              type="submit"
              size="sm"
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
    </div>
  );
};

export default Add;
