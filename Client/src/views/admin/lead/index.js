import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormLabel, Grid, GridItem, Input, Select, useDisclosure, Text } from '@chakra-ui/react';
import Card from "components/card/Card";
import { useFormik } from "formik";
import { useEffect, useState } from 'react';
import { getApi } from "services/api";
import CheckTable from './components/CheckTable';
import * as yup from 'yup';
import { FiUpload } from 'react-icons/fi';
import ImportModal from "./components/ImportModal";

const Index = () => {
    const [columns, setColumns] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [isImportLead, setIsImportLead] = useState(false);

    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'Name', accessor: 'leadName', width: 20 },
        { Header: "Status", accessor: "leadStatus", },
        { Header: "Email", accessor: "leadEmail", },
        { Header: "Phone Number", accessor: "leadPhoneNumber", },
        { Header: "Owner", accessor: "leadOwner", },
        { Header: "Score", accessor: "leadScore", },
        { Header: "Action", isSortable: false, center: true },
    ];
    const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const [action, setAction] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const size = "lg";

    const handleClear = () => {
        resetForm();
        setSearchedData([]);
    }

    const initialValues = {
        leadName: '',
        leadStatus: '',
        leadEmail: '',
        leadPhoneNumber: '',
        leadAddress: '',
        leadOwner: '',
        fromLeadScore: '',
        toLeadScore: ''
    }

    const validationSchema = yup.object({
        leadName: yup.string(),
        leadStatus: yup.string(),
        leadEmail: yup.string().email("Lead Email is invalid"),
        leadPhoneNumber: yup.number().min(0, 'Lead Phone Number is invalid').max(999999999999, 'Lead Phone Number is invalid'),
        leadAddress: yup.string(),
        leadOwner: yup.string(),
        fromLeadScore: yup.number().min(0, "From Lead Score is invalid"),
        toLeadScore: yup.number().min(yup.ref('fromLeadScore'), "To Lead Score must be greater than or equal to From Lead Score")
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {

            const serachResult = data?.filter(
                (item) =>
                    (!values?.leadName || (item?.leadName && item?.leadName.toLowerCase().includes(values?.leadName?.toLowerCase()))) &&
                    (!values?.leadStatus || (item?.leadStatus && item?.leadStatus.toLowerCase().includes(values?.leadStatus?.toLowerCase()))) &&
                    (!values?.leadEmail || (item?.leadEmail && item?.leadEmail.toLowerCase().includes(values?.leadEmail?.toLowerCase()))) &&
                    (!values?.leadPhoneNumber || (item?.leadPhoneNumber && item?.leadPhoneNumber.toString().includes(values?.leadPhoneNumber))) &&
                    (!values?.leadAddress || (item?.leadAddress && item?.leadAddress.toLowerCase().includes(values?.leadAddress?.toLowerCase()))) &&
                    (!values?.leadOwner || (item?.leadOwner && item?.leadOwner.toLowerCase().includes(values?.leadOwner?.toLowerCase()))) &&
                    ([null, undefined, ''].includes(values?.fromLeadScore) || [null, undefined, ''].includes(values?.toLeadScore) ||
                        ((item?.leadScore || item?.leadScore === 0) &&
                            (parseInt(item?.leadScore, 10) >= parseInt(values.fromLeadScore, 10) || 0) &&
                            (parseInt(item?.leadScore, 10) <= parseInt(values.toLeadScore, 10) || 0)))
            )

            if (serachResult?.length > 0) {
                setSearchedData(serachResult);
            } else {
                setSearchedData([]);
            }
        }
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const handleClick = () => {
        onOpen()
    }

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

    useEffect(() => {
        setColumns(tableColumns)
    }, [action])

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>

                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
                    <Button leftIcon={<FiUpload />} onClick={() => setIsImportLead(true)} variant="brand" ms="4px">Import</Button>
                </GridItem>
                <GridItem colSpan={6} >
                    <Card >
                        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
                            <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Lead Name
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.leadName}
                                    name="leadName"
                                    placeholder='Enter Lead Name'
                                    fontWeight='500'
                                    borderColor={errors.leadName && touched.leadName ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.leadName && touched.leadName && errors.leadName}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Lead Status
                                </FormLabel>
                                <Select
                                    value={values.leadStatus}
                                    fontSize='sm'
                                    name="leadStatus"
                                    onChange={handleChange}
                                    fontWeight='500'
                                    placeholder={'Select Lead Status'}
                                    borderColor={errors.leadStatus && touched.leadStatus ? "red.300" : null}
                                >
                                    <option value='active'>active</option>
                                    <option value='pending'>pending</option>
                                    <option value='sold'>sold</option>
                                </Select>
                                <Text mb='10px' color={'red'}> {errors.leadStatus && touched.leadStatus && errors.leadStatus}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 12, lg: 4 }} display={"flex"} flexWrap={"wrap"} justifyContent={"space-between"} alignItems={"center"} pt={7}>
                                {searchOpen === true ?
                                    <Button onClick={() => setSearchOpen(!searchOpen)} colorScheme="gray" variant="outline"><FaAnglesUp /></Button> :
                                    <Button onClick={() => setSearchOpen(!searchOpen)} colorScheme="gray" variant="outline"> <FaAnglesDown /> </Button>
                                }
                                <span>

                                    <Button onClick={() => handleSubmit()} colorScheme="brand" leftIcon={<FaSearch />} variant="outline" margin={"0 10px 0 0"}>Search</Button>
                                    <Button onClick={() => handleClear()} colorScheme="brand" type="reset" variant="outline">Clear</Button>
                                </span>
                            </GridItem>
                            {searchOpen &&
                                <>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2} >
                                            Lead Email
                                        </FormLabel>
                                        <Input
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.leadEmail}
                                            name="leadEmail"
                                            placeholder='Enter Lead Email'
                                            fontWeight='500'
                                            type="email"
                                            borderColor={errors.leadEmail && touched.leadEmail ? "red.300" : null}
                                        />
                                        <Text mb='10px' color={'red'}> {errors.leadEmail && touched.leadEmail && errors.leadEmail}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                            Lead Phone Number
                                        </FormLabel>
                                        <Input
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.leadPhoneNumber}
                                            name="leadPhoneNumber"
                                            placeholder='Enter Lead Phone Number'
                                            fontWeight='500'
                                            borderColor={errors.leadPhoneNumber && touched.leadPhoneNumber ? "red.300" : null}
                                            type="number"
                                        />
                                        <Text mb='10px' color={'red'}> {errors.leadPhoneNumber && touched.leadPhoneNumber && errors.leadPhoneNumber}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                            Lead Address
                                        </FormLabel>
                                        <Input
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.leadAddress}
                                            name="leadAddress"
                                            placeholder='Enter Lead Address'
                                            fontWeight='500'
                                            borderColor={errors.leadAddress && touched.leadAddress ? "red.300" : null}
                                        />
                                        <Text mb='10px' color={'red'}> {errors.leadAddress && touched.leadAddress && errors.leadAddress}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                            Lead Owner
                                        </FormLabel>
                                        <Input
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.leadOwner}
                                            name="leadOwner"
                                            placeholder='Enter Lead Owner'
                                            fontWeight='500'
                                            borderColor={errors.leadOwner && touched.leadOwner ? "red.300" : null}
                                        />
                                        <Text mb='10px' color={'red'}> {errors.leadOwner && touched.leadOwner && errors.leadOwner}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }} >
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                            Lead Score
                                        </FormLabel>
                                        <Flex justifyContent={"space-between"}>
                                            <Box w={"49%"}>
                                                <Input
                                                    fontSize='sm'
                                                    onChange={(e) => {
                                                        setFieldValue('toLeadScore', e.target.value)
                                                        handleChange(e)
                                                    }}
                                                    onBlur={handleBlur}
                                                    value={values.fromLeadScore}
                                                    name="fromLeadScore"
                                                    placeholder='From Lead Score'
                                                    fontWeight='500'
                                                    type='number'
                                                    borderColor={errors.fromLeadScore && touched.fromLeadScore ? "red.300" : null}
                                                />
                                                <Text mb='10px' color={'red'}> {errors.fromLeadScore && touched.fromLeadScore && errors.fromLeadScore}</Text>
                                            </Box>
                                            <Box w={"49%"}>
                                                <Input
                                                    fontSize='sm'
                                                    onChange={(e) => {
                                                        values.fromLeadScore <= e.target.value && handleChange(e)
                                                    }}
                                                    onBlur={handleBlur}
                                                    value={values.toLeadScore}
                                                    name="toLeadScore"
                                                    placeholder='To Lead Score'
                                                    fontWeight='500'
                                                    type='number'
                                                    borderColor={errors.toLeadScore && touched.toLeadScore ? "red.300" : null}
                                                    disabled={[null, undefined, ''].includes(values.fromLeadScore) || values.fromLeadScore < 0}
                                                />
                                                <Text mb='10px' color={'red'}> {errors.toLeadScore && touched.toLeadScore && errors.toLeadScore}</Text>
                                            </Box>
                                        </Flex>
                                    </GridItem>
                                </>}
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem colSpan={6}>
                    <CheckTable
                        isLoding={isLoding}
                        columnsData={columns}
                        isOpen={isOpen}
                        setAction={setAction}
                        action={action}
                        setSearchedData={setSearchedData}
                        allData={data}
                        displaySearchData={displaySearchData}
                        tableData={displaySearchData ? searchedData : data}
                        fetchData={fetchData}
                        setDisplaySearchData={setDisplaySearchData}
                        setDynamicColumns={setDynamicColumns}
                        dynamicColumns={dynamicColumns}
                        selectedColumns={selectedColumns}
                        setSelectedColumns={setSelectedColumns} />
                </GridItem>
            </Grid>

            {/* Add Form */}
            <Add isOpen={isOpen} size={size} onClose={onClose} />
            <ImportModal text='Lead file' fetchData={fetchData} isOpen={isImportLead} onClose={setIsImportLead} />
        </div>
    )
}

export default Index
