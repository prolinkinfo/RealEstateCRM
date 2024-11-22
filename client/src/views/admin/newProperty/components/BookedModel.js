import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
} from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postApiBlob } from "services/api";
import * as yup from "yup";
import "../../../../assets/css/stepper.css";
import { BankDetails } from "./bookedStepperForm/BankDetails";
import { FirstStepper } from "./bookedStepperForm/FirstStepper";
import PaymentSchedule from "./bookedStepperForm/PaymentSchedule";

function BookedModel(props) {
  const { isOpen, onClose, selectedFloorItem, setAction } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const [assignToLeadData, setAssignToLeadData] = useState([]);
  const [assignToContactData, setAssignToContactData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const param = useParams();

  const validationSchemas = [
    yup.object({
      category: yup.string().required("Category is required"),
      lead: yup.string(),
      contact: yup.string(),
    }),
    yup.object({
      currency: yup.string().required("Currency is required"),
      amount: yup
        .number()
        .typeError("Amount must be a number")
        .required("Amount is required"),
      accountName: yup.string().required("Account name is required"),
      bank: yup.string().required("Bank is required"),
      branch: yup.string().required("Branch is required"),
      accountNumber: yup
        .number()
        .required("Account Number is required")
        .typeError("Account Number must be a number"),
      swiftCode: yup
        .number()
        .required("Swift code is required")
        .typeError("Swift code must be a number"),
    }),
    yup.object({
      installments: yup
        .array()
        .of(
          yup.object({
            no: yup.number().required(),
            startDate: yup.date().required("Start date is required"),
            title: yup.string().required("Title is required"),
            per: yup
              .number()
              .max(100, "Percentage must not exceed 100")
              .required("Percentage is required"),
            // months: yup.number().required("Months are required"),
            total: yup.number().required("Total is required"),
          })
        )
        .min(1, "At least one installment is required"),
    }),
  ];

  const formik = useFormik({
    initialValues: {
      category: "contact",
      currency: "ksh",
      lead: "",
      contact: "",
      amount: "",
      accountName: "",
      bank: "",
      branch: "",
      accountNumber: "",
      swiftCode: "",
      installments: [
        {
          no: 1,
          title: "",
          startDate: "",
          per: "",
          months: "",
          total: "",
        },
      ],
    },
    validationSchema: validationSchemas[currentStep - 1],
    validate: (values) => {
      let errors = {};

      if (!values?.lead && !values?.contact) {
        // errors.lead = "Lead or contact are required";
        errors.contact = "Contact are required";
      }

      return errors;
    },
    onSubmit: () => {
      if (steps?.length === currentStep) {
        submitStepperData();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    },
  });

  const { values, handleSubmit, resetForm, validateForm } = formik;

  const steps = [
    {
      description: "Contact Info",
      component: (
        <FirstStepper
          formik={formik}
          assignToLeadData={assignToLeadData}
          setAssignToLeadData={setAssignToLeadData}
          assignToContactData={assignToContactData}
          setAssignToContactData={setAssignToContactData}
        />
      ),
    },
    {
      description: "Bank Details",
      component: (
        <BankDetails
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          formik={formik}
          assignToLeadData={assignToLeadData}
          assignToContactData={assignToContactData}
        />
      ),
    },
    {
      description: "Payment Schedule",
      component: <PaymentSchedule formik={formik} />,
    },
  ];

  const submitStepperData = async () => {
    try {
      const formData = new FormData();

      formData?.append("unit", JSON.stringify(selectedFloorItem?.item));
      formData?.append("floor", JSON.stringify(selectedFloorItem?.floor));

      Object?.keys(values)?.forEach((item) => {
        const value = values[item];
        formData.append(
          item,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      });

      formData?.append("buyerImage", values?.buyerImage);
      formData?.append("salesManagerSign", values?.salesManagerSign);

      const response = await postApiBlob(
        `api/property/genrate-offer-letter/${param?.id}`,
        formData
      );
      if (response?.status === 200) {
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        saveAs(pdfBlob, "offer-letter.pdf");
        handleClose();
        setAction((pre) => !pre);
      }
    } catch (e) {
      console.log(e);
      toast.error(`server error`);
    }
  };

  const handleNext = async () => {
    if (formik?.isValid && formik?.dirty) {
      formik.setTouched({});
      formik.resetForm({ values: formik.values });
      setCurrentStep((prev) => prev + 1);
    } else {
      await validateForm();
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const handleClose = () => {
    onClose();
    resetForm();
    setCurrentStep(1);
  };

  return (
    <>
      <Drawer isOpen={isOpen} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            alignItems={"center"}
            justifyContent="space-between"
            display="flex"
          >
            Booked
            <IconButton onClick={handleClose} icon={<CloseIcon />} />
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
