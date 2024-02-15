import { Image, Box } from '@chakra-ui/react'
// import dataImage from '../../assets/img/nodatafound1.png'
import React from 'react'

const DataNotFound = () => {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {/* <Image src={dataImage} /> */}
            -- No Data Found --
        </Box>
    )
}

export default DataNotFound
