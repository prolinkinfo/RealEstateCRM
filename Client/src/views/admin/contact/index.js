import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, FormLabel, Grid, GridItem, Input, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import Add from "./Add";
import Card from "components/card/Card";
import { useFormik } from "formik";


const Index = () => {
    const columns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'title', accessor: 'title' },
        { Header: "first Name", accessor: "firstName", },
        { Header: "last Name", accessor: "lastName", },
        { Header: "phone Number", accessor: "phoneNumber", },
        { Header: "Email Address", accessor: "email", },
        { Header: "physical Address", accessor: "physicalAddress", },
        { Header: "mailing Address", accessor: "mailingAddress", },
        { Header: "Contact Method", accessor: "preferredContactMethod", },
    ];

    const { isOpen, onOpen, onClose } = useDisclosure()
    const size = "lg";
    const [data, setData] = useState([])
    const [isLoding, setIsLoding] = useState(false)
    const [searchedData, setSearchedData] = useState([])

    const user = JSON.parse(localStorage.getItem("user"))

    const handleClear = () => {
        resetForm();
        setSearchedData([]);

    }

    const initialValues = {
        title: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddr: '',
        physicalAddr: '',
        mailingAddr: '',
        prefContactMethod: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {

            const serachResult = data?.filter(
                (item) =>
                    (!values?.title || (item?.title && item?.title.toLowerCase().includes(values?.title?.toLocaleLowerCase()))) &&
                    (!values?.firstName || (item?.firstName && item?.firstName.toLowerCase().includes(values?.firstName?.toLocaleLowerCase()))) &&
                    (!values?.lastName || (item?.lastName && item?.lastName.toLowerCase().includes(values?.lastName?.toLocaleLowerCase()))) &&
                    (!values?.phoneNumber || (item?.phoneNumber && item?.phoneNumber.toString().includes(values?.phoneNumber?.replace(/\D/g, '')))) &&
                    (!values?.emailAddr || (item?.email && item?.email.toLowerCase().includes(values?.emailAddr?.toLocaleLowerCase()))) &&
                    (!values?.physicalAddr || (item?.physicalAddress && item?.physicalAddress.toLowerCase().includes(values?.physicalAddr?.toLocaleLowerCase()))) &&
                    (!values?.mailingAddr || (item?.mailingAddress && item?.mailingAddress.toLowerCase().includes(values?.mailingAddr?.toLocaleLowerCase()))) &&
                    (!values?.prefContactMethod || (item?.preferredContactMethod && item?.preferredContactMethod.toLowerCase().includes(values?.prefContactMethod?.toLocaleLowerCase())))
            )

            if (serachResult?.length > 0) {
                setSearchedData(serachResult);
            } else {
                setSearchedData([]);
            }
        }
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

    const handleClick = () => {
        onOpen()
    }

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
                </GridItem>
                <GridItem colSpan={6} >
                    <Card>
                        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
                                    Title
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.title}
                                    name="title"
                                    placeholder='Enter Title'
                                    fontWeight='500'
                                />
                            </GridItem>
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
                                    First Name
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.firstName}
                                    name="firstName"
                                    placeholder='Enter First Name'
                                    fontWeight='500'
                                />
                            </GridItem>
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
                                    Last Name
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.lastName}
                                    name="lastName"
                                    placeholder='Enter Last Name'
                                    fontWeight='500'
                                />
                            </GridItem>
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
                                    Phone Number
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.phoneNumber}
                                    name="phoneNumber"
                                    placeholder='Enter Phone Number'
                                    fontWeight='500'
                                />
                            </GridItem>
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
                                    Email Address
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.emailAddr}
                                    name="emailAddr"
                                    type='email'
                                    placeholder='Enter Email Address'
                                    fontWeight='500'
                                />
                            </GridItem>

                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
                                    Physical Address
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.physicalAddr}
                                    name="physicalAddr"
                                    placeholder='Enter Physical Address'
                                    fontWeight='500'
                                />
                            </GridItem>
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
                                    Mailing Address
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.mailingAddr}
                                    name="mailingAddr"
                                    placeholder='Enter Mailing Address'
                                    fontWeight='500'
                                />
                            </GridItem>
                            <GridItem colSpan={4}>
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' >
                                    Preferred Contact Method
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.prefContactMethod}
                                    name="prefContactMethod"
                                    placeholder='Enter Preferred Contact Method'
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
