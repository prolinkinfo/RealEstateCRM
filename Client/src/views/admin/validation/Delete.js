import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteApi } from 'services/api';

const Delete = (props) => {
    const { selectedId, fetchData, onClose, isOpen } = props;
    const [isLoding, setIsLoding] = useState(false)

    const handleDeleteClick = async () => {
        try {
            if (selectedId) {
                setIsLoding(true)
                const response = await deleteApi('api/validation/delete/', selectedId)
                if (response.status === 200) {
                    onClose()
                    fetchData()
                }
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }

    };

    const handleClose = () => {
        props.onClose(false)
    }

    return (
        <div>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Validation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Delete selected Validation?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={2} onClick={handleDeleteClick} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Yes'}</Button>
                        <Button variant="outline" onClick={handleClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Delete
