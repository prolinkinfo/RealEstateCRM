import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteManyApi } from 'services/api';
import { deleteApi } from 'services/api';

const ImageView = (props) => {
    const [isLoding, setIsLoding] = useState(false)

    const navigate = useNavigate()
    console.log(props.image)
    return (
        <div>
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>View Images</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex wrap='wrap' justifyContent={"center"}>
                            <div className="imageCard" style={{ margin: "10px" }}>
                                <Image src={""} height={"100px"} width={"180px"} />
                                <div className='imageContent'>
                                    <Button size='sm' variant="brand">Set Image</Button>
                                    <Button size='sm' variant="brand" ms={1} >View</Button>
                                </div>
                            </div>
                            <div className="imageCard" style={{ margin: "10px" }}>
                                <Image src={""} height={"100px"} width={"180px"} />
                                <div className='imageContent'>
                                    <Button size='sm' variant="brand">Set Image</Button>
                                    <Button size='sm' variant="brand" ms={1} >View</Button>
                                </div>
                            </div>
                            <div className="imageCard" style={{ margin: "10px" }}>
                                <Image src={""} height={"100px"} width={"180px"} />
                                <div className='imageContent'>
                                    <Button size='sm' variant="brand">Set Image</Button>
                                    <Button size='sm' variant="brand" ms={1} >View</Button>
                                </div>
                            </div>

                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" mr={2} size='sm'>{isLoding ? <Spinner /> : 'Set Image'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ImageView
