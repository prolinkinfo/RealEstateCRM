import { Box, Button, Flex, Image } from '@chakra-ui/react'
import Card from 'components/card/Card'
import React from 'react'

const ChangeImage = () => {
    return (
        <Card>
            <Flex justifyContent={'end'}>
                <Button variant='brand' size='sm'>New Image</Button>
            </Flex>
            <Card>
                <Image src='' />
            </Card>
        </Card>
    )
}

export default ChangeImage