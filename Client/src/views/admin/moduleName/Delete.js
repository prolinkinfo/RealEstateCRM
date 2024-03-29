import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRouteData } from '../../../redux/routeSlice';
import { deleteManyApi } from 'services/api';
import { deleteApi } from 'services/api';

const Delete = (props) => {
    const { selectedId, fetchData, onClose, isOpen, data, setSelectedValues } = props;
    const [isLoding, setIsLoding] = useState(false)

    const dispatch = useDispatch();

    const handleDeleteClick = async () => {
        if (props.method === 'one') {
            try {
                if (selectedId) {
                    setIsLoding(true)
                    const response = await deleteApi('api/custom-field/module/', selectedId)
                    if (response.status === 200) {
                        await dispatch(fetchRouteData());
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
        } else if (props.method === 'many') {
            try {
                setIsLoding(true)
                let response = await deleteManyApi('api/custom-field/deleteMany-Module', data)
                if (response.status === 200) {
                    await dispatch(fetchRouteData());
                    setSelectedValues([])
                    onClose(false)
                    fetchData()
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
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Validation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Delete selected Module?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" size="sm" mr={2} onClick={handleDeleteClick} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Yes'}</Button>
                        <Button variant="outline" size="sm" onClick={handleClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Delete
