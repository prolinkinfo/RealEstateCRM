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
import OpprtunityAdvanceSearch from './components/OpprtunityAdvanceSearch';
import { fetchOpportunityData } from '../../../redux/slices/opportunitySlice';
import CommonDeleteModel from '../../../components/commonDeleteModel'
import ImportModal from './components/ImportModel';

const Index = (props) => {
    const title = "Opprtunities";
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

    const [permission, accountAccess] = HasAccess(["Opportunities", "Account"]);

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
                                    navigate(`/opportunitiesView/${row?.values?._id}`);
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
            Header: 'Opportunity Name', accessor: 'opportunityName', cell: (cell) => (
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
            Header: 'Account Name', accessor: 'accountName', cell: (cell) => (
                (user.role === 'superAdmin' || accountAccess?.view) ?
                    <div className="selectOpt">
                        <Text
                            onClick={() => navigate(cell?.row?.original.accountName !== null && `/accountView/${cell?.row?.original.accountName}`)}
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                            color='brand.600'
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {cell?.row?.original?.accountName2 ? cell?.row?.original?.accountName2 : "-"}
                        </Text>
                    </div>
                    :
                    <Text
                    >
                        {cell?.row?.original?.accountName2 ? cell?.row?.original?.accountName2 : "-"}
                    </Text>

            )
        },
        {
            Header: 'Opportunity Amount', accessor: 'opportunityAmount',
        },
        {
            Header: 'Expected Close Date', accessor: 'expectedCloseDate', cell: (cell) => (
                <div>{moment(cell?.value).format("YYYY-MM-DD")}</div>
            )
        },
        {
            Header: 'Sales Stage', accessor: 'salesStage',
        },
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])

    ];
    const handleViewOpen = (id) => {
        navigate(`/opportunitiesView/${id}`)
    }
    const customFields = [
        {
            "name": "opportunityName",
            "label": "Opportunity Name",
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
                    "_id": "6690be4a4e0f5916f4313f13"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6690be4a4e0f5916f4313f14"
                }
            ],
            "validation": [
                {
                    "require": true,
                    "message": "Opportunity Name is required ",
                    "_id": "6690be4a4e0f5916f4313f15"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6690be4a4e0f5916f4313f16"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6690be4a4e0f5916f4313f17"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6690be4a4e0f5916f4313f18"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6690be4a4e0f5916f4313f19"
                }
            ],
            "_id": "6690be4a4e0f5916f4313f12"
        },
        {
            "name": "accountName",
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
                    "_id": "6690be854e0f5916f4314260"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6690be854e0f5916f4314261"
                }
            ],
            "validation": [
                {
                    "require": true,
                    "message": "Account Name is required ",
                    "_id": "6690be854e0f5916f4314262"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6690be854e0f5916f4314263"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6690be854e0f5916f4314264"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6690be854e0f5916f4314265"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6690be854e0f5916f4314266"
                }
            ],
            "_id": "6690be854e0f5916f431425f"
        },
        {
            "name": "opportunityAmount",
            "label": "Opportunity Amount",
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
                    "_id": "6690bea44e0f5916f43145c5"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6690bea44e0f5916f43145c6"
                }
            ],
            "validation": [
                {
                    "require": true,
                    "message": "Opportunity Amount is required ",
                    "_id": "6690bea44e0f5916f43145c7"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6690bea44e0f5916f43145c8"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6690bea44e0f5916f43145c9"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6690bea44e0f5916f43145ca"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6690bea44e0f5916f43145cb"
                }
            ],
            "_id": "6690bea44e0f5916f43145c4"
        },
        {
            "name": "expectedCloseDate",
            "label": "Expected Close Date",
            "type": "date",
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
                    "_id": "6690bec04e0f5916f4314942"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6690bec04e0f5916f4314943"
                }
            ],
            "validation": [
                {
                    "require": true,
                    "message": "Expected Close Date is required ",
                    "_id": "6690bec04e0f5916f4314944"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6690bec04e0f5916f4314945"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6690bec04e0f5916f4314946"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6690bec04e0f5916f4314947"
                },
                {
                    "message": "",
                    "formikType": "date",
                    "_id": "6690bec04e0f5916f4314948"
                }
            ],
            "_id": "6690bec04e0f5916f4314941"
        },
        {
            "name": "salesStage",
            "label": "Sales Stage",
            "type": "select",
            "fixed": false,
            "isDefault": false,
            "delete": false,
            "belongsTo": null,
            "backendType": "Mixed",
            "isTableField": false,
            "isView": false,
            "options": [
                {
                    "name": "Prospecting",
                    "value": "Prospecting",
                    "_id": "6690bf4a4e0f5916f4314cd7"
                },
                {
                    "name": "Qualification",
                    "value": "Qualification",
                    "_id": "6690bf4a4e0f5916f4314cd8"
                },
                {
                    "name": "Needs Analysis",
                    "value": "Needs Analysis",
                    "_id": "6690bf4a4e0f5916f4314cd9"
                },
                {
                    "name": "Value Propositon",
                    "value": "Value Propositon",
                    "_id": "6690bf4a4e0f5916f4314cda"
                },
                {
                    "name": "Identifying Decision Makers",
                    "value": "Identifying Decision Makers",
                    "_id": "6690bf4a4e0f5916f4314cdb"
                },
                {
                    "name": "Perception Analysis",
                    "value": "Perception Analysis",
                    "_id": "6690bf4a4e0f5916f4314cdc"
                },
                {
                    "name": "Proposal/Price Quote",
                    "value": "Proposal/Price Quote",
                    "_id": "6690bf4a4e0f5916f4314cdd"
                },
                {
                    "name": "Negotiation/Review",
                    "value": "Negotiation/Review",
                    "_id": "6690bf4a4e0f5916f4314cde"
                },
                {
                    "name": "Closed/Won",
                    "value": "Closed/Won",
                    "_id": "6690bf4a4e0f5916f4314cdf"
                },
                {
                    "name": "Closed/Lost",
                    "value": "Closed/Lost",
                    "_id": "6690bf4a4e0f5916f4314ce0"
                }
            ],
            "validation": [
                {
                    "require": true,
                    "message": "Sales Stage is required",
                    "_id": "6690bf4a4e0f5916f4314ce1"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6690bf4a4e0f5916f4314ce2"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6690bf4a4e0f5916f4314ce3"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6690bf4a4e0f5916f4314ce4"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6690bf4a4e0f5916f4314ce5"
                }
            ],
            "_id": "6690bf4a4e0f5916f4314cd6"
        }
    ]

    const handleOpenAdd = () => {
        onOpen();
        setType("add")
    }

    const handleDelete = async (ids) => {
        try {
            setIsLoding(true);
            let response = await deleteManyApi("api/opportunity/deleteMany", ids);
            if (response.status === 200) {
                toast.success(`Opprtunities Delete successfully`)
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
        const result = await dispatch(fetchOpportunityData())

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
                title={title}
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
                handleSearchType="OpprtunitySearch"
            />

            <OpprtunityAdvanceSearch
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
                type="Opportunities"
                handleDeleteData={handleDelete}
                ids={selectedValues}
            />

            <ImportModal
                text="Opprotunities file"
                isOpen={isImport}
                onClose={setIsImport}
                customFields={customFields}
            />
        </div>
    )
}

export default Index