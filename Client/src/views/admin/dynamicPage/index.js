import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import { Grid, GridItem, Text, Menu, MenuButton, MenuItem, MenuList, useDisclosure, Flex } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon, EditIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { getApi } from "services/api";
import CommonCheckTable from '../../../components/reactTable/checktable';
import Add from './add';
import Edit from './Edit';
import Spinner from 'components/spinner/Spinner';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi } from 'services/api';


const Index = () => {
    const pathName = window.location.pathname.split('/')
    const title = pathName[1];
    const size = "lg";
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [permission] = HasAccess([title]);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    // const [dataColumn, setDataColumn] = useState([]);
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
        if (result.status === 200) {
            setData(result?.data?.data);
            setIsLoding(false);
        }
    };

    const fetchCustomDataFields = async () => {
        setIsLoding(true);
        const result = await getApi(`api/custom-field`);
        const singaleData = result?.data?.find((item) => path(item?.moduleName) === title)
        setModuleData(singaleData);
        fetchData(singaleData?._id);

        const actionHeader = {
            Header: "Action", isSortable: false, center: true,
            cell: ({ row }) => (
                <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                    <Menu isLazy  >
                        <MenuButton><CiMenuKebab /></MenuButton>
                        <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                            {permission?.update &&
                                <MenuItem py={2.5} icon={<EditIcon fontSize={15} mb={1} />} onClick={() => { setEdit(true); setSelectedId(row?.values?._id); }}>Edit</MenuItem>}
                            {permission?.view &&
                                <MenuItem py={2.5} color={'green'} icon={<ViewIcon mb={1} fontSize={15} />} onClick={() => { navigate(`/${title}/${row?.values?._id}`, { state: { module: singaleData } }) }}>View</MenuItem>}
                            {permission?.delete &&
                                <MenuItem py={2.5} color={'red'} icon={<DeleteIcon fontSize={15} mb={1} />} onClick={() => { setDelete(true); setSelectedValues([row?.values?._id]); }}>Delete</MenuItem>}
                        </MenuList>
                    </Menu>
                </Text>
            )
        };

        const tempTableColumns = [
            { Header: "#", accessor: "_id", isSortable: false, width: 10 },
            ...(singaleData?.fields?.filter((field) => field?.isTableField === true && field?.isView)?.map((field) => ({
                Header: field?.label,
                accessor: field?.name,
                cell: (cell) => (
                    <div className="selectOpt">
                        <Text
                            onClick={() => {
                                navigate(`/${title}/${cell?.row?.original?._id}`, { state: { module: singaleData } });
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
            })) || []),
            ...(singaleData?.fields?.filter((field) => field?.isTableField === true && !field?.isView)?.map((field) => ({ Header: field?.label, accessor: field?.name })) || []),
            ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : []),
        ];

        setColumns(tempTableColumns);
        setIsLoding(false);
    }
    const handleDelete = async (id, moduleId) => {
        try {
            setIsLoding(true)
            const payload = {
                moduleId: moduleId,
                ids: id
            }
            let response = await deleteManyApi('api/form/deleteMany', payload)
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
        fetchCustomDataFields();
    }, [action, title])

    // useEffect(() => {
    //     setDataColumn(tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header)));
    // }, [tableColumns, selectedColumns])

    return (
        <div>
            {isLoding ? <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={'black'} fontSize="sm" fontWeight="700">
                <Spinner />
            </Flex> :
                <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
                    <GridItem colSpan={6}>
                        <CommonCheckTable
                            title={moduleData?.moduleName}
                            isLoding={isLoding}
                            columnData={columns ?? []}
                            // dataColumn={dataColumn ?? []}
                            allData={data ?? []}
                            tableData={data}
                            tableCustomFields={moduleData?.fields?.filter((field) => field?.isTableField === true) || []}
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
                            setIsImport={setIsImport}
                        />
                    </GridItem>
                </Grid>
            }
            {isOpen && <Add isOpen={isOpen} title={title} size={size} moduleData={moduleData} onClose={onClose} setAction={setAction} action={action} />}
            {deleteModel && <CommonDeleteModel isOpen={deleteModel} onClose={() => setDelete(false)} type={title} handleDeleteData={handleDelete} ids={selectedValues} selectedValues={moduleData?._id} />}

            {edit && <Edit isOpen={edit} title={title} size={size} moduleData={moduleData} selectedId={selectedId} setSelectedId={setSelectedId} onClose={setEdit} setAction={setAction} moduleId={moduleData?._id} />}

        </div>
    )
}

export default Index