import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteApi, deleteManyApi } from 'services/api';

const CommonDeleteModel = (props) => {
    const { isOpen, onClose, type,handleDeleteData,ids } = props
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()
    const param = useParams()

    // const handleDeleteClick = async () => {
    //     if (props.method === 'one') {
    //         try {
    //             setIsLoding(true)
    //             const response = await deleteApi(props.url, props.id)
    //             if (response.status === 200) {
    //                 navigate('/lead')
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //         finally {
    //             setIsLoding(false)
    //         }
    //     } else if (props.method === 'many') {
    //         try {
    //             setIsLoding(true)
    //             let response = await deleteManyApi(props.url, props.data)
    //             if (response.status === 200) {
    //                 props.setSelectedValues([])
    //                 props.onClose(false)
    //                 props.setAction((pre) => !pre)
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //         finally {
    //             setIsLoding(false)
    //         }
    //     }
    // };

    const handleDelete = () => {
        handleDeleteData(ids)
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
