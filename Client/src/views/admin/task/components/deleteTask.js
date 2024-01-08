import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useState } from 'react';
import { deleteApi, deleteManyApi } from 'services/api';
import { useNavigate } from 'react-router-dom';

const DeleteTask = (props) => {
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()
    const handleDeleteClick = async () => {
        if (props.method === 'one') {
            try {
                setIsLoding(true)
                const response = await deleteApi(props.url, props.id)
                if (response.status === 200) {
                    props.viewClose();
                    props.onClose(false)
                    !props.redirectPage && props.fetchData()
                    navigate(props.redirectPage)
                    props.setAction((pre) => !pre)
                }

            } catch (error) {
                console.log(error)
            }
            finally {
                setIsLoding(false)
            }
        } else if (props.method === 'many') {
            try {
                setIsLoding(true)
                let response = await deleteManyApi(props.url, props.data)
                if (response.status === 200) {
                    props.viewClose();
                    props.onClose(false)
                    props.fetchData()
                    props.setAction((pre) => !pre)
                }
            } catch (error) {
                console.log(error)
            }
            finally {
                setIsLoding(false)
            }
        }
    };

    const handleClose = () => {
        props.onClose(false)
    }

    return (
        <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delete Task{props.method === 'one' ? '' : 's'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are You Sure To Delete selated Task{props.method === 'one' ? '' : 's'} ?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={2} onClick={handleDeleteClick} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Yes'}</Button>
                    <Button variant="outline" onClick={handleClose}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DeleteTask
