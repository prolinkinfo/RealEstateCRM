import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import { Grid, GridItem, Text, Menu, MenuButton, MenuItem, MenuList, useDisclosure, Flex } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon, EditIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { getApi } from "services/api";
import CommonCheckTable from '../../../components/checkTable/checktable';
import Add from './add';
import Edit from './Edit';
import Delete from './Delete';
import Spinner from 'components/spinner/Spinner';


const Index = () => {
    const pathName = window.location.pathname.split('/')
    const title = pathName[1];
    const size = "lg";
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [permission] = HasAccess([title]);
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
    const [moduleData, setModuleData] = useState({});
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [isImport, setIsImport] = useState(false);

    const path = (name) => {
        return `${name.toLowerCase().replace(/ /g, '-')}`;
    }

    const fetchData = async (id) => {
        setIsLoding(true);
        let result = await getApi(`api/form?moduleId=${id}`);
        console.log(result?.data?.data);
        setData(result?.data?.data);
        setIsLoding(false);
    };

    const fetchCustomDataFields = async () => {
        setIsLoding(true);
        // const result = await getApi(`api/custom-field/?moduleName=${title}`);
        const result = await getApi(`api/custom-field`);
        const singaleData = result?.data?.find((item) => path(item?.moduleName) === title)
        setModuleData(singaleData);
        fetchData(singaleData?._id);

        const tempTableColumns = [
            { Header: "#", accessor: "_id", isSortable: false, width: 10 },
            ...(singaleData?.fields?.filter((field) => field?.isTableField === true)?.map((field) => ({ Header: field?.label, accessor: field?.name })) || []),
            {
                Header: "Action", isSortable: false, center: true,
                cell: ({ row }) => (
                    <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                        <Menu isLazy  >
                            <MenuButton><CiMenuKebab /></MenuButton>
                            <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                                {permission?.update &&
                                    <MenuItem py={2.5} icon={<EditIcon fontSize={15} mb={1} />} onClick={() => { setEdit(true); setSelectedId(row?.values?._id); }}>Edit</MenuItem>}
                                {permission?.view &&
                                    <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { navigate(`/leadView/${row?.values?._id}`) }}>View</MenuItem>}
                                {permission?.delete &&
                                    <MenuItem py={2.5} color={'red'} icon={<DeleteIcon fontSize={15} mb={1} />} onClick={() => { setDelete(true); setSelectedValues([row?.values?._id]); }}>Delete</MenuItem>}
                            </MenuList>
                        </Menu>
                    </Text>
                )
            },
        ];

        setSelectedColumns(JSON.parse(JSON.stringify(tempTableColumns)));
        setColumns(tempTableColumns);
        setTableColumns(JSON.parse(JSON.stringify(tempTableColumns)));
        setIsLoding(false);
    }

    useEffect(() => {
        // fetchData();
        fetchCustomDataFields();
    }, [action, title])

    useEffect(() => {
        setDataColumn(tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header)));
    }, [tableColumns, selectedColumns])

    return (
        <div>
            {isLoding ? <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={'black'} fontSize="sm" fontWeight="700">
                <Spinner />
            </Flex> : <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>

                <GridItem colSpan={6}>
                    <CommonCheckTable
                        title={moduleData?.moduleName}
                        isLoding={isLoding}
                        columnData={columns}
                        dataColumn={dataColumn}
                        allData={data}
                        // tableData={displaySearchData ? searchedData : data}
                        tableData={data}
                        // displaySearchData={displaySearchData}
                        // setDisplaySearchData={setDisplaySearchData}
                        // searchedData={searchedData}
                        // setSearchedData={setSearchedData}
                        tableCustomFields={moduleData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
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
            </Grid>
            }
            {isOpen && <Add isOpen={isOpen} title={title} size={size} moduleData={moduleData} onClose={onClose} setAction={setAction} action={action} />}
            {deleteModel && <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/form/deleteMany' data={selectedValues} method='many' setAction={setAction} />}
            {edit && <Edit isOpen={edit} title={title} size={size} moduleData={moduleData} selectedId={selectedId} setSelectedId={setSelectedId} onClose={setEdit} setAction={setAction} moduleId={moduleData?.[0]?._id} />}

        </div>
    )
}

export default Index