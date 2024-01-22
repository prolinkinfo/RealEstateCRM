import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import React, { useState } from 'react'

const Edit = (props) => {
    const { onClose, isOpen } = props;
    const [isLoding, setIsLoding] = useState(false)


    return (
        <div>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        hello
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" size='sm' mr={2} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
                        <Button variant="outline" size='sm' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Edit
