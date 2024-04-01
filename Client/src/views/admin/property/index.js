// import { AddIcon } from "@chakra-ui/icons";
// import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
// import { useEffect, useState } from 'react';
// import Add from "./Add";
// import CheckTable from './components/CheckTable';
// import { getApi } from "services/api";
// import { HasAccess } from "../../../redux/accessUtils";

// const Index = () => {
//     const [columns, setColumns] = useState([]);
//     const [searchedData, setSearchedData] = useState([]);
//     const [isLoding, setIsLoding] = useState(false);
//     const [data, setData] = useState([]);
//     const [displaySearchData, setDisplaySearchData] = useState(false);
//     const user = JSON.parse(localStorage.getItem("user"));
//     const tableColumns = [
//         {
//             Header: "#",
//             accessor: "_id",
//             isSortable: false,
//             width: 10
//         },
//         { Header: 'property Type', accessor: 'propertyType' },
//         { Header: "listing Price", accessor: "listingPrice", },
//         { Header: "square Footage", accessor: "squareFootage", center: true },
//         { Header: "year Built", accessor: "yearBuilt", center: true },
//         { Header: "number of Bedrooms", accessor: "numberofBedrooms", center: true },
//         { Header: "number of Bathrooms", accessor: "numberofBathrooms", center: true },
//         { Header: "Action", isSortable: false, center: true },
//     ];
//     const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
//     const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
//     const [action, setAction] = useState(false)
//     const { isOpen, onOpen, onClose } = useDisclosure()
//     const size = "lg";

//     const dataColumn = dynamicColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

//     const fetchData = async () => {
//         setIsLoding(true)
//         let result = await getApi(user.role === 'superAdmin' ? 'api/property/' : `api/property/?createBy=${user._id}`);
//         setData(result.data);
//         setIsLoding(false)
//     }

//     useEffect(() => {
//         setColumns(tableColumns)
//     }, [onClose])
//     const [permission] = HasAccess(['Properties']);

//     return (
//         <div>
//             {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
//                 <GridItem colStart={6} textAlign={"right"}>
//                     {permission?.create && <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>}
//                 </GridItem>
//             </Grid> */}
//             <CheckTable
//                 isLoding={isLoding}
//                 columnsData={columns}
//                 isOpen={isOpen}
//                 setAction={setAction}
//                 action={action}
//                 dataColumn={dataColumn}
//                 setSearchedData={setSearchedData}
//                 allData={data}
//                 displaySearchData={displaySearchData}
//                 tableData={displaySearchData ? searchedData : data}
//                 fetchData={fetchData}
//                 setDisplaySearchData={setDisplaySearchData}
//                 setDynamicColumns={setDynamicColumns}
//                 dynamicColumns={dynamicColumns}
//                 selectedColumns={selectedColumns}
//                 access={permission}
//                 setSelectedColumns={setSelectedColumns}
//             />
//             {/* <Add isOpen={isOpen} size={size} onClose={onClose} setAction={setAction} /> */}
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
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi } from 'services/api';

const Index = () => {
    const title = "Properties";
    const size = "lg";
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [permission] = HasAccess(['Properties']);
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
    const [propertyData, setPropertyData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [isImportProperty, setIsImportProperty] = useState(false);

    const fetchData = async () => {
        setIsLoding(true);
        let result = await getApi(user.role === 'superAdmin' ? 'api/property/' : `api/property/?createBy=${user._id}`);
        setData(result?.data);
        setIsLoding(false);
    };

    const fetchCustomDataFields = async () => {
        setIsLoding(true);
        const result = await getApi(`api/custom-field/?moduleName=Properties`);
        setPropertyData(result?.data);
        const actionHeader = {
            Header: "Action",
            isSortable: false,
            center: true,
            cell: ({ row }) => (
                <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                    <Menu isLazy>
                        <MenuButton><CiMenuKebab /></MenuButton>
                        <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                            {permission?.update &&
                                <MenuItem py={2.5} icon={<EditIcon fontSize={15} mb={1} />} onClick={() => { setEdit(true); setSelectedId(row?.values?._id); }}>Edit</MenuItem>}
                            {permission?.view &&
                                <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { navigate(`/propertyView/${row?.values?._id}`) }}>View</MenuItem>}
                            {permission?.delete &&
                                <MenuItem py={2.5} color={'red'} icon={<DeleteIcon fontSize={15} mb={1} />} onClick={() => { setDelete(true); setSelectedValues([row?.values?._id]); setSelectedId(row?.values?._id); }}>Delete</MenuItem>}
                        </MenuList>
                    </Menu>
                </Text>
            )
        };
        const tempTableColumns = [
            { Header: "#", accessor: "_id", isSortable: false, width: 10 },
            ...result?.data?.[0]?.fields?.filter((field) => field?.isTableField === true)?.map((field) => ({ Header: field?.label, accessor: field?.name })),
            ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])
        ];

        setSelectedColumns(JSON.parse(JSON.stringify(tempTableColumns)));
        setColumns(JSON.parse(JSON.stringify(tempTableColumns)));
        setColumns(tempTableColumns);
        setTableColumns(JSON.parse(JSON.stringify(tempTableColumns)));
        setIsLoding(false);
    }

    const handleDeleteProperties = async (ids) => {
        try {
            setIsLoding(true)
            let response = await deleteManyApi('api/property/deleteMany', ids)
            if (response.status === 200) {
                setSelectedValues([])
                setDelete(false)
                setAction((pre) => !pre)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }
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
                            tableData={data}
                            // tableData={displaySearchData ? searchedData : data}
                            // displaySearchData={displaySearchData}
                            // setDisplaySearchData={setDisplaySearchData}
                            // searchedData={searchedData}
                            // setSearchedData={setSearchedData}
                            tableCustomFields={propertyData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
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
                            setIsImport={setIsImportProperty}
                        />
                    </GridItem>
                }
            </Grid>
            {isOpen && <Add propertyData={propertyData[0]} isOpen={isOpen} size={size} onClose={onClose} setAction={setAction} />}
            {edit && <Edit isOpen={edit} size={size} propertyData={propertyData[0]} selectedId={selectedId} setSelectedId={setSelectedId} onClose={setEdit} setAction={setAction} />}
            {deleteModel && <CommonDeleteModel isOpen={deleteModel} onClose={() => setDelete(false)} type='Properties' handleDeleteData={handleDeleteProperties} ids={selectedValues} />}
            {isImportProperty && <ImportModal text='Property file' isOpen={isImportProperty} onClose={setIsImportProperty} customFields={propertyData?.[0]?.fields || []} />}

        </div>
    )
}

export default Index