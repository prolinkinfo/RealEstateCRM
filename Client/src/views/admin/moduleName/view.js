import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import React, { useState } from 'react'
import Edit from './Edit';

const View = (props) => {
    const { onClose, isOpen, selectedId, fetchData, setAction } = props;
    const [isLoding, setIsLoding] = useState(false)
    const [data, setData] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const handleEditClose = () => {
        setEditModal(false)
    }

    return (
        <div>
            <Modal onClose={onClose} isOpen={isOpen} isCentered size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textTransform={"capitalize"}>{data?.name} </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12 }}>
                                    <Flex>
                                        <Text fontWeight={"bold"} pr={2} textTransform={"capitalize"}>require :</Text>
                                        <Text >
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[0]?.require === true ? "True" : "False"}
                                        </Text>
                                    </Flex>
                                </GridItem>
                            </Grid>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" colorScheme='green' size='sm' me={2} onClick={() => { onClose(); setEditModal(true) }} leftIcon={<EditIcon />}>Edit</Button>
                        <Button colorScheme="red" size='sm' mr={2} disabled={isLoding ? true : false} leftIcon={<DeleteIcon />} >{isLoding ? <Spinner /> : 'Delete'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Edit isOpen={editModal} onClose={handleEditClose} selectedId={props.selectedId} editdata={data} setAction={setAction} fetchData={fetchData} />
        </div>
    )
}

export default View
