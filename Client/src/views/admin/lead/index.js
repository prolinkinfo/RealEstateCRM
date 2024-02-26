// import { Grid, GridItem, useDisclosure } from '@chakra-ui/react';
// import { useEffect, useState } from 'react';
// import { getApi } from "services/api";
// import { HasAccess } from "../../../redux/accessUtils";
// import CheckTable from './components/CheckTable';

// const Index = () => {

//     const [isLoding, setIsLoding] = useState(false);
//     const [data, setData] = useState([]);
//     const [displaySearchData, setDisplaySearchData] = useState(false);
//     const [searchedData, setSearchedData] = useState([]);
//     const user = JSON.parse(localStorage.getItem("user"));

//     const [permission, emailAccess, callAccess] = HasAccess(['Lead', 'Email', 'Call']);
//     const tableColumns = [
//         { Header: "#", accessor: "_id", isSortable: false, width: 10 },
//         { Header: 'Name', accessor: 'leadName', width: 20 },
//         { Header: "Status", accessor: "leadStatus", },
//         { Header: "Email", accessor: "leadEmail", },
//         { Header: "Phone Number", accessor: "leadPhoneNumber", },
//         { Header: "Owner", accessor: "leadOwner", },
//         { Header: "Score", accessor: "leadScore", },
//         { Header: "Action", isSortable: false, center: true },
//     ];

//     const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
//     const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
//     const [action, setAction] = useState(false)
//     const [columns, setColumns] = useState(tableColumns);
//     const { isOpen, onOpen, onClose } = useDisclosure()
//     const size = "lg";

//     const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

//     const fetchData = async () => {
//         setIsLoding(true)
//         let result = await getApi(user.role === 'superAdmin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
//         setData(result.data);
//         setIsLoding(false)
//     }

//     useEffect(() => {
//         setColumns(tableColumns)
//     }, [action])

//     return (
//         <div>
//             <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
//                 <GridItem colSpan={6}>
//                     <CheckTable
//                         isLoding={isLoding}
//                         setIsLoding={setIsLoding}
//                         columnsData={tableColumns}
//                         isOpen={isOpen}
//                         setAction={setAction}
//                         dataColumn={dataColumn}
//                         action={action}
//                         setSearchedData={setSearchedData}
//                         allData={data}
//                         displaySearchData={displaySearchData}
//                         tableData={displaySearchData ? searchedData : data}
//                         fetchData={fetchData}
//                         setDisplaySearchData={setDisplaySearchData}
//                         setDynamicColumns={setDynamicColumns}
//                         dynamicColumns={dynamicColumns}
//                         selectedColumns={selectedColumns}
//                         access={permission}
//                         setSelectedColumns={setSelectedColumns}
//                         emailAccess={emailAccess}
//                         callAccess={callAccess}
//                     />
//                 </GridItem>
//             </Grid>

//         </div>
//     )
// }

// export default Index


import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import { Grid, GridItem, Text, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon, EditIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { getApi } from "services/api";
import CommonCheckTable from '../../../components/checkTable/checktable';
import Add from "./Add";
import Edit from "./Edit";
import Delete from './Delete';
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import ImportModal from './components/ImportModal';

const Index = () => {
    const title = "Leads";
    const size = "lg";
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [permission, emailAccess, callAccess] = HasAccess(['Lead', 'Email', 'Call']);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dataColumn, setDataColumn] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [leadData, setLeadData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);
    const [callSelectedId, setCallSelectedId] = useState();
    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [isImportLead, setIsImportLead] = useState(false);

    const fetchData = async () => {
        setIsLoding(true);
        let result = await getApi(user.role === 'superAdmin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
        setData(result?.data);
        setIsLoding(false);
    };

    const fetchCustomDataFields = async () => {
        setIsLoding(true);
        const result = await getApi(`api/custom-field/?moduleName=Lead`);
        setLeadData(result?.data);

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
                                    <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { navigate(`/leadView/${row?.values?._id}`) }}>View</MenuItem>}
                                {permission?.delete &&
                                    <MenuItem py={2.5} color={'red'} icon={<DeleteIcon fontSize={15} mb={1} />} onClick={() => { setDelete(true); setSelectedId(row?.values?._id); }}>Delete</MenuItem>}
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
    }

    useEffect(() => {
        fetchData();
        fetchCustomDataFields();
    }, [action])

    useEffect(() => {
        setDataColumn(tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header)));
    }, [tableColumns, selectedColumns])

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
                            tableData={displaySearchData ? searchedData : data}
                            displaySearchData={displaySearchData}
                            setDisplaySearchData={setDisplaySearchData}
                            searchedData={searchedData}
                            setSearchedData={setSearchedData}
                            tableCustomFields={leadData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
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
                            setIsImportLead={setIsImportLead}
                        />
                    </GridItem>
                }
            </Grid>

            {isOpen && <Add isOpen={isOpen} size={size} leadData={leadData[0]} onClose={onClose} setAction={setAction} action={action} />}
            {edit && <Edit isOpen={edit} size={size} leadData={leadData[0]} selectedId={selectedId} setSelectedId={setSelectedId} onClose={setEdit} setAction={setAction} moduleId={leadData?.[0]?._id} />}
            {deleteModel && <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/lead/deleteMany' data={selectedValues} method='many' setAction={setAction} />}
            {addEmailHistory && <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} data={data?.contact} lead='true' id={selectedId} />}
            {addPhoneCall && <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} data={data?.contact} id={callSelectedId} lead='true' />}
            {isImportLead && <ImportModal text='Lead file' isOpen={isImportLead} onClose={setIsImportLead} customFields={leadData?.[0]?.fields || []} />}

        </div>
    )
}

export default Index