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

  const steps = [
    { id: 1, label: "First", description: "Contact Info" },
    { id: 2, label: "Second", description: "Bank Details" },
  ];
  const param = useParams();

  const validationSchema = yup.object({
    category: yup.string().required("Currency Is Required"),
    lead: yup.string(),
    contact: yup.string(),
    // imagefirst: yup.array(),
    // secondimage: yup.array(),
    currency: yup.string().required("Currency Is Required"),
    ksh: yup.number(),
    usd: yup.number(),
    accountName: yup.string().required("Account Name Is Required"),
    bank: yup.string().required("Bank Is Required"),
    branch: yup.string().required("Branch Is Required"),
    accountNumber: yup.number().required("Account Number Is Required"),
    swiftCode: yup.number().required("swiftCode Is Required"),
  });

  const formik = useFormik({
    initialValues: {
      category: "lead",
      lead: "",
      contact: "",
      imagefirst: [],
      secondimage: [],
      currency: "",
      accountName: "",
      bank: "",
      ksh: "",
      usd: "",
      branch: "",
      accountNumber: "",
      swiftCode: "",
    },
    validationSchema,
    onSubmit: () => {
      submitStepperData();
      handleNextBtn();
    },
  });
  const { values, handleChange, handleSubmit, setFieldValue, errors, touched } =
    formik;

  const handleNextBtn = () => {
    console.log(values);
  };

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
            <IconButton onClick={onClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
            <div className="stepper">
              <div className="stepper-wrapper">
                {steps?.map((step, index) => (
                  <React.Fragment key={step?.id}>
                    <div
                      className={`step ${currentStep >= step?.id ? "active" : ""}`}
                    >
                      <div className="step-number">{step?.id}</div>
                      <div className="step-info">
                        <h4>{step?.label}</h4>
                        <p style={{ textAlign: "center", width: "120px" }}>
                          {step?.description}
                        </p>
                      </div>
                    </div>
                    {/* Add a line between steps, but not after the last step */}
                    {index !== steps.length - 1 && (
                      <div
                        className={`step-line ${currentStep > step?.id ? "completed" : ""}`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {/* Conditional Rendering of Form Fields */}
              <div className="step-content">
                {currentStep === 1 && (
                  <>
                    <div>
                      <FirstStepper formik={formik} />
                    </div>
                    <DrawerFooter>
                      <div className="stepper-actions">
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="red"
                          onClick={() =>
                            setCurrentStep((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentStep === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="brand"
                          onClick={() => {
                            setCurrentStep((prev) =>
                              Math.min(prev + 1, steps.length)
                            );
                            handleNextBtn();
                          }}
                          disabled={currentStep === steps.length}
                        >
                          Next
                        </Button>
                      </div>
                    </DrawerFooter>
                  </>
                )}
                {/* Placeholder content for other steps */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <BankDetails
                        setCurrentStep={setCurrentStep}
                        currentStep={currentStep}
                        steps={steps}
                        handleNextBtn={handleNextBtn}
                        formik={formik}
                      />
                    </div>
                    <ModalFooter
                      style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                      }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        mr={2}
                        onClick={() =>
                          setCurrentStep((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentStep === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        colorScheme="brand"
                        size="sm"
                      >
                        Submit
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default BookedModel;
