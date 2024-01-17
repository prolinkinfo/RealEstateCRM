import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { putApi } from 'services/api';
import Dropzone from "components/Dropzone";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fetchImage } from '../../../redux/imageSlice'

const ImageView = (props) => {
    const { data, fetchData } = props;
    const [isLoding, setIsLoding] = useState(false)
    const dispatch = useDispatch()

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

    const authimg = 'authimage';
    const logoimg = 'logoimg'
    const largelogoimg = 'largelogoimg'

    const changeImage = async (file, type) => {
        try {
            setIsLoding(true);
            const formData = new FormData();

            if (type == authimg) {
                formData?.append('authImg', file?.[0]);
            }

            if (type == logoimg) {
                formData?.append('logoSmImg', file?.[0]);
            }

            if (type == largelogoimg) {
                formData?.append('logoLgImg', file?.[0]);
            }
            if (type == authimg || type == logoimg || type == largelogoimg) {
                const response = await putApi(`api/images/change-auth-logo-img/${data?._id}`, formData);
                if (response.status === 200) {
                    fetchData(data?._id);
                    dispatch(fetchImage());
                    toast.success(response?.data?.message);
                } else {
                    toast.error(response?.response?.data?.message);
                }
            }

        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };
    return (
        <div>
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>View Images</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex wrap='wrap' justifyContent={"center"}>
                            <div>

                                <label>Small Logo Image</label>
                                <div className="imageCard" style={{ margin: "10px" }}>
                                    <Image src={data?.logoSmImg} height={"100px"} width={"180px"} />
                                    <div className='imageContent'>
                                        <Dropzone
                                            borderRadius="0"
                                            isMultipleAllow={false}
                                            onFileSelect={(file) => changeImage(file, logoimg)}
                                            content={
                                                <Button size='sm' variant="brand">Change</Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>

                                <label>Large Logo Image</label>
                                <div className="imageCard" style={{ margin: "10px" }}>
                                    <Image src={data?.logoLgImg} height={"100px"} width={"180px"} />
                                    <div className='imageContent'>
                                        <Dropzone
                                            borderRadius="0"
                                            isMultipleAllow={false}
                                            onFileSelect={(file) => changeImage(file, largelogoimg)}
                                            content={
                                                <Button size='sm' variant="brand">Change</Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label>Auth Image</label>
                                <div className="imageCard" style={{ margin: "10px" }}>
                                    <Image src={data?.authImg} height={"100px"} width={"180px"} />
                                    <div className='imageContent'>
                                        <Dropzone
                                            borderRadius="0"
                                            isMultipleAllow={false}
                                            onFileSelect={(file) => changeImage(file, authimg)}
                                            content={
                                                <Button size='sm' variant="brand" >Change</Button>
                                            }
                                        />
                                    </div>
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
