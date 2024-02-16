import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteApi, deleteManyApi } from 'services/api';

const DeleteHeading = (props) => {
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()
    const handleDeleteClick = async () => {
        if (props.method === 'one') {
            try {
                setIsLoding(true)
                const response = await deleteApi(`api/custom-field/delete-heading/${props.selectedId}?moduleId=`, props.moduleId)
                if (response.status === 200) {
                    props.onClose(false)
                    props.fetchData()
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
                const payload = {
                    moduleId: props.moduleId,
                    headingsIds: props.data
                }
                let response = await deleteManyApi(props.url, payload)
                if (response.status === 200) {
                    props.setSelectedValues([])
                    props.onClose(false)
                    props.fetchData()
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
        <div>
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete {props.moduleName}{props.method === 'one' ? '' : 's'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Delete selected {props.moduleName}{props.method === 'one' ? '' : 's'} heading?
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" colorScheme="red" mr={2} onClick={handleDeleteClick} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Yes'}</Button>
                        <Button size="sm" variant="outline" onClick={handleClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
    // }
}

export default DeleteHeading;