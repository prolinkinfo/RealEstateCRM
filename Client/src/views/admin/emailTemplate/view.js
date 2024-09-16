import { Button, Grid, GridItem, Heading, Flex, IconButton, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure, Input, FormLabel } from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React from 'react'
import moment from 'moment'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BiLink } from 'react-icons/bi'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { getApi } from 'services/api'
import Card from 'components/card/Card'
import { IoIosArrowBack } from "react-icons/io";
import { HasAccess } from '../../../redux/accessUtils';
import { HSeparator } from 'components/separator/Separator';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi, } from 'services/api';
import { EmailEditor } from 'react-email-editor';
import { toast } from 'react-toastify';
import { postApi } from 'services/api';
import { putApi } from 'services/api';

const View = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()
    const { id } = useParams()
    const [permission, contactAccess, leadAccess] = HasAccess(['Email Template', 'Contacts', 'Leads'])
    const emailEditorRef = useRef(null);
    const [preview, setPreview] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');


    const fetchData = async () => {
        const result = await getApi(`api/email-temp/view/${id}`)
        if (result && result.status === 200) {
            setName(result?.data?.templateName)
            setDescription(result?.data?.description)
            emailEditorRef?.current?.editor?.loadDesign(result?.data?.design);
            emailEditorRef.current?.editor?.showPreview('desktop');
        }
    }


    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <GridItem colSpan={{ base: 4 }}>
                <Heading size="lg" m={3}>
                    {name || ""}
                </Heading>
            </GridItem>
            <Card>
                <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={1} justifyContent={"space-between"} alignItem={"center"}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                        <Text fontSize="xl" fontWeight="bold" color={'blackAlpha.900'}>View Template </Text>
                    </GridItem>

                    <GridItem colSpan={{ base: 12, md: 6 }}>
                        <Flex justifyContent={"right"}>
                            <Link to="/email-template" style={{ marginLeft: "10px" }}>
                                <Button size="sm" leftIcon={<IoIosArrowBack />} variant="brand">
                                    Back
                                </Button>
                            </Link>
                        </Flex>
                    </GridItem>
                </Grid>
                <HSeparator />
                <div>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={2}>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Template Name </Text>
                            <Text >{name ? name : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Description </Text>
                            <Text >{description ? description : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 12 }} mt={2}>
                            <EmailEditor ref={emailEditorRef} />
                        </GridItem>
                    </Grid>
                </div>
            </Card>
        </div>
    )
}

export default View
