
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import { Grid, GridItem, Text, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon, EditIcon, } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { getApi } from "services/api";
import CommonCheckTable from '../../../components/reactTable/checktable';
import Add from "./Add";
import Edit from "./Edit";
import ImportModal from './components/ImportModal';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi } from 'services/api';
import { fetchPropertyCustomFiled } from '../../../redux/slices/propertyCustomFiledSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyData } from '../../../redux/slices/propertySlice'
import { toast } from 'react-toastify';

const Index = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [permission] = HasAccess(['Properties']);
    const [isLoding, setIsLoding] = useState(false);
    // const [data, setData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    // const [dataColumn, setDataColumn] = useState([]);
    // const [selectedColumns, setSelectedColumns] = useState([]);
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [propertyData, setPropertyData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [isImportProperty, setIsImportProperty] = useState(false);

    const data = useSelector((state) => state?.propertyData?.data)

    const fetchCustomDataFields = async () => {
        setIsLoding(true);
        const result = await dispatch(fetchPropertyCustomFiled())
        if (result.payload.status === 200) {
            setPropertyData(result?.payload?.data);
        } else {
            toast.error("Failed to fetch data", "error");
        }
        const actionHeader = {
            Header: "Action",
            accessor: "action",
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
            ...(result?.payload?.data && result.payload.data.length > 0
                ? result.payload.data[0]?.fields
                    ?.filter((field) => field?.isTableField === true && field?.isView)
                    ?.map(
                        (field) => ({
                            Header: field?.label,
                            accessor: field?.name,
                            cell: (cell) => (
                                <div className="selectOpt">
                                    <Text
                                        onClick={() => {
                                            navigate(`/propertyView/${cell?.row?.original?._id}`);
                                        }}
                                        me="10px"
                                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                                        color='brand.600'
                                        fontSize="sm"
                                        fontWeight="700"
                                    >
                                        {cell?.value || "-"}
                                    </Text>
                                </div>
                            ),
                        })) || []
                : []),
            ...(result?.payload?.data?.[0]?.fields || []) // Ensure result.payload[0].fields is an array
                .filter(field => field?.isTableField === true && !field?.isView) // Filter out fields where isTableField is true
                .map(field => ({ Header: field?.label, accessor: field?.name })),
            ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])
        ];


        setColumns(tempTableColumns);
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
        dispatch(fetchPropertyData());
        fetchCustomDataFields();
    }, [action])

    // useEffect(() => {
    //     setDataColumn(tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header)));
    // }, [tableColumns, selectedColumns])

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
                {!isLoding &&
                    <GridItem colSpan={6}>
                        <CommonCheckTable
                            title={"Properties"}
                            isLoding={isLoding}
                            columnData={columns ?? []}
                            // dataColumn={dataColumn ?? []}
                            allData={data ?? []}
                            tableData={data}
                            tableCustomFields={propertyData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
                            access={permission}
                            // action={action}
                            // setAction={setAction}
                            // selectedColumns={selectedColumns}
                            // setSelectedColumns={setSelectedColumns}
                            // isOpen={isOpen}
                            // onClose={onclose}
                            onOpen={onOpen}
                            selectedValues={selectedValues}
                            setSelectedValues={setSelectedValues}
                            setDelete={setDelete}
                            setIsImport={setIsImportProperty}
                        />
                    </GridItem>
                }
            </Grid>
            {isOpen && <Add propertyData={propertyData[0]} isOpen={isOpen} size={"lg"} onClose={onClose} setAction={setAction} />}
            {edit && <Edit isOpen={edit} size={"lg"} propertyData={propertyData[0]} selectedId={selectedId} setSelectedId={setSelectedId} onClose={setEdit} setAction={setAction} />}
            {deleteModel && <CommonDeleteModel isOpen={deleteModel} onClose={() => setDelete(false)} type='Properties' handleDeleteData={handleDeleteProperties} ids={selectedValues} />}
            {isImportProperty && <ImportModal text='Property file' isOpen={isImportProperty} onClose={setIsImportProperty} customFields={propertyData?.[0]?.fields || []} />}

        </div>
    )
}

export default Index