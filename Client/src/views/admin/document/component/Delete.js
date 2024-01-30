import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { deleteManyApi } from 'services/api';

const Delete = (props) => {
    const handleDeleteClick = async () => {
        if (props.method === 'one') {
            props.deleteFile(props.id)
            props.onClose(false)
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
                    <ModalHeader>Delete Document{props.method === 'one' ? '' : 's'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Delete selected Document{props.method === 'one' ? '' : 's'} ?
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" colorScheme="red" mr={2} onClick={handleDeleteClick}>Yes</Button>
                        <Button size="sm" variant="outline" onClick={handleClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Delete
