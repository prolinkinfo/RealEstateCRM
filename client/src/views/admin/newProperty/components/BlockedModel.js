import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';

function BlockedModel (props){
    const {onClose,isOpen} = props
    return(
        <>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Blocked 
                        {/* {`${type}`} */}
                        </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Block selected 
                        {/* {`${type}`} ? */}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" size="sm" type="submit" mr={2} >Yes</Button>
                        <Button variant="outline" size="sm" type='submit' onClick={onClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default BlockedModel