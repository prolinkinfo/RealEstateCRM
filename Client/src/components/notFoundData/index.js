import { Image, Box } from '@chakra-ui/react'
import dataImage from '../../assets/img/nodatafound.png'
import React from 'react'

const DataNotFound = () => {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Image src={dataImage} />
        </Box>
    )
}

export default DataNotFound
