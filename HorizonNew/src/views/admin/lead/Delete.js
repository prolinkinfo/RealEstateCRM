import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteManyApi } from 'services/api';
import { deleteApi } from 'services/api';

const Delete = (props) => {

    const navigate = useNavigate()
    const handleDeleteClick = async () => {
        if (props.method === 'one') {
            try {
                const response = await deleteApi(props.url, props.id)
                if (response.status === 200) {
                    navigate('/lead')
                }
            } catch (error) {
                console.log(error)
            }
        } else if (props.method === 'many') {
            try {
                let response = await deleteManyApi(props.url, props.data)
                if (response.status === 200) {
                    props.setSelectedValues([])
                    props.onClose(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    };

    const handleClose = () => {
        props.onClose(false)
    }

    return (
        <div>
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Lead{props.method === 'one' ? '' : 's'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Delete selated Lead{props.method === 'one' ? '' : 's'} ?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={2} onClick={handleDeleteClick}>Yes</Button>
                        <Button variant="outline" onClick={handleClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Delete
