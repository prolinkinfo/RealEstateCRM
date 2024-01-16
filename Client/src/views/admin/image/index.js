import { Box, Button, Flex, Grid, GridItem, Image } from '@chakra-ui/react'
import Card from 'components/card/Card'
import React, { useEffect, useState } from 'react'
import { fetchImage } from "../../../redux/imageSlice";
import { useDispatch, useSelector } from 'react-redux'
import ImageView from './imageView';
import AddImage from './addImage';

const ChangeImage = () => {
    const [imageModal, setImageModal] = useState(false)
    const dispatch = useDispatch();
    const [imageview, setImageView] = useState(false)
    const [action, setAction] = useState(false)
    useEffect(() => {
        dispatch(fetchImage());
    }, [dispatch]);

    const image = useSelector((state) => state?.images?.image);
    const handleViewOpen = () => {
        setImageView(!imageview)
    }
    const handleViewClose = () => {
        setImageView(!imageview)
    }

    return (
        <>
            <Card>
                <Flex justifyContent={'end'}>
                    <Button variant='brand' size='sm' onClick={() => setImageModal(true)}>New Image</Button>
                </Flex>
                <Card>
                    <Grid templateColumns={'repeat(12, 1fr)'} gap={5}>
                        {image?.length > 0 && image?.map((item, i) => (
                            <GridItem colSpan={{ base: 12, md: 4, lg: 3 }}>
                                <div className="imageCard">
                                    <Image src={item?.authImg} height={"200px"} width={"400px"} />
                                    <div className='imageContent'>
                                        <Button size='sm' variant="brand">Set Image</Button>
                                        <Button size='sm' variant="brand" ms={1} onClick={() => handleViewOpen()}>View</Button>
                                    </div>
                                </div>
                            </GridItem>
                        ))}
                    </Grid>
                </Card>
            </Card>

            <ImageView isOpen={imageview}
                onClose={handleViewClose}
                image={image}
            />
            <AddImage imageModal={imageModal} setAction={setAction} setImageModal={setImageModal} fetchData={fetchImage} />
        </>
    )
}

export default ChangeImage