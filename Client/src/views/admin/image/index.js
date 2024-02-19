import { Box, Button, Flex, Grid, GridItem, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import Card from 'components/card/Card'
import React, { useEffect, useState } from 'react'
import { fetchImage } from "../../../redux/imageSlice";
import { useDispatch, useSelector } from 'react-redux'
import ImageView from './imageView';
import AddImage from './addImage';
import { getApi } from 'services/api';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { putApi } from 'services/api';
import { AddIcon } from '@chakra-ui/icons';
import DataNotFound from 'components/notFoundData';
import { deleteApi } from 'services/api';
import Spinner from 'components/spinner/Spinner';

const ChangeImage = () => {
    const [imageModal, setImageModal] = useState(false)
    const dispatch = useDispatch();
    const [imageview, setImageView] = useState(false)
    const [deleteOpen, setDelete] = useState(false)
    const [data, setData] = useState(false)
    const [selectedId, setSelectedId] = useState(false)
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchImage());
    }, [dispatch]);

    const fetchData = async (selectedId) => {
        setIsLoding(true)
        let result = await getApi(`api/images/view/${selectedId}`);
        setData(result.data)
        setIsLoding(false)
    }
    const image = useSelector((state) => state?.images?.image);
    const handleViewOpen = (item) => {
        fetchData(item._id)
        setImageView(!imageview)
    }
    const handleViewClose = () => {
        setImageView(false)
    }
    const handleDeleteClose = () => { setDelete(false) }
    const handleDeleteOpen = (item) => {
        setDelete(!deleteOpen);
        setSelectedId(item._id)
    }

    const handleDelete = async () => {
        try {
            setIsLoding(true)
            let response = await deleteApi(`api/images/delete/`, selectedId);
            if (response.status === 200) {
                dispatch(fetchImage());
                setDelete(false);
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    }

    const setImageData = async (item) => {
        try {
            setIsLoding(true)
            let response = await putApi(`api/images/isActive/${item?._id}`, { isActive: true });
            if (response.status === 200) {
                handleViewClose();
                dispatch(fetchImage());
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    }

    return (
        <>
            <Card>
                <Flex justifyContent={'end'}>
                    <Button variant='brand' size='sm' onClick={() => setImageModal(true)} leftIcon={<AddIcon />}>Add New</Button>
                    <Button onClick={() => navigate('/admin-setting')} variant="brand" size="sm" leftIcon={<IoIosArrowBack />} ml={2}>Back</Button>
                </Flex>
                <Card>
                    <Grid templateColumns={'repeat(12, 1fr)'} gap={5}>
                        {image?.length > 0 && image?.map((item, i) => (
                            <GridItem colSpan={{ base: 12, md: 4, lg: 3 }}>
                                <div className="imageCard">
                                    <Image src={item?.authImg} height={"200px"} width={"100%"} />
                                    {item?.isActive === true ? <Box backgroundColor={"#422afb"} color={"#fff"} height={"20px"} width={"140px"} position={"absolute"} top={"18px"} right={"-40px"} transform={"rotate(45deg)"} fontSize={"16px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                        Active
                                    </Box> : ""}
                                    <div className='imageContent'>
                                        <Button size='sm' variant="brand" onClick={() => setImageData(item)}>Set Image</Button>
                                        <Button size='sm' variant="brand" mx={1} onClick={() => handleViewOpen(item)}>View</Button>
                                        <Button size="sm" colorScheme="red" onClick={() => handleDeleteOpen(item)}>Delete</Button>
                                    </div>
                                </div>
                            </GridItem>
                        ))}
                    </Grid>
                    {!image?.length > 0 && <DataNotFound />}
                </Card>
            </Card>

            <ImageView isOpen={imageview}
                onClose={handleViewClose}
                image={image}
                fetchData={fetchData}
                data={data}
                setImageData={setImageData}
            />
            <AddImage imageModal={imageModal} setImageModal={setImageModal} fetchData={fetchImage} />
            {/* Delete modal */}
            <Modal onClose={handleDeleteClose} isOpen={deleteOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Images</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Delete selected Images ?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" size="sm" mr={2} onClick={handleDelete} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Yes'}</Button>
                        <Button variant="outline" size="sm" onClick={handleDeleteClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ChangeImage