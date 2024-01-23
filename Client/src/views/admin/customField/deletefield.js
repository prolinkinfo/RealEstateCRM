import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteApi, deleteManyApi } from 'services/api';

const DeleteFiled = (props) => {
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()
    const handleDeleteClick = async () => {
        // isf (props.method === 'one') {
        try {
            setIsLoding(true)
            const response = await deleteApi(`api/custom-field/delete/${props.selectedId}?moduleId=`, props.moduleId)
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
    };

    const handleClose = () => {
        props.onClose(false)
    }

    return (
        <div>
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Lead</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Delete selected {props.moduleName} filed?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={2} onClick={handleDeleteClick} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Yes'}</Button>
                        <Button variant="outline" onClick={handleClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
    // }
}

export default DeleteFiled;
