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

function BlockedModel(props) {
  const { onClose, isOpen, clickOnYes } = props;
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Blocked
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are You Sure To Block selected
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" size="sm" type="submit" mr={2} onClick={clickOnYes}>
              Yes
            </Button>
            <Button variant="outline" size="sm" type="submit" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default BlockedModel;
