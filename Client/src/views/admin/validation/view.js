import { Box, Button, Flex, Grid, GridItem, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Card from 'components/card/Card';
import { HSeparator } from 'components/separator/Separator';
import Spinner from 'components/spinner/Spinner'
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { getApi } from 'services/api';



const Edit = (props) => {
    const { onClose, isOpen, selectedId } = props;
    const [isLoding, setIsLoding] = useState(false)
    const [data, setData] = useState(false)

    const fetchData = async () => {
        setIsLoding(true)
        try {
            if (selectedId) {
                let response = await getApi(`api/validation/view/`, selectedId)
                setData(response.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoding(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [selectedId])
    console.log(data)

    return (
        <div>
            <Modal onClose={onClose} isOpen={isOpen} isCentered size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>View </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12 }} mb={3}>
                                    <Heading
                                        size="md" fontWeight={"600"} textTransform={"capitalize"}
                                    >{data?.name}</Heading>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }} borderTop={"1px solid gray"} pt={2}>
                                    <Flex>
                                        <Text fontWeight={"bold"} pr={2} textTransform={"capitalize"}>require:</Text>
                                        <Text fontWeight={"bold"}>
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[0]?.require === true ? "True" : "False"}
                                        </Text>
                                    </Flex>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }} borderBottom={"1px solid gray"} pb={2}>
                                    <Flex>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Message:
                                        </Text>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[0]?.message}
                                        </Text>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}></GridItem>
                                <GridItem colSpan={{ base: 12 }}>
                                    <Flex>
                                        <Text fontWeight={"bold"} pr={2} textTransform={"capitalize"}>Min:</Text>
                                        <Text fontWeight={"bold"}>
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[1]?.min === true ? "True" : "False"}
                                        </Text>
                                    </Flex>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }} >
                                    <Flex>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Message:
                                        </Text>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[1]?.message}
                                        </Text>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }} >
                                    <Flex>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Value:
                                        </Text>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[1]?.message}
                                        </Text>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }} borderTop={"1px solid gray"} pt={2}>
                                    <Flex>
                                        <Text fontWeight={"bold"} pr={2} textTransform={"capitalize"}>Max:</Text>
                                        <Text fontWeight={"bold"}>
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[2]?.max === true ? "True" : "False"}
                                        </Text>
                                    </Flex>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }} >
                                    <Flex>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Message:
                                        </Text>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[2]?.message}
                                        </Text>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }} >
                                    <Flex>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Value:
                                        </Text>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[2]?.message}
                                        </Text>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }} borderTop={"1px solid gray"} pt={2}>
                                    <Flex>
                                        <Text fontWeight={"bold"} pr={2} textTransform={"capitalize"}>Match:</Text>
                                        <Text fontWeight={"bold"}>
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[3]?.match === true ? "True" : "False"}
                                        </Text>
                                    </Flex>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }} >
                                    <Flex>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Message:
                                        </Text>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[3]?.message}
                                        </Text>
                                    </Flex>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }} >
                                    <Flex>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Value:
                                        </Text>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[3]?.message}
                                        </Text>
                                    </Flex>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }} borderTop={"1px solid gray"} pt={2}>
                                    <Flex>
                                        <Text fontWeight={"bold"} pr={2} textTransform={"capitalize"}>FormikType:</Text>
                                        <Text fontWeight={"bold"}>
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[4]?.formikType === true ? "True" : "False"}
                                        </Text>
                                    </Flex>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }} >
                                    <Flex>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            Message:
                                        </Text>
                                        <Text display='flex' ms='4px' fontSize='sm' fontWeight='500' mb="0">
                                            {data?.validations && data?.validations?.length > 0 && data?.validations[4]?.message}
                                        </Text>
                                    </Flex>
                                </GridItem>
                            </Grid>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" colorScheme='green' size='sm' me={2} onClick={onClose}>Edit</Button>
                        <Button colorScheme="red" size='sm' mr={2} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Delete'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Edit
