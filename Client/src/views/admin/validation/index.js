import { EditIcon, ViewIcon } from '@chakra-ui/icons'
import { Button, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import Card from 'components/card/Card'
import { HSeparator } from 'components/separator/Separator'
import React, { useEffect, useState } from 'react'
import { getApi } from 'services/api'
import Edit from './Edit'
import View from './view'
import { useNavigate } from 'react-router-dom'

const Index = () => {
    const navigate = useNavigate()
    const [editModal, setEdit] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [selectedId, setselectedId] = useState()
    const [data, setData] = useState([])
    const [validationData, setValidateData] = useState([])


    const fetchData = async () => {
        let response = await getApi(`api/validation`);
        setValidateData(response?.data);
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleEditClose = () => {
        setEdit(false)
    }

    const handleViewOpen = (item) => {
        setselectedId(item._id)
        setViewModal(!viewModal)
    }
    const handleViewClose = () => {
        setViewModal(false)
    }
    return (
        <div>
            <Flex justifyContent={"end"} mb={2}>
                <Button size='sm' variant='brand' me={1}>Add </Button>
                <Button size='sm' variant='brand' onClick={() => navigate(-1)}> Back</Button>
            </Flex>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                {validationData?.map((item, i) => (
                    <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }} key={i}>
                        <Card>
                            <Flex alignItems={"center"} justifyContent={"space-between"}>
                                <Heading size="md" fontWeight={"500"} textTransform={"capitalize"}
                                >{item?.name}</Heading>
                                <Flex>
                                    <Button size='sm' variant='outline' me={1} onClick={() => setEdit(!editModal)}><EditIcon color={"blue"} /> </Button>
                                    <Button size='sm' variant='outline' onClick={() => handleViewOpen(item)}> <ViewIcon color={"green"} /></Button>
                                </Flex>
                            </Flex>
                            <Text pt={3} textTransform={"capitalize"}>validations</Text>
                            <HSeparator mb={2} mt={1} />
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>require:</Text>
                                <Text width={"50%"} fontWeight={"500"}  > {item?.validations && item?.validations?.length > 0 && item?.validations[0]?.require === true ? "True" : "False"
                                }</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>min:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item?.validations && item?.validations?.length > 0 && item?.validations[1]?.min === true ? "True" : "False"
                                }</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>max:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item?.validations && item?.validations?.length > 0 && item?.validations[2]?.max === true ? "True" : "False"
                                }</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>match:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item?.validations && item?.validations?.length > 0 && item?.validations[3]?.match === true ? "True" : "False"
                                }</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>formik type:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item?.validations && item?.validations?.length > 0 && item?.validations[4]?.formikType === true ? "True" : "False"
                                }</Text>
                            </Flex>
                        </Card>
                    </GridItem>
                ))}
            </Grid>

            <Edit isOpen={editModal} onClose={handleEditClose} />
            <View isOpen={viewModal} onClose={handleViewClose} selectedId={selectedId} />

        </div>
    )
}

export default Index
