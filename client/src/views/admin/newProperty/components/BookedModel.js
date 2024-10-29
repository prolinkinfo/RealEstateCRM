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
  IconButton,
  Input,
  ModalFooter,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import "../../../../assets/css/stepper.css";
import { BankDetails } from "./bookedStepperForm/BankDetails";
import { FirstStepper } from "./bookedStepperForm/FirstStepper";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { postApiBlob } from "services/api";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";

function BookedModel(props) {
  const { isOpen, onClose } = props;
  const [currentStep, setCurrentStep] = useState(1);

  const param = useParams();

  const validationSchema = yup.object({
    category: yup.string().required("Currency Is Required"),
    lead: yup.string(),
    contact: yup.string(),
    currency: yup.string().required("Currency Is Required"),
    amount: yup.number().typeError("Amount must be a number").required("amount Is Required"),
    accountName: yup.string().required("Account Name Is Required"),
    bank: yup.string().required("Bank Is Required"),
    branch: yup.string().required("Branch Is Required"),
    accountNumber: yup.number().required("Account Number Is Required"),
    swiftCode: yup.number().required("swiftCode Is Required"),
  });

  const formik = useFormik({
    initialValues: {
      category: "lead",
      currency: "ksh",
      lead: "",
      contact: "",
      imagefirst: [],
      secondimage: [],
      accountName: "",
      bank: "",
      branch: "",
      accountNumber: "",
      swiftCode: "",
    },
    validationSchema,
    onSubmit: () => {
      submitStepperData();
    },
  });

  const { values, handleSubmit, resetForm } = formik;

  const steps = [
    {
      label: "First",
      description: "Contact Info",
      component: <FirstStepper formik={formik} />,
    },
    {
      label: "Second",
      description: "Bank Details",
      component: <BankDetails formik={formik} />,
    },
  ];

  const submitStepperData = async () => {
    try {
      const response = await postApiBlob(
        `api/property/genrate-offer-letter/${param?.id}`,
        values
      );
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      saveAs(pdfBlob, "offer-letter.pdf");
    } catch (e) {
      console.log(e);
      toast.error(`server error`);
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <>
      <Drawer isOpen={isOpen} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            alignItems={"center"}
            justifyContent="space-between"
            display="flex"
          >
            Booked
            <IconButton
              onClick={() => {
                onClose();
                resetForm();
              }}
              icon={<CloseIcon />}
            />
          </DrawerHeader>
          <DrawerBody>
            <div className="stepper">
              <div className="stepper-wrapper">
                {steps?.map((step, index) => (
                  <React.Fragment key={index + 1}>
                    <div
                      className={`step ${currentStep >= index + 1 ? "active" : ""}`}
                    >
                      <div className="step-number">{index + 1}</div>
                      <div className="step-info">
                        <h4>{step?.label}</h4>
                        <p style={{ textAlign: "center", width: "120px" }}>
                          {step?.description}
                        </p>
                      </div>
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        className={`step-line ${currentStep > index + 1 ? "completed" : ""}`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="step-content">
                {steps?.map(
                  (step, index) => currentStep === index + 1 && step?.component
                )}
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              colorScheme="red"
              disabled={currentStep <= 1}
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              variant="brand"
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={
                steps?.length === currentStep ? handleSubmit : handleNext
              }
            >
              {steps?.length === currentStep ? "Submit" : "Next"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default BookedModel;
