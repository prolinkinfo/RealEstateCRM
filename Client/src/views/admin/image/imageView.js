import { Button, Grid, GridItem, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import React from 'react';
import { useState } from 'react';
import { putApi } from 'services/api';
import Dropzone from "components/Dropzone";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fetchImage } from '../../../redux/slices/imageSlice'

const ImageView = (props) => {
    const { data, fetchData, setImageData, handleDeleteOpen, imageviewData } = props;
    const [isLoding, setIsLoding] = useState(false)
    const dispatch = useDispatch()

    const authimg = 'authimage';
    const logoimg = 'logoimg'
    const largelogoimg = 'largelogoimg'

    const changeImage = async (file, type) => {
        try {
            setIsLoding(true);
            const formData = new FormData();

            if (type === authimg) {
                formData?.append('authImg', file?.[0]);
            }

            if (type === logoimg) {
                formData?.append('logoSmImg', file?.[0]);
            }

            if (type === largelogoimg) {
                formData?.append('logoLgImg', file?.[0]);
            }
            if (type === authimg || type === logoimg || type === largelogoimg) {
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
            <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>View Images</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Grid templateColumns={'repeat(12, 1fr)'} gap={5}>
                            <GridItem colSpan={{ base: 12, md: 6 }} display={"flex"} justifyContent={"center"}>
                                <div>
                                    <Text fontWeight={"600"} ps={3}>Navbar Small Logo Image</Text>
                                    <div className="imageCard" style={{ margin: "10px" }}>
                                        <Image src={data?.logoSmImg} height={"100px"} width={"100%"} />
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
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} display={"flex"} justifyContent={"center"}>
                                <div>
                                    <Text fontWeight={"600"} ps={3}>Navbar Large Logo Image</Text>
                                    <div className="imageCard" style={{ margin: "10px" }}>
                                        <Image src={data?.logoLgImg} height={"100px"} width={"100%"} />
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
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }} display={"flex"} justifyContent={"center"}>
                                <div>
                                    <Text fontWeight={"600"} ps={3}>Login page Image</Text>
                                    <div className="imageCard" style={{ margin: "10px" }}>
                                        <Image src={data?.authImg} height={"100px"} width={"100%"} />
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
                            </GridItem>
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" mr={2} size='sm' onClick={() => setImageData(data)} disabled={isLoding ? true : false}>{isLoding ? <Spinner /> : 'Set Image'}</Button>
                        <Button colorScheme="red"
                            size='sm'
                            disabled={data?.isActive === true ? true : false}
                            onClick={() => { handleDeleteOpen(imageviewData); }}
                        >Delete</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ImageView
