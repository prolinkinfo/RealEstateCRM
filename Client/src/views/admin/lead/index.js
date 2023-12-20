import { AddIcon } from "@chakra-ui/icons";
import { Button, FormLabel, Grid, GridItem, Input, Select, useDisclosure } from '@chakra-ui/react';
import Card from "components/card/Card";
import { useFormik } from "formik";
import { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
import { getApi } from "services/api";
import Add from "./Add";
import CheckTable from './components/CheckTable';

const Index = () => {
    const [columns, setColumns] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'Lead Name', accessor: 'leadName', width: 20 },
        { Header: "Lead Status", accessor: "leadStatus", },
        { Header: "Lead Email", accessor: "leadEmail", },
        { Header: "Lead PhoneNumber", accessor: "leadPhoneNumber", },
        { Header: "Lead Address", accessor: "leadAddress", },
        { Header: "Lead Owner", accessor: "leadOwner", },
        { Header: "Lead Score", accessor: "leadScore", },
    ];

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
        leadScore: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {

            const serachResult = data?.filter(
                (item) =>
                    (!values?.leadName || (item?.leadName && item?.leadName.toLowerCase().includes(values?.leadName?.toLocaleLowerCase()))) &&
                    (!values?.leadStatus || (item?.leadStatus && item?.leadStatus.toLowerCase().includes(values?.leadStatus?.toLocaleLowerCase()))) &&
                    (!values?.leadEmail || (item?.leadEmail && item?.leadEmail.toLowerCase().includes(values?.leadEmail?.toLocaleLowerCase()))) &&
                    (!values?.leadPhoneNumber || (item?.leadPhoneNumber && item?.leadPhoneNumber.toString().includes(values?.leadPhoneNumber?.replace(/\D/g, '')))) &&
                    (!values?.leadAddress || (item?.leadAddress && item?.leadAddress.toLowerCase().includes(values?.leadAddress?.toLocaleLowerCase()))) &&
                    (!values?.leadOwner || (item?.leadOwner && item?.leadOwner.toLowerCase().includes(values?.leadOwner?.toLocaleLowerCase()))) &&
                    (values?.leadScore === null || values?.leadScore === undefined ||   // if values.leadScore = 0 then also filter works
                        (item?.leadScore !== undefined &&
                            item?.leadScore.toString().includes(values?.leadScore?.replace(/\D/g, ''))))
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
    }, [onClose])

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
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
                                />
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                    Lead Status
                                </FormLabel>
                                <Select
                                    value={values.leadStatus}
                                    name="leadStatus"
                                    onChange={handleChange}
                                    fontWeight='500'
                                    placeholder={'Select Lead Status'}
                                >
                                    <option value='active'>active</option>
                                    <option value='pending'>pending</option>
                                    <option value='sold'>sold</option>
                                </Select>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 12, lg: 4 }} display={"flex"} flexWrap={"wrap"} justifyContent={"space-between"} alignItems={"center"} pt={5}>
                                {searchOpen === true ?
                                    <Button onClick={() => setSearchOpen(!searchOpen)} colorScheme="gray" variant="outline"><FaAnglesUp /></Button> :
                                    <Button onClick={() => setSearchOpen(!searchOpen)} colorScheme="gray" variant="outline"> <FaAnglesDown /> </Button>
                                }
                                <span>

                                    <Button onClick={() => handleSubmit()} colorScheme="brand" leftIcon={<FaSearch />} variant="outline" margin={"0 10px 0 0"}>Search</Button>
                                    <Button onClick={() => handleClear()} colorScheme="brand" variant="outline">Clear</Button>
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
                                        />
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                            Lead PhoneNumber
                                        </FormLabel>
                                        <Input
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.leadPhoneNumber}
                                            name="leadPhoneNumber"
                                            placeholder='Enter Lead PhoneNumber'
                                            fontWeight='500'
                                        />
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
                                        />
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
                                        />
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                                            Lead Score
                                        </FormLabel>
                                        <Input
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.leadScore}
                                            name="leadScore"
                                            placeholder='Enter Lead Score'
                                            fontWeight='500'
                                        />
                                    </GridItem>
                                </>}
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem colSpan={6}>
                    <CheckTable isLoding={isLoding} columnsData={columns} isOpen={isOpen} tableData={searchedData?.length > 0 ? searchedData : data} fetchData={fetchData} />
                </GridItem>
            </Grid>
            {/* Add Form */}
            <Add isOpen={isOpen} size={size} onClose={onClose} />
        </div>
    )
}

export default Index
