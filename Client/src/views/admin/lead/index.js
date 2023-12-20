import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure, Input, FormLabel, Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Add from "./Add";
import CheckTable from './components/CheckTable';
import Card from "components/card/Card";
import { getApi } from "services/api";
import { useFormik } from "formik";


const Index = () => {
    const [columns, setColumns] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
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
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={2}>
                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
                </GridItem>
                <GridItem colSpan={6} m={4}>
                    <Card>
                        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
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
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500'>
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
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
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
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
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
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
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
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
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
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
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
                            <GridItem colSpan={2} textAlign={"center"}>
                                <Button onClick={() => handleSubmit()} variant="brand">Search</Button>
                            </GridItem>
                            <GridItem colSpan={2} textAlign={"center"}>
                                <Button onClick={() => handleClear()} variant="brand">Clear</Button>
                            </GridItem>
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
