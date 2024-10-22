import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CommonDeleteModel = (props) => {
    const { isOpen, onClose, type, handleDeleteData, ids, selectedValues } = props
    const [isLoding, setIsLoding] = useState(false)

    const handleDelete = () => {
        handleDeleteData(ids, selectedValues)
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <div>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete {`${type}`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Delete selected {`${type}`} ?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" size="sm" mr={2} onClick={handleDelete} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Yes'}</Button>
                        <Button variant="outline" size="sm" onClick={handleClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default CommonDeleteModel
