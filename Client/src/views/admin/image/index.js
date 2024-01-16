import { Box, Button, Flex, Grid, GridItem, Image } from '@chakra-ui/react'
import Card from 'components/card/Card'
import React, { useEffect, useState } from 'react'
import { fetchImage } from "../../../redux/imageSlice";
import { useDispatch, useSelector } from 'react-redux'
import AddImage from './addImage';

const ChangeImage = () => {
    const [imageModal, setImageModal] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchImage());
    }, [dispatch]);

    const image = useSelector((state) => state?.images?.image);


    console.log(image, "image");
    return (
        <Card>
            <Flex justifyContent={'end'}>
                <Button variant='brand' size='sm' onClick={() => setImageModal(true)}>New Image</Button>
            </Flex>
            <Card>
                <Grid templateColumns={'repeat(12, 1fr)'} gap={5}>
                    {image && image?.map((item, i) => (
                        <GridItem colSpan={{ base: 12, md: 4, lg: 3 }}>
                            <div className="imageCard">
                                <Image src={item?.authImg} height={"200px"} width={"400px"} />
                                <div className='imageContent'>
                                    <Button size='sm' variant="brand">Set Image</Button>
                                </div>
                            </div>
                        </GridItem>
                    ))}

                </Grid>
            </Card>
            <AddImage imageModal={imageModal} setImageModal={setImageModal} fetchData={fetchImage} />
        </Card>
    )
}

export default ChangeImage