import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { getApi, deleteManyApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/reactTable/checktable';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import moment from 'moment';
import { MdLeaderboard } from 'react-icons/md';
import { IoIosContact } from 'react-icons/io';
import AddEdit from './AddEdit';
import { useDispatch } from 'react-redux';
import { fetchEmailsData } from '../../../redux/slices/emailsSlice';
import { toast } from 'react-toastify';
import AccountAdvanceSearch from './components/AccountAdvanceSearch';
import { fetchAccountData } from '../../../redux/slices/accountSlice';
import CommonDeleteModel from '../../../components/commonDeleteModel'
import ImportModal from './components/ImportModel';

const Index = (props) => {
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [selectedId, setSelectedId] = useState();
    const [deleteModel, setDelete] = useState(false);
    const [edit, setEdit] = useState(false);
    const [type, setType] = useState("")
    const [isImport, setIsImport] = useState(false);

    const [permission] = HasAccess(["Account"]);

    const actionHeader = {
        Header: "Action",
        accessor: "action",
        isSortable: false,
        center: true,
        cell: ({ row, i }) => (
            <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                <Menu isLazy>
                    <MenuButton>
                        <CiMenuKebab />
                    </MenuButton>
                    <MenuList
                        minW={"fit-content"}
                        transform={"translate(1520px, 173px);"}
                    >
                        {permission?.update && (
                            <MenuItem
                                py={2.5}
                                icon={<EditIcon fontSize={15} mb={1} />}
                                onClick={() => {
                                    setType("edit");
                                    onOpen();
                                    setSelectedId(row?.values?._id);
                                }}
                            >
                                Edit
                            </MenuItem>
                        )}
                        {permission?.view && (
                            <MenuItem
                                py={2.5}
                                color={"green"}
                                icon={<ViewIcon mb={1} fontSize={15} />}
                                onClick={() => {
                                    navigate(`/accountView/${row?.values?._id}`);
                                }}
                            >
                                View
                            </MenuItem>
                        )}
                        {permission?.delete && (
                            <MenuItem
                                py={2.5}
                                color={"red"}
                                icon={<DeleteIcon fontSize={15} mb={1} />}
                                onClick={() => {
                                    setDelete(true);
                                    setSelectedValues([row?.values?._id]);
                                }}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Text>
        ),
    };
    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        {
            Header: 'Account Name', accessor: 'name', cell: (cell) => (
                <div className="selectOpt">
                    <Text
                        onClick={() => handleViewOpen(cell?.row?.original._id)}
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value}
                    </Text>
                </div>
            )
        },
        {
            Header: 'Office Phone', accessor: 'officePhone',
        },
        {
            Header: 'Fax', accessor: 'fax',
        },
        {
            Header: 'Email Address', accessor: 'emailAddress',
        },
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])

    ];
    const handleViewOpen = (id) => {
        navigate(`/accountView/${id}`)
    }
    const customFields = [
        {
            "name": "name",
            "label": "Account Name",
            "type": "text",
            "fixed": false,
            "isDefault": false,
            "delete": false,
            "belongsTo": null,
            "backendType": "Mixed",
            "isTableField": false,
            "isView": false,
            "options": [
                {
                    "name": "",
                    "value": "",
                    "_id": "6694b8112cf3cbec6b5286c0"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6694b8112cf3cbec6b5286c1"
                }
            ],
            "validation": [
                {
                    "require": true,
                    "message": "Account Name is required",
                    "_id": "6694b8112cf3cbec6b5286c2"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6694b8112cf3cbec6b5286c3"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6694b8112cf3cbec6b5286c4"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6694b8112cf3cbec6b5286c5"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6694b8112cf3cbec6b5286c6"
                }
            ],
            "_id": "6694b8112cf3cbec6b5286bf"
        },
        {
            "name": "officePhone",
            "label": "Office Phone",
            "type": "number",
            "fixed": false,
            "isDefault": false,
            "delete": false,
            "belongsTo": null,
            "backendType": "Mixed",
            "isTableField": false,
            "isView": false,
            "options": [
                {
                    "name": "",
                    "value": "",
                    "_id": "6694b8662cf3cbec6b5289fd"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6694b8662cf3cbec6b5289fe"
                }
            ],
            "validation": [
                {
                    "require": false,
                    "message": "",
                    "_id": "6694b8662cf3cbec6b5289ff"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6694b8662cf3cbec6b528a00"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6694b8662cf3cbec6b528a01"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6694b8662cf3cbec6b528a02"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6694b8662cf3cbec6b528a03"
                }
            ],
            "_id": "6694b8662cf3cbec6b5289fc"
        },
        {
            "name": "fax",
            "label": "Fax",
            "type": "number",
            "fixed": false,
            "isDefault": false,
            "delete": false,
            "belongsTo": null,
            "backendType": "Mixed",
            "isTableField": false,
            "isView": false,
            "options": [
                {
                    "name": "",
                    "value": "",
                    "_id": "6694b8742cf3cbec6b528d52"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6694b8742cf3cbec6b528d53"
                }
            ],
            "validation": [
                {
                    "require": false,
                    "message": "",
                    "_id": "6694b8742cf3cbec6b528d54"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6694b8742cf3cbec6b528d55"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6694b8742cf3cbec6b528d56"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6694b8742cf3cbec6b528d57"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6694b8742cf3cbec6b528d58"
                }
            ],
            "_id": "6694b8742cf3cbec6b528d51"
        },
        {
            "name": "emailAddress",
            "label": "Email Address",
            "type": "text",
            "fixed": false,
            "isDefault": false,
            "delete": false,
            "belongsTo": null,
            "backendType": "Mixed",
            "isTableField": false,
            "isView": false,
            "options": [
                {
                    "name": "",
                    "value": "",
                    "_id": "6694b8942cf3cbec6b5290bf"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6694b8942cf3cbec6b5290c0"
                }
            ],
            "validation": [
                {
                    "require": false,
                    "message": "",
                    "_id": "6694b8942cf3cbec6b5290c1"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6694b8942cf3cbec6b5290c2"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6694b8942cf3cbec6b5290c3"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6694b8942cf3cbec6b5290c4"
                },
                {
                    "message": "",
                    "formikType": "email",
                    "_id": "6694b8942cf3cbec6b5290c5"
                }
            ],
            "_id": "6694b8942cf3cbec6b5290be"
        }
    ]

    const handleOpenAdd = () => {
        onOpen();
        setType("add")
    }

    const handleDelete = async (ids) => {
        try {
            setIsLoding(true);
            let response = await deleteManyApi("api/account/deleteMany", ids);
            if (response.status === 200) {
                toast.success(`Account Delete successfully`)
                setSelectedValues([]);
                setDelete(false);
                setAction((pre) => !pre);
            }
        } catch (error) {
            console.log(error);
            toast.error(`server error`)

        } finally {
            setIsLoding(false);
        }
    };

    const fetchData = async () => {
        setIsLoding(true)
        const result = await dispatch(fetchAccountData())

        if (result.payload.status === 200) {
            setData(result?.payload?.data);
        } else {
            toast.error("Failed to fetch data", "error");
        }
        setIsLoding(false)
    }

    // const [columns, setColumns] = useState([...tableColumns]);
    // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))


    useEffect(() => {
        fetchData();
    }, [action])

    return (
        <div>
            <CommonCheckTable
                title={"Account"}
                isLoding={isLoding}
                columnData={tableColumns ?? []}
                // dataColumn={dataColumn ?? []}
                allData={data ?? []}
                tableData={data}
                searchDisplay={displaySearchData}
                setSearchDisplay={setDisplaySearchData}
                searchedDataOut={searchedData}
                setSearchedDataOut={setSearchedData}
                tableCustomFields={[]}
                access={permission}
                // action={action}
                // setAction={setAction}
                // selectedColumns={selectedColumns}
                // setSelectedColumns={setSelectedColumns}
                // isOpen={isOpen}
                // onClose={onclose}
                setIsImport={setIsImport}
                onOpen={handleOpenAdd}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDelete}
                deleteMany={false}
                AdvanceSearch={
                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvanceSearch(true)}>Advance Search</Button>
                }
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
                handleSearchType="AccountSearch"
            />

            <AccountAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data ?? []}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />

            <AddEdit isOpen={isOpen} size={"lg"} onClose={onClose} setAction={setAction} type={type} selectedId={selectedId} />
            <CommonDeleteModel
                isOpen={deleteModel}
                onClose={() => setDelete(false)}
                type="Account"
                handleDeleteData={handleDelete}
                ids={selectedValues}
            />

            <ImportModal
                text="Account file"
                isOpen={isImport}
                onClose={setIsImport}
                customFields={customFields}
            />
        </div>
    )
}

export default Index