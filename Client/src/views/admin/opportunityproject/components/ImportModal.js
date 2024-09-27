import {Button,Grid,GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import OpportunityprojectImport from "./opportunityprojectImport";
import { useNavigate } from "react-router-dom";
import CommonFileUpload from "components/commonFileUpload";

const ImportModal = (props) => {
  const { onClose, isOpen, text, customFields } = props;
  const [isLoding, setIsLoding] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    opportunityproject: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values, { resetForm }) => {
      console.log(values, "values");
      AddData();
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

  const AddData = async () => {
    try {
      setIsLoding(true);
      resetForm();
      console.log(values.opportunityproject,"PPPPPPPPPPPPP");
      if (values.opportunityproject) {
        onClose();
        navigate("/opportunityProjectImport", {
          state: { fileData: values.opportunityproject, customFields: customFields },
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <>
    <OpportunityprojectImport />
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import Opportunity Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <CommonFileUpload
                count={values.opportunityproject.length}
                onFileSelect={(file) =>
                  setFieldValue("opportunityproject", file)
                }
                text={text}
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.opportunityproject && touched.opportunityproject && <>Please Select {text}</>}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            onClick={handleSubmit}
            disabled={isLoding ? true : false}
          >
            {isLoding ? <Spinner /> : "Save"}
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            size="sm"
            onClick={() => {
              onClose();
              formik.resetForm();
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

export default ImportModal;