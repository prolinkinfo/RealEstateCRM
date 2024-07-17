import { Box, Button, Flex, Grid, GridItem, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Card from 'components/card/Card'
import React, { useEffect, useState } from 'react'
import { fetchImage } from "../../../redux/slices/imageSlice";
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
    const [imageviewData, setImageViewData] = useState({})
    const [deleteOpen, setDelete] = useState(false)
    const [data, setData] = useState(false)
    const [selectedId, setSelectedId] = useState(false)
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()



    const fetchData = async (selectedId) => {
        setIsLoding(true)
        let result = await getApi(`api/images/view/${selectedId}`);
        setData(result.data)
        setIsLoding(false)
    }
    const image = useSelector((state) => state?.images?.images);
    const load = useSelector((state) => state?.images);
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
                setImageView(false)
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
    useEffect(() => {
        dispatch(fetchImage());
    }, [dispatch]);

    useEffect(() => {
        if (image?.length === 0) {
            localStorage.removeItem('persist:image')
        }
    }, [image])

    return (
        <>
            <Card>
                <Flex justifyContent={'end'}>
                    <Button variant='brand' size='sm' onClick={() => setImageModal(true)} leftIcon={<AddIcon />}>Add New</Button>
                    <Button onClick={() => navigate('/admin-setting')} variant="brand" size="sm" leftIcon={<IoIosArrowBack />} ml={2}>Back</Button>
                </Flex>
                {!(load.status === 'succeeded') ? <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={'black'} fontSize="sm" fontWeight="700">
                    <Spinner />
                </Flex> : <Card>
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
                                        <Button size='sm' variant="brand" mx={1} onClick={() => { handleViewOpen(item); setImageViewData(item) }}>View</Button>
                                        <Button size="sm" colorScheme="red" disabled={item?.isActive === true ? true : false} onClick={() => { handleDeleteOpen(item) }}>Delete</Button>
                                    </div>
                                </div>
                            </GridItem>
                        ))}
                    </Grid>
                    {!image?.length > 0 && <Text textAlign={'center'} width="100%" color={'gray.500'} fontSize="sm" fontWeight="700"><DataNotFound /></Text>}
                </Card>}
            </Card>

            <ImageView isOpen={imageview}
                onClose={handleViewClose}
                image={image}
                handleDeleteOpen={handleDeleteOpen}
                imageviewData={imageviewData}
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