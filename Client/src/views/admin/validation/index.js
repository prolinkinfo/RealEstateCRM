import { Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import Card from 'components/card/Card'
import { HSeparator } from 'components/separator/Separator'
import React, { useEffect, useState } from 'react'
import { getApi } from 'services/api'

const Index = () => {
    const [validationData, setValidateData] = useState([
        {
            name: "name validation",
            validation: [
                { require: true, message: 'Please Enter Name' },
                { min: true, value: 0, message: '' },
                { max: true, value: 10, message: '' },
                { match: true, value: '/^\d{10}$/', message: '' },
                { formikType: true, value: 'type error ', message: '' }
            ]
        },
        {
            name: "email validation",
            validation: [
                { require: true, message: 'Please Enter Name' },
                { min: true, value: 0, message: '' },
                { max: true, value: 10, message: '' },
                { match: true, value: '/^\d{10}$/', message: '' },
                { formikType: true, value: 'type error ', message: '' }
            ]
        },
    ])
    const fetchData = async () => {
        // if (moduleName) {
        let response = await getApi(`api/custom-field/?moduleName=${1}}`);
        // setData(response?.data);
        // } 
    }
    useEffect(() => {
        // fetchData()
    }, [])
    return (
        <div>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                {validationData?.map((item, i) => (
                    <GridItem GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
                        <Card>
                            <Flex>
                                <Heading size="md" fontWeight={"500"} textTransform={"capitalize"}
                                >{item.name}</Heading>
                            </Flex>
                            <Text pt={3} textTransform={"capitalize"}>validation</Text>
                            <HSeparator mb={2} mt={1} />
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>require:</Text>
                                {/* <Text width={"50%"} fontWeight={"500"}  >{item?.validation && item?.validation?.length > 0 && item?.validation[0]?.require}</Text> */}
                                <Text width={"50%"} fontWeight={"500"}  >  {item?.validation && item?.validation.length > 0 && item?.validation[0]?.require
                                    ? item?.validation[0]?.require
                                    : "true"}</Text>
                            </Flex>
                            {console.log(item?.validation[0].require)}
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>min:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item.validation.min}</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>max:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item.validation.max}</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>match:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item.validation.match}</Text>
                            </Flex>
                            <Flex>
                                <Text width={"50%"} pr={2} textTransform={"capitalize"}>formik type:</Text>
                                <Text width={"50%"} fontWeight={"500"}  >{item.validation.formikType}</Text>
                            </Flex>
                        </Card>
                        {/* <Card>
                             {validationData?.map((item, i) => (
                    <GridItem key={i} rowSpan={2} colSpan={{ base: 12, md: 6, lg: 3 }}>
                        <Card>
                            <Flex>
                                <Heading size="md" fontWeight="500" textTransform="capitalize">
                                    {item.name}
                                </Heading>
                            </Flex>
                            <Text pt={3} textTransform="capitalize">
                                Validation
                            </Text>
                            <HSeparator mb={2} mt={1} />

                            {item.validation.map((rule, index) => (
                                <Flex key={index}>
                                    {console.log({ rule[Object.keys(rule)[0]]})}
                                    <Text width="50%" pr={2} textTransform="capitalize">
                                        {Object.keys(rule)[0]}:
                                    </Text>
                                    <Text width="50%" fontWeight="500">
                                        {rule[Object.keys(rule)[0]]}
                                    </Text>
                                </Flex>
                            ))}
                        </Card>
                    </GridItem>
                ))}
                        </Card> */}

                    </GridItem>
                ))}
            </Grid>
        </div>
    )
}

export default Index
