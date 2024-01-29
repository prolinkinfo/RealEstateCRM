import { Button, Flex, FormLabel, Grid, GridItem, Heading, Input, List, ListItem, Text, VStack, useDisclosure } from '@chakra-ui/react';
import FolderTreeView from 'components/FolderTreeView/folderTreeView';
import Card from 'components/card/Card';
import { HSeparator } from 'components/separator/Separator';
import Spinner from 'components/spinner/Spinner';
import { constant } from 'constant';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { documentSchema } from 'schema';
import { deleteApi, getApi } from 'services/api';
import Upload from './component/Upload';
import { postApi } from 'services/api';


const Index = () => {

    const [data, setData] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const [linkDocument, setLinkDocument] = useState(false)

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/document' : `api/document?createBy=${user._id}`);
        setData(result?.data);
        setIsLoding(false)
    }

    const initialValues = {
        folderName: '',
        files: '',
        filename: '',
        createBy: user._id
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: documentSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik
    const navigate = useNavigate()

    const download = async (data) => {
        if (data) {
            let result = await getApi(`api/document/download/`, data)
            if (result && result.status === 200) {
                window.open(`${constant.baseUrl}api/document/download/${data}`)
                toast.success('File Download successful')
            } else if (result && result.response.status === 404) {
                toast.error('File Not Found')
            }
        }
    }
    const deleteFile = async (data) => {
        if (data) {
            let result = await deleteApi(`api/document/delete/`, data)
            if (result && result.status === 200) {
                fetchData()
            }
        }
    }

    const AddData = async () => {
        try {
            setIsLoding(true)
            const formData = new FormData();
            formData?.append('folderName', values.folderName);
            formData?.append('createBy', values.createBy);
            formData?.append('filename', values.filename);

            // Append files to the formData
            values.files.forEach((file) => {
                formData?.append('files', file);
            });

            let response = await postApi('api/document/add', formData);
            if (response && response.status === 200) {
                fetchData();
                formik.resetForm();
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    useEffect(() => {
        fetchData()
    }, [linkDocument, handleSubmit])

    return (
        <div>
            <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
                <GridItem colSpan={{ base: 12, md: 7 }}  >
                    <Card minH={'20em'}>
                        <Heading size="lg" mb={4} >
                            File Explorer
                        </Heading>
                        <HSeparator />
                        <VStack mt={4} alignItems="flex-start">
                            {isLoding ?
                                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                                    <Spinner />
                                </Flex>
                                : data?.length === 0 ? (
                                    <Text textAlign={'center'} width="100%" fontSize="sm" fontWeight="700">
                                        -- No Document Found --
                                    </Text>
                                ) : data?.map((item) => (
                                    <FolderTreeView name={item.folderName} item={item}>
                                        {item?.files?.map((file) => (
                                            <FolderTreeView download={download} setLinkDocument={setLinkDocument} deleteFile={deleteFile} data={file} name={file.fileName} isFile />
                                        ))}
                                    </FolderTreeView>
                                ))}
                        </VStack>
                    </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 5 }} colStart={{ base: 1, md: 8 }} >
                    <Card >
                        <GridItem colSpan={{ base: 12 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Folder Name<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                onFocus={onOpen}
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={() => setTimeout(onClose, 200)}
                                value={values.folderName}
                                name="folderName"
                                placeholder='Enter Folder Name'
                                fontWeight='500'
                                borderColor={errors?.folderName && touched?.folderName ? "red.300" : null}
                            />
                            {isOpen && values?.folderName && data?.filter((option) => option?.folderName?.toLowerCase()?.includes(values?.folderName.toLowerCase())).length > 0 && (
                                <List position={'relative'} border={'1px solid'} bg={'gray.100'} width={'100%'} borderRadius={'0px 0px 20px 20px'} lineHeight={1} >
                                    {data?.filter((option) => option?.folderName?.toLowerCase()?.includes(values?.folderName.toLowerCase())).map((option, index) => (
                                        <ListItem p={3} borderBottom={'2px solid #efefef'} sx={{ '&:last-child': { borderBottom: 'none' } }} key={option?._id} cursor={'pointer'}
                                            onClick={() => {
                                                setFieldValue('folderName', option?.folderName)
                                            }}
                                        >
                                            {option?.folderName}
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                            <Text mb='10px' color={'red'}> {errors.folderName && touched.folderName && errors.folderName}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                File Name
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={() => setTimeout(onClose, 200)}
                                value={values.filename}
                                name="filename"
                                placeholder='Enter File Name'
                                fontWeight='500'
                                borderColor={errors?.filename && touched?.filename ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.filename && touched.filename && errors.filename}</Text>
                        </GridItem>
                        <Upload count={values.files.length} onFileSelect={(file) => setFieldValue('files', file)} />
                        <Button size="sm" disabled={isLoding ? true : false} onClick={handleSubmit} variant='brand' fontWeight='500'>
                            {isLoding ? <Spinner /> : 'Publish now'}
                        </Button>
                    </Card>
                </GridItem>

            </Grid>


        </div>
    )
}

export default Index
