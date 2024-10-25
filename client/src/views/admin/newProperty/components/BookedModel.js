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

function BookedModel(props) {
  const { isOpen, onClose } = props;
  const [currentStep, setCurrentStep] = useState(1);
  // currentStep == 1 that show in 1 then currenStep == 2 that show in 2
  const steps = [
    { id: 1, label: "First", description: "Contact Info" },
    { id: 2, label: "Second", description: "Bank Details" },
  ];

  const validationSchema = yup.object({
    category: yup.string().required("Currency Is Required"),
    lead: yup.string(),
    contact: yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      category: "lead",
      lead: "",
      contact: "",
    },
    validationSchema,
    onSubmit: () => {
      console.log();
    },
  });
  const { values, handleChange, handleSubmit, setFieldValue, errors, touched } =
    formik;

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
                  <div>
                    <FirstStepper
                      formik={formik}
                    />
                    <ModalFooter>
                      <div className="stepper-actions">
                        <Button
                          onClick={() =>
                            setCurrentStep((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentStep === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() =>
                            setCurrentStep((prev) =>
                              Math.min(prev + 1, steps.length)
                            )
                          }
                          disabled={currentStep === steps.length}
                        >
                          Next
                        </Button>
                      </div>
                    </ModalFooter>
                  </div>
                )}
                {/* Placeholder content for other steps */}
                {currentStep === 2 && (
                  <div>
                    {/* Select Date & Time */}
                    <BankDetails
                      setCurrentStep={setCurrentStep}
                      currentStep={currentStep}
                      steps={steps}
                    />
                  </div>
                )}
              </div>
              {/* <div className="stepper-actions">
        <Button
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
          disabled={currentStep === steps.length}
        >
          Next
        </Button>
      </div> */}
            </div>
            {/* <CustomForm moduleData={props?.leadData} values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} /> */}
          </DrawerBody>
          <DrawerFooter>
            {/* <Button sx={{ textTransform: "capitalize" }} size="sm" disabled={isLoding ? true : false} variant="brand" type="submit" onClick={handleSubmit}                        >
                            {isLoding ? <Spinner /> : 'Save'}
                        </Button> */}
            {/* <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={onClose}
            >
              Close
            </Button> */}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default BookedModel;
