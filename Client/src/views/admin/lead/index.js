import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormLabel, Grid, GridItem, Input, Select, useDisclosure } from '@chakra-ui/react';
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
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

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

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {

            const serachResult = data?.filter(
                (item) =>
                    (!values?.leadName || (item?.leadName && item?.leadName.toLowerCase().includes(values?.leadName?.toLowerCase()))) &&
                    (!values?.leadStatus || (item?.leadStatus && item?.leadStatus.toLowerCase().includes(values?.leadStatus?.toLowerCase()))) &&
                    (!values?.leadEmail || (item?.leadEmail && item?.leadEmail.toLowerCase().includes(values?.leadEmail?.toLowerCase()))) &&
                    (!values?.leadPhoneNumber || (item?.leadPhoneNumber && item?.leadPhoneNumber.toString().includes(values?.leadPhoneNumber?.replace(/\D/g, '')))) &&
                    (!values?.leadAddress || (item?.leadAddress && item?.leadAddress.toLowerCase().includes(values?.leadAddress?.toLowerCase()))) &&
                    (!values?.leadOwner || (item?.leadOwner && item?.leadOwner.toLowerCase().includes(values?.leadOwner?.toLowerCase()))) &&
                    (!values?.fromLeadScore ||
                        (item?.leadScore &&
                            parseInt(item?.leadScore, 10) >= parseInt(values.fromLeadScore, 10) &&
                            parseInt(item?.leadScore, 10) <= parseInt(values.toLeadScore, 10))
                    )
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

                <GridItem colSpan={6}>
                    <CheckTable
                        isLoding={isLoding}
                        columnsData={columns}
                        isOpen={isOpen}
                        setSearchedData={setSearchedData}
                        allData={data}
                        tableData={displaySearchData ? searchedData : data}
                        fetchData={fetchData}
                        setDisplaySearchData={setDisplaySearchData} />
                </GridItem>
            </Grid>
            {/* Add Form */}
            {/* <Add isOpen={isOpen} size={size} onClose={onClose} /> */}
        </div>
    )
}

export default Index
