import { DeleteIcon, EditIcon, SearchIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import html2pdf from "html2pdf.js";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { CiMenuKebab } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { deleteManyApi } from 'services/api';
import CommonDeleteModel from '../../../components/commonDeleteModel';
import CommonCheckTable from '../../../components/reactTable/checktable';
import { HasAccess } from '../../../redux/accessUtils';
import { fetchInvoicesData } from '../../../redux/slices/invoicesSlice';
import AddEdit from './AddEdit';
import ImportModal from './components/ImportModel';
import InvoiceAdvanceSearch from './components/InvoiceAdvanceSearch';
import Preview from './preview';
import { TbFileInvoice } from 'react-icons/tb';

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
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [selectedId, setSelectedId] = useState();
    const [selectedPreviewId, setSelectedPreviewId] = useState();
    const [deleteModel, setDelete] = useState(false);
    const [edit, setEdit] = useState(false);
    const [type, setType] = useState("")
    const [isImport, setIsImport] = useState(false);
    const [isOpenPreview, setIsOpenPreview] = useState(false)

    const [permission, accountAccess, contactAccess] = HasAccess(["Invoices", "Account", "Contacts"]);

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
                                    navigate(`/invoicesView/${row?.values?._id}`);
                                }}
                            >
                                View
                            </MenuItem>
                        )}
                        <MenuItem
                            py={2.5}
                            color={"black"}
                            icon={<TbFileInvoice mb={1} fontSize={15} />}
                            onClick={() => {
                                setSelectedId(row?.values?._id)
                                setIsOpenPreview(true)
                            }}
                        >
                            Invoice
                        </MenuItem>
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
        { Header: "Invoice Number", accessor: "invoiceNumber", isSortable: false, width: 10 },
        {
            Header: 'Title', accessor: 'title', cell: (cell) => (
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
            Header: 'Status', accessor: 'status',
        },
        {
            Header: 'Contact',
            accessor: 'contact',
            cell: (cell) => (
                (user.role === 'superAdmin' || contactAccess?.view) ?
                    <div className="selectOpt">
                        <Text
                            onClick={() => navigate(cell?.row?.original.contact !== null && `/contactView/${cell?.row?.original.contact}`)}
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                            color='brand.600'
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {cell?.row?.original?.contactName ? cell?.row?.original?.contactName : "-"}
                        </Text>
                    </div>
                    :
                    <Text
                    >
                        {cell?.row?.original?.contactName ? cell?.row?.original?.contactName : "-"}
                    </Text>
            )
        },
        {
            Header: 'Account',
            accessor: 'account',
            cell: (cell) => (
                (user.role === 'superAdmin' || accountAccess?.view) ?
                    <div className="selectOpt">
                        <Text
                            onClick={() => navigate(cell?.row?.original.account !== null && `/accountView/${cell?.row?.original.account}`)}
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                            color='brand.600'
                            fontSize="sm"
                            fontWeight="700"
                        >
                            {cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}
                        </Text>
                    </div>
                    :
                    <Text
                    >
                        {cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}
                    </Text>
            )
        },
        {
            Header: "Grand Total",
            accessor: "grandTotal",
            cell: (cell) => (
                <div className="selectOpt">
                    <Text>
                        {cell?.row?.original?.grandTotal ? `${cell?.row?.original?.currency} ${cell?.row?.original?.grandTotal}` : '-'}
                    </Text>
                </div>
            )
        },

        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])

    ];
    const handleViewOpen = (id) => {
        navigate(`/invoicesView/${id}`)
    }
    const customFields = [
        {
            "name": "invoiceNumber",
            "label": "Invoice Number",
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
                    "_id": "669508bc20a9be3594c8652f"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "669508bc20a9be3594c86530"
                }
            ],
            "validation": [
                {
                    "require": true,
                    "message": "Quote Number is required",
                    "_id": "669508bc20a9be3594c86531"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "669508bc20a9be3594c86532"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "669508bc20a9be3594c86533"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "669508bc20a9be3594c86534"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "669508bc20a9be3594c86535"
                }
            ],
            "_id": "669508bc20a9be3594c8652e"
        },
        {
            "name": "title",
            "label": "Title",
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
                    "_id": "669508f820a9be3594c8686c"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "669508f820a9be3594c8686d"
                }
            ],
            "validation": [
                {
                    "require": true,
                    "message": "Title is required ",
                    "_id": "669508f820a9be3594c8686e"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "669508f820a9be3594c8686f"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "669508f820a9be3594c86870"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "669508f820a9be3594c86871"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "669508f820a9be3594c86872"
                }
            ],
            "_id": "669508f820a9be3594c8686b"
        },
        {
            "name": "status",
            "label": "Status",
            "type": "select",
            "fixed": false,
            "isDefault": false,
            "delete": false,
            "belongsTo": null,
            "backendType": "Mixed",
            "isTableField": false,
            "isView": false,
            "options": [
            ],
            "validation": [
                {
                    "require": false,
                    "message": "",
                    "_id": "6695095120a9be3594c86bc9"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6695095120a9be3594c86bca"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6695095120a9be3594c86bcb"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6695095120a9be3594c86bcc"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6695095120a9be3594c86bcd"
                }
            ],
            "_id": "6695095120a9be3594c86bc0"
        },
        {
            "name": "contact",
            "label": "Contact",
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
                    "_id": "6695099520a9be3594c86f46"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "6695099520a9be3594c86f47"
                }
            ],
            "validation": [
                {
                    "require": false,
                    "message": "",
                    "_id": "6695099520a9be3594c86f48"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "6695099520a9be3594c86f49"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "6695099520a9be3594c86f4a"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "6695099520a9be3594c86f4b"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "6695099520a9be3594c86f4c"
                }
            ],
            "_id": "6695099520a9be3594c86f45"
        },
        {
            "name": "account",
            "label": "Account",
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
                    "_id": "669509a320a9be3594c872dd"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "669509a320a9be3594c872de"
                }
            ],
            "validation": [
                {
                    "require": false,
                    "message": "",
                    "_id": "669509a320a9be3594c872df"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "669509a320a9be3594c872e0"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "669509a320a9be3594c872e1"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "669509a320a9be3594c872e2"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "669509a320a9be3594c872e3"
                }
            ],
            "_id": "669509a320a9be3594c872dc"
        },
        {
            "name": "grandTotal",
            "label": "Grand Total",
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
                    "_id": "669509b120a9be3594c8768c"
                },
                {
                    "name": "",
                    "value": "",
                    "_id": "669509b120a9be3594c8768d"
                }
            ],
            "validation": [
                {
                    "require": false,
                    "message": "",
                    "_id": "669509b120a9be3594c8768e"
                },
                {
                    "min": false,
                    "value": "",
                    "message": "",
                    "_id": "669509b120a9be3594c8768f"
                },
                {
                    "max": false,
                    "value": "",
                    "message": "",
                    "_id": "669509b120a9be3594c87690"
                },
                {
                    "value": "",
                    "message": "",
                    "match": false,
                    "_id": "669509b120a9be3594c87691"
                },
                {
                    "message": "",
                    "formikType": "",
                    "_id": "669509b120a9be3594c87692"
                }
            ],
            "_id": "669509b120a9be3594c8768b"
        },
    ]

    const handleOpenAdd = () => {
        onOpen();
        setType("add")
    }

    const handleDelete = async (ids) => {
        try {
            setIsLoding(true);
            let response = await deleteManyApi("api/invoices/deleteMany", ids);
            if (response.status === 200) {
                toast.success(`Invoices Delete successfully`)
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
        const result = await dispatch(fetchInvoicesData())

        if (result.payload.status === 200) {
            setData(result?.payload?.data);
        } else {
            toast.error("Failed to fetch data", "error");
        }
        setIsLoding(false)
    }

    const [columns, setColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    const generatePDF = () => {
        setLoading(true)
        const element = document.getElementById("reports");

        if (element) {
            html2pdf()
                .from(element)
                .set({
                    margin: [0, 0, 0, 0],
                    filename: `Invoice_${moment().format("DD-MM-YYYY")}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
                })
                .save().then(() => {
                    setLoading(false)
                    setIsOpenPreview(false)
                })
            // }, 500);
        } else {
            console.error("Element with ID 'reports' not found.");
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [action])

    return (
        <div>
            <CommonCheckTable
                title={"Invoices"}
                isLoding={isLoding}
                columnData={columns ?? []}
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
                handleSearchType="InvoiceSearch"
            />

            <InvoiceAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data ?? []}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />

            <Preview isOpen={isOpenPreview} onClose={setIsOpenPreview} generatePDF={generatePDF} id="reports" selectedId={selectedId} isLoading={loading} />

            <AddEdit isOpen={isOpen} size={"lg"} onClose={onClose} setAction={setAction} type={type} selectedId={selectedId} action={action} />
            <CommonDeleteModel
                isOpen={deleteModel}
                onClose={() => setDelete(false)}
                type="Invoices"
                handleDeleteData={handleDelete}
                ids={selectedValues}
            />

            <ImportModal
                text="Invoices file"
                isOpen={isImport}
                onClose={setIsImport}
                customFields={customFields}
            />
        </div>
    )
}

export default Index