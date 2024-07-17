import { Button, Grid, GridItem, Flex, IconButton, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure, Input, FormLabel } from '@chakra-ui/react'
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

const AddEdit = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()
    const loction = useLocation()
    const { type, id } = loction?.state || {}
    const [permission] = HasAccess(['Email Template'])
    const emailEditorRef = useRef(null);
    const [preview, setPreview] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const togglePreview = () => {
        if (preview) {
            emailEditorRef.current?.editor?.hidePreview();
            setPreview(false);
        } else {
            emailEditorRef.current?.editor?.showPreview('desktop');
            setPreview(true);
        }
    };

    const fetchData = async () => {
        const result = await getApi(`api/email-temp/view/${id}`)
        if (result && result.status === 200) {
            setName(result?.data?.templateName)
            setDescription(result?.data?.description)
            emailEditorRef?.current?.editor?.loadDesign(result?.data?.design);
        }
    }

    const saveDesign = () => {
        if (name !== "") {
            emailEditorRef.current?.editor?.exportHtml(async (allData) => {
                const { html } = allData
                const { design } = allData

                const data = {
                    html: html,
                    design: design,
                    templateName: name,
                    description: description,
                    createBy: user?._id
                }
                const result = await postApi('api/email-temp/add', data)
                if (result && result.status === 200) {
                    toast.success(result.data.message)
                    setName('')
                }
                navigate('/email-template')
            });
        } else {
            toast.error("Template Name is required")
        }

    };

    const editDesign = () => {
        if (name !== "") {
            emailEditorRef.current?.editor?.exportHtml(async (allData) => {
                const { html } = allData
                const { design } = allData

                const data = {
                    html: html,
                    design: design,
                    templateName: name,
                    description: description,
                    createBy: user?._id
                }
                const result = await putApi(`api/email-temp/edit/${id}`, data)
                if (result && result.status === 200) {
                    toast.success(result.data.message)
                    navigate('/email-template')
                }
            });
        } else {
            toast.error("Template Name is required")
        }

    };

    const handleSave = () => {
        type === "add" ? saveDesign() : editDesign()
    }


    useEffect(() => {
        if (type === "edit") fetchData()
    }, [type])

    return (
        <div>
            <Card>
                <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={1} justifyContent={"space-between"} alignItem={"center"}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                        <Text fontSize="xl" fontWeight="bold" color={'blackAlpha.900'}>{type === "add" ? "Create" : "Edit"} Template </Text>
                    </GridItem>

                    <GridItem colSpan={{ base: 12, md: 6 }}>
                        <Flex justifyContent={"right"}>
                            <Button size="sm" variant="brand" onClick={togglePreview}>
                                {preview ? "Hide Preview" : "Show Preview"}
                            </Button>
                            <Button size="sm" variant="brand" style={{ marginLeft: "10px" }} onClick={handleSave}>
                                Save
                            </Button>
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
                            <Input
                                fontSize='sm'
                                name="templateName"
                                placeholder='Template Name'
                                fontWeight='500'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Input
                                fontSize='sm'
                                name="description"
                                placeholder='Description'
                                fontWeight='500'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
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

export default AddEdit
