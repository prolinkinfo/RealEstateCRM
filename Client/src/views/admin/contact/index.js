// import { AddIcon } from "@chakra-ui/icons";
// import { Box, Button, FormLabel, Grid, GridItem, Input, Spinner, Text, useDisclosure } from '@chakra-ui/react';
// import { useEffect, useState } from 'react';
// import { getApi } from 'services/api';
// import CheckTable from './components/CheckTable';
// import Add from "./Add";
// import Card from "components/card/Card";
// import { useFormik } from "formik";
// import { HasAccess } from "../../../redux/accessUtils";


// const Index = () => {
//     const tableColumns = [
//         { Header: "#", accessor: "_id", isSortable: false, width: 10 },
//         { Header: 'Title', accessor: 'title' },
//         { Header: "First Name", accessor: "firstName", },
//         { Header: "Last Name", accessor: "lastName", },
//         { Header: "Phone Number", accessor: "phoneNumber", },
//         { Header: "Email Address", accessor: "email", },
//         { Header: "Contact Method", accessor: "preferredContactMethod", },
//         { Header: "Action", isSortable: false, center: true },
//     ];

//     const { isOpen, onOpen, onClose } = useDisclosure()
//     const [data, setData] = useState([])
//     const [isLoding, setIsLoding] = useState(false)
//     const [action, setAction] = useState(false)
//     const [columns, setColumns] = useState([]);
//     const [searchedData, setSearchedData] = useState([]);
//     const [displaySearchData, setDisplaySearchData] = useState(false);
//     const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
//     const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);

//     const user = JSON.parse(localStorage.getItem("user"))

//     const [permission, emailAccess, callAccess] = HasAccess(['Contacts', 'Email', 'Call']);

//     const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

//     const fetchData = async () => {
//         setIsLoding(true)
//         let result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
//         setData(result.data);
//         setIsLoding(false)
//     }

//     useEffect(() => {
//         fetchData()
//         setColumns(tableColumns)
//     }, [action])

//     return (
//         <div>
//             <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
//                 <GridItem colSpan={6}>
//                     <CheckTable
//                         isLoding={isLoding}
//                         columnsData={columns}
//                         dataColumn={dataColumn}
//                         isOpen={isOpen}
//                         setAction={setAction}
//                         action={action}
//                         setSearchedData={setSearchedData}
//                         displaySearchData={displaySearchData}
//                         setDisplaySearchData={setDisplaySearchData}
//                         allData={data}
//                         emailAccess={emailAccess}
//                         callAccess={callAccess}
//                         setDynamicColumns={setDynamicColumns}
//                         dynamicColumns={dynamicColumns}
//                         tableData={displaySearchData ? searchedData : data}
//                         fetchData={fetchData}
//                         onOpen={onOpen}
//                         onClose={onClose}
//                         selectedColumns={selectedColumns}
//                         access={permission}
//                         setSelectedColumns={setSelectedColumns} />
//                 </GridItem>
//             </Grid>
//         </div>
//     )
// }

// export default Index


import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, GridItem, Text, useDisclosure, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon, EditIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { getApi } from 'services/api';
import Add from "./Add";
import Edit from './Edit';
import Delete from "./Delete";
import AddEmailHistory from "../emailHistory/components/AddEmail";
import AddPhoneCall from "../phoneCall/components/AddPhoneCall";
import { HasAccess } from "../../../redux/accessUtils";
import CommonCheckTable from "../../../components/checkTable/checktable";
import ImportModal from "./components/ImportModel";

const Index = () => {

    const title = "Contacts";
    const size = "lg";
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [permission, emailAccess, callAccess] = HasAccess(['Contacts', 'Emails', 'Calls']);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    // const [displaySearchData, setDisplaySearchData] = useState(false);
    // const [searchedData, setSearchedData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dataColumn, setDataColumn] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [contactData, setContactData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);
    const [callSelectedId, setCallSelectedId] = useState();
    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [isImportContact, setIsImport] = useState(false);

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    };

    const fetchCustomDataFields = async () => {
        setIsLoding(true);
        const result = await getApi(`api/custom-field/?moduleName=Contact`);
        setContactData(result?.data);

        const tempTableColumns = [
            { Header: "#", accessor: "_id", isSortable: false, width: 10 },
            ...result?.data?.[0]?.fields?.filter((field) => field?.isTableField === true)?.map((field) => ({ Header: field?.label, accessor: field?.name })),
            {
                Header: "Action", isSortable: false, center: true,
                cell: ({ row }) => (
                    <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                        <Menu isLazy  >
                            <MenuButton><CiMenuKebab /></MenuButton>
                            <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                                {permission?.update &&
                                    <MenuItem py={2.5} icon={<EditIcon fontSize={15} mb={1} />} onClick={() => { setEdit(true); setSelectedId(row?.values?._id); }}>Edit</MenuItem>}
                                {callAccess?.create &&
                                    <MenuItem py={2.5} width={"165px"} onClick={() => { setAddPhoneCall(true); setCallSelectedId(row?.values?._id) }} icon={<PhoneIcon fontSize={15} mb={1} />}>Create Call</MenuItem>}
                                {emailAccess?.create &&
                                    <MenuItem py={2.5} width={"165px"} onClick={() => { setAddEmailHistory(true); setSelectedId(row?.values?._id) }} icon={<EmailIcon fontSize={15} mb={1} />}>Send Email</MenuItem>}
                                {permission?.view &&
                                    <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { navigate(`/contactView/${row?.values?._id}`) }}>View</MenuItem>}
                                {permission?.delete &&
                                    <MenuItem py={2.5} color={'red'} icon={<DeleteIcon fontSize={15} mb={1} />} onClick={() => { setDelete(true); setSelectedValues([row?.values?._id]); }}>Delete</MenuItem>}
                            </MenuList>
                        </Menu>
                    </Text>
                )
            },
        ];

        setSelectedColumns(JSON.parse(JSON.stringify(tempTableColumns)));
        setColumns(JSON.parse(JSON.stringify(tempTableColumns)));
        setColumns(tempTableColumns);
        setTableColumns(JSON.parse(JSON.stringify(tempTableColumns)));
        setIsLoding(false);
    };

    useEffect(() => {
        fetchData();
        fetchCustomDataFields();
    }, [action]);

    useEffect(() => {
        setDataColumn(tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header)));
    }, [tableColumns, selectedColumns]);

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
                {!isLoding &&
                    <GridItem colSpan={6}>
                        <CommonCheckTable
                            title={title}
                            isLoding={isLoding}
                            columnData={columns}
                            dataColumn={dataColumn}
                            allData={data}
                            tableData={data}
                            // tableData={displaySearchData ? searchedData : data}
                            // displaySearchData={displaySearchData}
                            // setDisplaySearchData={setDisplaySearchData}
                            // searchedData={searchedData}
                            // setSearchedData={setSearchedData}
                            tableCustomFields={contactData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
                            access={permission}
                            action={action}
                            setAction={setAction}
                            selectedColumns={selectedColumns}
                            setSelectedColumns={setSelectedColumns}
                            isOpen={isOpen}
                            onClose={onclose}
                            onOpen={onOpen}
                            selectedValues={selectedValues}
                            setSelectedValues={setSelectedValues}
                            setDelete={setDelete}
                            setIsImport={setIsImport}
                        />
                    </GridItem>
                }
            </Grid>
            {isOpen && <Add isOpen={isOpen} size={size} contactData={contactData[0]} onClose={onClose} setAction={setAction} action={action} />}
            {edit && <Edit isOpen={edit} size={size} contactData={contactData[0]} selectedId={selectedId} setSelectedId={setSelectedId} onClose={setEdit} setAction={setAction} moduleId={contactData?.[0]?._id} />}
            {deleteModel && <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/contact/deleteMany' data={selectedValues} method='many' setAction={setAction} />}
            {addEmailHistory && <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={selectedId} />}
            {addPhoneCall && <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} id={callSelectedId} />}
            {isImportContact && <ImportModal text='Contact file' isOpen={isImportContact} onClose={setIsImport} customFields={contactData?.[0]?.fields || []} />}

        </div>
    )
}

export default Index
