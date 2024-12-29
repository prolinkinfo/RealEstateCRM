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
import { CloseIcon } from "@chakra-ui/icons";
import UserDetailsForm from "./soldForm/UserDetailsForm";
import { useFormik } from "formik";

function SoldModel(props) {
  const { isOpen, onClose } = props;

  const formik = useFormik({
    initialValues: {
      category: "Lead",
    },
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      console.log("submit");
    },
  });

  const { handleSubmit } = formik;

  return (
    <Drawer isOpen={isOpen} size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          alignItems={"center"}
          justifyContent="space-between"
          display="flex"
        >
          Sold
          <IconButton onClick={onClose} icon={<CloseIcon />} />
        </DrawerHeader>
        <DrawerBody>
          <UserDetailsForm formik={formik} />
        </DrawerBody>
        <DrawerFooter>
          <Button
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
          </Button>
          <Button
            variant="brand"
            size="sm"
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
export default SoldModel;
