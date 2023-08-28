import { LinkIcon } from '@chakra-ui/icons';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteManyApi } from 'services/api';
import { deleteApi } from 'services/api';

const Link = (props) => {


    const handleClick = async () => {
        try {


        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        props.onClose(false)
    }

    return (
        <div>
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Link Document</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                    


                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='brand' rightIcon={<LinkIcon />} mr={2} onClick={handleClick}>Link</Button>
                        <Button variant="outline" colorScheme='red' onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Link
