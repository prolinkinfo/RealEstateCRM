import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

function ChangeStatusModel(props) {
  const { onClose, isOpen, clickOnYes, title, message } = props;
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title || "Change Status"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{message || "Are you sure to change status"}</ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            type="submit"
            mr={2}
            onClick={clickOnYes}
          >
            Yes
          </Button>
          <Button variant="outline" colorScheme="red" size="sm" type="submit" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default ChangeStatusModel;
