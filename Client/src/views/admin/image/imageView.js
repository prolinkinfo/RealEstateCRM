import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { putApi } from 'services/api';


const ImageView = (props) => {
    const { data } = props;
    const [isLoding, setIsLoding] = useState(false)

    const setImageData = async () => {
        try {
            setIsLoding(true)
            let response = await putApi(`api/images/isActive/${data?._id}`, { isActive: true });
            if (response.status === 200) {
                props.onClose();
                props.setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    }

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
                                <Image src={data?.authImg} height={"100px"} width={"180px"} />
                                <div className='imageContent'>
                                    <Button size='sm' variant="brand">Change</Button>
                                </div>
                            </div>
                            <div className="imageCard" style={{ margin: "10px" }}>
                                <Image src={data?.logoSmImg} height={"100px"} width={"180px"} />
                                <div className='imageContent'>
                                    <Button size='sm' variant="brand">Change</Button>
                                </div>
                            </div>
                            <div className="imageCard" style={{ margin: "10px" }}>
                                <Image src={data?.logoLgImg} height={"100px"} width={"180px"} />
                                <div className='imageContent'>
                                    <Button size='sm' variant="brand">Change</Button>
                                </div>
                            </div>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" mr={2} size='sm' onClick={() => { setImageData() }} disabled={isLoding ? true : false}>{isLoding ? <Spinner /> : 'Set Image'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ImageView
